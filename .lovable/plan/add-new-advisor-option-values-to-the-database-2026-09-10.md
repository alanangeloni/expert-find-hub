# Add new advisor option values to the database

Your file lists 181 new option values across five lists. They will all be added, with the misplaced ones routed to the correct list. Nothing on the site changes yet: this only prepares the database so your CSV import of ~300 advisors succeeds.

## Name matching

The list names in your file don't match the ones the database actually uses. They map like this:

| In your file | Actual name in the database |
| --- | --- |
| clientele_type | clientele_type (matches) |
| advisor_services | "Advisor Services" |
| professional_designations | professional_designations_for_advisors |
| compensation | compensation_type |
| licenses | advisors_licenses |

## What gets added

- Clientele: 60 new values, plus the client-type entries pulled out of the services list (Baby Boomers, Medical Professionals, Entrepreneurs, Corporate Executives, Generation X, Millennials, Federal Employees, Novice Investors, Professional Athletes or Entertainers, Pre-retirees and retirees, and similar).
- Services: the remaining ~75 values, added exactly as written, including truncated ones like "Tax Minimization Inv..." and one-offs like "Wichita area residents".
- Fee types: the 4 new ones from your file, plus Hourly, AUM, and Fixed Fee (Subscription, Retainer, etc.) moved over from the services list.
- Credentials: 16 new values.
- Licenses: 9 new values, skipping any that already exist (Series 3 and Series 26 are already there).

Values that already exist are skipped so nothing errors out mid-run.

## Technical notes

- Applied as a single migration. Each `ALTER TYPE ... ADD VALUE` runs individually with `IF NOT EXISTS`, since Postgres won't allow enum additions inside a transaction with dependent usage.
- No table, policy, or view changes.
- The generated Supabase types file refreshes after the migration; no app code is edited.
- Site filters and forms keep their current curated option lists, per your choice.

## After this

Your CSV import through the Supabase dashboard will accept rows using any of these values. If you later want the new options selectable in the site's filters and forms, that's a separate, small follow-up.
