import { supabase } from "@/integrations/supabase/client";

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  cover_image_url?: string;
  status: 'draft' | 'published';
  author_id?: string;
  authorName?: string;
  published_at?: string;
  created_at: string;
  updated_at: string;
  categories?: string[];
}

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
}

export const getBlogPosts = async (options: {
  status?: 'draft' | 'published' | 'all';
  category?: string;
  limit?: number;
  authorId?: string;
} = {}): Promise<BlogPost[]> => {
  try {
    let query = supabase.from('blog_posts').select('*');

    // Apply filters
    if (options.status && options.status !== 'all') {
      query = query.eq('status', options.status);
    }
    
    if (options.authorId) {
      query = query.eq('author_id', options.authorId);
    }
    
    if (options.limit) {
      query = query.limit(options.limit);
    }
    
    // Order by published date or created date
    query = query.order('published_at', { ascending: false, nullsLast: true })
                 .order('created_at', { ascending: false });

    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching blog posts:', error);
      return [];
    }
    
    if (!data) return [];
    
    // Get categories for each post
    const postIds = data.map(post => post.id);
    const { data: categoriesData } = await supabase
      .from('blog_post_categories')
      .select('blog_post_id, name')
      .in('blog_post_id', postIds);
      
    // Format posts with categories
    const posts = data.map(post => {
      const postCategories = categoriesData 
        ? categoriesData
            .filter(cat => cat.blog_post_id === post.id)
            .map(cat => cat.name)
        : [];
        
      return {
        ...post,
        categories: postCategories
      };
    });
    
    // Filter by category if specified
    if (options.category) {
      return posts.filter(post => 
        post.categories && post.categories.includes(options.category)
      );
    }
    
    return posts;
  } catch (error) {
    console.error('Error in getBlogPosts:', error);
    return [];
  }
};

export const getBlogPostBySlug = async (slug: string): Promise<BlogPost | null> => {
  try {
    const { data } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .single();

    return data || null;
  } catch (error: any) {
    console.error(`Error fetching blog post with slug ${slug}:`, error);
    return null;
  }
};

export const getBlogCategories = async (): Promise<BlogCategory[]> => {
  try {
    const { data, error } = await supabase
      .from('blog_categories')
      .select('*')
      .order('name');
      
    if (error) {
      console.error('Error fetching blog categories:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Error in getBlogCategories:', error);
    return [];
  }
};

export const addCategoryToPost = async (postId: string, categoryName: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('blog_post_categories')
      .insert({ blog_post_id: postId, name: categoryName });
      
    if (error) {
      console.error('Error adding category to post:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in addCategoryToPost:', error);
    return false;
  }
};

export const removeCategoryFromPost = async (postId: string, categoryName: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('blog_post_categories')
      .delete()
      .eq('blog_post_id', postId)
      .eq('name', categoryName);
      
    if (error) {
      console.error('Error removing category from post:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in removeCategoryFromPost:', error);
    return false;
  }
};
