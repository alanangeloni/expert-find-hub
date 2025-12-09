-- Drop any policies that might allow public read access
DROP POLICY IF EXISTS "Allow public read access" ON public.meeting_requests;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.meeting_requests;

-- Ensure only the admin SELECT policy exists (recreate to be safe)
DROP POLICY IF EXISTS "Admins can view all meeting requests" ON public.meeting_requests;

CREATE POLICY "Admins can view all meeting requests" 
ON public.meeting_requests 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.id = auth.uid() 
  AND profiles.is_admin = true
));

-- Also allow advisors to view their own meeting requests
CREATE POLICY "Advisors can view their own meeting requests"
ON public.meeting_requests
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM financial_advisors 
    WHERE financial_advisors.id = meeting_requests.advisor_id 
    AND financial_advisors.user_id = auth.uid()
  )
);