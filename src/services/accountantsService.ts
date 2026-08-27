import { supabase } from "@/integrations/supabase/client";

export interface Accountant {
  id: string;
  name: string;
  slug: string;
  position?: string;
  bio?: string;
  firm_name?: string;
  firm_address?: string;
  linked_firm?: string;
  headshot_url?: string;
  city?: string;
  state_hq?: string;
  states_served?: string[];
  website_url?: string;
  credentials?: string[];
  services?: string[];
  client_specialties?: string[];
  years_of_experience?: number;
  minimum_fee?: string;
  pricing_note?: string;
  disclaimer?: string;
  verified?: boolean;
  status?: string;
  created_at?: string;
  updated_at?: string;
}

// Public reads go through the secure view that omits email, phone, and user_id
// and only exposes approved accountants.
const publicView = () => (supabase.from as any)("accountants_public");

export const getAllAccountants = async (): Promise<Accountant[]> => {
  try {
    const { data, error } = await publicView().select("*").range(0, 999);
    if (error) throw error;
    return (data || []) as Accountant[];
  } catch (error) {
    console.error("Error fetching accountants:", error);
    return [];
  }
};

export const getAccountantBySlug = async (slug: string): Promise<Accountant | null> => {
  try {
    const { data, error } = await publicView().select("*").eq("slug", slug).maybeSingle();
    if (error) throw error;
    return (data as Accountant) || null;
  } catch (error) {
    console.error("Error fetching accountant:", error);
    return null;
  }
};

export const getAccountantCountBySpecialty = async (): Promise<Record<string, number>> => {
  const accountants = await getAllAccountants();
  const counts: Record<string, number> = {};
  for (const a of accountants) {
    for (const s of a.client_specialties || []) {
      counts[s] = (counts[s] || 0) + 1;
    }
  }
  return counts;
};
