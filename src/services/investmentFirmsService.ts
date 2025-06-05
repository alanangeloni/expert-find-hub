
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";

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
  asset_class?: string[];
  created_at?: string;
  updated_at?: string;
  // Related entities
  investment_firm_features?: InvestmentFirmFeature[];
  investment_firm_leadership?: InvestmentFirmLeadership[];
  money_making_methods?: MoneyMakingMethod[];
  investment_firm_regulatory_info?: InvestmentFirmRegulatoryInfo[];
  investment_firm_clients?: InvestmentFirmClient[];
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
  assetClass?: string;
  asset_classes?: string[];
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

export const getInvestmentFirms = async (filters?: FirmFilter): Promise<PaginatedResponse<InvestmentFirm>> => {
  try {
    console.log('Fetching investment firms with filters:', filters);
    
    // Start with a basic query
    let queryBuilder = supabase.from('investment_firms').select('*');
    
    // Apply search query filter
    if (filters?.searchQuery) {
      queryBuilder = queryBuilder.or(
        `name.ilike.%${filters.searchQuery}%,headquarters.ilike.%${filters.searchQuery}%,description.ilike.%${filters.searchQuery}%`
      );
    }
    
    // Apply minimum investment filter with numerical comparison
    if (filters?.minimumInvestment && filters.minimumInvestment !== 'all') {
      const minValue = parseInt(filters.minimumInvestment.split('-')[0]);
      const maxValue = filters.minimumInvestment.includes('-') 
        ? parseInt(filters.minimumInvestment.split('-')[1]) 
        : null;
      
      if (maxValue) {
        // For ranges like 250000-500000
        queryBuilder = queryBuilder
          .gte('minimum_investment', minValue)
          .lte('minimum_investment', maxValue);
      } else {
        // For minimum values like 5000000 (for $5M+)
        queryBuilder = queryBuilder.gte('minimum_investment', minValue);
      }
    }
    
    // First, get the total count with all filters applied
    let countQuery = supabase
      .from('investment_firms')
      .select('*', { count: 'exact', head: true });
      
    // Apply the same filters to the count query as the main query
    if (filters?.searchQuery) {
      countQuery = countQuery.or(
        `name.ilike.%${filters.searchQuery}%,headquarters.ilike.%${filters.searchQuery}%,description.ilike.%${filters.searchQuery}%`
      );
    }
    
    if (filters?.minimumInvestment && filters.minimumInvestment !== 'all') {
      const minValue = parseInt(filters.minimumInvestment.split('-')[0]);
      const maxValue = filters.minimumInvestment.includes('-') 
        ? parseInt(filters.minimumInvestment.split('-')[1]) 
        : null;
      
      if (maxValue) {
        countQuery = countQuery.gte('minimum_investment', minValue).lte('minimum_investment', maxValue);
      } else {
        countQuery = countQuery.gte('minimum_investment', minValue);
      }
    }
    
    // Execute the count query
    const { count, error: countError } = await countQuery;
    if (countError) {
      console.error('Error counting firms:', countError);
      throw countError;
    }
    
    const totalCount = count || 0;
    console.log('Total firms count:', totalCount, 'for filters:', filters);
    
    // Apply pagination
    const page = filters?.page || 1;
    const pageSize = filters?.pageSize || 15;
    const from = (page - 1) * pageSize;
    
    // Execute the query with pagination
    const { data, error } = await queryBuilder.range(from, from + pageSize - 1);
    
    if (error) {
      console.error('Error fetching paginated firms:', error);
      throw error;
    }
    
    // Process the data - handle asset_class as a string
    let processedFirms = data || [];
    
    // Apply asset class filter in-memory if needed
    if (filters?.assetClass && filters.assetClass !== 'all') {
      console.log('Applying asset class filter:', filters.assetClass);
      processedFirms = processedFirms.filter((firm: any) => {
        const matches = firm.asset_class === filters.assetClass;
        console.log(`Firm ${firm.name} (${firm.asset_class}) matches ${filters.assetClass}:`, matches);
        return matches;
      });
      console.log('Firms after asset class filter:', processedFirms);
    }
    
    // Process the firms data
    const processedData = processedFirms.map((firm: any) => {
      const assetClasses = Array.isArray(firm.asset_class) 
        ? firm.asset_class 
        : firm.asset_class ? [firm.asset_class] : [];
        
      return {
        ...firm,
        asset_classes: assetClasses,
        asset_class: assetClasses[0] || '' // Keep the first one as string for backward compatibility
      };
    }) as InvestmentFirm[];
    
    // Return paginated response
    return {
      data: processedData,
      total: totalCount,
      page,
      pageSize,
      totalPages: Math.ceil(totalCount / pageSize)
    };
  } catch (error) {
    console.error('Error in getInvestmentFirms:', error);
    return {
      data: [],
      total: 0,
      page: 1,
      pageSize: filters?.pageSize || 15,
      totalPages: 0
    };
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
    const assetClasses = Array.isArray(firmData.asset_class) 
      ? firmData.asset_class 
      : firmData.asset_class ? [firmData.asset_class] : [];
      
    const firm: InvestmentFirm = {
      ...firmData,
      asset_classes: assetClasses,
      asset_class: assetClasses, // Keep both for backward compatibility
      investment_firm_features: featuresData || [],
      investment_firm_leadership: leadershipData || [],
      money_making_methods: moneyMakingMethodsData || [],
      investment_firm_clients: clientsData || [],
      investment_firm_regulatory_info: regulatoryData || []
    };
    
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

// Add the getSimilarFirms function
export const getSimilarFirms = async (firmId: string): Promise<InvestmentFirm[]> => {
  try {
    // First get the similar firm IDs
    const { data: similarFirmsData, error: similarError } = await supabase
      .from('similar_firms')
      .select('similar_firm_id')
      .eq('firm_id', firmId);
    
    if (similarError || !similarFirmsData || similarFirmsData.length === 0) {
      console.log('No similar firms found or error:', similarError);
      return [];
    }
    
    // Extract the similar firm IDs
    const similarFirmIds = similarFirmsData.map(item => item.similar_firm_id);
    
    // Fetch the details of these similar firms
    const { data: firms, error: firmsError } = await supabase
      .from('investment_firms')
      .select('*')
      .in('id', similarFirmIds);
    
    if (firmsError || !firms) {
      console.error('Error fetching similar firms:', firmsError);
      return [];
    }
    
    // Ensure asset_classes is always an array
    const firmsWithAssetClasses = firms.map(firm => {
      const assetClasses = Array.isArray(firm.asset_class) 
        ? firm.asset_class 
        : firm.asset_class ? [firm.asset_class] : [];
        
      return {
        ...firm,
        asset_classes: assetClasses,
        asset_class: assetClasses // Keep both for backward compatibility
      };
    });
    
    return firmsWithAssetClasses as unknown as InvestmentFirm[];
  } catch (error) {
    console.error('Error in getSimilarFirms:', error);
    return [];
  }
};
