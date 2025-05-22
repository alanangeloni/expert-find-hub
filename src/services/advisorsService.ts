
import { supabase } from "@/integrations/supabase/client";

export interface Advisor {
  id: string;
  name: string;
  slug: string;
  position?: string;
  firm_name?: string;
  headshot_url?: string;
  city?: string;
  state_hq?: string;
  minimum?: string;
  years_of_experience?: number;
  personal_bio?: string;
  firm_bio?: string;
  fiduciary?: boolean;
  rating?: number;
  verified?: boolean;
  premium?: boolean;
  first_session_is_free?: boolean;
  scheduling_link?: string;
  // Add missing properties that are used in the AdvisorDetail component
  firm_logo_url?: string;
  phone_number?: string;
  email?: string;
  website_url?: string;
}

export interface AdvisorFilter {
  searchQuery?: string;
  state?: string;
  minimumAssets?: string;
  serviceType?: string;
  compensationType?: string;
}

export const getAdvisors = async (filters: AdvisorFilter = {}) => {
  let query = supabase
    .from("financial_advisors")
    .select("*")
    .order("premium", { ascending: false })
    .order("name");

  if (filters.searchQuery) {
    query = query.or(`name.ilike.%${filters.searchQuery}%,firm_name.ilike.%${filters.searchQuery}%`);
  }
  
  if (filters.state) {
    query = query.eq("state_hq", filters.state);
  }

  // Fetch the results
  const { data, error } = await query;

  if (error) {
    console.error("Error fetching advisors:", error);
    throw error;
  }

  return data as Advisor[];
};

export const getAdvisorBySlug = async (slug: string) => {
  const { data, error } = await supabase
    .from("financial_advisors")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) {
    console.error(`Error fetching advisor with slug ${slug}:`, error);
    throw error;
  }

  return data as Advisor;
};

export const getAdvisorServices = async (advisorId: string) => {
  const { data, error } = await supabase
    .from("advisor_services")
    .select("service")
    .eq("advisor_id", advisorId);

  if (error) {
    console.error(`Error fetching services for advisor ${advisorId}:`, error);
    return [];
  }

  return data.map(item => item.service);
};

export const getAdvisorProfessionalDesignations = async (advisorId: string) => {
  const { data, error } = await supabase
    .from("advisor_professional_designations")
    .select("designation")
    .eq("advisor_id", advisorId);

  if (error) {
    console.error(`Error fetching designations for advisor ${advisorId}:`, error);
    return [];
  }

  return data.map(item => item.designation);
};

export const getAdvisorCompensationTypes = async (advisorId: string) => {
  const { data, error } = await supabase
    .from("advisor_compensation_types")
    .select("compensation_type")
    .eq("advisor_id", advisorId);

  if (error) {
    console.error(`Error fetching compensation types for advisor ${advisorId}:`, error);
    return [];
  }

  return data.map(item => item.compensation_type);
};
