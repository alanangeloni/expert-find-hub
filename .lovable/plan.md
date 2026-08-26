# SEO fixes

The biggest problem right now: every canonical URL, Open Graph URL, and sitemap entry points at `https://financial-professional.lovable.app`, not your live domain `https://financialprofessional.com`. Google treats those as two different sites, and your real domain's pages are being told "the real version lives somewhere else." Everything else below is secondary to fixing that.

## 1. Point the whole site at financialprofessional.com

- Replace the lovable.app URL in `index.html` (canonical, `og:url`, `og:image`, `twitter:image`).
- Replace it in every page's `<Seo canonicalUrl=...>` call: Index, Advisors, AdvisorDetail, InvestmentFirms, InvestmentFirmDetail, AccountingFirms, AccountingFirmDetail, Blog, BlogArticle, App.
- Replace it in `public/sitemap.xml`, `public/robots.txt` (Sitemap directive) and `src/utils/sitemap.ts`.

## 2. Sitemap only lists 6 pages

The sitemap covers the hub pages only. Your hundreds of advisor profiles, firm pages, accounting firm pages, and blog articles are not listed anywhere, so Google has to find them by crawling links.

- Convert the sitemap into a build-time generator that queries Supabase for every approved advisor, investment firm, accounting firm, and published blog post, and emits one `<url>` per detail page alongside the static routes.
- Wire it into `predev`/`prebuild` so it regenerates automatically as content changes.
- Drop the `<lastmod>` values that are currently derived from "today" in `src/utils/sitemap.ts` (they're meaningless and Google discounts them); use real `updated_at` values for database-backed pages only.

## 3. Missing / weak per-page metadata

- Several routes render no `<Seo>` block at all (advisor registration, auth pages, admin). Public ones need a title + description; private ones (auth, admin, profile, `/app`) should be `noindex` so they stop competing for crawl budget.
- Add `og:url` self-reference on every page that sets a canonical (the `Seo` component already supports it, but pages don't always pass it).
- Detail pages should carry richer descriptions built from the record (name, firm, city, specialties) instead of generic text.

## 4. Structured data

- `Organization` + `WebSite` (with `SearchAction`) JSON-LD sitewide in `index.html`.
- `FinancialService` / `Person` schema on advisor detail pages, `Organization` on firm pages, `Article` + `BreadcrumbList` on blog articles.
- `BreadcrumbList` on all detail pages so results show a path instead of a raw URL.

## 5. Google Search Console

Not connected, so you have zero visibility into what Google actually sees. Once the domain fix ships: connect Search Console, verify `https://financialprofessional.com`, and submit the sitemap.

## Technical notes

- Canonical host assumed to be the apex `https://financialprofessional.com` (www redirects to it). Say so if you'd rather standardise on `www`.
- The site prerenders through `prerender.js` / `scripts/build-ssg.js`, so head tags set via `react-helmet-async` do land in the static HTML — no SSR migration needed.
- No visual or copy changes on any page; this is metadata, sitemap, and structured-data work only.

## Order of work

1. Domain swap everywhere (biggest impact, lowest risk)
2. Dynamic sitemap generator + robots
3. Per-page metadata and noindex on private routes
4. Structured data
5. Search Console connect + sitemap submit
