# Fix state page heading styling

## Problem
On the "Browse by state" pages, the H1 ends with a single italic word ("State" or the state name). That lone italic accent at the end of the line looks unbalanced.

## Resolution
Italicize a word or phrase earlier in the heading so the accent feels intentional and matches the rhythm of the homepage headings.

## Changes

1. **`src/pages/StatesIndex.tsx`** — Change the H1 to italicize the phrase "Financial Professionals":
   `<h1>Browse <em>Financial Professionals</em> by State</h1>`

2. **`src/pages/StateAdvisors.tsx`** — Change the H1 to italicize the word "in":
   `<h1>Find a Financial Professional <em>in</em> {state}</h1>`

3. **`src/styles/design/StatesPage.css`** — Keep the `.states-page__hero h1 em` rule as-is since it is still used.

## Notes
- H1 text content stays identical, so SEO is unchanged.
- No other visual changes to these pages.
