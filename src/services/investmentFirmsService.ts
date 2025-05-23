import { supabase } from "@/integrations/supabase/client";
import { type Tables } from "@/integrations/supabase/types";

// Define types for related entities
type InvestmentFirmFeature = {
  feature: string;
};

type InvestmentFirmLeadership = {
  id: string;
  name: string;
  position: string | null;
  bio: string | null;
  avatar_url: string | null;
};

type MoneyMakingMethod = {
  id: string;
  title: string;
  description: string | null;
};

type InvestmentFirmClient = {
  client_type: string;
};

type InvestmentFirmRegulatoryInfo = {
  registration: string;
};

// Define filter type
export type FirmFilter = {
  state?: string;
  minimumInvestment?: string;
  firmType?: string;
  searchQuery?: string;
};

// Define the main InvestmentFirm type with its related entities
export type InvestmentFirm = Tables<"investment_firms"> & {
  asset_classes: string[];
  investment_firm_features?: InvestmentFirmFeature[];
  investment_firm_leadership?: InvestmentFirmLeadership[];
  money_making_methods?: MoneyMakingMethod[];
  investment_firm_clients?: InvestmentFirmClient[];
  investment_firm_regulatory_info?: InvestmentFirmRegulatoryInfo[];
};

export const getInvestmentFirms = async (filter?: FirmFilter): Promise<InvestmentFirm[]> => {
  let query = supabase.from("investment_firms").select("*");

  if (filter) {
    if (filter.state) {
      query = query.eq("headquarters", filter.state);
    }
    
    if (filter.firmType) {
      // Assuming there's a column for firm_type, adjust if needed
      query = query.eq("firm_type", filter.firmType);
    }
    
    if (filter.minimumInvestment) {
      // Handle minimum investment filtering based on ranges
      switch (filter.minimumInvestment) {
        case "No Minimum":
          query = query.is("minimum_investment", null);
          break;
        case "Under $250k":
          query = query.lt("minimum_investment", 250000);
          break;
        case "$250k - $500k":
          query = query.gte("minimum_investment", 250000).lt("minimum_investment", 500000);
          break;
        case "$500k - $1M":
          query = query.gte("minimum_investment", 500000).lt("minimum_investment", 1000000);
          break;
        case "$1M - $5M":
          query = query.gte("minimum_investment", 1000000).lt("minimum_investment", 5000000);
          break;
        case "$5M+":
          query = query.gte("minimum_investment", 5000000);
          break;
      }
    }
    
    if (filter.searchQuery) {
      query = query.or(`name.ilike.%${filter.searchQuery}%,description.ilike.%${filter.searchQuery}%`);
    }
  }
  
  const { data, error } = await query.order("name");
    
  if (error) {
    console.error("Error fetching investment firms:", error);
    throw new Error("Failed to fetch investment firms");
  }
  
  return data || [];
};

export const getUniqueStates = async (): Promise<string[]> => {
  const { data, error } = await supabase
    .from("investment_firms")
    .select("headquarters")
    .not("headquarters", "is", null);
    
  if (error) {
    console.error("Error fetching unique states:", error);
    throw new Error("Failed to fetch states");
  }
  
  const states = data
    .map(item => item.headquarters)
    .filter((state, index, self) => 
      state && self.indexOf(state) === index
    )
    .sort();
    
  return states;
};

export const getInvestmentFirmBySlug = async (slug: string): Promise<InvestmentFirm | null> => {
  const { data, error } = await supabase
    .from("investment_firms")
    .select(`
      *,
      investment_firm_features(feature),
      investment_firm_leadership(id, name, position, bio, avatar_url),
      money_making_methods(id, title, description),
      investment_firm_clients(client_type),
      investment_firm_regulatory_info(registration)
    `)
    .eq("slug", slug)
    .single();
    
  if (error) {
    console.error(`Error fetching investment firm with slug ${slug}:`, error);
    return null;
  }
  
  return data;
};

export const getSimilarFirms = async (firmId: string): Promise<InvestmentFirm[]> => {
  const { data, error } = await supabase
    .from("similar_firms")
    .select(`
      similar_firm_id,
      investment_firms!similar_firms_similar_firm_id_fkey(*)
    `)
    .eq("firm_id", firmId)
    .limit(3);
    
  if (error) {
    console.error("Error fetching similar firms:", error);
    return [];
  }
  
  return data?.map(item => item.investment_firms as InvestmentFirm) || [];
};
