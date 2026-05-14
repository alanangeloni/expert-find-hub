-- Remove broad SELECT on raw financial_advisors table; force public to use the safe view that excludes email/phone
DROP POLICY IF EXISTS "Anyone can view approved advisors" ON public.financial_advisors;

-- Make the public view bypass RLS so anon/authenticated can read approved advisors through it
ALTER VIEW public.financial_advisors_public SET (security_invoker = off);
GRANT SELECT ON public.financial_advisors_public TO anon, authenticated;