
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
  city?: string;
  state_hq?: string;
  years_of_experience?: number;
  minimum?: string;
  headshot_url?: string;
  firm_logo_url?: string;
  website_url?: string;
  youtube_video_id?: string;
  primary_education?: string;
  disclaimer?: string;
  advisor_services?: string[];
  professional_designations?: string[];
  client_type?: string[];
  states_registered_in?: string[];
  licenses?: string[];
  compensation?: string[];
  fiduciary?: boolean;
  verified?: boolean;
  status?: string;
  user_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface AdvisorFilters {
  state?: string;
  minimumAssets?: string;
  specialties?: string[];
  clientType?: string;
  searchQuery?: string;
  page?: number;
  pageSize?: number;
}

export const getAdvisors = async (filters: AdvisorFilters = {}): Promise<Advisor[]> => {
  try {
    console.log('Fetching advisors with filters:', filters);
    
    let query = supabase
      .from('financial_advisors')
      .select('*')
      .eq('status', 'approved');

    // Apply filters
    if (filters.state) {
      query = query.eq('state_hq', filters.state);
    }

    if (filters.searchQuery) {
      query = query.or(`name.ilike.%${filters.searchQuery}%,firm_name.ilike.%${filters.searchQuery}%`);
    }

    // Apply pagination
    const page = filters.page || 1;
    const pageSize = filters.pageSize || 15;
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    query = query.range(from, to);

    const { data, error } = await query;

    if (error) throw error;

    let advisors = data || [];

    // Apply client-side filters for specialties and minimum assets
    if (filters.specialties && filters.specialties.length > 0) {
      advisors = advisors.filter(advisor => 
        advisor.advisor_services && 
        filters.specialties!.some(specialty => 
          advisor.advisor_services!.includes(specialty)
        )
      );
    }

    if (filters.minimumAssets && filters.minimumAssets !== 'any') {
      const minimumThreshold = parseInt(filters.minimumAssets);
      advisors = advisors.filter(advisor => {
        if (!advisor.minimum || advisor.minimum === "0") return true;
        const advisorMinimum = parseInt(advisor.minimum.replace(/[,$]/g, ''));
        return advisorMinimum <= minimumThreshold;
      });
    }

    console.log(`Found ${advisors.length} advisors after filtering`);
    
    return advisors.map(advisor => ({
      ...advisor,
      state_hq: advisor.state_hq || undefined
    }));
  } catch (error) {
    console.error('Error fetching advisors:', error);
    return [];
  }
};

export const getAdvisorBySlug = async (slug: string): Promise<Advisor | null> => {
  try {
    const { data, error } = await supabase
      .from('financial_advisors')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'approved')
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching advisor:', error);
    return null;
  }
};

export const createAdvisor = async (advisorData: Partial<Advisor>): Promise<Advisor> => {
  try {
    const { data, error } = await supabase
      .from('financial_advisors')
      .insert(advisorData)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating advisor:', error);
    throw error;
  }
};

export const updateAdvisor = async (id: string, updates: Partial<Advisor>): Promise<Advisor> => {
  try {
    const { data, error } = await supabase
      .from('financial_advisors')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating advisor:', error);
    throw error;
  }
};

export const deleteAdvisor = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('financial_advisors')
      .delete()
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting advisor:', error);
    throw error;
  }
};
