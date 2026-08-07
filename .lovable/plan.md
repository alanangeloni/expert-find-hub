# Show all advisors in the directory

## What's happening

The advisor directory reads from a public view that only exposes advisors whose status is `approved`. Your table has 233 advisors:

- 91 approved (the ones currently visible)
- 141 draft
- 1 pending approval

Nothing is broken in the page or the filters — the other 142 advisors are simply not marked approved.

## The fix

Mark all 142 non-approved advisors as approved so they appear publicly, stamping their approval timestamp.

After that, the directory should report 233 advisors.

## Technical details

- Data update on `public.financial_advisors`: set `status = 'approved'` and `approved_at = now()` for every row where `status <> 'approved'`.
- No schema, view, or RLS change needed — `financial_advisors_public` already filters on `status = 'approved'`.
- No frontend change needed; `getAllAdvisors` already fetches up to 1000 rows, so 233 fits.
