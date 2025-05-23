
import { supabase } from "@/integrations/supabase/client";

// Define types for investment firms
export interface InvestmentFirm {
  id: string;
  name: string;
  slug: string;
  description?: string;
  long_description?: string;
  address?: string;
  firm_link?: string;
  app_store_link?: string;
  play_store_link?: string;
  aum?: string;
  headquarters?: string;
  website?: string;
  logo_url?: string;
  large_image_url?: string;
  small_image_url?: string;
  video_url?: string;
  video_title?: string;
  established?: string;
  fees?: string;
  verified?: boolean;
  rating?: number;
  review_count?: number;
  minimum_investment?: number;
  target_return?: string;
  payout?: string;
  withdrawal_type?: string;
  investment_risks?: string;
  liquidity?: string;
  how_company_makes_money?: string;
  how_you_make_money?: string;
  asset_classes?: string[];
  created_at?: string;
  updated_at?: string;
}

// Define type for investment firm features
export interface InvestmentFirmFeature {
  id: string;
  firm_id: string;
  feature: string;
}

// Define type for investment firm leadership
export interface InvestmentFirmLeadership {
  id: string;
  firm_id: string;
  name: string;
  position?: string;
  bio?: string;
  avatar_url?: string;
}

// Define type for money making methods
export interface MoneyMakingMethod {
  id: string;
  firm_id: string;
  title: string;
  description?: string;
}

// Define type for investment firm clients
export interface InvestmentFirmClient {
  id: string;
  firm_id: string;
  client_type: string;
}

// Define type for investment firm regulatory info
export interface InvestmentFirmRegulatoryInfo {
  id: string;
  firm_id: string;
  registration: string;
}

// Define filter type for investment firms
export interface FirmFilter {
  searchQuery?: string;
  state?: string;
  minimumInvestment?: string;
  firmType?: string;
}

export const getInvestmentFirms = async (filters?: FirmFilter): Promise<InvestmentFirm[]> => {
  try {
    let query = supabase.from('investment_firms').select('*');
    
    // Apply filters if provided
    if (filters?.searchQuery) {
      query = query.or(
        `name.ilike.%${filters.searchQuery}%,headquarters.ilike.%${filters.searchQuery}%`
      );
    }
    
    if (filters?.state && filters.state !== 'all') {
      query = query.eq('headquarters', filters.state);
    }
    
    // Handle minimum investment filter
    if (filters?.minimumInvestment && filters.minimumInvestment !== 'all') {
      switch (filters.minimumInvestment) {
        case 'No Minimum':
          query = query.is('minimum_investment', null).or('minimum_investment.eq.0');
          break;
        case 'Under $250k':
          query = query.lt('minimum_investment', 250000);
          break;
        case '$250k - $500k':
          query = query.gte('minimum_investment', 250000).lt('minimum_investment', 500000);
          break;
        case '$500k - $1M':
          query = query.gte('minimum_investment', 500000).lt('minimum_investment', 1000000);
          break;
        case '$1M - $5M':
          query = query.gte('minimum_investment', 1000000).lt('minimum_investment', 5000000);
          break;
        case '$5M+':
          query = query.gte('minimum_investment', 5000000);
          break;
      }
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching investment firms:', error);
      return [];
    }
    
    // Add asset_classes as empty array to match the required interface
    const firmsWithAssetClasses = data?.map(firm => ({
      ...firm,
      asset_classes: [] // Add empty array to satisfy TypeScript
    })) || [];
    
    return firmsWithAssetClasses;
  } catch (error) {
    console.error('Error in getInvestmentFirms:', error);
    return [];
  }
};

export const getInvestmentFirmBySlug = async (slug: string): Promise<InvestmentFirm | null> => {
  try {
    // Get the basic firm data
    const { data: firmData, error: firmError } = await supabase
      .from('investment_firms')
      .select('*')
      .eq('slug', slug)
      .single();
      
    if (firmError || !firmData) {
      console.error(`Error fetching investment firm with slug ${slug}:`, firmError);
      return null;
    }
    
    // Get firm features
    const { data: featuresData } = await supabase
      .from('investment_firm_features')
      .select('*')
      .eq('firm_id', firmData.id);
      
    // Get firm leadership
    const { data: leadershipData } = await supabase
      .from('investment_firm_leadership')
      .select('*')
      .eq('firm_id', firmData.id);
      
    // Get money making methods
    const { data: moneyMakingMethodsData } = await supabase
      .from('money_making_methods')
      .select('*')
      .eq('firm_id', firmData.id);
      
    // Get firm clients
    const { data: clientsData } = await supabase
      .from('investment_firm_clients')
      .select('*')
      .eq('firm_id', firmData.id);
      
    // Get regulatory info
    const { data: regulatoryData } = await supabase
      .from('investment_firm_regulatory_info')
      .select('*')
      .eq('firm_id', firmData.id);
    
    // Combine all data into one firm object
    const firm = {
      ...firmData,
      asset_classes: [], // Add empty array to satisfy TypeScript
      investment_firm_features: featuresData || [],
      investment_firm_leadership: leadershipData || [],
      money_making_methods: moneyMakingMethodsData || [],
      investment_firm_clients: clientsData || [],
      investment_firm_regulatory_info: regulatoryData || []
    } as InvestmentFirm;
    
    return firm;
  } catch (error: any) {
    console.error(`Error fetching investment firm with slug ${slug}:`, error);
    return null;
  }
};

// Function to get unique states from investment firms
export const getUniqueStates = async (): Promise<string[]> => {
  try {
    const { data, error } = await supabase
      .from('investment_firms')
      .select('headquarters')
      .not('headquarters', 'is', null);
    
    if (error) {
      console.error('Error fetching states:', error);
      return [];
    }
    
    // Extract unique states
    const states = [...new Set(data.map(item => item.headquarters))].filter(Boolean).sort();
    return states;
  } catch (error) {
    console.error('Error in getUniqueStates:', error);
    return [];
  }
};
