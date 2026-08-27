# Browse financial professionals by state

Two new SEO page types, built with the existing advisor cards and current theme:

1. `/financial-professionals` — a hub page listing every US state as a card link (like the reference screenshot, in our black/white/green style).
2. `/financial-professionals/:state` — one page per state, e.g. `/financial-professionals/california`, listing that state's advisors with our `AdvisorCard`.

Everything targets the phrase "financial professional" rather than "advisor".

## Hub page

- H1: "Browse Financial Professionals by State"
- Intro line naming vetted financial professionals, advisors and firms.
- Grid of all 50 states + DC. Each card shows the state name and the number of financial professionals listed there.
- States with no listings yet still appear in the grid (internal linking), but their state page is marked `noindex` until it has listings.
- Uses our cream background, serif/italic heading accent, white cards with our border and hover lift.

## State page

- H1: "Find a Financial Professional in {State}"
- Intro paragraph written per state (state name, count, mix of specialties present) so pages are not duplicate copy.
- Results grid using the existing `AdvisorCard`, same layout as `/advisors`, with the compare toggle working as usual.
- Lightweight filters: search box, specialty dropdown, sort. Reuses the current filter styles rather than the full sidebar.
- "Browse by specialty in {State}" links back into `/advisors?state=X&specialty=Y` for the top specialties in that state.
- Related links row: neighbouring/nearby states plus a link back to the hub.
- Newsletter CTA at the bottom, matching `/advisors`.
- Empty state: friendly message plus a link to all financial professionals.

## SEO

- Hub: title "Browse Financial Professionals by State", canonical `https://financialprofessional.com/financial-professionals`, `BreadcrumbList` + `ItemList` JSON-LD.
- State pages: title "Financial Professionals in {State} | Find a Financial Professional", unique meta description, self-referencing canonical, `BreadcrumbList` + `ItemList` of the listed professionals.
- Both added to the sitemap generator, with state slugs pulled from live data.
- Footer gets a "Browse by state" link to the hub so the pages are crawlable from every page.

## Technical notes

- New pages: `src/pages/StatesIndex.tsx`, `src/pages/StateAdvisors.tsx`; routes added in `src/App.tsx`.
- State slugs: lowercase, hyphenated (`new-york`), mapped back to the `state_hq` values already stored as full state names.
- Data comes from the existing `getAllAdvisors()` (public view) and is grouped client-side, so no schema or query changes and PII stays protected.
- Styles in a new `src/styles/design/StatesPage.css` using existing design tokens; no new colors or fonts.
- `scripts/generate-sitemap.js` gets the hub entry plus one entry per state that has listings.

## Open choice

State membership is based on `state_hq` (where the professional's firm is headquartered). We could instead include anyone licensed in the state via `states_registered_in`, which would make each page much fuller but less locally precise. Default in this plan: `state_hq`. Say the word and I'll switch it, or list registered-in professionals in a secondary section below the local ones.
