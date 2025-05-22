
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
  authorName?: string; // Added this field for UI display
  categories?: string[]; // Added for category support
};

export type CreateBlogPostInput = {
  title: string;
  content: string;
  slug: string;
  excerpt?: string;
  cover_image_url?: string;
  status?: 'draft' | 'published';
  categories?: string[]; // Added for category support
};

export type UpdateBlogPostInput = Partial<CreateBlogPostInput> & {
  id: string;
  published_at?: string | null;
};

// Get all available blog categories
export const getBlogCategories = async (): Promise<string[]> => {
  try {
    const { data, error } = await supabase
      .from('blog_categories')
      .select('name')
      .order('name');
      
    if (error) {
      console.error('Error fetching blog categories:', error);
      return [];
    }
    
    return data.map(category => category.name);
  } catch (error: any) {
    console.error('Error fetching blog categories:', error);
    return [];
  }
};

// Get all blog posts (admin can see all, public sees only published)
export const getBlogPosts = async (categoryFilter?: string) => {
  try {
    const query = supabase
      .from('blog_posts')
      .select('*, blog_post_categories(category_name)')
      .order('created_at', { ascending: false });
    
    const { data, error } = await query;

    if (error) {
      console.error('Error fetching blog posts:', error);
      toast({
        title: "Error fetching blog posts",
        description: error.message,
        variant: "destructive",
      });
      return [];
    }

    const formattedPosts = data.map(post => {
      // Extract categories from the blog_post_categories relation
      const categories = post.blog_post_categories 
        ? post.blog_post_categories.map((cat: any) => cat.category_name) 
        : [];
      
      // Remove the blog_post_categories property and add the categories array
      const { blog_post_categories, ...restPost } = post;
      return {
        ...restPost,
        categories
      } as BlogPost;
    });
    
    // Filter by category if requested
    if (categoryFilter && categoryFilter !== 'All') {
      return formattedPosts.filter(post => 
        post.categories?.includes(categoryFilter)
      );
    }

    return formattedPosts;
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
      .select('*, blog_post_categories(category_name)')
      .eq('slug', slug)
      .maybeSingle();

    if (error || !data) {
      console.error(`Error fetching blog post with slug ${slug}:`, error);
      return null;
    }

    // Format the post with categories
    const categories = data.blog_post_categories 
      ? data.blog_post_categories.map((cat: any) => cat.category_name) 
      : [];
    
    const { blog_post_categories, ...restPost } = data;
    
    return {
      ...restPost,
      categories
    } as BlogPost;
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
    
    // Extract categories to handle separately
    const { categories, ...postData } = post;
    
    // Insert the post first
    const { data, error } = await supabase
      .from('blog_posts')
      .insert([{ ...postData, status, published_at }])
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
    
    // If categories were provided, add them to the blog_post_categories table
    if (categories && categories.length > 0 && data.id) {
      const categoryEntries = categories.map(category => ({
        post_id: data.id,
        category_name: category
      }));
      
      const { error: categoryError } = await supabase
        .from('blog_post_categories')
        .insert(categoryEntries);
      
      if (categoryError) {
        console.error('Error adding blog post categories:', categoryError);
        toast({
          title: "Warning",
          description: "Post created but categories could not be added",
          variant: "default",
        });
      }
    }

    toast({
      title: "Blog post created",
      description: "The blog post was created successfully.",
    });

    return { ...data, categories } as BlogPost;
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
    const { id, categories, ...updateData } = post;
    
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
    
    // Update the blog post
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

    // If categories are provided, update them
    if (categories !== undefined) {
      // First remove all existing categories for this post
      const { error: deleteError } = await supabase
        .from('blog_post_categories')
        .delete()
        .eq('post_id', id);
        
      if (deleteError) {
        console.error('Error removing existing categories:', deleteError);
        toast({
          title: "Warning",
          description: "Post updated but there was an issue updating categories",
          variant: "default",
        });
      }
      
      // Then add the new categories
      if (categories.length > 0) {
        const categoryEntries = categories.map(category => ({
          post_id: id,
          category_name: category
        }));
        
        const { error: insertError } = await supabase
          .from('blog_post_categories')
          .insert(categoryEntries);
          
        if (insertError) {
          console.error('Error adding new categories:', insertError);
          toast({
            title: "Warning",
            description: "Post updated but there was an issue adding new categories",
            variant: "default",
          });
        }
      }
    }

    toast({
      title: "Blog post updated",
      description: "The blog post was updated successfully.",
    });

    return { ...data, categories } as BlogPost;
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
    // First delete the category associations
    await supabase
      .from('blog_post_categories')
      .delete()
      .eq('post_id', id);
      
    // Then delete the blog post
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
