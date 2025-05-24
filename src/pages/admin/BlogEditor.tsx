
import React from 'react';
import { BlogPostForm } from '@/components/blog/BlogPostForm';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { useBlogEditor } from '@/hooks/useBlogEditor';

const BlogEditor = () => {
  const {
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
  } = useBlogEditor();

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
