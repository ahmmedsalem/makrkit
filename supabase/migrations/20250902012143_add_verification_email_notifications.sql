-- Add email notifications for verification status changes
-- Since Supabase doesn't support custom email templates directly,
-- we'll create a simpler trigger that logs the email data

-- Function to handle verification status changes and send email notifications
CREATE OR REPLACE FUNCTION kit.handle_verification_approval_with_email() 
RETURNS TRIGGER AS $$
DECLARE
    user_email text;
    user_name text;
    api_response text;
BEGIN
    -- Only process if status actually changed
    IF OLD.status = NEW.status THEN
        RETURN NEW;
    END IF;
    
    -- If verification request is approved, update account status to active
    IF NEW.status = 'approved' AND OLD.status != 'approved' THEN
        UPDATE public.accounts 
        SET status = 'active'
        WHERE id = NEW.account_id;
        
        -- Get user details for email
        SELECT email, name INTO user_email, user_name
        FROM public.accounts 
        WHERE id = NEW.account_id;
        
        -- Call email API
        SELECT net.http_post(
            url := 'http://localhost:3000/api/verification-email',
            headers := '{"Content-Type": "application/json"}'::jsonb,
            body := json_build_object(
                'userId', NEW.account_id::text,
                'status', 'approved'
            )::text
        ) INTO api_response;
        
        RAISE NOTICE 'VERIFICATION_APPROVED: Email API called for % (%)', user_email, COALESCE(user_name, 'Unknown');
    END IF;
    
    -- If verification request is rejected, update account status to inactive
    IF NEW.status = 'rejected' AND OLD.status != 'rejected' THEN
        UPDATE public.accounts 
        SET status = 'inactive'
        WHERE id = NEW.account_id;
        
        -- Get user details for email
        SELECT email, name INTO user_email, user_name
        FROM public.accounts 
        WHERE id = NEW.account_id;
        
        -- Call email API with rejection reason
        SELECT net.http_post(
            url := 'http://localhost:3000/api/verification-email',
            headers := '{"Content-Type": "application/json"}'::jsonb,
            body := json_build_object(
                'userId', NEW.account_id::text,
                'status', 'rejected',
                'rejectionReason', COALESCE(NEW.rejection_reason, 'No reason provided')
            )::text
        ) INTO api_response;
        
        RAISE NOTICE 'VERIFICATION_REJECTED: Email API called for % (%) - Reason: %', 
                     user_email, COALESCE(user_name, 'Unknown'), 
                     COALESCE(NEW.rejection_reason, 'No reason provided');
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

-- Create trigger for verification status updates
DROP TRIGGER IF EXISTS verification_status_update ON public.verification_requests;
DROP TRIGGER IF EXISTS verification_status_update_with_email ON public.verification_requests;

CREATE TRIGGER verification_status_update_with_email
    AFTER UPDATE OF status
    ON public.verification_requests
    FOR EACH ROW
    EXECUTE FUNCTION kit.handle_verification_approval_with_email();