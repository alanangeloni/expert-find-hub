
import { supabase } from "@/integrations/supabase/client";

export interface Advisor {
  id: string;
  name: string;
  slug: string;
  firm_name?: string;
  position?: string;
  personal_bio?: string;
  firm_bio?: string;
  email?: string;
  phone_number?: string;
  years_of_experience?: number;
  state_hq?: string;
  city?: string;
  minimum?: string;
  fiduciary?: boolean;
  verified?: boolean;
  headshot_url?: string;
  firm_logo_url?: string;
  website_url?: string;
  youtube_video_id?: string;
  primary_education?: string;
  disclaimer?: string;
  advisor_sec_crd?: string;
  firm_sec_crd?: string;
  link_to_advisor_sec?: string;
  link_to_firm_sec?: string;
  firm_address?: string;
  firm_aum?: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
  approved_at?: string;
  approved_by?: string;
  user_id?: string;
  submitted_at?: string;
  rejection_reason?: string;
  linked_firm?: string;
  advisor_services?: string[];
  professional_designations?: string[];
  client_type?: string[];
  states_registered_in?: string[];
  licenses?: string[];
  compensation?: string[];
  rating?: number;
  review_count?: number;
  scheduling_link?: string;
}

export interface AdvisorFilter {
  state?: string;
  minimumAssets?: string;
  specialties?: string[];
  clientType?: string;
  searchQuery?: string;
  page?: number;
  pageSize?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export const getAdvisors = async (filters?: AdvisorFilter): Promise<PaginatedResponse<Advisor>> => {
  try {
    console.log('Fetching advisors with filters:', filters);
    
    let queryBuilder = supabase.from('financial_advisors').select('*');
    
    // Apply filters
    if (filters?.searchQuery) {
      queryBuilder = queryBuilder.or(
        `name.ilike.%${filters.searchQuery}%,firm_name.ilike.%${filters.searchQuery}%,city.ilike.%${filters.searchQuery}%`
      );
    }
    
    if (filters?.state && filters.state !== 'all') {
      queryBuilder = queryBuilder.eq('state_hq', filters.state);
    }
    
    // Get total count first
    const { count, error: countError } = await supabase
      .from('financial_advisors')
      .select('*', { count: 'exact', head: true });
    
    if (countError) {
      console.error('Error counting advisors:', countError);
      throw countError;
    }
    
    const totalCount = count || 0;
    
    // Apply pagination
    const page = filters?.page || 1;
    const pageSize = filters?.pageSize || 15;
    const from = (page - 1) * pageSize;
    
    const { data, error } = await queryBuilder.range(from, from + pageSize - 1);
    
    if (error) {
      console.error('Error fetching advisors:', error);
      throw error;
    }
    
    console.log(`Found ${data?.length || 0} advisors after filtering`);
    
    return {
      data: data || [],
      total: totalCount,
      page,
      pageSize,
      totalPages: Math.ceil(totalCount / pageSize)
    };
  } catch (error) {
    console.error('Error in getAdvisors:', error);
    return {
      data: [],
      total: 0,
      page: 1,
      pageSize: filters?.pageSize || 15,
      totalPages: 0
    };
  }
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
  } catch (error) {
    console.error(`Error fetching advisor with slug ${slug}:`, error);
    return null;
  }
};

export const getUniqueStatesFromAdvisors = async (): Promise<string[]> => {
  try {
    const { data, error } = await supabase
      .from('financial_advisors')
      .select('state_hq')
      .not('state_hq', 'is', null);
    
    if (error) {
      console.error('Error fetching states:', error);
      return [];
    }
    
    const states = [...new Set(data.map(item => item.state_hq))].filter(Boolean).sort();
    return states;
  } catch (error) {
    console.error('Error in getUniqueStatesFromAdvisors:', error);
    return [];
  }
};

export const updateAdvisor = async (id: string, updates: Partial<Advisor>): Promise<Advisor | null> => {
  try {
    const { data, error } = await supabase
      .from('financial_advisors')
      .update(updates as any)
      .eq('id', id)
      .select()
      .single();
      
    if (error) {
      console.error('Error updating advisor:', error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error updating advisor:', error);
    throw error;
  }
};

// Legacy function names for compatibility
export const getUniqueStates = getUniqueStatesFromAdvisors;

// Mock functions for compatibility with existing code
export const getAdvisorServices = async (advisorId: string): Promise<string[]> => {
  return [];
};

export const getAdvisorProfessionalDesignations = async (advisorId: string): Promise<string[]> => {
  return [];
};

export const getAdvisorCompensationTypes = async (advisorId: string): Promise<string[]> => {
  return [];
};

export const getAdvisorLicenses = async (advisorId: string): Promise<string[]> => {
  return [];
};
