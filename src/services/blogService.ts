
import { supabase } from "@/integrations/supabase/client";

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  cover_image_url?: string;
  status: 'draft' | 'published';
  created_at: string;
  updated_at: string;
  published_at?: string;
  author_id?: string;
  blog_category?: string;
  categories?: string[];
  authorName?: string;
}

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
}

export interface BlogPostCreate {
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  cover_image_url?: string;
  status: 'draft' | 'published';
  categories?: string[];
  published_at?: string;
}

export interface BlogPostUpdate {
  title?: string;
  slug?: string;
  content?: string;
  excerpt?: string;
  cover_image_url?: string;
  status?: 'draft' | 'published';
  categories?: string[];
  published_at?: string;
}

export interface BlogPostFilters {
  status?: 'draft' | 'published';
  category?: string;
  limit?: number;
}

export const getBlogPosts = async (filters?: BlogPostFilters): Promise<BlogPost[]> => {
  try {
    let query = supabase.from('blog_posts').select('*');

    if (filters?.status) {
      query = query.eq('status', filters.status);
    }

    if (filters?.category && filters.category !== 'all') {
      query = query.eq('blog_category', filters.category);
    }

    query = query.order('published_at', { ascending: false });

    if (filters?.limit) {
      query = query.limit(filters.limit);
    }

    const { data, error } = await query;

    if (error) throw error;
    return (data || []).map(post => ({
      ...post,
      status: post.status as 'draft' | 'published'
    }));
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return [];
  }
};

export const getBlogCategories = async (): Promise<BlogCategory[]> => {
  try {
    const { data, error } = await supabase.rpc('get_blog_categories');
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching blog categories:', error);
    // Return predefined categories as fallback
    return [
      { id: '1', name: 'Investment Planning', slug: 'investment-planning' },
      { id: '2', name: 'Retirement Planning', slug: 'retirement-planning' },
      { id: '3', name: 'Tax Planning', slug: 'tax-planning' },
      { id: '4', name: 'Estate Planning', slug: 'estate-planning' },
      { id: '5', name: 'Financial Education', slug: 'financial-education' },
      { id: '6', name: 'Market Analysis', slug: 'market-analysis' },
      { id: '7', name: 'Personal Finance', slug: 'personal-finance' },
      { id: '8', name: 'Business Finance', slug: 'business-finance' }
    ];
  }
};

export const getBlogPostBySlug = async (slug: string): Promise<BlogPost | null> => {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'published')
      .single();

    if (error) throw error;
    return {
      ...data,
      status: data.status as 'draft' | 'published'
    };
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return null;
  }
};

export const createBlogPost = async (post: BlogPostCreate): Promise<BlogPost> => {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .insert(post)
      .select()
      .single();

    if (error) throw error;
    return {
      ...data,
      status: data.status as 'draft' | 'published'
    };
  } catch (error) {
    console.error('Error creating blog post:', error);
    throw error;
  }
};

export const updateBlogPost = async (id: string, updates: BlogPostUpdate): Promise<BlogPost> => {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return {
      ...data,
      status: data.status as 'draft' | 'published'
    };
  } catch (error) {
    console.error('Error updating blog post:', error);
    throw error;
  }
};

export const deleteBlogPost = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('blog_posts')
      .delete()
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting blog post:', error);
    throw error;
  }
};

export const uploadBlogImage = async (file: File): Promise<string> => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    
    // For now, return a placeholder URL since we don't have storage configured
    return `/placeholder-image.jpg`;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};
