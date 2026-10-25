# Project rules

- Public pages are prerendered at build time: `scripts/prerender.mjs` renders every route from `scripts/seo-lib.mjs` `collectPages()` through `src/entry-server.tsx` and embeds the React Query cache. Why: crawlers need full text, links and JSON-LD in raw HTML.
- Page data must load through React Query (`useQuery`), not `useEffect` + `useState`. Why: the prerenderer only fetches pending queries, so effect-based data renders as a loading state.
- Render output must be deterministic on first render; randomness (e.g. advisor shuffles) runs after mount via `useShuffleSeed`. Why: prerendered markup must match the first browser render to hydrate.
- Head metadata (title, description, canonical, OG) comes from `seo-lib.mjs`; only JSON-LD is taken from Helmet during prerender. Why: one tuned source, no duplicate tags.
- `scripts/seo-head.mjs` replaces all existing route head tags before injecting metadata; the homepage share image is stored as a CDN asset pointer. Why: social crawlers need one unambiguous static preview without large binary files in Git.
- `main.tsx` hydrates only when `window.__PRERENDER_PATH__` matches the current path. Why: the homepage file also serves as the fallback for unlisted routes.
