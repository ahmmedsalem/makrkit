-- Add status field to accounts table
-- Status values: 'active', 'inactive', 'pending'
-- Default value: 'pending' for new users requiring verification

-- Create enum type for account status
CREATE TYPE account_status AS ENUM ('active', 'inactive', 'pending');

-- Add status column to accounts table
ALTER TABLE public.accounts 
ADD COLUMN status account_status NOT NULL DEFAULT 'inactive';

-- Add comment for the new column
COMMENT ON COLUMN public.accounts.status IS 'The status of the account - pending (requires verification), active, or inactive';

-- Update existing accounts to have 'active' status (assuming they are already verified)
UPDATE public.accounts SET status = 'active' WHERE status = 'pending';