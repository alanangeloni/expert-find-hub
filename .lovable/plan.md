# Fix state page heading styling

## Problem
On the "Browse by state" pages, the H1 ends with a single word ("State" or the state name) rendered in italic serif (`<em>`). A lone italic word at the end of the line looks unbalanced and inconsistent with the rest of the site — other directory pages (Advisors, Investment Firms) use clean all-sans H1s with no italic accent, and the homepage only uses italic serif on multi-word phrases mid-heading.

## Changes

1. **`src/pages/StatesIndex.tsx`** — Change the H1 from
   `Browse Financial Professionals by <em>State</em>`
   to plain text: `Browse Financial Professionals by State`

2. **`src/pages/StateAdvisors.tsx`** — Change the H1 from
   `Find a Financial Professional in <em>{state}</em>`
   to plain text: `Find a Financial Professional in {state}`

3. **`src/styles/design/StatesPage.css`** — Remove the now-unused `.states-page__hero h1 em` serif/italic override so no dead styles remain.

## Notes
- H1 wording stays identical, so SEO (unique H1s targeting "financial professional") is unchanged.
- No other visual changes to these pages; the eyebrow, sub-copy, tiles, and advisor cards stay as-is.
