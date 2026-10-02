-- Hotfix: admin AdvisorManagement .select('*') was 403ing because
-- financial_advisors only had an admin UPDATE policy + column-level SELECT grants.
-- Mirror accountants: table GRANTs + "Admins can manage all ..." FOR ALL policy.
-- Does NOT drop "Anyone can view approved advisors" or change financial_advisors_public.

GRANT SELECT, INSERT, UPDATE, DELETE ON public.financial_advisors TO authenticated;
GRANT ALL ON public.financial_advisors TO service_role;

DROP POLICY IF EXISTS "Admins can manage all advisors" ON public.financial_advisors;

CREATE POLICY "Admins can manage all advisors"
  ON public.financial_advisors FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true))
  WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true));
