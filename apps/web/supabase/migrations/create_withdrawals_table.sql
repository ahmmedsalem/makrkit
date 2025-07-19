-- Create withdrawals table
CREATE TABLE IF NOT EXISTS withdrawals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL CHECK (amount >= 10.00),
  payment_method TEXT NOT NULL CHECK (payment_method IN ('paypal', 'stripe', 'bank', 'crypto')),
  payment_details JSONB NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'cancelled')),
  request_id TEXT UNIQUE NOT NULL,
  processing_fee DECIMAL(10,2) DEFAULT 0.00,
  net_amount DECIMAL(10,2) NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  processed_at TIMESTAMP WITH TIME ZONE
);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_withdrawals_user_id ON withdrawals(user_id);
CREATE INDEX IF NOT EXISTS idx_withdrawals_status ON withdrawals(status);
CREATE INDEX IF NOT EXISTS idx_withdrawals_created_at ON withdrawals(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_withdrawals_request_id ON withdrawals(request_id);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_withdrawals_updated_at 
    BEFORE UPDATE ON withdrawals 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS)
ALTER TABLE withdrawals ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own withdrawals
CREATE POLICY "Users can view own withdrawals" ON withdrawals
    FOR SELECT USING (auth.uid() = user_id);

-- Policy: Users can insert their own withdrawals
CREATE POLICY "Users can insert own withdrawals" ON withdrawals
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own pending withdrawals (for cancellation)
CREATE POLICY "Users can update own pending withdrawals" ON withdrawals
    FOR UPDATE USING (auth.uid() = user_id AND status = 'pending');
