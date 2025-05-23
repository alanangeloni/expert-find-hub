
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
    query = query.order('published_at', { ascending: false })
                 .order('created_at', { ascending: false });

    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching blog posts:', error);
      return [];
    }
    
    if (!data) return [];
    
    // Get categories for each post using a utility function
    const posts = await Promise.all(data.map(async (post) => {
      const postCategories = await getPostCategories(post.id);
      return {
        ...post,
        categories: postCategories,
        // Type cast status to ensure it matches the expected type
        status: post.status as 'draft' | 'published'
      } as BlogPost;
    }));
    
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
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error || !data) {
      console.error(`Error fetching blog post with slug ${slug}:`, error);
      return null;
    }

    // Get categories for the post
    const categories = await getPostCategories(data.id);

    return { 
      ...data, 
      categories,
      // Type cast status to ensure it matches the expected type
      status: data.status as 'draft' | 'published'
    } as BlogPost;
  } catch (error: any) {
    console.error(`Error fetching blog post with slug ${slug}:`, error);
    return null;
  }
};

// Get categories for a specific post
export const getPostCategories = async (postId: string): Promise<string[]> => {
  try {
    // Using direct SQL query since the relation might not be set up in Supabase types yet
    const { data, error } = await supabase
      .rpc('get_post_categories', { post_id: postId });
    
    if (error || !data) {
      console.error('Error fetching post categories:', error);
      return [];
    }
    
    return data.map((item: any) => item.category_name);
  } catch (error) {
    console.error('Error in getPostCategories:', error);
    return [];
  }
};

export const getBlogCategories = async (): Promise<string[]> => {
  try {
    // Using direct SQL query since the table might not be set up in Supabase types yet
    const { data, error } = await supabase
      .rpc('get_blog_categories');
      
    if (error || !data) {
      console.error('Error fetching blog categories:', error);
      return [];
    }
    
    return data.map((item: any) => item.name);
  } catch (error) {
    console.error('Error in getBlogCategories:', error);
    return [];
  }
};

export const createBlogPost = async (postData: {
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  cover_image_url?: string;
  status: 'draft' | 'published';
  categories?: string[];
}): Promise<BlogPost | null> => {
  try {
    const { categories, ...postFields } = postData;
    
    // Create the blog post
    const { data: post, error } = await supabase
      .from('blog_posts')
      .insert({
        ...postFields,
        published_at: postData.status === 'published' ? new Date().toISOString() : null
      })
      .select()
      .single();
      
    if (error || !post) {
      console.error('Error creating blog post:', error);
      return null;
    }
    
    // Add categories if provided
    if (categories && categories.length > 0) {
      for (const category of categories) {
        await addCategoryToPost(post.id, category);
      }
    }
    
    return { 
      ...post, 
      categories: categories || [],
      status: post.status as 'draft' | 'published'
    } as BlogPost;
  } catch (error) {
    console.error('Error in createBlogPost:', error);
    return null;
  }
};

export const updateBlogPost = async (postData: {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  cover_image_url?: string;
  status: 'draft' | 'published';
  categories?: string[];
}): Promise<BlogPost | null> => {
  try {
    const { id, categories, ...postFields } = postData;
    
    // Update the blog post
    const { data: post, error } = await supabase
      .from('blog_posts')
      .update({
        ...postFields,
        // Update published_at if changing to published status
        published_at: postData.status === 'published' && !postData.published_at 
          ? new Date().toISOString() 
          : undefined
      })
      .eq('id', id)
      .select()
      .single();
      
    if (error || !post) {
      console.error('Error updating blog post:', error);
      return null;
    }
    
    // Handle categories if provided
    if (categories !== undefined) {
      // First remove existing categories
      await supabase.rpc('remove_all_post_categories', { post_id: id });
      
      // Then add the new categories
      if (categories.length > 0) {
        for (const category of categories) {
          await addCategoryToPost(id, category);
        }
      }
    }
    
    return { 
      ...post, 
      categories: categories || [],
      status: post.status as 'draft' | 'published'
    } as BlogPost;
  } catch (error) {
    console.error('Error in updateBlogPost:', error);
    return null;
  }
};

export const deleteBlogPost = async (id: string): Promise<boolean> => {
  try {
    // Delete the blog post
    const { error } = await supabase
      .from('blog_posts')
      .delete()
      .eq('id', id);
      
    if (error) {
      console.error('Error deleting blog post:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in deleteBlogPost:', error);
    return false;
  }
};

export const addCategoryToPost = async (postId: string, categoryName: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .rpc('add_category_to_post', { 
        post_id: postId, 
        category: categoryName 
      });
      
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
      .rpc('remove_category_from_post', { 
        post_id: postId, 
        category: categoryName 
      });
      
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

export const uploadBlogImage = async (file: File): Promise<string | null> => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    const filePath = `blog-images/${fileName}`;
    
    const { error } = await supabase.storage
      .from('blog-images')
      .upload(filePath, file);
      
    if (error) {
      console.error('Error uploading image:', error);
      return null;
    }
    
    const { data } = supabase.storage
      .from('blog-images')
      .getPublicUrl(filePath);
      
    return data.publicUrl;
  } catch (error) {
    console.error('Error in uploadBlogImage:', error);
    return null;
  }
};
