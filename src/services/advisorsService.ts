
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
  firm_logo_url?: string;
  phone_number?: string;
  email?: string;
  website_url?: string;
}

export type AdvisorSpecialty = 
  | "Retirement Planning" 
  | "Investment Management" 
  | "Tax Planning" 
  | "Estate Planning" 
  | "Insurance Planning"
  | "Business Planning"
  | "Education Planning"
  | "Financial Planning";

export interface AdvisorFilter {
  searchQuery?: string;
  state?: string;
  minimumAssets?: string;
  serviceType?: string;
  compensationType?: string;
  specialty?: string; // Kept as string for form handling
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
  
  if (filters.minimumAssets) {
    // Handle minimum assets filter based on the selected value
    switch (filters.minimumAssets) {
      case "No Minimum":
        // Include advisors with no minimum or 0 minimum
        query = query.or('minimum.is.null,minimum.eq.0,minimum.eq.$0');
        break;
      case "Under $250k":
        query = query.lt("minimum", "250000");
        break;
      case "$250k - $500k":
        query = query.gte("minimum", "250000").lt("minimum", "500000");
        break;
      case "$500k - $1M":
        query = query.gte("minimum", "500000").lt("minimum", "1000000");
        break;
      case "$1M+":
        query = query.gte("minimum", "1000000");
        break;
    }
  }

  if (filters.specialty) {
    // If specialty filter is applied, we need to join with advisor_services
    // For simplicity in this implementation, we'll fetch all advisors first and filter in memory
    const { data, error } = await query;
    
    if (error) {
      console.error("Error fetching advisors:", error);
      throw error;
    }
    
    if (data.length > 0) {
      // For each advisor, fetch their services and check if they match the specialty
      const advisorsWithSpecialty = [];
      
      for (const advisor of data) {
        // Cast filters.specialty to AdvisorSpecialty type only for the comparison
        // This maintains compatibility with the form handling while satisfying TypeScript
        const services = await getAdvisorSpecialties(advisor.id);
        if (services.includes(filters.specialty)) {
          advisorsWithSpecialty.push(advisor);
        }
      }
      
      return advisorsWithSpecialty as Advisor[];
    }
    
    return [];
  }

  // If no specialty filter, just fetch with the query
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

export const getAdvisorSpecialties = async (advisorId: string) => {
  const { data, error } = await supabase
    .from("advisor_services")
    .select("service")
    .eq("advisor_id", advisorId);

  if (error) {
    console.error(`Error fetching specialties for advisor ${advisorId}:`, error);
    return [];
  }

  return data.map(item => item.service);
};

export const getUniqueStates = async () => {
  const { data, error } = await supabase
    .from("financial_advisors")
    .select("state_hq")
    .not("state_hq", "is", null)
    .order("state_hq");

  if (error) {
    console.error("Error fetching unique states:", error);
    return [];
  }

  // Filter out duplicates and null values
  const uniqueStates = [...new Set(data.map(item => item.state_hq).filter(Boolean))];
  return uniqueStates;
};
