# Fix inconsistent and collapsed buttons

## The problem

Two separate issues make buttons look wrong:

1. **Collapsed buttons.** The design system's button style only gets its height and padding from a size class (`sm`/`md`/`lg`). Several buttons were written without one, so they render with zero padding and a squashed height — that's why "Take matching quiz" looks like a thin sticker with the text touching the edges.

2. **Two different button styles side by side.** The header's "Sign in" and "Sign up" use the old shadcn button (square-ish corners, mint green, 40px tall) while "Search advisors" next to them uses the new pill style (black, 36px tall). They don't match.

## The fix

- Give every button a proper default: if no size is specified, it falls back to the standard medium height and padding instead of collapsing.
- Add the missing size to the buttons currently written without one:
  - "Take matching quiz" on the advisor directory
  - "Browse all advisors" / "Browse all firms" on the not-found states of the advisor and firm detail pages
  - "Visit website" in both detail-page sidebars
- Convert "Sign in" and "Sign up" in the header to the site's pill button style — "Sign in" as an outlined pill, "Sign up" as a green pill — so all three header buttons share the same shape, height, and typography.

No layout, copy, or behavior changes.

## Technical details

- `src/styles/design/Button.css`: add `height: 44px; padding: 0 var(--space-6); font-size: var(--text-sm);` to the base `.btn` rule so size modifiers override rather than supply the only sizing.
- Add `btn--md` (or `btn--sm` where inline in a compact row) to: `src/pages/Advisors.tsx:115`, `src/pages/AdvisorDetail.tsx:47` and `:376`, `src/pages/InvestmentFirmDetail.tsx:46` and `:284`.
- `src/components/auth/UserMenu.tsx`: replace the two shadcn `<Button>`s with `<Link className="btn btn--outline btn--sm">` and `<Link className="btn btn--green btn--sm">` to match `header__cta`.
- Verify with an element screenshot of the header and the advisor-directory hero after the change.
