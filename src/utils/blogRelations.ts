
import { supabase } from "@/integrations/supabase/client";

// Helper function to get post categories to work around the relation issue
export const getPostCategories = async (postId: string): Promise<string[]> => {
  try {
    const { data, error } = await supabase
      .from('blog_post_categories')
      .select('name')
      .eq('blog_post_id', postId);
      
    if (error) {
      console.error('Error fetching post categories:', error);
      return [];
    }
    
    return data ? data.map(item => item.name) : [];
  } catch (error) {
    console.error('Error in getPostCategories:', error);
    return [];
  }
};

// Helper function to get all blog posts with their categories
export const getBlogPostsWithCategories = async () => {
  try {
    // First, get all posts
    const { data: posts, error: postsError } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('status', 'published')
      .order('published_at', { ascending: false });
      
    if (postsError) {
      console.error('Error fetching blog posts:', postsError);
      return [];
    }
    
    if (!posts || posts.length === 0) return [];
    
    // Then get all categories for these posts
    const postIds = posts.map(post => post.id);
    const { data: categoriesData } = await supabase
      .from('blog_post_categories')
      .select('blog_post_id, name')
      .in('blog_post_id', postIds);
      
    // Map categories to posts
    return posts.map(post => {
      const categories = categoriesData 
        ? categoriesData
            .filter(cat => cat.blog_post_id === post.id)
            .map(cat => cat.name)
        : [];
            
      return {
        ...post,
        categories
      };
    });
  } catch (error) {
    console.error('Error in getBlogPostsWithCategories:', error);
    return [];
  }
};
