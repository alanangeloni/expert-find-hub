
-- Enable RLS on newsletter_signups table if not already enabled
ALTER TABLE newsletter_signups ENABLE ROW LEVEL SECURITY;

-- Create a policy to allow anyone to insert newsletter signups
CREATE POLICY "Allow public newsletter signups" ON newsletter_signups
FOR INSERT 
TO public
WITH CHECK (true);

-- Create a policy to allow users to read their own newsletter signups (optional)
CREATE POLICY "Allow read own newsletter signups" ON newsletter_signups
FOR SELECT 
TO public
USING (true);
