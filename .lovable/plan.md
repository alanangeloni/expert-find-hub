# Fix Chip Alignment + Add Definition Tooltips

## What we'll do

### 1. Center the homepage "Popular" chips
In `src/styles/design/HomePage.css`, the `.home-hero__chips` row mixes the "Popular:" label with wrapping chips, which makes the group look off-center on desktop.
- Keep the label and chips as one centered flex group, and center each wrapped row (`justify-content: center` is present, but the label throws off visual balance).
- Fix: put the label on its own centered line above the chips (or visually center the whole block) so the pill row reads as centered, matching the mobile layout.

### 2. Fix "Areas of focus" pill alignment on advisor detail
In `src/styles/design/AdvisorDetailPage.css`, `.advisor-detail__specialty-grid` uses `flex-wrap` with left alignment and fixed 40px pills.
- Keep left-aligned grid (matches section content) but even out gaps, pill heights, and vertical alignment so rows look tidy and consistent with the homepage chip style (same radius, padding, hover behavior).

### 3. Hover definition popups (tooltips)
Create a small reusable tooltip, no new dependencies:
- New `src/components/common/InfoTooltip.tsx` (or a CSS-only `data-tooltip` span) that shows a definition bubble on hover/focus above the pill, with an arrow, using design tokens (white card, border, shadow, small text).
- New `src/constants/definitions.ts` with two maps:
  - **Specialty/service definitions** — one-sentence plain-English explanation for each entry in `advisorServices.ts` (e.g. "Retirement Planning: Building a strategy for income, savings, and investments so you can retire comfortably.").
  - **Certification/designation definitions** — keyed by acronym and full name (CFP, CFA, CPA, ChFC, LUTCF, CIMA, RICP, EA, etc.), each with the full name and a one-line description of what the credential means.
- Wire it up in `src/pages/AdvisorDetail.tsx`:
  - "Areas of focus" pills: hovering a pill shows that specialty's definition.
  - "Designations" badges: hovering an acronym badge shows the full name + definition.
  - "Licenses" badges get the same treatment where a definition exists.
- Fallback: if no definition exists, no tooltip is shown.
- Tooltips are keyboard accessible (appear on focus) and don't wrap the pill links in a way that breaks click-through to the filtered advisors page.

## Technical notes
- Files touched: `HomePage.css`, `AdvisorDetailPage.css`, new `InfoTooltip` (or pure-CSS tooltip classes in a design CSS file), new `src/constants/definitions.ts`, and `AdvisorDetail.tsx`.
- Tooltip content is static copy in a constants file — easy to edit later.
- No database changes; no new packages.
