import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { BlogPost, getBlogCategories, getBlogPostBySlug } from '@/services/blogService';
import { BlogPostForm } from '@/components/blog/BlogPostForm';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { Spinner } from '@/components/ui/spinner';
import { blogPostSchema, type BlogPostFormValues } from '@/types/blog';

const createBlogPost = async (postData: {
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  cover_image_url?: string;
  status: "draft" | "published";
  categories?: string[];
}): Promise<BlogPost> => {
  const response = await fetch('/api/blog/posts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(postData),
  });
  
  if (!response.ok) {
    throw new Error('Failed to create blog post');
  }
  
  return response.json();
};

const updateBlogPost = async (postData: {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  cover_image_url?: string;
  status: "draft" | "published";
  categories?: string[];
  published_at?: string;
}): Promise<BlogPost> => {
  const response = await fetch(`/api/blog/posts/${postData.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(postData),
  });
  
  if (!response.ok) {
    throw new Error('Failed to update blog post');
  }
  
  return response.json();
};

const BlogEditor = () => {
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

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-semibold mb-5">{slug ? 'Edit Blog Post' : 'Create Blog Post'}</h1>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <BlogPostForm
            control={control}
            errors={errors}
            setValue={setValue}
            categories={categories}
            coverImageUrl={coverImageUrl}
            setCoverImageUrl={setCoverImageUrl}
          />

          <Button type="submit" className="bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
            {slug ? 'Update Post' : 'Create Post'}
          </Button>
        </form>
      )}
    </div>
  );
};

export default BlogEditor;
