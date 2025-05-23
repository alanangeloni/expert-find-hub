
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Editor } from '@tinymce/tinymce-react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { BlogPost, getBlogCategories, getBlogPostBySlug, uploadBlogImage } from '@/services/blogService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { Spinner } from '@/components/ui/spinner';

// Define the schema for blog post validation
const blogPostSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters." }),
  slug: z.string().min(3, { message: "Slug must be at least 3 characters." }),
  content: z.string().min(10, { message: "Content must be at least 10 characters." }),
  excerpt: z.string().optional(),
  cover_image_url: z.string().optional(),
  status: z.enum(['draft', 'published']),
  categories: z.array(z.string()).optional(),
});

type BlogPostFormValues = z.infer<typeof blogPostSchema>;

// Add these functions that were missing from blogService import
const createBlogPost = async (postData: {
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  cover_image_url?: string;
  status: "draft" | "published";
  categories?: string[];
}): Promise<BlogPost> => {
  // Implementation
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
  // Implementation
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

  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [coverImageUrl, setCoverImageUrl] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);

  // Fetch blog categories
  const { data: categories, isLoading: isCategoriesLoading } = useQuery({
    queryKey: ['blogCategories'],
    queryFn: getBlogCategories,
  });

  // Fetch existing blog post if editing
  const { data: existingPost, isLoading: isPostLoading } = useQuery({
    queryKey: ['blogPost', slug],
    queryFn: () => getBlogPostBySlug(slug || ''),
    enabled: !!slug, // Only run if slug exists
  });

  // Initialize form with React Hook Form
  const { control, handleSubmit, setValue, formState: { errors }, watch } = useForm<BlogPostFormValues>({
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

  // Set default values when existingPost is loaded
  useEffect(() => {
    if (existingPost) {
      setValue('title', existingPost.title);
      setValue('slug', existingPost.slug);
      setValue('content', existingPost.content);
      setValue('excerpt', existingPost.excerpt || '');
      setValue('cover_image_url', existingPost.cover_image_url || '');
      setValue('status', existingPost.status);
      // Ensure categories are strings
      setValue('categories', existingPost.categories ? existingPost.categories.map(cat => cat) : []);
      setCoverImageUrl(existingPost.cover_image_url || '');
    }
  }, [existingPost, setValue]);

  // Watch the status to update published_at if it changes to 'published'
  const status = watch('status');

  // Mutation for creating a blog post
  const createPostMutation = useMutation({
    mutationFn: createBlogPost,
    onSuccess: () => {
      toast({
        title: "Blog post created successfully!",
      });
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

  // Mutation for updating a blog post
  const updatePostMutation = useMutation({
    mutationFn: updateBlogPost,
    onSuccess: () => {
      toast({
        title: "Blog post updated successfully!",
      });
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

  // Function to handle form submission
  const onSubmit = (data: BlogPostFormValues) => {
    if (slug && existingPost) {
      // Update existing post - ensure all required fields are included
      updatePostMutation.mutate({
        id: existingPost.id,
        title: data.title,
        slug: data.slug,
        content: data.content,
        excerpt: data.excerpt,
        cover_image_url: data.cover_image_url,
        status: data.status,
        categories: data.categories,
        published_at: existingPost.published_at, // Preserve existing published_at value
      });
    } else {
      // Create new post - ensure all required fields are included
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

  // Function to handle image upload
  const handleImageUpload = async (file: File) => {
    setIsUploading(true);
    try {
      const imageUrl = await uploadBlogImage(file);
      if (imageUrl) {
        setCoverImageUrl(imageUrl);
        setValue('cover_image_url', imageUrl); // Set the form value
      } else {
        toast({
          title: "Failed to upload image.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Image upload error:", error);
      toast({
        title: "Error uploading image.",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  // Handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverImage(file);
      handleImageUpload(file);
    }
  };

  const isLoading = isCategoriesLoading || isPostLoading || createPostMutation.isPending || updatePostMutation.isPending || isUploading;

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-semibold mb-5">{slug ? 'Edit Blog Post' : 'Create Blog Post'}</h1>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Title Input */}
                <div>
                  <Label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</Label>
                  <Controller
                    name="title"
                    control={control}
                    render={({ field }) => (
                      <Input
                        type="text"
                        id="title"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        {...field}
                      />
                    )}
                  />
                  {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
                </div>

                {/* Slug Input */}
                <div>
                  <Label htmlFor="slug" className="block text-sm font-medium text-gray-700">Slug</Label>
                  <Controller
                    name="slug"
                    control={control}
                    render={({ field }) => (
                      <Input
                        type="text"
                        id="slug"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        {...field}
                      />
                    )}
                  />
                  {errors.slug && <p className="text-red-500 text-sm mt-1">{errors.slug.message}</p>}
                </div>
              </div>

              {/* Excerpt Textarea */}
              <div>
                <Label htmlFor="excerpt" className="block text-sm font-medium text-gray-700">Excerpt</Label>
                <Controller
                  name="excerpt"
                  control={control}
                  render={({ field }) => (
                    <Textarea
                      id="excerpt"
                      rows={3}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      {...field}
                    />
                  )}
                />
                {errors.excerpt && <p className="text-red-500 text-sm mt-1">{errors.excerpt.message}</p>}
              </div>

              {/* Cover Image Upload */}
              <div>
                <Label htmlFor="cover_image" className="block text-sm font-medium text-gray-700">Cover Image</Label>
                <Input
                  type="file"
                  id="cover_image"
                  accept="image/*"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  onChange={handleFileSelect}
                />
                {coverImageUrl && (
                  <img src={coverImageUrl} alt="Cover" className="mt-2 max-h-40 object-contain rounded-md" />
                )}
                {errors.cover_image_url && <p className="text-red-500 text-sm mt-1">{errors.cover_image_url.message}</p>}
              </div>

              {/* Content Editor */}
              <div>
                <Label htmlFor="content" className="block text-sm font-medium text-gray-700">Content</Label>
                <Controller
                  name="content"
                  control={control}
                  render={({ field }) => (
                    <Editor
                      apiKey="YOUR_TINY_MCE_API_KEY"
                      value={field.value || ''}
                      onEditorChange={field.onChange}
                      init={{
                        height: 500,
                        menubar: true,
                        plugins: [
                          'advlist autolink lists link image charmap print preview anchor',
                          'searchreplace visualblocks code fullscreen',
                          'insertdatetime media table paste code help wordcount'
                        ],
                        toolbar:
                          'undo redo | formatselect | ' +
                          'bold italic backcolor | alignleft aligncenter ' +
                          'alignright alignjustify | bullist numlist outdent indent | ' +
                          'removeformat | help'
                      }}
                    />
                  )}
                />
                {errors.content && <p className="text-red-500 text-sm mt-1">{errors.content.message}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Status Select */}
                <div>
                  <Label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</Label>
                  <Controller
                    name="status"
                    control={control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="published">Published</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>

                {/* Categories Select (Multiple) */}
                <div>
                  <Label htmlFor="categories" className="block text-sm font-medium text-gray-700">Categories</Label>
                  <div className="mt-1">
                    {categories && categories.length > 0 ? (
                      categories.map((category) => (
                        <div key={category.id} className="flex items-center space-x-2">
                          <Controller
                            name="categories"
                            control={control}
                            render={({ field }) => (
                              <Checkbox
                                id={`category-${category.id}`}
                                checked={field.value?.includes(category.name) || false}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    field.onChange([...(field.value || []), category.name]);
                                  } else {
                                    field.onChange(field.value?.filter((val) => val !== category.name));
                                  }
                                }}
                              />
                            )}
                          />
                          <Label htmlFor={`category-${category.id}`} className="text-sm font-medium text-gray-700">{category.name}</Label>
                        </div>
                      ))
                    ) : (
                      <p>No categories available.</p>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <Button type="submit" className="bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
            {slug ? 'Update Post' : 'Create Post'}
          </Button>
        </form>
      )}
    </div>
  );
};

export default BlogEditor;
