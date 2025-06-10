
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
  rejection_reason?: string;
  created_at?: string;
  updated_at?: string;
}

export interface AdvisorFilter {
  state?: string;
  minimumAssets?: string;
  specialties?: string[];
  clientType?: string;
  searchQuery?: string;
}

export interface GetAdvisorsParams extends AdvisorFilter {
  page?: number;
  pageSize?: number;
}

export interface GetAdvisorsResponse {
  data: Advisor[];
  count: number;
}

export const getAdvisors = async (params: GetAdvisorsParams = {}): Promise<GetAdvisorsResponse> => {
  try {
    console.log('Fetching advisors with params:', params);
    
    let query = supabase
      .from('financial_advisors')
      .select('*', { count: 'exact' })
      .eq('status', 'approved');

    // Apply filters
    if (params.state) {
      query = query.eq('state_hq', params.state);
    }

    if (params.searchQuery) {
      query = query.or(`name.ilike.%${params.searchQuery}%,firm_name.ilike.%${params.searchQuery}%`);
    }

    if (params.clientType) {
      query = query.contains('client_type', [params.clientType]);
    }

    // Apply pagination
    const page = params.page || 1;
    const pageSize = params.pageSize || 15;
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    query = query.range(from, to);

    const { data, error, count } = await query;

    if (error) throw error;

    let advisors = data || [];

    // Apply client-side filters for specialties
    if (params.specialties && params.specialties.length > 0) {
      advisors = advisors.filter(advisor => 
        advisor.advisor_services && 
        params.specialties!.some(specialty => 
          advisor.advisor_services!.includes(specialty)
        )
      );
    }

    console.log(`Found ${advisors.length} approved advisors after filtering`);
    
    return {
      data: advisors,
      count: count || 0
    };
  } catch (error) {
    console.error('Error fetching advisors:', error);
    return { data: [], count: 0 };
  }
};

export const getUniqueStates = async (): Promise<string[]> => {
  try {
    const { data, error } = await supabase
      .from('financial_advisors')
      .select('state_hq')
      .not('state_hq', 'is', null)
      .eq('status', 'approved');

    if (error) throw error;

    const uniqueStates = Array.from(new Set(data.map(item => item.state_hq).filter(Boolean)));
    return uniqueStates.sort();
  } catch (error) {
    console.error('Error fetching unique states:', error);
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
