# Fix advisor photo uploads during signup

## What's wrong (confirmed)
The photo storage only lets **admins** upload right now. When a new advisor picks their photo, the upload gets blocked, so nothing saves. The upload button already puts each advisor's photo in their own folder, so it just needs permission to do that.

## What I'll do
Run your bot's SQL, mostly as it is. It's sound and it matches how the site already works:

1. **Advisor photo uploads (the main fix):** signed-in advisors can upload, replace and delete photos in their own folder only. They can't touch anyone else's. Admins keep full access, and everyone can still view photos.
2. **Admins can manage all advisors:** adds one rule that also lets admins create and delete advisor profiles. Today admins can only view and edit them.
3. **Admins can save firms:** investment firms and accounting firms currently have no rule that lets anyone save changes, so admin firm edits may not stick. This adds admin-only save rules. The firm pages stay public.

One small change to your SQL: it adds "anyone can view firms" rules, but matching rules already exist. I'll leave those lines out so we don't end up with duplicates. Everything else runs as written.

## After
- Sign in as a test advisor and upload a photo during signup to confirm it saves and appears on the profile.
- Run the security check.

## Technical details
- Storage policies on `advisor-headshots`: INSERT, UPDATE and DELETE for `authenticated` where `(storage.foldername(name))[1] = auth.uid()::text`. This matches the `{user.id}/{file}` path in `HeadshotUpload`.
- `financial_advisors`: FOR ALL admin policy via `profiles.is_admin`. The existing self-service policies stay unchanged.
- `investment_firms` / `accounting_firms`: grants, RLS enabled, FOR ALL admin policy. Skip the redundant public SELECT policies.
- No app code changes are expected. If the test upload still fails, I'll check the form wiring next.
