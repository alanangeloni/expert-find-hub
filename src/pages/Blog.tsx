
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { 
  getBlogPosts, 
  getBlogCategories,
  type BlogPost as BlogPostType,
  type BlogCategory
} from '@/services/blogService';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Spinner } from '@/components/ui/spinner';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';

const Blog = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [posts, setPosts] = useState<BlogPostType[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);

  // Fetch categories
  const { data: categoriesData, isLoading: categoriesLoading } = useQuery({
    queryKey: ['blogCategories'],
    queryFn: getBlogCategories
  });

  // Fetch blog posts
  const { data: postsData, isLoading: postsLoading } = useQuery({
    queryKey: ['blogPosts', selectedCategory],
    queryFn: () => getBlogPosts({
      status: 'published',
      category: selectedCategory === 'all' ? undefined : selectedCategory
    })
  });

  // Update posts when data changes
  useEffect(() => {
    if (postsData) {
      setPosts(postsData);
    }
  }, [postsData]);

  // Update categories when data changes
  useEffect(() => {
    if (categoriesData) {
      setCategories(categoriesData);
    }
  }, [categoriesData]);

  // Function to truncate text for post excerpts
  const truncateText = (text: string, maxLength: number) => {
    if (text && text.length > maxLength) {
      return text.substring(0, maxLength) + '...';
    }
    return text;
  };

  // Format date for display
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    return format(new Date(dateString), 'MMMM d, yyyy');
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Blog</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Industry insights and financial wisdom from our expert advisors
        </p>
      </div>

      {/* Categories filter */}
      <div className="mb-8">
        <Tabs defaultValue="all" value={selectedCategory} onValueChange={setSelectedCategory}>
          <TabsList className="flex flex-wrap justify-center gap-2 mb-8">
            <TabsTrigger value="all">All Posts</TabsTrigger>
            {categories.map((category) => (
              <TabsTrigger key={category.id} value={category.name}>
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* Loading state */}
      {(postsLoading || categoriesLoading) && (
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      )}

      {/* Blog posts grid */}
      {!postsLoading && posts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <Card key={post.id} className="overflow-hidden flex flex-col h-full hover:shadow-lg transition-shadow">
              {post.cover_image_url && (
                <div className="aspect-video overflow-hidden">
                  <img 
                    src={post.cover_image_url} 
                    alt={post.title} 
                    className="w-full h-full object-cover transition-transform hover:scale-105" 
                  />
                </div>
              )}
              <CardContent className="flex flex-col flex-grow p-5">
                <div className="mb-4 text-sm text-gray-500">
                  {formatDate(post.published_at || post.created_at)}
                </div>
                <h2 className="text-xl font-bold mb-2 hover:text-blue-600 transition-colors">{post.title}</h2>
                <p className="text-gray-600 mb-4 line-clamp-3 flex-grow">
                  {truncateText(post.excerpt || post.content, 160)}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {post.categories?.map((category, index) => (
                    <span key={`${post.id}-${category}-${index}`} className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                      {category}
                    </span>
                  ))}
                </div>
                <Link to={`/blog/${post.slug}`} className="mt-auto">
                  <Button variant="outline" className="w-full">Read More</Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : !postsLoading ? (
        <div className="text-center py-12">
          <p className="text-lg text-gray-600">No articles found for this category.</p>
        </div>
      ) : null}
    </div>
  );
};

export default Blog;
