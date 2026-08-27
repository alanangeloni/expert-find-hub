ALTER TYPE public.accounting_service_type ADD VALUE IF NOT EXISTS 'Tax Planning & Strategy';
ALTER TYPE public.accounting_service_type ADD VALUE IF NOT EXISTS 'Business Tax Preparation';
ALTER TYPE public.accounting_service_type ADD VALUE IF NOT EXISTS 'IRS Representation & Tax Resolution';
ALTER TYPE public.accounting_service_type ADD VALUE IF NOT EXISTS 'Estate & Trust Tax';
ALTER TYPE public.accounting_service_type ADD VALUE IF NOT EXISTS 'Accounts Payable/Receivable';
ALTER TYPE public.accounting_service_type ADD VALUE IF NOT EXISTS 'Business & Entity Formation';
ALTER TYPE public.accounting_service_type ADD VALUE IF NOT EXISTS 'Business Valuation';
ALTER TYPE public.accounting_service_type ADD VALUE IF NOT EXISTS 'Controller Services';
ALTER TYPE public.accounting_service_type ADD VALUE IF NOT EXISTS 'Cash Flow Forecasting';
ALTER TYPE public.accounting_service_type ADD VALUE IF NOT EXISTS 'Cost Accounting';
ALTER TYPE public.accounting_service_type ADD VALUE IF NOT EXISTS 'Audit Services';
ALTER TYPE public.accounting_service_type ADD VALUE IF NOT EXISTS 'QuickBooks Setup & Cleanup';
ALTER TYPE public.accounting_service_type ADD VALUE IF NOT EXISTS 'Back-Office Support';

CREATE TABLE public.accountants (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  position text,
  bio text,
  firm_name text,
  firm_address text,
  linked_firm uuid REFERENCES public.accounting_firms(id) ON DELETE SET NULL,
  headshot_url text,
  city text,
  state_hq "States",
  states_served text[],
  email text,
  phone_number text,
  website_url text,
  credentials text[],
  services accounting_service_type[],
  client_specialties client_specialty_type[],
  years_of_experience integer,
  minimum_fee text,
  pricing_note text,
  disclaimer text,
  verified boolean DEFAULT false,
  status text NOT NULL DEFAULT 'draft',
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  submitted_at timestamp with time zone,
  approved_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  approved_at timestamp with time zone,
  rejection_reason text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.accountants TO authenticated;
GRANT ALL ON public.accountants TO service_role;

ALTER TABLE public.accountants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage all accountants"
  ON public.accountants FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true))
  WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true));

CREATE POLICY "Owners can view their own accountant record"
  ON public.accountants FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Owners can create their own accountant record"
  ON public.accountants FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid() AND status <> 'approved');

CREATE POLICY "Owners can update their own accountant record"
  ON public.accountants FOR UPDATE TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid() AND status <> 'approved');

CREATE OR REPLACE VIEW public.accountants_public AS
SELECT
  id, name, slug, position, bio, firm_name, firm_address, linked_firm,
  headshot_url, city, state_hq, states_served, website_url, credentials,
  services, client_specialties, years_of_experience, minimum_fee,
  pricing_note, disclaimer, verified, status, created_at, updated_at
FROM public.accountants
WHERE status = 'approved';

GRANT SELECT ON public.accountants_public TO anon;
GRANT SELECT ON public.accountants_public TO authenticated;

CREATE OR REPLACE FUNCTION public.get_accountant_contact(_accountant_id uuid)
RETURNS TABLE(email text, phone_number text)
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM public.accountants a
    WHERE a.id = _accountant_id AND a.user_id = auth.uid()
  ) OR EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = auth.uid() AND p.is_admin = true
  ) THEN
    RETURN QUERY
    SELECT a.email, a.phone_number
    FROM public.accountants a
    WHERE a.id = _accountant_id;
  ELSE
    RETURN;
  END IF;
END;
$$;

CREATE TRIGGER set_accountants_updated_at
  BEFORE UPDATE ON public.accountants
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();