
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { getBlogCategories, getBlogPostBySlug } from '@/services/blogService';
import { createBlogPost, updateBlogPost } from '@/services/blogMutations';
import { toast } from '@/components/ui/use-toast';
import { blogPostSchema, type BlogPostFormValues } from '@/types/blog';

export const useBlogEditor = () => {
  const { slug } = useParams<{ slug?: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [coverImageUrl, setCoverImageUrl] = useState<string>('');

  const { data: categories, isLoading: isCategoriesLoading } = useQuery({
    queryKey: ['blogCategories'],
    queryFn: getBlogCategories,
  });

  const { data: existingPost, isLoading: isPostLoading } = useQuery({
    queryKey: ['blogPost', slug],
    queryFn: () => getBlogPostBySlug(slug || ''),
    enabled: !!slug,
  });

  const { control, handleSubmit, setValue, formState: { errors } } = useForm<BlogPostFormValues>({
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
    if (existingPost) {
      setValue('title', existingPost.title);
      setValue('slug', existingPost.slug);
      setValue('content', existingPost.content);
      setValue('excerpt', existingPost.excerpt || '');
      setValue('cover_image_url', existingPost.cover_image_url || '');
      setValue('status', existingPost.status);
      setValue('categories', existingPost.categories ? existingPost.categories.map(cat => cat) : []);
      setCoverImageUrl(existingPost.cover_image_url || '');
    }
  }, [existingPost, setValue]);

  const createPostMutation = useMutation({
    mutationFn: createBlogPost,
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
    mutationFn: updateBlogPost,
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

  const isLoading = isCategoriesLoading || isPostLoading || createPostMutation.isPending || updatePostMutation.isPending;

  return {
    slug,
    control,
    errors,
    setValue,
    categories,
    coverImageUrl,
    setCoverImageUrl,
    handleSubmit,
    onSubmit,
    isLoading,
  };
};
