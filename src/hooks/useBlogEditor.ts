
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { supabase } from '@/integrations/supabase/client';
import { getPostCategories } from '@/utils/blogRelations';
import { BlogPost } from '@/services/blogService';
import { createBlogPost, updateBlogPost } from '@/services/blogService';
import { toast } from '@/components/ui/use-toast';
import { blogPostSchema, type BlogPostFormValues, type BlogCategoryType } from '@/types/blog';

export const useBlogEditor = () => {
  // Get the slug from the URL params
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [coverImageUrl, setCoverImageUrl] = useState<string>('');

  const [isPostLoading, setIsPostLoading] = useState(false);
  const [existingPost, setExistingPost] = useState<BlogPost | null>(null);

  // Fetch blog post data directly from Supabase by slug
  useEffect(() => {
    const fetchPost = async () => {
      if (!slug) {
        console.log('No slug provided, skipping fetch');
        return;
      }
      
      console.log('Fetching post with slug:', slug);
      setIsPostLoading(true);
      try {
        // Fetch the post by slug
        const { data: postData, error } = await supabase
          .from('blog_posts')
          .select('*')
          .eq('slug', slug)
          .single();

        if (error) {
          console.error('Error fetching post data:', error);
          throw error;
        }
        
        if (!postData) {
          console.log('No post found with slug:', slug);
          return;
        }

        console.log('Fetched post data:', postData);
        
        // Fetch categories
        console.log('Fetching categories for post ID:', postData.id);
        const categories = await getPostCategories(postData.id);
        
        const fullPost = {
          ...postData,
          categories,
          status: postData.status as 'draft' | 'published'
        };
        
        console.log('Full post data with categories:', fullPost);
        setExistingPost(fullPost);
      } catch (error) {
        console.error('Error fetching blog post:', error);
      } finally {
        setIsPostLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  const { control, handleSubmit, setValue, reset, formState: { errors } } = useForm<BlogPostFormValues>({
    resolver: zodResolver(blogPostSchema),
    defaultValues: {
      title: '',
      slug: '',
      content: '',
      excerpt: '',
      cover_image_url: '',
      status: 'draft',
      categories: [],
    },
  });

  useEffect(() => {
    console.log('Existing post changed:', existingPost);
    if (existingPost) {
      const formData = {
        title: existingPost.title,
        slug: existingPost.slug,
        content: existingPost.content,
        excerpt: existingPost.excerpt || '',
        cover_image_url: existingPost.cover_image_url || '',
        status: existingPost.status,
        categories: existingPost.categories as BlogCategoryType[] || [],
      };
      console.log('Resetting form with data:', formData);
      
      // Log the form state before reset
      console.log('Form state before reset:', control._formValues);
      
      reset(formData, {
        keepDirty: false,
        keepErrors: false,
        keepDefaultValues: false,
      });
      
      // Log the form state after reset
      setTimeout(() => {
        console.log('Form state after reset:', control._formValues);
      }, 0);
      
      setCoverImageUrl(existingPost.cover_image_url || '');
      console.log('Cover image URL set to:', existingPost.cover_image_url || '(empty)');
    } else if (slug) {
      console.log('No post found for slug:', slug);
    }
  }, [existingPost, reset, slug]);

  const createPostMutation = useMutation({
    mutationFn: (postData: {
      title: string;
      slug: string;
      content: string;
      excerpt?: string;
      cover_image_url?: string;
      status: "draft" | "published";
      categories?: string[];
    }) => createBlogPost(postData),
    onSuccess: () => {
      toast({ title: "Blog post created successfully!" });
      queryClient.invalidateQueries({ queryKey: ['blogPosts'] });
      navigate('/admin/blog');
    },
    onError: (error: any) => {
      toast({
        title: "Error creating blog post.",
        description: error.message || "Something went wrong.",
        variant: "destructive",
      });
    },
  });

  const updatePostMutation = useMutation({
    mutationFn: (postData: {
      id: string;
      title: string;
      slug: string;
      content: string;
      excerpt?: string;
      cover_image_url?: string;
      status: "draft" | "published";
      categories?: string[];
      published_at?: string;
    }) => updateBlogPost(postData),
    onSuccess: () => {
      toast({ title: "Blog post updated successfully!" });
      queryClient.invalidateQueries({ queryKey: ['blogPosts'] });
      navigate('/admin/blog');
    },
    onError: (error: any) => {
      toast({
        title: "Error updating blog post.",
        description: error.message || "Something went wrong.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: BlogPostFormValues) => {
    if (slug && existingPost) {
      updatePostMutation.mutate({
        id: existingPost.id,
        title: data.title,
        slug: data.slug,
        content: data.content,
        excerpt: data.excerpt,
        cover_image_url: data.cover_image_url,
        status: data.status,
        categories: data.categories,
        published_at: existingPost.published_at,
      });
    } else {
      createPostMutation.mutate({
        title: data.title,
        slug: data.slug,
        content: data.content,
        excerpt: data.excerpt,
        cover_image_url: data.cover_image_url,
        status: data.status,
        categories: data.categories,
      });
    }
  };

  const isLoading = isPostLoading || createPostMutation.isPending || updatePostMutation.isPending;

  return {
    slug,
    control,
    errors,
    setValue,
    coverImageUrl,
    setCoverImageUrl,
    handleSubmit,
    onSubmit,
    isLoading,
  };
};
