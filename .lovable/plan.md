# Homepage: 6 advisor cards with photos + photo-first ordering on browse pages

## What changes

### 1. Homepage featured advisors
- Show **6 cards** instead of 3.
- Only advisors **with a profile photo** (`headshot_url` set) are eligible.
- Keep the current random shuffle so it's fair — we fetch a pool of photo-having advisors, shuffle, and take 6.

### 2. Browse pages show photo advisors first
- On the advisor directory (`/advisors`), the state pages (`/financial-professionals/:state`), and the service pages (`/services/:slug`), advisors **with photos sort to the top**, advisors without photos appear after.
- Within each group (photo / no photo), ordering stays **random** so no advisor is permanently buried — randomization is preserved, just photo-having advisors get the top slots.
- Filters, search, and the "Load more" behavior work exactly as before; only the ordering changes.

### What does NOT change
- No design or layout changes — same cards, same grid (it already handles 2-3 columns, so 6 cards fill two rows nicely).
- No changes to advisor detail pages, admin, or the database.
- Advisors without photos still appear on browse pages, just lower down.

## Technical details
- `src/pages/Index.tsx` — `FeaturedAdvisors`: filter `getAdvisors` results to `headshot_url` present, shuffle, slice to 6.
- `src/services/advisorsService.ts` — add a small helper (e.g. `sortPhotoFirst`) that stable-partitions a list into photo/no-photo with a random shuffle inside each group.
- Apply that helper in the results ordering of `src/pages/Advisors.tsx`, `src/pages/StateAdvisors.tsx`, and `src/pages/ServiceAdvisors.tsx` (and the homepage), so the rule lives in one place.
- Randomization uses the existing shuffle pattern already used on the homepage.
