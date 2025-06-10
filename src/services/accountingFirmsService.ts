
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
}

export async function getAccountingFirms(): Promise<AccountingFirm[]> {
  try {
    const { data: firms, error } = await supabase
      .from('accounting_firms')
      .select('*');

    if (error) throw error;

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
