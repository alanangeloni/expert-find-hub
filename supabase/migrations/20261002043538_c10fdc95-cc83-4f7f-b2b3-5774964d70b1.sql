GRANT SELECT, INSERT, UPDATE, DELETE ON public.financial_advisors TO authenticated;
GRANT ALL ON public.financial_advisors TO service_role;
DROP POLICY IF EXISTS "Admins can manage all advisors" ON public.financial_advisors;
CREATE POLICY "Admins can manage all advisors" ON public.financial_advisors FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true))
  WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true));

GRANT SELECT, INSERT, UPDATE, DELETE ON public.investment_firms TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.accounting_firms TO authenticated;
GRANT ALL ON public.investment_firms TO service_role;
GRANT ALL ON public.accounting_firms TO service_role;
ALTER TABLE public.investment_firms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.accounting_firms ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admins can manage all investment firms" ON public.investment_firms;
CREATE POLICY "Admins can manage all investment firms" ON public.investment_firms FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true))
  WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true));
DROP POLICY IF EXISTS "Admins can manage all accounting firms" ON public.accounting_firms;
CREATE POLICY "Admins can manage all accounting firms" ON public.accounting_firms FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true))
  WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true));

DROP POLICY IF EXISTS "Advisors can upload own headshots" ON storage.objects;
CREATE POLICY "Advisors can upload own headshots" ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'advisor-headshots' AND (storage.foldername(name))[1] = auth.uid()::text);
DROP POLICY IF EXISTS "Advisors can update own headshots" ON storage.objects;
CREATE POLICY "Advisors can update own headshots" ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'advisor-headshots' AND (storage.foldername(name))[1] = auth.uid()::text)
WITH CHECK (bucket_id = 'advisor-headshots' AND (storage.foldername(name))[1] = auth.uid()::text);
DROP POLICY IF EXISTS "Advisors can delete own headshots" ON storage.objects;
CREATE POLICY "Advisors can delete own headshots" ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'advisor-headshots' AND (storage.foldername(name))[1] = auth.uid()::text);