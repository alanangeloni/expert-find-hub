import { supabase } from "@/integrations/supabase/client";

// Define Advisor interface based on the financial_advisors table
export interface Advisor {
  id: string;
  name: string;
  slug: string;
  firm_name?: string;
  position?: string;
  personal_bio?: string;
  firm_bio?: string;
  email?: string | null;
  phone_number?: string | null;
  years_of_experience?: number;
  state_hq?: string;
  city?: string;
  minimum?: string;
  website_url?: string | null;
  verified?: boolean;
  premium?: boolean;
  fiduciary?: boolean;
  first_session_is_free?: boolean;
  advisor_services?: string[];
  professional_designations?: string[];
  client_type?: string[];
  created_at?: string;
  updated_at?: string;
}

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
  specialties?: string[];
  state?: string;
  minimumAssets?: string;
  minExperience?: number;
  maxExperience?: number;
  clientType?: string;
}

export const getAdvisors = async (filters?: AdvisorFilter) => {
  try {
    // Start with a basic query
    const { data, error } = await supabase
      .from("financial_advisors")
      .select("*")
      .then(async (query) => {
        let result = query;
        
        // Apply filters
        if (filters?.searchQuery) {
          result = await supabase
            .from("financial_advisors")
            .select("*")
            .or(`first_name.ilike.%${filters.searchQuery}%,last_name.ilike.%${filters.searchQuery}%,firm_name.ilike.%${filters.searchQuery}%,name.ilike.%${filters.searchQuery}%`);
        } else {
          result = await supabase.from("financial_advisors").select("*");
        }

        return result;
      });
    
    if (error) {
      console.error("Error fetching advisors:", error);
      return [];
    }

    let advisors = data || [];
    
    // Apply filters in memory to avoid TypeScript issues
    if (filters?.minExperience) {
      advisors = advisors.filter(advisor => (advisor.years_of_experience || 0) >= filters.minExperience!);
    }

    if (filters?.maxExperience) {
      advisors = advisors.filter(advisor => (advisor.years_of_experience || 0) <= filters.maxExperience!);
    }

    if (filters?.state && filters.state !== "all") {
      advisors = advisors.filter(advisor => advisor.state_hq === filters.state);
    }
    
    // Apply minimum assets filter
    if (filters?.minimumAssets && filters.minimumAssets !== "all") {
      advisors = applyMinimumAssetsFilter(advisors, filters.minimumAssets);
    }

    // Attach services to each advisor
    advisors = advisors.map(advisor => {
      // Check if services are stored directly on the advisor
      if (advisor.advisor_services && Array.isArray(advisor.advisor_services)) {
        return {
          ...advisor,
          services: advisor.advisor_services
        };
      }
      
      // Fallback to empty array if no services found
      return {
        ...advisor,
        services: []
      };
    });

    // Apply specialty filter if needed
    if (filters?.specialties && filters.specialties.length > 0) {
      advisors = advisors.filter(advisor => {
        if (!advisor.services || advisor.services.length === 0) return false;
        return filters.specialties?.some(specialty => 
          advisor.services?.includes(specialty)
        );
      });
    }

    // Apply client type filter if needed
    if (filters?.clientType && filters.clientType !== "all") {
      advisors = advisors.filter(advisor => {
        // Check if client_type is defined and is an array before calling includes
        const clientTypes = Array.isArray(advisor.client_type) 
          ? advisor.client_type 
          : [];
        return clientTypes.includes(filters.clientType!);
      });
    }

    return advisors;
  } catch (error) {
    console.error("Error in getAdvisors:", error);
    return [];
  }
};

// Helper function to apply minimum assets filter in memory
const applyMinimumAssetsFilter = (advisors: Advisor[], minimumAssets: string) => {
  return advisors.filter(advisor => {
    const minimum = parseInt(advisor.minimum || "0");
    
    switch (minimumAssets) {
      case "No Minimum":
        return minimum === 0;
      case "Under $250k":
        return minimum < 250000;
      case "$250k - $500k":
        return minimum >= 250000 && minimum < 500000;
      case "$500k - $1M":
        return minimum >= 500000 && minimum < 1000000;
      case "$1M+":
        return minimum >= 1000000;
      default:
        return true;
    }
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
