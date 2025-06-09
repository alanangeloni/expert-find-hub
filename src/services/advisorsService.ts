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
  review_count?: number;
  rating?: number | string;
  headshot_url?: string | null;
  scheduling_link?: string | null;
  firm_logo_url?: string | null;
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
  disclaimer?: string;
  // Status fields for advisor approval workflow
  status?: string;
  rejection_reason?: string;
  user_id?: string;
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

export interface AdvisorsResponse {
  data: Advisor[];
  count: number;
}

export const getAdvisors = async (filters?: AdvisorFilter & { page?: number; pageSize?: number }): Promise<AdvisorsResponse> => {
  try {
    console.log('Fetching advisors with filters:', filters);
    
    const page = filters?.page || 1;
    const pageSize = filters?.pageSize || 15;
    const start = (page - 1) * pageSize;
    const end = start + pageSize - 1;
    
    // Start with a query that includes linked investment firm data
    // Only show approved advisors to the public
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
      `, { count: 'exact' })
      .eq('status', 'approved'); // Only show approved advisors
    
    // Apply search filter if provided
    if (filters?.searchQuery) {
      query = query.or(`name.ilike.%${filters.searchQuery}%,firm_name.ilike.%${filters.searchQuery}%`);
    }

    // Apply state filter at database level - cast to proper type
    if (filters?.state && filters.state !== "all") {
      query = query.eq('state_hq', filters.state as any);
    }

    // Apply specialty filter at database level if provided
    if (filters?.specialties?.length) {
      // Use overlaps operator to check if any of the filter specialties exist in the advisor's services array
      query = query.overlaps('advisor_services', filters.specialties);
    }

    // Apply client type filter at database level if provided
    if (filters?.clientType && filters.clientType !== "all") {
      // Use contains operator to check if the advisor's client_type array contains the filter value
      query = query.contains('client_type', [filters.clientType]);
    }

    // Apply pagination
    query = query.range(start, end);
    
    const { data, error, count } = await query;
    
    if (error) {
      console.error("Error fetching advisors:", error);
      return { data: [], count: 0 };
    }

    // Process the data to ensure advisor_services is always an array
    let advisors = (data || []).map(advisor => ({
      ...advisor,
      advisor_services: Array.isArray(advisor.advisor_services) 
        ? advisor.advisor_services.filter(Boolean) // Remove any null/undefined values
        : []
    })) as Advisor[];
    
    // Apply remaining filters in memory (only minimum assets and experience now)
    if (filters?.minExperience) {
      advisors = advisors.filter(advisor => (advisor.years_of_experience || 0) >= filters.minExperience!);
    }

    if (filters?.maxExperience) {
      advisors = advisors.filter(advisor => (advisor.years_of_experience || 0) <= filters.maxExperience!);
    }
    
    // Apply minimum assets filter
    if (filters?.minimumAssets && filters.minimumAssets !== "all") {
      advisors = applyMinimumAssetsFilter(advisors, filters.minimumAssets);
    }

    console.log(`Found ${advisors.length} advisors after filtering`);
    
    return { data: advisors, count: count || 0 };
  } catch (error) {
    console.error("Error in getAdvisors:", error);
    return { data: [], count: 0 };
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
    console.log('Fetching advisor with slug:', slug);
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
      .eq('status', 'approved') // Only show approved advisors
      .single();

    if (error) {
      console.error(`Error fetching advisor with slug ${slug}:`, error);
      return null;
    }

    console.log('Raw advisor data from DB:', JSON.stringify(data, null, 2));
    console.log('Advisor services:', data.advisor_services);
    console.log('Advisor services type:', typeof data.advisor_services);
    console.log('Advisor services length:', data.advisor_services?.length);

    // Ensure advisor_services is an array
    const advisor = {
      ...data,
      advisor_services: Array.isArray(data.advisor_services) ? data.advisor_services : []
    } as Advisor;

    console.log('Processed advisor services:', advisor.advisor_services);
    return advisor;
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

// Function to get advisor licenses (placeholder since no separate table exists)
export const getAdvisorLicenses = async (advisorId: string): Promise<string[]> => {
  try {
    // This is a placeholder - in a real app, this would query a licenses table
    return [];
  } catch (error) {
    console.error('Error in getAdvisorLicenses:', error);
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
