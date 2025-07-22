-- Add username and available_amount fields to withdrawals table
ALTER TABLE withdrawals 
ADD COLUMN username TEXT,
ADD COLUMN user_email TEXT,
ADD COLUMN available_amount DECIMAL(10,2);

-- Update existing records to populate the new fields from accounts table
UPDATE withdrawals 
SET username = accounts.name,
    user_email = accounts.email,
    available_amount = (accounts.amount_invested + accounts.total_profit)
FROM accounts 
WHERE withdrawals.user_id = accounts.created_by;

-- Add NOT NULL constraints after populating existing data
ALTER TABLE withdrawals 
ALTER COLUMN username SET NOT NULL,
ALTER COLUMN user_email SET NOT NULL,
ALTER COLUMN available_amount SET NOT NULL;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_withdrawals_username ON withdrawals(username);
CREATE INDEX IF NOT EXISTS idx_withdrawals_user_email ON withdrawals(user_email);