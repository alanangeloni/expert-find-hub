import { supabase } from "@/integrations/supabase/client";
import { type Tables } from "@/integrations/supabase/types";

// Define Advisor type based on the financial_advisors table
export type Advisor = Tables<"financial_advisors">;

// Define an AdvisorSpecialty type to match the allowed values
export type AdvisorSpecialty = 
  | "Financial Planning" 
  | "Retirement Planning" 
  | "Investment Management" 
  | "Estate Planning" 
  | "Tax Planning" 
  | "Insurance Planning" 
  | "Education Planning" 
  | "Business Planning";

// Define the filter interface for advisor search
export interface AdvisorFilter {
  searchQuery?: string;
  specialty?: string;
  state?: string;
  minimumAssets?: string;
  leadGenEnabled?: boolean;
  minExperience?: number;
  maxExperience?: number;
}

export const getAdvisors = async (filters?: AdvisorFilter) => {
  try {
    // Start with a basic query
    let query = supabase.from("financial_advisors").select("*");

    // Apply filters one by one
    if (filters?.searchQuery) {
      query = query.or(
        `first_name.ilike.%${filters.searchQuery}%,last_name.ilike.%${filters.searchQuery}%,firm_name.ilike.%${filters.searchQuery}%,name.ilike.%${filters.searchQuery}%`
      );
    }

    if (filters?.leadGenEnabled !== undefined) {
      query = query.eq("lead_gen_enabled", filters.leadGenEnabled);
    }

    if (filters?.minExperience) {
      query = query.gte("years_of_experience", filters.minExperience);
    }

    if (filters?.maxExperience) {
      query = query.lte("years_of_experience", filters.maxExperience);
    }

    if (filters?.state && filters.state !== "all") {
      query = query.eq("state_hq", filters.state);
    }
    
    // Apply minimum assets filter separately
    if (filters?.minimumAssets && filters.minimumAssets !== "all") {
      applyMinimumAssetsFilter(query, filters.minimumAssets);
    }

    // Execute query
    const { data, error } = await query;
    
    if (error) {
      console.error("Error fetching advisors:", error);
      return [];
    }

    let advisors = data || [];
    
    // Apply specialty filter if needed
    if (filters?.specialty && filters.specialty !== "all") {
      advisors = await filterBySpecialty(advisors, filters.specialty);
    }

    return advisors;
  } catch (error) {
    console.error("Error in getAdvisors:", error);
    return [];
  }
};

// Helper function to apply minimum assets filter
const applyMinimumAssetsFilter = (query: any, minimumAssets: string) => {
  switch (minimumAssets) {
    case "No Minimum":
      query.eq("minimum", "0");
      break;
    case "Under $250k":
      query.lt("minimum", "250000");
      break;
    case "$250k - $500k":
      query.gte("minimum", "250000").lt("minimum", "500000");
      break;
    case "$500k - $1M":
      query.gte("minimum", "500000").lt("minimum", "1000000");
      break;
    case "$1M+":
      query.gte("minimum", "1000000");
      break;
  }
  return query;
};

// Helper function to filter advisors by specialty
const filterBySpecialty = async (advisors: Advisor[], specialty: string) => {
  if (advisors.length === 0) return [];
  
  const advisorIds = advisors.map(advisor => advisor.id);
  
  const { data: servicesData } = await supabase
    .from("advisor_services")
    .select("*")
    .in("advisor_id", advisorIds);
    
  if (!servicesData) return [];
  
  // Create a mapping of advisor_id -> services
  const servicesMap = new Map();
  servicesData.forEach(service => {
    const services = servicesMap.get(service.advisor_id) || [];
    services.push(service.service);
    servicesMap.set(service.advisor_id, services);
  });
  
  // Filter advisors based on specialty
  return advisors.filter(advisor => {
    const services = servicesMap.get(advisor.id) || [];
    return services.includes(specialty);
  });
};

export const getAdvisorBySlug = async (slug: string): Promise<Advisor | null> => {
  try {
    const { data, error } = await supabase
      .from('financial_advisors')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) {
      console.error(`Error fetching advisor with slug ${slug}:`, error);
      return null;
    }

    return data;
  } catch (error: any) {
    console.error(`Error fetching advisor with slug ${slug}:`, error);
    return null;
  }
};

// Function to get unique states from advisors
export const getUniqueStates = async (): Promise<string[]> => {
  try {
    const { data, error } = await supabase
      .from('financial_advisors')
      .select('state_hq')
      .not('state_hq', 'is', null);
    
    if (error) {
      console.error('Error fetching states:', error);
      return [];
    }
    
    // Extract unique states
    const states = [...new Set(data.map(item => item.state_hq))].filter(Boolean).sort();
    return states;
  } catch (error) {
    console.error('Error in getUniqueStates:', error);
    return [];
  }
};

// Function to get advisor services
export const getAdvisorServices = async (advisorId: string): Promise<string[]> => {
  try {
    const { data, error } = await supabase
      .from('advisor_services')
      .select('service')
      .eq('advisor_id', advisorId);
    
    if (error) {
      console.error('Error fetching advisor services:', error);
      return [];
    }
    
    return data.map(item => item.service);
  } catch (error) {
    console.error('Error in getAdvisorServices:', error);
    return [];
  }
};

// Function to get advisor professional designations
export const getAdvisorProfessionalDesignations = async (advisorId: string): Promise<string[]> => {
  try {
    const { data, error } = await supabase
      .from('advisor_professional_designations')
      .select('designation')
      .eq('advisor_id', advisorId);
    
    if (error) {
      console.error('Error fetching advisor designations:', error);
      return [];
    }
    
    return data.map(item => item.designation);
  } catch (error) {
    console.error('Error in getAdvisorProfessionalDesignations:', error);
    return [];
  }
};

// Function to get advisor compensation types
export const getAdvisorCompensationTypes = async (advisorId: string): Promise<string[]> => {
  try {
    const { data, error } = await supabase
      .from('advisor_compensation_types')
      .select('compensation_type')
      .eq('advisor_id', advisorId);
    
    if (error) {
      console.error('Error fetching advisor compensation types:', error);
      return [];
    }
    
    return data.map(item => item.compensation_type);
  } catch (error) {
    console.error('Error in getAdvisorCompensationTypes:', error);
    return [];
  }
};
