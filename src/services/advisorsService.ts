import { supabase } from "@/integrations/supabase/client";
import { AdvisorService } from "@/constants/advisorServices";
import { ClientType } from "@/constants/clientTypes";

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
  linked_firm?: string | null;
  advisor_services?: AdvisorService[];
  professional_designations?: string[];
  client_type?: ClientType[];
  created_at?: string;
  updated_at?: string;
  // Additional fields from database
  headshot_url?: string | null;
  firm_logo_url?: string | null;
  scheduling_link?: string | null;
  firm_address?: string;
  firm_aum?: string;
  advisor_sec_crd?: string;
  firm_sec_crd?: string;
  link_to_firm_sec?: string;
  link_to_advisor_sec?: string;
  youtube_video_id?: string;
  primary_education?: string;
  secondary_education?: string;
  username?: string;
  calls_booked?: number;
  rating?: number;
  // Linked investment firm data
  investment_firm?: {
    id: string;
    name: string;
    slug?: string;
    description?: string;
    logo_url?: string;
    website?: string;
  };
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
    // Start with a basic query that includes linked investment firm data
    let query = supabase
      .from("financial_advisors")
      .select(`
        *,
        investment_firm:investment_firms!linked_firm(
          id,
          name,
          slug,
          description,
          logo_url,
          website
        )
      `);
    
    // Apply search filter if provided
    if (filters?.searchQuery) {
      query = query.or(`name.ilike.%${filters.searchQuery}%,firm_name.ilike.%${filters.searchQuery}%`);
    }

    const { data, error } = await query;
    
    if (error) {
      console.error("Error fetching advisors:", error);
      return [];
    }

    let advisors = (data || []) as Advisor[];
    
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

    // Apply specialty filter if needed
    if (filters?.specialties && filters.specialties.length > 0) {
      advisors = advisors.filter(advisor => {
        if (!advisor.advisor_services || advisor.advisor_services.length === 0) return false;
        return filters.specialties?.some(specialty => 
          advisor.advisor_services?.includes(specialty as AdvisorService)
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
        return clientTypes.includes(filters.clientType as ClientType);
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
      .select(`
        *,
        investment_firm:investment_firms!linked_firm(
          id,
          name,
          slug,
          description,
          logo_url,
          website,
          headquarters,
          aum,
          established
        )
      `)
      .eq('slug', slug)
      .single();

    if (error) {
      console.error(`Error fetching advisor with slug ${slug}:`, error);
      return null;
    }

    return data as Advisor;
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

// Function to get advisor services from advisor_services array
export const getAdvisorServices = async (advisorId: string): Promise<string[]> => {
  try {
    const { data, error } = await supabase
      .from('financial_advisors')
      .select('advisor_services')
      .eq('id', advisorId)
      .single();
    
    if (error) {
      console.error('Error fetching advisor services:', error);
      return [];
    }
    
    return data?.advisor_services || [];
  } catch (error) {
    console.error('Error in getAdvisorServices:', error);
    return [];
  }
};

// Function to get advisor professional designations
export const getAdvisorProfessionalDesignations = async (advisorId: string): Promise<string[]> => {
  try {
    const { data, error } = await supabase
      .from('financial_advisors')
      .select('professional_designations')
      .eq('id', advisorId)
      .single();
    
    if (error) {
      console.error('Error fetching advisor designations:', error);
      return [];
    }
    
    return data?.professional_designations || [];
  } catch (error) {
    console.error('Error in getAdvisorProfessionalDesignations:', error);
    return [];
  }
};

// Function to get advisor compensation types (placeholder since no separate table exists)
export const getAdvisorCompensationTypes = async (advisorId: string): Promise<string[]> => {
  try {
    // Since there's no separate compensation table, return empty array for now
    return [];
  } catch (error) {
    console.error('Error in getAdvisorCompensationTypes:', error);
    return [];
  }
};

// Helper function to filter advisors by specialty
const filterBySpecialty = async (advisors: Advisor[], specialty: string) => {
  if (advisors.length === 0) return [];
  
  // Filter based on advisor_services array in the main table
  return advisors.filter(advisor => {
    const services = advisor.advisor_services || [];
    return services.includes(specialty as AdvisorService);
  });
};
