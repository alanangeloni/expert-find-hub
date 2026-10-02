-- Allow admins to create/update/delete investment and accounting firms.
-- Without these policies, PostgREST UPDATE/DELETE match 0 rows (no error),
-- so admin forms show "Firm updated successfully" while nothing persists.
-- Mirrors the accountants admin policy pattern.

GRANT SELECT, INSERT, UPDATE, DELETE ON public.investment_firms TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.accounting_firms TO authenticated;

GRANT ALL ON public.investment_firms TO service_role;
GRANT ALL ON public.accounting_firms TO service_role;

ALTER TABLE public.investment_firms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.accounting_firms ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can manage all investment firms" ON public.investment_firms;
CREATE POLICY "Admins can manage all investment firms"
  ON public.investment_firms FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true))
  WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true));

DROP POLICY IF EXISTS "Admins can manage all accounting firms" ON public.accounting_firms;
CREATE POLICY "Admins can manage all accounting firms"
  ON public.accounting_firms FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true))
  WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true));
