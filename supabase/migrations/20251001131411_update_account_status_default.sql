-- Update default account status from 'pending' to 'inactive'
-- This ensures new accounts start as inactive and must complete verification

ALTER TABLE public.accounts 
ALTER COLUMN status SET DEFAULT 'inactive';

-- Add comment explaining the change
COMMENT ON COLUMN public.accounts.status IS 'Account status: inactive (default for new accounts), pending (verification submitted), active (verified)';