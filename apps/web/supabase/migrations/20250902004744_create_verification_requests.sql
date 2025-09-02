-- Create verification_requests table to store user verification submissions

-- Create enum for verification request status
CREATE TYPE verification_request_status AS ENUM ('pending', 'approved', 'rejected');

-- Create verification_requests table
CREATE TABLE IF NOT EXISTS public.verification_requests (
    id uuid PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    account_id uuid NOT NULL REFERENCES public.accounts(id) ON DELETE CASCADE,
    
    -- User submitted data
    full_name text NOT NULL,
    phone_number text NOT NULL,
    
    -- File storage paths
    personal_photo_url text NOT NULL,
    id_document_url text NOT NULL,
    
    -- Request status and metadata
    status verification_request_status NOT NULL DEFAULT 'pending',
    submitted_at timestamp with time zone NOT NULL DEFAULT now(),
    reviewed_at timestamp with time zone NULL,
    reviewed_by uuid NULL REFERENCES auth.users(id),
    rejection_reason text NULL,
    
    -- Audit fields
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Add comments
COMMENT ON TABLE public.verification_requests IS 'User verification requests with uploaded documents';
COMMENT ON COLUMN public.verification_requests.user_id IS 'Reference to the user submitting verification';
COMMENT ON COLUMN public.verification_requests.account_id IS 'Reference to the account being verified';
COMMENT ON COLUMN public.verification_requests.full_name IS 'User submitted full legal name';
COMMENT ON COLUMN public.verification_requests.phone_number IS 'User submitted phone number';
COMMENT ON COLUMN public.verification_requests.personal_photo_url IS 'Storage path to personal photo';
COMMENT ON COLUMN public.verification_requests.id_document_url IS 'Storage path to government ID document';
COMMENT ON COLUMN public.verification_requests.status IS 'Current status of verification request';
COMMENT ON COLUMN public.verification_requests.reviewed_by IS 'Admin user who reviewed the request';
COMMENT ON COLUMN public.verification_requests.rejection_reason IS 'Reason for rejection if applicable';

-- Enable RLS
ALTER TABLE public.verification_requests ENABLE ROW LEVEL SECURITY;

-- Users can only read their own verification requests
CREATE POLICY verification_requests_user_read ON public.verification_requests
    FOR SELECT
    TO authenticated
    USING (user_id = auth.uid());

-- Users can only insert their own verification requests
CREATE POLICY verification_requests_user_insert ON public.verification_requests
    FOR INSERT
    TO authenticated
    WITH CHECK (user_id = auth.uid() AND account_id = auth.uid());

-- Only service_role can update verification requests (for admin approval/rejection)
CREATE POLICY verification_requests_admin_update ON public.verification_requests
    FOR UPDATE
    TO service_role
    USING (true);

-- Grant permissions
GRANT SELECT, INSERT ON public.verification_requests TO authenticated;
GRANT ALL ON public.verification_requests TO service_role;

-- Create storage bucket for verification documents
INSERT INTO storage.buckets (id, name, public)
VALUES ('verification_documents', 'verification_documents', false);

-- RLS policies for verification documents storage
CREATE POLICY verification_documents_user_upload ON storage.objects
    FOR INSERT
    TO authenticated
    WITH CHECK (
        bucket_id = 'verification_documents' 
        AND (auth.uid()::text) = (storage.foldername(name))[1]
    );

CREATE POLICY verification_documents_user_read ON storage.objects
    FOR SELECT
    TO authenticated
    USING (
        bucket_id = 'verification_documents' 
        AND (auth.uid()::text) = (storage.foldername(name))[1]
    );

-- Admin access to verification documents
CREATE POLICY verification_documents_admin_read ON storage.objects
    FOR SELECT
    TO service_role
    USING (bucket_id = 'verification_documents');

-- Function to update account status when verification is approved
CREATE OR REPLACE FUNCTION kit.handle_verification_approval() 
RETURNS TRIGGER AS $$
BEGIN
    -- If verification request is approved, update account status to active
    IF NEW.status = 'approved' AND OLD.status != 'approved' THEN
        UPDATE public.accounts 
        SET status = 'active'
        WHERE id = NEW.account_id;
    END IF;
    
    -- If verification request is rejected, update account status to inactive
    IF NEW.status = 'rejected' AND OLD.status != 'rejected' THEN
        UPDATE public.accounts 
        SET status = 'inactive'
        WHERE id = NEW.account_id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

-- Trigger to automatically update account status
CREATE TRIGGER verification_status_update
    AFTER UPDATE OF status
    ON public.verification_requests
    FOR EACH ROW
    EXECUTE FUNCTION kit.handle_verification_approval();