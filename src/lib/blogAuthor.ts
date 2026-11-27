/** Public byline when a post has no profile author. This is not a database id. */
export const HOUSE_BYLINE = "Financial Professional";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export type AuthorCandidate = {
  id: string;
  name: string;
  slug?: string | null;
};

export const isUuid = (value: unknown): value is string =>
  typeof value === "string" && UUID_RE.test(value.trim());

export const normalizeUuid = (value: unknown): string | null => {
  if (!isUuid(value)) return null;
  return value.trim().toLowerCase();
};

export const personName = (first?: string | null, last?: string | null): string =>
  [first, last]
    .map((part) => (part ?? "").trim())
    .filter(Boolean)
    .join(" ");

/** Lowercase hyphenated key used to match an author name or slug. */
export const slugifyName = (value: string): string =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const normalizedName = (value: string): string =>
  value.trim().replace(/\s+/g, " ").toLowerCase();

const candidateKeys = (candidate: AuthorCandidate): string[] => {
  const keys = new Set<string>();
  const name = normalizedName(candidate.name || "");
  if (name) keys.add(name);
  const slug = slugifyName(candidate.slug || candidate.name || "");
  if (slug) keys.add(slug);
  return [...keys];
};

const authorIdError = (raw: string) =>
  `Author must be a profile id (UUID), not a display name ("${raw.trim()}").`;

const ambiguousAuthorError = (raw: string) =>
  `Author "${raw.trim()}" matches more than one profile. Choose the profile id.`;

/**
 * Turn an author form value into a profiles/authors UUID.
 * Blank means no author. A display name is resolved against known rows.
 * The name itself is never returned as an id.
 */
export const resolveAuthorId = (
  raw: unknown,
  candidates: AuthorCandidate[],
  options?: { required?: boolean }
): { id: string | null; error?: string } => {
  const required = options?.required ?? true;
  if (raw == null) return { id: null };
  const trimmed = String(raw).trim();
  if (!trimmed) return { id: null };

  const uuid = normalizeUuid(trimmed);
  if (uuid) return { id: uuid };

  const wanted = new Set<string>([normalizedName(trimmed), slugifyName(trimmed)].filter(Boolean));
  const matches = new Map<string, AuthorCandidate>();
  for (const candidate of candidates) {
    const id = normalizeUuid(candidate.id);
    if (!id) continue;
    if (candidateKeys(candidate).some((key) => wanted.has(key))) {
      matches.set(id, { ...candidate, id });
    }
  }

  if (matches.size === 1) return { id: [...matches.keys()][0] };
  if (!required) return { id: null };
  if (matches.size === 0) return { id: null, error: authorIdError(trimmed) };
  return { id: null, error: ambiguousAuthorError(trimmed) };
};

/** Last gate before a uuid column. Throws instead of writing a display name. */
export const blogAuthorColumn = (value: string | null | undefined): string | null => {
  if (value == null || value.trim() === "") return null;
  const id = normalizeUuid(value);
  if (!id) throw new Error(authorIdError(value));
  return id;
};

/** Postgres / Supabase SQL-editor errors, turned into a form-sized message. */
export const friendlyDatabaseError = (message: string): string => {
  const cleaned = message
    .replace(/^Failed to run sql query:\s*/i, "")
    .replace(/^ERROR:\s*[0-9A-Z]+:\s*/i, "")
    .trim();
  const uuid = cleaned.match(/invalid input syntax for type uuid:\s*"([^"]*)"/i);
  if (uuid) return authorIdError(uuid[1]);
  return cleaned || message;
};
