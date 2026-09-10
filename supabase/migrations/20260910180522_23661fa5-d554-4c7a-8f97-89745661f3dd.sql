CREATE OR REPLACE VIEW public.accountants_public AS
SELECT
  a.id, a.name, a.slug, a."position", a.bio, a.firm_name, a.firm_address,
  a.linked_firm, a.headshot_url, a.city, a.state_hq, a.states_served,
  a.website_url, a.credentials, a.services, a.client_specialties,
  a.years_of_experience, a.minimum_fee, a.pricing_note, a.disclaimer,
  a.verified, a.status, a.created_at, a.updated_at,
  a.tagline, a.profile_url, a.role_badges, a.team_size, a.founded,
  a.serves_clients, a.dedicated_staff, a.tech_stack, a.pricing_packages,
  a.industries_served, a.min_revenue
FROM public.accountants a
WHERE a.status = 'approved'::text;