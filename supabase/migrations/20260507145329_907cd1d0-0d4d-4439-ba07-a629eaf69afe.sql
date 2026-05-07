
-- Remove duplicate/overly permissive admin update policy (WITH CHECK true)
DROP POLICY IF EXISTS "Admin Advisor Update" ON public.financial_advisors;

-- Tighten the remaining admin update policy with explicit WITH CHECK
DROP POLICY IF EXISTS "Admins can update any advisor profile" ON public.financial_advisors;
CREATE POLICY "Admins can update any advisor profile"
ON public.financial_advisors
FOR UPDATE
USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true))
WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true));

-- Revoke EXECUTE on trigger-only SECURITY DEFINER functions
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.prevent_admin_self_escalation() FROM anon, authenticated, public;
