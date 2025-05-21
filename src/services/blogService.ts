
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export type BlogPost = {
  id: string;
  title: string;
  content: string;
  slug: string;
  excerpt?: string | null;
  cover_image_url?: string | null;
  author_id?: string | null;
  status: 'draft' | 'published';
  published_at?: string | null;
  created_at: string;
  updated_at: string;
};

export type CreateBlogPostInput = {
  title: string;
  content: string;
  slug: string;
  excerpt?: string;
  cover_image_url?: string;
  status?: 'draft' | 'published';
};

export type UpdateBlogPostInput = Partial<CreateBlogPostInput> & {
  id: string;
  published_at?: string | null;
};

// Get all blog posts (admin can see all, public sees only published)
export const getBlogPosts = async () => {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching blog posts:', error);
      toast({
        title: "Error fetching blog posts",
        description: error.message,
        variant: "destructive",
      });
      return [];
    }

    return data as BlogPost[];
  } catch (error: any) {
    console.error('Error fetching blog posts:', error);
    toast({
      title: "Error fetching blog posts",
      description: error.message,
      variant: "destructive",
    });
    return [];
  }
};

// Get a single blog post by slug
export const getBlogPostBySlug = async (slug: string) => {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) {
      console.error(`Error fetching blog post with slug ${slug}:`, error);
      return null;
    }

    return data as BlogPost;
  } catch (error: any) {
    console.error(`Error fetching blog post with slug ${slug}:`, error);
    return null;
  }
};

// Create a new blog post
export const createBlogPost = async (post: CreateBlogPostInput) => {
  try {
    // Default to draft if status is not provided
    const status = post.status || 'draft';
    const published_at = status === 'published' ? new Date().toISOString() : null;
    
    const { data, error } = await supabase
      .from('blog_posts')
      .insert([{ ...post, status, published_at }])
      .select()
      .single();

    if (error) {
      console.error('Error creating blog post:', error);
      toast({
        title: "Error creating blog post",
        description: error.message,
        variant: "destructive",
      });
      return null;
    }

    toast({
      title: "Blog post created",
      description: "The blog post was created successfully.",
    });

    return data as BlogPost;
  } catch (error: any) {
    console.error('Error creating blog post:', error);
    toast({
      title: "Error creating blog post",
      description: error.message,
      variant: "destructive",
    });
    return null;
  }
};

// Update an existing blog post
export const updateBlogPost = async (post: UpdateBlogPostInput) => {
  try {
    const { id, ...updateData } = post;
    
    // If status is changed to published and there's no published_at date, set it
    if (updateData.status === 'published') {
      const { data: existingPost } = await supabase
        .from('blog_posts')
        .select('status, published_at')
        .eq('id', id)
        .single();
        
      if (existingPost && existingPost.status !== 'published') {
        updateData.published_at = new Date().toISOString();
      }
    }
    
    const { data, error } = await supabase
      .from('blog_posts')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error(`Error updating blog post with id ${id}:`, error);
      toast({
        title: "Error updating blog post",
        description: error.message,
        variant: "destructive",
      });
      return null;
    }

    toast({
      title: "Blog post updated",
      description: "The blog post was updated successfully.",
    });

    return data as BlogPost;
  } catch (error: any) {
    console.error('Error updating blog post:', error);
    toast({
      title: "Error updating blog post",
      description: error.message,
      variant: "destructive",
    });
    return null;
  }
};

// Delete a blog post
export const deleteBlogPost = async (id: string) => {
  try {
    const { error } = await supabase
      .from('blog_posts')
      .delete()
      .eq('id', id);

    if (error) {
      console.error(`Error deleting blog post with id ${id}:`, error);
      toast({
        title: "Error deleting blog post",
        description: error.message,
        variant: "destructive",
      });
      return false;
    }

    toast({
      title: "Blog post deleted",
      description: "The blog post was deleted successfully.",
    });

    return true;
  } catch (error: any) {
    console.error(`Error deleting blog post with id ${id}:`, error);
    toast({
      title: "Error deleting blog post",
      description: error.message,
      variant: "destructive",
    });
    return false;
  }
};

// Upload an image for a blog post
export const uploadBlogImage = async (file: File) => {
  try {
    // Create a unique file name
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
    const filePath = `blog/${fileName}`;
    
    const { error: uploadError } = await supabase.storage
      .from('blog-images')
      .upload(filePath, file);
      
    if (uploadError) {
      console.error('Error uploading image:', uploadError);
      toast({
        title: "Error uploading image",
        description: uploadError.message,
        variant: "destructive",
      });
      return null;
    }
    
    const { data } = supabase.storage
      .from('blog-images')
      .getPublicUrl(filePath);
      
    return data.publicUrl;
  } catch (error: any) {
    console.error('Error uploading image:', error);
    toast({
      title: "Error uploading image",
      description: error.message,
      variant: "destructive",
    });
    return null;
  }
};
