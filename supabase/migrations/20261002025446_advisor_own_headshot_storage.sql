-- Allow authenticated advisors to manage objects under their own folder
-- in the advisor-headshots bucket: {auth.uid()}/{filename}
-- Admin policies from 20260507144220 remain in place for full-bucket admin writes.
-- Public read policy is unchanged.

CREATE POLICY "Advisors can upload own headshots"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'advisor-headshots'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Advisors can update own headshots"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'advisor-headshots'
  AND (storage.foldername(name))[1] = auth.uid()::text
)
WITH CHECK (
  bucket_id = 'advisor-headshots'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Advisors can delete own headshots"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'advisor-headshots'
  AND (storage.foldername(name))[1] = auth.uid()::text
);
