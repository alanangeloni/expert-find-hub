
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
    console.log('Fetching accounting firms from database...');
    
    const { data: firms, error } = await supabase
      .from('accounting_firms')
      .select('*')
      .order('name');

    if (error) {
      console.error('Error fetching accounting firms:', error);
      console.error('Error details:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
      return [];
    }

    console.log(`Found ${firms?.length || 0} accounting firms`);
    console.log('Firms data:', firms);
    return firms || [];
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

    return firms[0];
  } catch (error) {
    console.error('Error fetching accounting firm by slug:', error);
    return null;
  }
}
