
import { supabase } from "@/integrations/supabase/client";

export interface AccountingFirm {
  id: string;
  name: string;
  slug: string;
  description?: string;
  long_description?: string;
  address?: string;
  website?: string;
  logo_url?: string;
  large_image_url?: string;
  small_image_url?: string;
  video_url?: string;
  video_title?: string;
  minimum_fee?: string;
  established?: string;
  headquarters?: string;
  employees?: string;
  rating?: number;
  review_count?: number;
  verified?: boolean;
  premium?: boolean;
  created_at?: string;
  updated_at?: string;
  services?: string[];
  specialties?: string[];
  industries?: string[];
}

export async function getAccountingFirms(): Promise<AccountingFirm[]> {
  try {
    const { data: firms, error } = await supabase
      .from('accounting_firms')
      .select('*');

    if (error) throw error;

    // Get additional details for each firm
    const firmsWithDetails = await Promise.all(
      firms.map(async (firm) => {
        // Get services
        const { data: services, error: servicesError } = await supabase
          .from('accounting_firm_services')
          .select('service')
          .eq('firm_id', firm.id);

        if (servicesError) console.error('Error fetching services:', servicesError);

        // Get specialties
        const { data: specialties, error: specialtiesError } = await supabase
          .from('accounting_firm_specialties')
          .select('specialty')
          .eq('firm_id', firm.id);

        if (specialtiesError) console.error('Error fetching specialties:', specialtiesError);

        // Get industries
        const { data: industries, error: industriesError } = await supabase
          .from('accounting_firm_industries')
          .select('industry')
          .eq('firm_id', firm.id);

        if (industriesError) console.error('Error fetching industries:', industriesError);

        return {
          ...firm,
          services: services?.map(s => s.service) || [],
          specialties: specialties?.map(s => s.specialty) || [],
          industries: industries?.map(i => i.industry) || []
        };
      })
    );

    return firmsWithDetails;
  } catch (error) {
    console.error('Error fetching accounting firms:', error);
    return [];
  }
}

export async function getAccountingFirmBySlug(slug: string): Promise<AccountingFirm | null> {
  try {
    const { data: firms, error } = await supabase
      .from('accounting_firms')
      .select('*')
      .eq('slug', slug)
      .limit(1);

    if (error) throw error;
    if (!firms || firms.length === 0) return null;

    const firm = firms[0];

    // Get services
    const { data: services, error: servicesError } = await supabase
      .from('accounting_firm_services')
      .select('service')
      .eq('firm_id', firm.id);

    if (servicesError) console.error('Error fetching services:', servicesError);

    // Get specialties
    const { data: specialties, error: specialtiesError } = await supabase
      .from('accounting_firm_specialties')
      .select('specialty')
      .eq('firm_id', firm.id);

    if (specialtiesError) console.error('Error fetching specialties:', specialtiesError);

    // Get industries
    const { data: industries, error: industriesError } = await supabase
      .from('accounting_firm_industries')
      .select('industry')
      .eq('firm_id', firm.id);

    if (industriesError) console.error('Error fetching industries:', industriesError);

    return {
      ...firm,
      services: services?.map(s => s.service) || [],
      specialties: specialties?.map(s => s.specialty) || [],
      industries: industries?.map(i => i.industry) || []
    };
  } catch (error) {
    console.error('Error fetching accounting firm by slug:', error);
    return null;
  }
}
