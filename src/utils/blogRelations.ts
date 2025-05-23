
import { supabase } from '@/integrations/supabase/client';

/**
 * Get all categories for a specific blog post
 */
export const getPostCategories = async (postId: string): Promise<string[]> => {
  try {
    // We'll use a direct query since the relationships might not be set up yet
    const { data, error } = await supabase
      .from('blog_post_categories')
      .select('category_name')
      .eq('post_id', postId);

    if (error) {
      console.error('Error fetching post categories:', error);
      return [];
    }

    return data?.map(item => item.category_name) || [];
  } catch (error) {
    console.error('Error in getPostCategories:', error);
    return [];
  }
};
