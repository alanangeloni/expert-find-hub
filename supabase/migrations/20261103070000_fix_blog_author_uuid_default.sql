-- blog_posts.author_id is a uuid foreign key to profiles.id.
-- A column default or trigger that writes the byline "Financial Professional "
-- (note the trailing space) makes saves fail with
-- 22P02 invalid input syntax for type uuid.
-- Drop those defaults and triggers. Do not update existing article rows.

DO $$
DECLARE
  rec record;
  expr text;
BEGIN
  FOR rec IN
    SELECT a.attname,
           a.attgenerated,
           pg_get_expr(d.adbin, d.adrelid) AS def,
           t.typname
    FROM pg_attribute a
    JOIN pg_class c ON c.oid = a.attrelid
    JOIN pg_namespace n ON n.oid = c.relnamespace
    JOIN pg_type t ON t.oid = a.atttypid
    LEFT JOIN pg_attrdef d ON d.adrelid = a.attrelid AND d.adnum = a.attnum
    WHERE n.nspname = 'public'
      AND c.relname = 'blog_posts'
      AND a.attname IN ('author_id', 'Author')
      AND NOT a.attisdropped
  LOOP
    expr := rec.def;
    IF rec.attgenerated <> '' AND expr ILIKE '%Financial Professional%' THEN
      EXECUTE format('ALTER TABLE public.blog_posts ALTER COLUMN %I DROP EXPRESSION IF EXISTS', rec.attname);
    ELSIF rec.typname = 'uuid' AND expr IS NOT NULL AND (
      expr ILIKE '%Financial Professional%'
      OR (expr ~ '''[^'']+''' AND expr !~* '[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}')
    ) THEN
      EXECUTE format('ALTER TABLE public.blog_posts ALTER COLUMN %I DROP DEFAULT', rec.attname);
    END IF;
  END LOOP;

  FOR rec IN
    SELECT tg.tgname, pg_get_functiondef(tg.tgfoid) AS def
    FROM pg_trigger tg
    JOIN pg_class c ON c.oid = tg.tgrelid
    JOIN pg_namespace n ON n.oid = c.relnamespace
    JOIN pg_proc p ON p.oid = tg.tgfoid
    JOIN pg_language l ON l.oid = p.prolang
    WHERE n.nspname = 'public'
      AND c.relname = 'blog_posts'
      AND NOT tg.tgisinternal
      AND l.lanname IN ('plpgsql', 'sql')
  LOOP
    IF rec.def ILIKE '%Financial Professional%'
       OR (rec.def ~* 'author_id' AND rec.def ~* '"Author"' AND rec.def ~* '::[[:space:]]*uuid') THEN
      EXECUTE format('DROP TRIGGER IF EXISTS %I ON public.blog_posts', rec.tgname);
    END IF;
  END LOOP;
END $$;

-- Resolve a byline or slug to a profile uuid. Empty input returns null.
-- required = false is for a stored legacy byline: no match does not raise,
-- so the article can still be saved without writing the name into author_id.
CREATE OR REPLACE FUNCTION public.resolve_blog_author(raw_name text, required boolean DEFAULT true)
RETURNS uuid
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  trimmed text := btrim(COALESCE(raw_name, ''));
  normalized text;
  v_slug text;
  matches uuid[];
BEGIN
  IF trimmed = '' THEN
    RETURN NULL;
  END IF;

  IF trimmed ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' THEN
    RETURN trimmed::uuid;
  END IF;

  IF auth.uid() IS NULL OR NOT EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = auth.uid() AND p.is_admin IS TRUE
  ) THEN
    RAISE EXCEPTION 'Only admins can resolve a blog author'
      USING ERRCODE = '42501';
  END IF;

  normalized := lower(regexp_replace(trimmed, '\s+', ' ', 'g'));
  v_slug := regexp_replace(
    regexp_replace(normalized, '[^a-z0-9]+', '-', 'g'),
    '(^-+|-+$)', '', 'g'
  );

  WITH named AS (
    SELECT
      p.id,
      lower(btrim(regexp_replace(
        concat_ws(' ', btrim(coalesce(p.first_name, '')), btrim(coalesce(p.last_name, ''))),
        '\s+', ' ', 'g'
      ))) AS norm
    FROM public.profiles p
    UNION ALL
    SELECT
      author_row.author_uuid::uuid,
      lower(btrim(regexp_replace(
        concat_ws(' ', btrim(coalesce(author_row.first_name, '')), btrim(coalesce(author_row.last_name, ''))),
        '\s+', ' ', 'g'
      ))) AS norm
    FROM (
      SELECT a."author id" AS author_uuid, a.first_name, a.last_name
      FROM public.authors a
      WHERE a."author id" ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
    ) AS author_row
  ),
  keyed AS (
    SELECT
      named.id,
      named.norm,
      regexp_replace(
        regexp_replace(named.norm, '[^a-z0-9]+', '-', 'g'),
        '(^-+|-+$)', '', 'g'
      ) AS slug
    FROM named
    WHERE named.id IS NOT NULL AND named.norm <> ''
  )
  SELECT COALESCE(array_agg(DISTINCT keyed.id), ARRAY[]::uuid[])
    INTO matches
  FROM keyed
  WHERE (keyed.norm = normalized OR keyed.slug = v_slug)
    AND EXISTS (SELECT 1 FROM public.profiles profile_row WHERE profile_row.id = keyed.id);

  IF matches IS NULL OR cardinality(matches) = 0 THEN
    IF required THEN
      RAISE EXCEPTION 'Author must be a profile id (UUID), not a display name ("%").', trimmed
        USING ERRCODE = '22023';
    END IF;
    RETURN NULL;
  END IF;

  IF cardinality(matches) > 1 THEN
    IF required THEN
      RAISE EXCEPTION 'Author "%" matches more than one profile. Choose the profile id.', trimmed
        USING ERRCODE = '22023';
    END IF;
    RETURN NULL;
  END IF;

  RETURN matches[1];
END;
$$;

REVOKE ALL ON FUNCTION public.resolve_blog_author(text, boolean) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.resolve_blog_author(text, boolean) TO authenticated;
