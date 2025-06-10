
import { supabase } from "@/integrations/supabase/client";
import { getPostCategories } from "@/utils/blogRelations";
import { BLOG_CATEGORIES, type BlogCategoryType } from "@/types/blog";

// Export the BlogPost interface
export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  cover_image_url?: string;
  status: 'draft' | 'published';
  author_id?: string;
  published_at?: string;
  created_at?: string;
  updated_at?: string;
  categories?: string[];
  authorName?: string;
}

// Export the BlogCategory interface
export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
}

export const uploadBlogImage = async (file: File): Promise<string | null> => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `blog-images/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('blog-images')
      .upload(filePath, file);

    if (uploadError) {
      console.error('Error uploading image:', uploadError);
      return null;
    }

    const { data } = supabase.storage
      .from('blog-images')
      .getPublicUrl(filePath);

    return data.publicUrl;
  } catch (error) {
    console.error('Error uploading blog image:', error);
    return null;
  }
};

export const getBlogPosts = async (): Promise<BlogPost[]> => {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('status', 'published')
      .order('published_at', { ascending: false });

    if (error) {
      console.error('Error fetching blog posts:', error);
      return [];
    }

    // Add categories to each post
    const postsWithCategories = await Promise.all(
      (data || []).map(async (post) => {
        const categories = await getPostCategories(post.id);
        return {
          ...post,
          categories,
          authorName: 'Admin' // Default author name
        };
      })
    );

    return postsWithCategories;
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
      console.error('Error fetching blog post:', error);
      return null;
    }

    const categories = await getPostCategories(data.id);

    return {
      ...data,
      categories,
      authorName: 'Admin' // Default author name
    };
  } catch (error) {
    console.error('Error in getBlogPostBySlug:', error);
    return null;
  }
};

export const createBlogPost = async (post: Omit<BlogPost, 'id' | 'created_at' | 'updated_at'>): Promise<BlogPost | null> => {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .insert([{
        ...post,
        published_at: post.status === 'published' ? new Date().toISOString() : null
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating blog post:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error in createBlogPost:', error);
    throw error;
  }
};

export const updateBlogPost = async (id: string, updates: Partial<BlogPost>): Promise<BlogPost | null> => {
  try {
    const updateData = { ...updates };
    
    // If status is being changed to published and there's no published_at date, set it
    if (updates.status === 'published' && !updates.published_at) {
      updateData.published_at = new Date().toISOString();
    }

    const { data, error } = await supabase
      .from('blog_posts')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating blog post:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error in updateBlogPost:', error);
    throw error;
  }
};

export const deleteBlogPost = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('blog_posts')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting blog post:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error in deleteBlogPost:', error);
    throw error;
  }
};

export const getDraftBlogPosts = async (): Promise<BlogPost[]> => {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('status', 'draft')
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Error fetching draft blog posts:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getDraftBlogPosts:', error);
    return [];
  }
};

export const getAllBlogPosts = async (): Promise<BlogPost[]> => {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Error fetching all blog posts:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getAllBlogPosts:', error);
    return [];
  }
};
