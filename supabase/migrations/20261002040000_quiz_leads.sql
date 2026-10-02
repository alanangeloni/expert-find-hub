-- Matching Quiz v1 leads storage (build spec §10)
CREATE TABLE IF NOT EXISTS public.quiz_leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text NOT NULL UNIQUE,
  source text NOT NULL DEFAULT 'matching_quiz_v1',
  status text NOT NULL DEFAULT 'in_progress',
  path text,
  services text[],
  additional_needs text[],
  tax_filing_type text,
  industry text,
  industry_other text,
  persona_tags text[],
  intent_reason text,
  financial_size text,
  investable_assets text,
  annual_income text,
  age_range text,
  timing text,
  state text,
  outside_us boolean NOT NULL DEFAULT false,
  first_name text,
  last_name text,
  email text,
  phone text,
  notes text,
  current_step integer,
  last_phase text,
  submitted_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS quiz_leads_created_at_idx ON public.quiz_leads (created_at DESC);
CREATE INDEX IF NOT EXISTS quiz_leads_email_idx ON public.quiz_leads (email);
CREATE INDEX IF NOT EXISTS quiz_leads_path_idx ON public.quiz_leads (path);

ALTER TABLE public.quiz_leads ENABLE ROW LEVEL SECURITY;

-- Public can insert/upsert their own quiz progress by session_id
DROP POLICY IF EXISTS "Anyone can insert quiz leads" ON public.quiz_leads;
CREATE POLICY "Anyone can insert quiz leads"
ON public.quiz_leads
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

DROP POLICY IF EXISTS "Anyone can update quiz leads by session" ON public.quiz_leads;
CREATE POLICY "Anyone can update quiz leads by session"
ON public.quiz_leads
FOR UPDATE
TO anon, authenticated
USING (true)
WITH CHECK (true);

-- No public SELECT — admin tooling for quiz is out of scope for v1
DROP POLICY IF EXISTS "Admins can read quiz leads" ON public.quiz_leads;
CREATE POLICY "Admins can read quiz leads"
ON public.quiz_leads
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = auth.uid() AND p.is_admin = true
  )
);

CREATE OR REPLACE FUNCTION public.set_quiz_leads_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS quiz_leads_set_updated_at ON public.quiz_leads;
CREATE TRIGGER quiz_leads_set_updated_at
BEFORE UPDATE ON public.quiz_leads
FOR EACH ROW
EXECUTE FUNCTION public.set_quiz_leads_updated_at();
