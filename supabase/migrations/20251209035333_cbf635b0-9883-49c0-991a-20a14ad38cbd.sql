-- Fix the security definer view issue by recreating with SECURITY INVOKER
DROP VIEW IF EXISTS public.financial_advisors_public;

CREATE VIEW public.financial_advisors_public 
WITH (security_invoker = true) AS
SELECT 
  id, name, slug, city, state_hq, firm_name, firm_bio, personal_bio,
  headshot_url, firm_logo_url, website_url, youtube_video_id,
  years_of_experience, fiduciary, verified, minimum, disclaimer,
  advisor_services, professional_designations, client_type,
  states_registered_in, licenses, compensation, position,
  primary_education, firm_address, firm_aum,
  advisor_sec_crd, firm_sec_crd, link_to_advisor_sec, link_to_firm_sec,
  linked_firm, status, created_at, updated_at, approved_at, approved_by,
  submitted_at, user_id, rejection_reason
FROM public.financial_advisors
WHERE status = 'approved';

-- Grant access to the view for anon and authenticated users
GRANT SELECT ON public.financial_advisors_public TO anon, authenticated;