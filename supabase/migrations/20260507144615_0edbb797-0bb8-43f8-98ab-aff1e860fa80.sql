
-- Revert view to security_invoker so it doesn't trigger the SECURITY DEFINER VIEW lint
ALTER VIEW public.financial_advisors_public SET (security_invoker = true);

-- Re-add public read on approved rows, but use column-level privileges to hide PII
CREATE POLICY "Anyone can view approved advisors"
ON public.financial_advisors
FOR SELECT
USING (status = 'approved');

-- Revoke all column access from anon/authenticated, then grant only safe columns
REVOKE SELECT ON public.financial_advisors FROM anon, authenticated;

GRANT SELECT (
  id, name, slug, city, state_hq, firm_name, firm_bio, personal_bio,
  headshot_url, firm_logo_url, website_url, youtube_video_id,
  years_of_experience, fiduciary, verified, minimum, disclaimer,
  advisor_services, professional_designations, client_type,
  states_registered_in, licenses, compensation, "position",
  primary_education, firm_address, firm_aum, advisor_sec_crd,
  firm_sec_crd, link_to_advisor_sec, link_to_firm_sec, linked_firm,
  status, created_at, updated_at, approved_at, approved_by,
  submitted_at, user_id, rejection_reason
) ON public.financial_advisors TO anon, authenticated;

-- Grant full select to advisors viewing their own row (via owner SELECT policy already in place);
-- the column grants above intentionally exclude email/phone from anon/authenticated.
-- Owners need email/phone of their own row → grant those columns to authenticated only.
GRANT SELECT (email, phone_number) ON public.financial_advisors TO authenticated;
