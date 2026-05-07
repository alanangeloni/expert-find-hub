
-- 1. Remove public read on newsletter_signups
DROP POLICY IF EXISTS "Allow read own newsletter signups" ON public.newsletter_signups;

-- 2. Profiles: add INSERT policy and prevent privilege escalation via is_admin
CREATE POLICY "Users can insert their own profile"
ON public.profiles
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id AND is_admin IS NOT TRUE);

-- Trigger to prevent non-admins from elevating is_admin via UPDATE
CREATE OR REPLACE FUNCTION public.prevent_admin_self_escalation()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  caller_is_admin boolean;
BEGIN
  SELECT is_admin INTO caller_is_admin FROM public.profiles WHERE id = auth.uid();
  IF COALESCE(NEW.is_admin, false) IS DISTINCT FROM COALESCE(OLD.is_admin, false)
     AND COALESCE(caller_is_admin, false) = false THEN
    RAISE EXCEPTION 'Only admins can change admin status';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS prevent_admin_self_escalation_trigger ON public.profiles;
CREATE TRIGGER prevent_admin_self_escalation_trigger
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.prevent_admin_self_escalation();

-- 3. Blog posts: ensure admin write check enforced (recreate policy with WITH CHECK)
DROP POLICY IF EXISTS "Admin users can perform all operations on blog posts" ON public.blog_posts;
CREATE POLICY "Admin users can perform all operations on blog posts"
ON public.blog_posts
FOR ALL
TO authenticated
USING (EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true))
WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true));

-- 4. Fix mutable search_path on existing functions
ALTER FUNCTION public.handle_new_user() SET search_path = public;
ALTER FUNCTION public.handle_updated_at() SET search_path = public;
ALTER FUNCTION public.get_post_categories(uuid) SET search_path = public;
ALTER FUNCTION public.get_blog_categories() SET search_path = public;
ALTER FUNCTION public.add_category_to_post(uuid, text) SET search_path = public;
ALTER FUNCTION public.remove_category_from_post(uuid, text) SET search_path = public;
ALTER FUNCTION public.remove_all_post_categories(uuid) SET search_path = public;
