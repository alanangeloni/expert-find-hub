# Match hero headings across directory pages to the Journal style

## Goal
Give the Advisors, Firms, and state pages the same hero treatment the blog uses: green keyline, uppercase eyebrow, a two-line headline where the second line is italic serif, then supporting copy and buttons.

## Blog pattern (reference)
```text
▬ (green keyline)
THE JOURNAL
Clarity for every
financial decision   <- italic serif second line
sub-copy
[Take the matching quiz] [Browse advisors]
```

## Changes

1. **`src/pages/Advisors.tsx`** — Add the green `keyline` above the eyebrow and split the H1 into two lines:
   `Find your financial` / `<em>advisor</em>`
   Keep the existing eyebrow, sub-copy, and "Take matching quiz" button; place buttons in a hero CTA row like the blog.

2. **`src/pages/InvestmentFirms.tsx`** — Same treatment:
   keyline + `Firm directory` eyebrow, H1 as `Browse independent` / `<em>investment firms</em>`, keep sub-copy, and add a hero CTA row (Browse advisors / Take matching quiz) so the layout matches.

3. **`src/pages/StatesIndex.tsx`** — keyline + eyebrow, H1 as
   `Browse <em>Financial Professionals</em>` / `by State` (two lines, italic on the phrase the user picked).

4. **`src/pages/StateAdvisors.tsx`** — keep the breadcrumb, then H1 as
   `Find a Financial Professional` / `<em>in {state}</em>` (two lines).

5. **CSS updates** — In `src/styles/design/AdvisorSearchPage.css`, `FirmSearchPage.css`, and `StatesPage.css`:
   - match the blog's hero sizing/weight (`clamp(2rem, 4.5vw, 3.25rem)`, weight 800, tight tracking, line-height ~1.08)
   - add the `em` serif-italic rule where missing
   - add a flex hero row (copy left, CTA buttons right, wrapping on mobile) mirroring `.blog-page__hero-inner`

## Notes
- Headline wording is unchanged, so SEO/H1 targeting stays intact.
- Filters, cards, and page bodies are untouched; this is hero styling only.
