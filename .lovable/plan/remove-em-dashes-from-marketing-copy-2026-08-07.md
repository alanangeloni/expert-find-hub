# Remove em dashes from marketing copy

## Goal
Replace all em dashes in website marketing/body copy with appropriate punctuation while leaving functional placeholders and separators unchanged.

## Scope
Marketing copy only. Functional uses of em dashes remain untouched:
- Missing-value placeholders (e.g., `—` for unknown AUM, years of experience, education)
- Page title separators (`Advisor Name — Financial Advisor`)
- Inline stat separators in detail tables

## Files affected

```text
src/pages/Index.tsx      (12 occurrences in hero, quiz, FAQ, and value-prop copy)
src/pages/Advisors.tsx   (1 meta description occurrence)
src/pages/Blog.tsx       (2 occurrences in journal intro copy)
src/pages/BlogArticle.tsx (1 occurrence in journal intro copy)
src/pages/App.tsx        (1 quote-attribution occurrence)
```

## Approach

For each occurrence, replace the em dash with the most natural punctuation:
- Mid-sentence separation → comma or period
- Introducing a list or explanation → colon
- Emphasis/aside inside a sentence → comma or rephrase without a dash
- Quote attribution → en dash or remove the dash depending on context

Examples of expected replacements:
- `Optional — leave blank for nationwide.` → `Optional. Leave blank for nationwide.`
- `no obligation — talk to as many advisors` → `no obligation. Talk to as many advisors`
- `rankings — ever` → `rankings, ever`
- `directory — either way` → `directory. Either way`
- `side by side — free` → `side by side, free`
- `goals—or compare` → `goals, or compare`
- `— Bankrate` → review against surrounding quote styling and choose an en dash or remove the dash

## Verification
- Run a fresh search to confirm no em dashes remain in marketing copy.
- Run a production build to ensure no syntax errors from string changes.
- Spot-check the homepage, advisors page, and journal pages in the preview.

## Out of scope
- Data model / schema
- Component logic
- API calls or storage
- SEO metadata structure (only the em dash inside the description string is updated)
