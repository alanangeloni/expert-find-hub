
-- Revoke direct column access to PII from all client roles
REVOKE SELECT (email, phone_number) ON public.financial_advisors FROM anon;
REVOKE SELECT (email, phone_number) ON public.financial_advisors FROM authenticated;
REVOKE SELECT (email, phone_number) ON public.financial_advisors FROM PUBLIC;

-- Secure function: returns contact info only to the owning advisor or an admin
CREATE OR REPLACE FUNCTION public.get_advisor_contact(_advisor_id uuid)
RETURNS TABLE(email text, phone_number text)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM public.financial_advisors fa
    WHERE fa.id = _advisor_id AND fa.user_id = auth.uid()
  ) OR EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = auth.uid() AND p.is_admin = true
  ) THEN
    RETURN QUERY
    SELECT fa.email, fa.phone_number
    FROM public.financial_advisors fa
    WHERE fa.id = _advisor_id;
  ELSE
    RETURN;
  END IF;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.get_advisor_contact(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_advisor_contact(uuid) TO authenticated;
