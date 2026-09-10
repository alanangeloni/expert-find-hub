CREATE OR REPLACE FUNCTION public.import_advisors_bulk(rows jsonb)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  r jsonb;
  inserted integer := 0;
BEGIN
  FOR r IN SELECT * FROM jsonb_array_elements(rows) LOOP
    IF EXISTS (SELECT 1 FROM public.financial_advisors f
               WHERE f.slug = (r->>'slug')
                  OR f.id = NULLIF(r->>'id','')::uuid) THEN
      CONTINUE;
    END IF;

    INSERT INTO public.financial_advisors (
      id, name, slug, position, personal_bio, firm_bio, email, phone_number,
      firm_name, firm_address, firm_aum, advisor_sec_crd, firm_sec_crd,
      link_to_advisor_sec, link_to_firm_sec, headshot_url, firm_logo_url,
      website_url, youtube_video_id, primary_education, years_of_experience,
      fiduciary, city, state_hq, minimum, verified,
      advisor_services, professional_designations, client_type,
      states_registered_in, licenses, compensation, disclaimer, status
    ) VALUES (
      COALESCE(NULLIF(r->>'id','')::uuid, gen_random_uuid()),
      r->>'name', r->>'slug', r->>'position', r->>'personal_bio', r->>'firm_bio',
      r->>'email', r->>'phone_number', r->>'firm_name', r->>'firm_address',
      r->>'firm_aum', r->>'advisor_sec_crd', r->>'firm_sec_crd',
      r->>'link_to_advisor_sec', r->>'link_to_firm_sec', r->>'headshot_url',
      r->>'firm_logo_url', r->>'website_url', r->>'youtube_video_id',
      r->>'primary_education', NULLIF(r->>'years_of_experience','')::integer,
      COALESCE((r->>'fiduciary')::boolean, false),
      r->>'city',
      (SELECT x::"States" FROM (SELECT r->>'state_hq' AS x) s
        WHERE x = ANY(enum_range(NULL::"States")::text[])),
      r->>'minimum',
      COALESCE((r->>'verified')::boolean, false),
      (SELECT array_agg(x::"Advisor Services") FROM jsonb_array_elements_text(COALESCE(r->'advisor_services','[]'::jsonb)) x
        WHERE x = ANY(enum_range(NULL::"Advisor Services")::text[])),
      (SELECT array_agg(x::professional_designations_for_advisors) FROM jsonb_array_elements_text(COALESCE(r->'professional_designations','[]'::jsonb)) x
        WHERE x = ANY(enum_range(NULL::professional_designations_for_advisors)::text[])),
      (SELECT array_agg(x::clientele_type) FROM jsonb_array_elements_text(COALESCE(r->'client_type','[]'::jsonb)) x
        WHERE x = ANY(enum_range(NULL::clientele_type)::text[])),
      (SELECT array_agg(x::"States") FROM jsonb_array_elements_text(COALESCE(r->'states_registered_in','[]'::jsonb)) x
        WHERE x = ANY(enum_range(NULL::"States")::text[])),
      (SELECT array_agg(x::advisors_licenses) FROM jsonb_array_elements_text(COALESCE(r->'licenses','[]'::jsonb)) x
        WHERE x = ANY(enum_range(NULL::advisors_licenses)::text[])),
      (SELECT array_agg(x::compensation_type) FROM jsonb_array_elements_text(COALESCE(r->'compensation','[]'::jsonb)) x
        WHERE x = ANY(enum_range(NULL::compensation_type)::text[])),
      r->>'disclaimer',
      COALESCE(NULLIF(r->>'status',''), 'approved')
    );
    inserted := inserted + 1;
  END LOOP;
  RETURN inserted;
END;
$$;

REVOKE ALL ON FUNCTION public.import_advisors_bulk(jsonb) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.import_advisors_bulk(jsonb) TO service_role;