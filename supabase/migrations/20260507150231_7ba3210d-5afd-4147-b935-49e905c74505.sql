
-- Authors: allow public read so blog posts can join author info
CREATE POLICY "Public can view authors"
ON public.authors
FOR SELECT
USING (true);

-- Helper: function to check admin
-- (using inline EXISTS for simplicity)

-- advisor_states
CREATE POLICY "Owners or admins can insert advisor_states"
ON public.advisor_states FOR INSERT
WITH CHECK (
  EXISTS (SELECT 1 FROM public.financial_advisors fa WHERE fa.id = advisor_states.advisor_id AND fa.user_id = auth.uid())
  OR EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.is_admin = true)
);
CREATE POLICY "Owners or admins can update advisor_states"
ON public.advisor_states FOR UPDATE
USING (
  EXISTS (SELECT 1 FROM public.financial_advisors fa WHERE fa.id = advisor_states.advisor_id AND fa.user_id = auth.uid())
  OR EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.is_admin = true)
);
CREATE POLICY "Owners or admins can delete advisor_states"
ON public.advisor_states FOR DELETE
USING (
  EXISTS (SELECT 1 FROM public.financial_advisors fa WHERE fa.id = advisor_states.advisor_id AND fa.user_id = auth.uid())
  OR EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.is_admin = true)
);

-- advisor_clientele
CREATE POLICY "Owners or admins can insert advisor_clientele"
ON public.advisor_clientele FOR INSERT
WITH CHECK (
  EXISTS (SELECT 1 FROM public.financial_advisors fa WHERE fa.id = advisor_clientele.advisor_id AND fa.user_id = auth.uid())
  OR EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.is_admin = true)
);
CREATE POLICY "Owners or admins can update advisor_clientele"
ON public.advisor_clientele FOR UPDATE
USING (
  EXISTS (SELECT 1 FROM public.financial_advisors fa WHERE fa.id = advisor_clientele.advisor_id AND fa.user_id = auth.uid())
  OR EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.is_admin = true)
);
CREATE POLICY "Owners or admins can delete advisor_clientele"
ON public.advisor_clientele FOR DELETE
USING (
  EXISTS (SELECT 1 FROM public.financial_advisors fa WHERE fa.id = advisor_clientele.advisor_id AND fa.user_id = auth.uid())
  OR EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.is_admin = true)
);

-- advisor_compensation_types
CREATE POLICY "Owners or admins can insert advisor_compensation_types"
ON public.advisor_compensation_types FOR INSERT
WITH CHECK (
  EXISTS (SELECT 1 FROM public.financial_advisors fa WHERE fa.id = advisor_compensation_types.advisor_id AND fa.user_id = auth.uid())
  OR EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.is_admin = true)
);
CREATE POLICY "Owners or admins can update advisor_compensation_types"
ON public.advisor_compensation_types FOR UPDATE
USING (
  EXISTS (SELECT 1 FROM public.financial_advisors fa WHERE fa.id = advisor_compensation_types.advisor_id AND fa.user_id = auth.uid())
  OR EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.is_admin = true)
);
CREATE POLICY "Owners or admins can delete advisor_compensation_types"
ON public.advisor_compensation_types FOR DELETE
USING (
  EXISTS (SELECT 1 FROM public.financial_advisors fa WHERE fa.id = advisor_compensation_types.advisor_id AND fa.user_id = auth.uid())
  OR EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.is_admin = true)
);

-- advisor_professions
CREATE POLICY "Owners or admins can insert advisor_professions"
ON public.advisor_professions FOR INSERT
WITH CHECK (
  EXISTS (SELECT 1 FROM public.financial_advisors fa WHERE fa.id = advisor_professions.advisor_id AND fa.user_id = auth.uid())
  OR EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.is_admin = true)
);
CREATE POLICY "Owners or admins can update advisor_professions"
ON public.advisor_professions FOR UPDATE
USING (
  EXISTS (SELECT 1 FROM public.financial_advisors fa WHERE fa.id = advisor_professions.advisor_id AND fa.user_id = auth.uid())
  OR EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.is_admin = true)
);
CREATE POLICY "Owners or admins can delete advisor_professions"
ON public.advisor_professions FOR DELETE
USING (
  EXISTS (SELECT 1 FROM public.financial_advisors fa WHERE fa.id = advisor_professions.advisor_id AND fa.user_id = auth.uid())
  OR EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.is_admin = true)
);

-- advisor_professional_designations
CREATE POLICY "Owners or admins can insert advisor_professional_designations"
ON public.advisor_professional_designations FOR INSERT
WITH CHECK (
  EXISTS (SELECT 1 FROM public.financial_advisors fa WHERE fa.id = advisor_professional_designations.advisor_id AND fa.user_id = auth.uid())
  OR EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.is_admin = true)
);
CREATE POLICY "Owners or admins can update advisor_professional_designations"
ON public.advisor_professional_designations FOR UPDATE
USING (
  EXISTS (SELECT 1 FROM public.financial_advisors fa WHERE fa.id = advisor_professional_designations.advisor_id AND fa.user_id = auth.uid())
  OR EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.is_admin = true)
);
CREATE POLICY "Owners or admins can delete advisor_professional_designations"
ON public.advisor_professional_designations FOR DELETE
USING (
  EXISTS (SELECT 1 FROM public.financial_advisors fa WHERE fa.id = advisor_professional_designations.advisor_id AND fa.user_id = auth.uid())
  OR EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.is_admin = true)
);

-- advisor_carousel_images
CREATE POLICY "Owners or admins can insert advisor_carousel_images"
ON public.advisor_carousel_images FOR INSERT
WITH CHECK (
  EXISTS (SELECT 1 FROM public.financial_advisors fa WHERE fa.id = advisor_carousel_images.advisor_id AND fa.user_id = auth.uid())
  OR EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.is_admin = true)
);
CREATE POLICY "Owners or admins can update advisor_carousel_images"
ON public.advisor_carousel_images FOR UPDATE
USING (
  EXISTS (SELECT 1 FROM public.financial_advisors fa WHERE fa.id = advisor_carousel_images.advisor_id AND fa.user_id = auth.uid())
  OR EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.is_admin = true)
);
CREATE POLICY "Owners or admins can delete advisor_carousel_images"
ON public.advisor_carousel_images FOR DELETE
USING (
  EXISTS (SELECT 1 FROM public.financial_advisors fa WHERE fa.id = advisor_carousel_images.advisor_id AND fa.user_id = auth.uid())
  OR EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.is_admin = true)
);
