CREATE TABLE IF NOT EXISTS public.blog_slug_redirects (
  old_slug text PRIMARY KEY,
  new_slug text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.blog_slug_redirects TO anon;
GRANT SELECT ON public.blog_slug_redirects TO authenticated;
GRANT ALL ON public.blog_slug_redirects TO service_role;

ALTER TABLE public.blog_slug_redirects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read blog slug redirects" ON public.blog_slug_redirects;
CREATE POLICY "Anyone can read blog slug redirects"
ON public.blog_slug_redirects
FOR SELECT
USING (true);

DO $$
DECLARE
  r record;
  base text;
  candidate text;
  i int;
BEGIN
  FOR r IN SELECT id, slug FROM public.blog_posts ORDER BY (status = 'published') DESC, updated_at DESC LOOP
    base := regexp_replace(regexp_replace(lower(r.slug), '[^a-z0-9]+', '-', 'g'), '(^-+|-+$)', '', 'g');
    IF base = '' THEN
      CONTINUE;
    END IF;
    IF base = r.slug THEN
      CONTINUE;
    END IF;
    candidate := base;
    i := 1;
    WHILE EXISTS (SELECT 1 FROM public.blog_posts b WHERE b.slug = candidate AND b.id <> r.id) LOOP
      i := i + 1;
      candidate := base || '-' || i;
    END LOOP;
    UPDATE public.blog_posts SET slug = candidate WHERE id = r.id;
    INSERT INTO public.blog_slug_redirects (old_slug, new_slug)
    VALUES (r.slug, candidate)
    ON CONFLICT (old_slug) DO UPDATE SET new_slug = EXCLUDED.new_slug;
  END LOOP;
END $$;