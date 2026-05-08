
-- 1) Prevent advisors from self-approving via INSERT
DROP POLICY IF EXISTS "Users can create their own advisor profiles" ON public.financial_advisors;
CREATE POLICY "Users can create their own advisor profiles"
ON public.financial_advisors
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = user_id
  AND COALESCE(status, 'draft') IN ('draft', 'pending_approval')
  AND COALESCE(verified, false) = false
  AND approved_at IS NULL
  AND approved_by IS NULL
);

-- 2) Prevent advisors from escalating status to 'approved' via UPDATE
DROP POLICY IF EXISTS "Users can update their own draft/pending advisor profiles" ON public.financial_advisors;
CREATE POLICY "Users can update their own draft/pending advisor profiles"
ON public.financial_advisors
FOR UPDATE
TO authenticated
USING (
  auth.uid() = user_id
  AND status = ANY (ARRAY['draft','rejected','pending_approval'])
)
WITH CHECK (
  auth.uid() = user_id
  AND status = ANY (ARRAY['draft','pending_approval'])
  AND COALESCE(verified, false) = false
  AND approved_at IS NULL
  AND approved_by IS NULL
);
