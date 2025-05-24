
import React, { useState } from 'react';
import { Controller, Control, FieldErrors, UseFormSetValue } from 'react-hook-form';
import { RichTextEditor } from '@/components/editor/RichTextEditor';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { uploadBlogImage } from '@/services/blogService';

interface BlogPostFormValues {
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  cover_image_url?: string;
  status: 'draft' | 'published';
  categories?: string[];
}

interface BlogCategory {
  id: string;
  name: string;
}

interface BlogPostFormProps {
  control: Control<BlogPostFormValues>;
  errors: FieldErrors<BlogPostFormValues>;
  setValue: UseFormSetValue<BlogPostFormValues>;
  categories?: BlogCategory[];
  coverImageUrl: string;
  setCoverImageUrl: (url: string) => void;
}

export const BlogPostForm = ({
  control,
  errors,
  setValue,
  categories,
  coverImageUrl,
  setCoverImageUrl
}: BlogPostFormProps) => {
  const [isUploading, setIsUploading] = useState(false);

  const handleImageUpload = async (file: File) => {
    setIsUploading(true);
    try {
      const imageUrl = await uploadBlogImage(file);
      if (imageUrl) {
        setCoverImageUrl(imageUrl);
        setValue('cover_image_url', imageUrl);
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

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

        <div>
          <Label htmlFor="cover_image" className="block text-sm font-medium text-gray-700">Cover Image</Label>
          <Input
            type="file"
            id="cover_image"
            accept="image/*"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            onChange={handleFileSelect}
            disabled={isUploading}
          />
          {coverImageUrl && (
            <img src={coverImageUrl} alt="Cover" className="mt-2 max-h-40 object-contain rounded-md" />
          )}
          {errors.cover_image_url && <p className="text-red-500 text-sm mt-1">{errors.cover_image_url.message}</p>}
        </div>

        <div>
          <Label htmlFor="content" className="block text-sm font-medium text-gray-700">Content</Label>
          <Controller
            name="content"
            control={control}
            render={({ field }) => (
              <RichTextEditor
                value={field.value || ''}
                onChange={field.onChange}
                placeholder="Write your blog post content here..."
                className="mt-1"
              />
            )}
          />
          {errors.content && <p className="text-red-500 text-sm mt-1">{errors.content.message}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
  );
};
