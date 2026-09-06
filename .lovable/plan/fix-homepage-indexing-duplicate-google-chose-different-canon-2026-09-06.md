# Fix homepage indexing: "Duplicate, Google chose different canonical than user"

## What Google reports

Search Console shows the homepage is **not indexed**. Google's stored crawl says the page declares `https://financialprofessional.com/` as canonical, but Google chose `https://www.financialprofessional.com/` instead and treats the homepage as a duplicate. The page itself is crawlable and allowed by robots.txt — this is purely a canonical conflict.

## Root cause

Two things are fighting each other:

1. **The live homepage HTML has no canonical tag at all.** The SSG build skips the homepage, so the static `index.html` served to Google contains no `<link rel="canonical">`. The canonical only appears after JavaScript runs (via the `Seo` component in `Index.tsx`). When Google indexes the pre-JS version, it sees no declared canonical and picks one itself — it picked `www`.
2. **The `www` version was previously serving the site** without a redirect. A `www → apex` redirect now exists (verified live: `www.financialprofessional.com` returns a 302 to the apex), but Google's indexed copy predates it, so it still considers `www` the real page.

## Fix

### 1. Give the static homepage a self-referencing canonical

- Add `<link rel="canonical" href="https://financialprofessional.com/" />` (plus matching `og:url`) directly to the static `index.html`, so Google's first fetch — before any JavaScript — sees the apex as the canonical homepage.
- Update `scripts/build-ssg.js` / `prerender.js` so that when a prerendered page injects its own canonical via `headTags`, the template's homepage canonical is removed/replaced. This prevents two canonical tags on prerendered routes (two conflicting canonicals is worse than none — Google ignores both).

### 2. Publish and ask Google to recrawl

- Publish the change so the live site serves the canonical in static HTML.
- Once live, you click **"Validate Fix"** in Search Console on the "Duplicate, Google chose different canonical than user" report. The `www → apex` redirect already in place reinforces the signal; Google typically re-indexes within days to a couple of weeks. (Requesting indexing itself must be done by you in Search Console's URL Inspection tool — it can't be done through the API.)

## Notes

- No design or content changes — head metadata and build script only.
- Search Console performance snapshot (last 28 days): 2 clicks, 1,655 impressions — the site is getting impressions through other pages, so this is a homepage-specific canonical issue, not a sitewide penalty.
