# Service (specialty) landing pages at /services

Build an SEO directory for every advisor service, mirroring the reference layout but in our existing black/white/green Journal style, reusing the advisor cards.

## Pages

### Hub: `/services`
- Journal-style hero: keyline, "Advisor services" eyebrow, two-line H1 "Browse Financial Professionals" / *by Specialty*, sub-copy, CTA row (matching quiz, browse all advisors).
- Grid of cards, one per service (all 35 from the services list), each showing the service name, its short definition, and the count of professionals offering it. Links to the service page.
- Newsletter section at the bottom, same as other directory pages.

### Service page: `/services/:slug` (e.g. `/services/alternative-investments`)
Sections, top to bottom:
1. Breadcrumb (Services / {Service}) + H1 "Find a Financial Professional for *{Service}*", intro paragraph generated from the count, top states, and the service definition.
2. Existing `SearchFilters` bar (state, fees, fiduciary, minimums, sort) filtering only advisors offering that service.
3. Grid of `AdvisorCard`s with "Load more" pagination, plus the compare toggle already built into the card.
4. "What to look for in a financial professional for {Service}" - a short bulleted checklist.
5. FAQ block (3 questions per service, generated from the service name/definition) rendered in our existing accordion/FAQ style.
6. Related blog posts: up to 3 posts matched by category/tag or keyword against the service name, using the existing `BlogCard`.
7. "Explore more" internal-link sections: other services, and this service filtered by top states (`/financial-professionals/{state}`) - for internal linking.
8. Newsletter section.

Empty state: if no advisors offer the service, show the intro, a message, and a link to the full directory; mark the page `noIndex` (same rule already used on empty state pages).

## SEO
- Unique title/description per service, canonical `https://financialprofessional.com/services/{slug}`.
- JSON-LD: `BreadcrumbList` + `CollectionPage` with `ItemList` of listed professionals, and `FAQPage` for the FAQ block.
- Single H1, H2s for each section.
- Add hub + all service pages to `scripts/generate-sitemap.js` and to the SSG prerender route list.
- Add a "Browse by specialty" link group in the footer alongside the by-state links.

## Technical notes
- New `src/constants/serviceSlugs.ts` with `serviceSlug()` / `serviceFromSlug()` helpers over `ADVISOR_SERVICES`, plus per-service copy (definition reused from `src/constants/definitions.ts`, checklist bullets, FAQ entries) in `src/constants/serviceContent.ts` with sensible generated defaults so every service is covered.
- New pages `src/pages/ServicesIndex.tsx` and `src/pages/ServiceAdvisors.tsx`, modeled on `StatesIndex.tsx` / `StateAdvisors.tsx`; filtering uses `valuesForSpecialty` so grouped labels still match DB values.
- New `src/styles/design/ServicesPage.css` (BEM `services-page__*`, `service-page__*`), imported from `src/index.css`, reusing existing tokens and hero typography from the states/blog pages.
- Routes added in `src/App.tsx`: `/services` and `/services/:slug`.
- No database or backend changes; data comes from the existing `financial_advisors_public` query.
