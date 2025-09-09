-- Create contact_applications table
CREATE TABLE IF NOT EXISTS contact_applications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    status TEXT DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied', 'resolved'))
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS contact_applications_created_at_idx ON contact_applications(created_at DESC);
CREATE INDEX IF NOT EXISTS contact_applications_status_idx ON contact_applications(status);
CREATE INDEX IF NOT EXISTS contact_applications_email_idx ON contact_applications(email);

-- Enable Row Level Security
ALTER TABLE contact_applications ENABLE ROW LEVEL SECURITY;

-- Create policies for contact_applications table
-- Allow public to insert (submit contact forms)
CREATE POLICY "Allow public to submit contact applications" ON contact_applications
    FOR INSERT
    TO public
    WITH CHECK (true);

-- Only authenticated admin users can read contact applications
-- Note: You'll need to adjust this based on your admin role system
CREATE POLICY "Allow authenticated users to read contact applications" ON contact_applications
    FOR SELECT
    TO authenticated
    USING (true);

-- Only authenticated admin users can update contact applications
CREATE POLICY "Allow authenticated users to update contact applications" ON contact_applications
    FOR UPDATE
    TO authenticated
    USING (true);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_contact_applications_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_contact_applications_updated_at_trigger
    BEFORE UPDATE ON contact_applications
    FOR EACH ROW
    EXECUTE FUNCTION update_contact_applications_updated_at();

-- Comment on table and columns
COMMENT ON TABLE contact_applications IS 'Stores contact form submissions from the website';
COMMENT ON COLUMN contact_applications.id IS 'Unique identifier for the contact application';
COMMENT ON COLUMN contact_applications.name IS 'Name of the person submitting the contact form';
COMMENT ON COLUMN contact_applications.email IS 'Email address of the person submitting the contact form';
COMMENT ON COLUMN contact_applications.subject IS 'Subject of the contact form submission';
COMMENT ON COLUMN contact_applications.message IS 'Message content of the contact form submission';
COMMENT ON COLUMN contact_applications.status IS 'Status of the contact application: new, read, replied, resolved';
COMMENT ON COLUMN contact_applications.created_at IS 'Timestamp when the contact application was created';
COMMENT ON COLUMN contact_applications.updated_at IS 'Timestamp when the contact application was last updated';