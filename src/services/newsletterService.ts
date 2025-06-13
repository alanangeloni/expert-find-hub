
import { supabase } from '@/integrations/supabase/client';

export interface NewsletterSignup {
  Name?: string;
  Email: string;
}

export const subscribeToNewsletter = async (data: NewsletterSignup) => {
  try {
    const { error } = await supabase
      .from('newsletter_signups')
      .insert([{
        Name: data.Name,
        Email: data.Email
      }]);

    if (error) throw error;
    
    return { success: true };
  } catch (error) {
    console.error('Error subscribing to newsletter:', error);
    throw error;
  }
};
