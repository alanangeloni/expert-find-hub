# Prerender every public page with full content

## Goal
Every public page on financialprofessional.com is served as finished HTML: the visible text, internal links, headings, and JSON-LD are already in the page before any JavaScript runs. Visitors see the same design; the page then becomes interactive as it does today. No URLs, copy, or design change.

## What exists today
- `index.html` has an empty `<!--app-html-->` slot in `#root`.
- `src/entry-server.tsx` can render the app to a string, and `src/main.tsx` already hydrates when that slot is filled. Nothing builds or calls the server entry.
- The live build (`scripts/prerender-seo.js`) only swaps head tags (title, description, canonical, OG). The body stays empty.
- `prerender.js` and `src/utils/ssg.ts` are older, unused attempts. `ssg.ts` writes a separate plain HTML block instead of the real page.
- Most pages load data through React Query after mount, so a plain render-to-string would only output loading skeletons.

## Approach
1. **Build a server bundle.** After `vite build`, run a second `vite build --ssr src/entry-server.tsx` into `dist/server`.
2. **Load data before rendering.** For each route, fetch its data at build time with the same service functions the pages already use. Put the results into a fresh React Query client so the server render shows real content instead of skeletons. Serialize that cache into the page (`window.__RQ_STATE__`) so the browser hydrates without refetching or flashing.
3. **Render every route.** Reuse the route list from `scripts/seo-lib.mjs` (the same list that drives the sitemap: home, directories, about 640 advisor, 190 accountant, firm, state, service, calculator, and blog pages). For each route: render the app, insert the HTML into `<!--app-html-->`, and use the Helmet output (title, meta, canonical, JSON-LD) as the page's only head tags, so nothing is duplicated. Write the result to `dist/<path>/index.html`.
4. **Make shared parts server-safe.** Guard `window` and `localStorage` access in Compare, Auth, calculators, and the quiz. Make sure auth checks render a signed-out shell. Remove the second HelmetProvider so the head tags are collected once. Homepage and browse-page shuffles use a fixed order during the server render and the first browser render, then reshuffle after the page loads, which keeps the photo-first random order without hydration errors.
5. **Keep it safe.** If one page fails to render, fall back to the current head-only HTML for that page and log it. The build never fails because of prerendering. Private pages (admin, profile, `/app`, auth) keep the empty client shell and `noindex`.
6. **Clean up.** Delete the unused `prerender.js`, `scripts/build-ssg.js`, and `src/utils/ssg.ts`. Fold `prerender-seo.js` into the new prerender script.

## Verification
- After a build, check sample pages: home, `/advisors`, one advisor, one state, one service, `/blog`, one article, one firm, one accountant, one calculator. Each raw HTML file should contain its H1, body text, `<a href>` links, one canonical tag, and its JSON-LD.
- Load those pages in a headless browser and confirm there are no hydration errors (React #418/#423), the design looks the same, and filters, compare, and the quiz still work.
- Compare page counts against the sitemap.

## Caveats
- Content is frozen at publish time. New advisors or scheduled posts get prerendered HTML only on the next publish. Until then the site still shows them through the browser as it does now.
- Build time goes up. With about 1,000 pages, expect a few extra minutes per publish.

## Technical details
- New files: `scripts/prerender.mjs` and a route-to-loader map in `src/ssr/loaders.ts` (pattern → `queryClient.prefetchQuery` calls that use the existing query keys).
- `entry-server.tsx`: `render(url, dehydratedState)` returns `{ appHtml, headTags }` and wraps the app in `QueryClientProvider` + `HydrationBoundary`. `App.tsx` accepts the query client as a prop instead of creating it at module level.
- `main.tsx`: reads `window.__RQ_STATE__` and hydrates it.
- Package script: `"build": "vite build && vite build --ssr src/entry-server.tsx --outDir dist/server && node scripts/prerender.mjs"`.
- Record the prerender architecture rule in `AGENTS.md`.
