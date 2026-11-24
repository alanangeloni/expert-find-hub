# Rename "Asset Management" to "Investment Management" for firms

## What changes
- The firm category "Asset Management" becomes "Investment Management" in the database.
- The 5 firms that have advisors attached (the only ones with this label today) automatically switch to "Investment Management". No other firms change.
- The firm category dropdown filter on the firms page and the admin firm form show "Investment Management" instead of "Asset Management".

## Technical details
- Migration: `ALTER TYPE public."Asset Class" RENAME VALUE 'Asset Management' TO 'Investment Management';` (renames in place, existing rows update automatically).
- Update labels in `src/data/investmentFirms.ts`, `src/components/admin/InvestmentFirmManagement.tsx`, `src/components/admin/InvestmentFirmForm.tsx`.
- Verify: query that 5 firms now read "Investment Management", and the filter dropdown lists it.
- Firm pages update for search engines after the next publish.
