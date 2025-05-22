import { supabase } from "@/integrations/supabase/client";
import { type Tables } from "@/integrations/supabase/types";

export type Advisor = Tables<"advisors">;

// Define an AdvisorSpecialty type to match the allowed values
export type AdvisorSpecialty = 
  | "Financial Planning" 
  | "Retirement Planning" 
  | "Investment Management" 
  | "Estate Planning" 
  | "Tax Planning" 
  | "Insurance Planning" 
  | "Education Planning" 
  | "Business Planning";

export const getAdvisors = async (
  searchTerm?: string,
  specialties?: AdvisorSpecialty | "all",
  leadGenEnabled?: boolean,
  minExperience?: number,
  maxExperience?: number
) => {
  try {
    let query = supabase.from("advisors").select("*");

    // Apply filters if provided
    if (searchTerm) {
      query = query.or(
        `first_name.ilike.%${searchTerm}%,last_name.ilike.%${searchTerm}%,firm_name.ilike.%${searchTerm}%`
      );
    }

    if (leadGenEnabled !== undefined) {
      query = query.eq("lead_gen_enabled", leadGenEnabled);
    }

    if (minExperience) {
      query = query.gte("years_experience", minExperience);
    }

    if (maxExperience) {
      query = query.lte("years_experience", maxExperience);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching advisors:", error);
      return [];
    }

    // Filter by specialty if needed (using client-side filtering)
    let filteredData = [...(data || [])];
    
    if (specialties && specialties !== "all") {
      const specialtyToCheck = specialties;
      filteredData = filteredData.filter((advisor) => {
        // Safe check for services property
        if (!advisor.services || !Array.isArray(advisor.services)) return false;
        // Check if the advisor has the requested specialty
        return advisor.services.includes(specialtyToCheck);
      });
    }

    return filteredData;
  } catch (error) {
    console.error("Error in getAdvisors:", error);
    return [];
  }
};

export const getAdvisorBySlug = async (slug: string): Promise<Advisor | null> => {
  try {
    const { data, error } = await supabase
      .from('advisors')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) {
      console.error(`Error fetching advisor with slug ${slug}:`, error);
      return null;
    }

    return data;
  } catch (error: any) {
    console.error(`Error fetching advisor with slug ${slug}:`, error);
    return null;
  }
};
