
-- 1. Financial advisors: remove public SELECT on raw table, route public access through view
DROP POLICY IF EXISTS "Anyone can view approved advisors" ON public.financial_advisors;

CREATE POLICY "Users can view their own advisor profile"
ON public.financial_advisors
FOR SELECT
USING (auth.uid() = user_id);

-- Make the public view bypass RLS so anonymous users can read the safe (no email/phone) projection
ALTER VIEW public.financial_advisors_public SET (security_invoker = false);
GRANT SELECT ON public.financial_advisors_public TO anon, authenticated;

-- 2. Meeting requests: require advisor_id to reference an approved advisor
DROP POLICY IF EXISTS "Anyone can create meeting requests" ON public.meeting_requests;

CREATE POLICY "Anyone can create meeting requests for approved advisors"
ON public.meeting_requests
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.financial_advisors fa
    WHERE fa.id = meeting_requests.advisor_id
      AND fa.status = 'approved'
  )
);

-- 3. Profiles: tighten UPDATE policy with WITH CHECK to prevent self-escalation at policy level too
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

CREATE POLICY "Users can update their own profile"
ON public.profiles
FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id AND is_admin IS NOT TRUE);

-- Ensure trigger preventing admin escalation is attached (idempotent)
DROP TRIGGER IF EXISTS prevent_admin_self_escalation_trigger ON public.profiles;
CREATE TRIGGER prevent_admin_self_escalation_trigger
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.prevent_admin_self_escalation();

-- 4. Newsletter signups: admin-only SELECT
CREATE POLICY "Admins can view newsletter signups"
ON public.newsletter_signups
FOR SELECT
USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true));

-- 5. Storage: admin-only writes for all 4 buckets, public read preserved
CREATE POLICY "Admins can upload to managed buckets"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id IN ('blog-images', 'investment-firm-logos', 'advisor-headshots', 'website-wide-images')
  AND EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
);

CREATE POLICY "Admins can update managed buckets"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id IN ('blog-images', 'investment-firm-logos', 'advisor-headshots', 'website-wide-images')
  AND EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
);

CREATE POLICY "Admins can delete from managed buckets"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id IN ('blog-images', 'investment-firm-logos', 'advisor-headshots', 'website-wide-images')
  AND EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
);

CREATE POLICY "Public can read managed buckets"
ON storage.objects
FOR SELECT
USING (bucket_id IN ('blog-images', 'investment-firm-logos', 'advisor-headshots', 'website-wide-images'));

-- 6. Revoke EXECUTE on category mutation functions from public roles
REVOKE EXECUTE ON FUNCTION public.add_category_to_post(uuid, text) FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.remove_category_from_post(uuid, text) FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.remove_all_post_categories(uuid) FROM anon, authenticated, public;
