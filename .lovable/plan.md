# Accountant Profiles

Build a full accountant directory that mirrors the advisor experience, without wiring it into the site navigation yet. No homepage, header, or footer changes. No reviews anywhere on accountant pages. Job board is deferred.

## What gets built

**1. Accountant records (database)**
A new `accountants` table modeled on the existing advisors table: name, slug, title/position, bio, firm name, optional link to an existing accounting firm, headshot, city/state, states served, email and phone (kept private), website, credentials (CPA, EA, etc.), years of experience, minimum fee, pricing note, verified flag, and status (draft / approved).

Two list fields drive filtering:
- **Services** (expanded list: Tax Preparation, Business Tax Preparation, Tax Planning & Strategy, IRS Representation & Tax Resolution, Estate & Trust Tax, Bookkeeping, Accounts Payable/Receivable, Payroll Services, Sales Tax, Advisory Services, Business & Entity Formation, Business Valuation, Fractional CFO Services, Controller Services, Cash Flow Forecasting, Cost Accounting, Audit Services, Forensic Accounting, International Tax Services, Mergers and Acquisitions, QuickBooks Setup & Cleanup, Back-Office Support)
- **Client specialties** (from the specialty list in the screenshot: Athletes & Entertainers, Bootstrapped Companies, Business Executives, Business Owners/Entrepreneurs, Content Creators, Cryptocurrency Investors, Digital Nomads, Divorced Individuals, Enterprise Companies, Equity Compensation, Generational Wealth Transfer, Growing Companies, HENRYs, High Net Worth Individuals, International/Expats, K1 Partnership Income, Mid-Market Companies, Multi-generational Families, Multi-state Returns, Pre-Retirees, Pre-revenue Startups, Private Equity-Backed Companies, Professors & Educators, QSBS Holders, Real Estate Investors, Retirees, SMB Owners, Solopreneurs, Ultra High Net Worth Individuals, VC Backed Startups, Young Professionals)

Contact email and phone are protected the same way advisor contact info is: hidden from public reads, exposed only to admins through a secure lookup function.

**2. Public pages (built, not linked)**
- `/accountants` — directory hero in the current site style, filters (specialty, service, state, credential, keyword search), and an accountant card grid reusing the advisor card layout.
- `/accountants/:slug` — profile page matching the advisor detail layout: hero with name/firm/location/credentials, about, services offered, client specialties (chips with tooltips), credentials & licenses, states served, pricing, contact/meeting CTA, disclaimer, JSON-LD. No reviews section.
- `/accountants/specialty/:slug` — one page per client specialty ("Accountants for Athletes & Entertainers") with intro copy, filters, matching accountant cards, FAQ block, and cross-links to other specialties.

These routes exist and work by URL but appear in no menu or footer.

**3. Admin management**
A new "Accountants" tab in the admin entity dashboard with the same pattern as advisor management: searchable list, add/edit form covering every field above (including multi-select services, specialties, states, credentials), headshot upload, verified/status toggles, and delete with confirmation.

## Technical notes

- Migration creates `public.accountants` with GRANTs, RLS (public reads limited to approved rows via an `accountants_public` view that omits email/phone; admins full access via `profiles.is_admin`), `updated_at` trigger, and a `get_accountant_contact(uuid)` security-definer function.
- Two new enums or constant arrays for accountant services and client specialties; the existing `accounting_service_type` and `client_specialty_type` enums already carry these values and will be reused.
- New files: `src/constants/accountantSpecialties.ts`, `src/services/accountantsService.ts`, `src/components/accountants/AccountantCard.tsx`, `src/pages/Accountants.tsx`, `src/pages/AccountantDetail.tsx`, `src/pages/AccountantSpecialty.tsx`, `src/components/admin/AccountantManagement.tsx`, `src/components/admin/AccountantForm.tsx`, `src/styles/design/AccountantsPage.css`.
- Edited: `src/App.tsx` (routes), `src/index.css` (style import), `src/pages/admin/AdminEntityDashboard.tsx` (new tab).
- Sitemap and navigation stay untouched until you say the pages are ready to launch.
