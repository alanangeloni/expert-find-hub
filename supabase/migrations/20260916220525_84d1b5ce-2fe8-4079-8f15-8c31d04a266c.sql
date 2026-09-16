DROP POLICY IF EXISTS "Everyone can read published blog posts" ON public.blog_posts;

CREATE POLICY "Everyone can read live blog posts"
ON public.blog_posts
FOR SELECT
USING (
  (status = 'published' AND (published_at IS NULL OR published_at <= now()))
  OR (status = 'scheduled' AND published_at IS NOT NULL AND published_at <= now())
);

CREATE INDEX IF NOT EXISTS blog_posts_status_published_at_idx
  ON public.blog_posts (status, published_at DESC);