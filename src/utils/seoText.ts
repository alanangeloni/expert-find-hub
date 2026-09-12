// Shared helpers for building SEO titles and meta descriptions.
// Never truncate mid-word: cut at the last word boundary and add an ellipsis.

const SUFFIX = "Financial Professional";
export const TITLE_MAX = 60;
export const DESC_MIN = 150;
export const DESC_MAX = 158;

const collapse = (value: string) => String(value ?? "").replace(/\s+/g, " ").trim();

/** Truncate at a word boundary. Adds `ellipsis` only when text was actually cut. */
export const clampAtWord = (value: string, max: number, ellipsis = ""): string => {
  const text = collapse(value);
  const limit = max - ellipsis.length;
  if (text.length <= max) return text;
  const cut = text.slice(0, limit + 1);
  const lastSpace = cut.lastIndexOf(" ");
  const base = (lastSpace > 0 ? cut.slice(0, lastSpace) : cut.slice(0, limit)).replace(/[\s,;:.\-—–]+$/, "");
  return `${base}${ellipsis}`;
};

/**
 * Build a "<main> | Financial Professional" title that always fits in 60 chars.
 * The suffix is dropped before the main phrase is ever cut mid-word.
 */
export const seoTitle = (main: string, suffix: string | null = SUFFIX): string => {
  const head = collapse(main);
  if (!suffix) return clampAtWord(head, TITLE_MAX);
  const tail = ` | ${suffix}`;
  if (head.length + tail.length <= TITLE_MAX) return `${head}${tail}`;
  const room = TITLE_MAX - tail.length;
  if (room >= 24) return `${clampAtWord(head, room)}${tail}`;
  return clampAtWord(head, TITLE_MAX);
};

/**
 * Build a 150-160 character meta description that reads as a complete phrase.
 * `filler` sentences are appended (whole only) when the base text is too short.
 */
export const seoDescription = (base: string, ...filler: string[]): string => {
  let text = collapse(base);
  for (const extra of filler) {
    if (text.length >= DESC_MIN) break;
    const next = collapse(extra);
    if (!next) continue;
    const joined = `${text.replace(/[.\s]+$/, "")}. ${next}`.replace(/^\.\s*/, "");
    if (joined.length <= DESC_MAX) text = joined;
  }
  if (text.length <= DESC_MAX) return text;
  return clampAtWord(text, DESC_MAX, "…");
};
