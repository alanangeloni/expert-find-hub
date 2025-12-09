-- Drop the overly permissive public read policy that exposes all data
DROP POLICY IF EXISTS "Allow public read access" ON public.financial_advisors;

-- Create a public view that excludes sensitive columns (email, phone_number)
CREATE OR REPLACE VIEW public.financial_advisors_public AS
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