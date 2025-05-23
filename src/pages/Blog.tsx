
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { 
  getBlogPosts, 
  getBlogCategories,
  type BlogPost,
  type BlogCategory
} from '@/services/blogService';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/spinner';
import { format } from 'date-fns';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

const Blog = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [posts, setPosts] = useState<BlogPost[]>([]);

  // Fetch categories
  const { data: categoriesData, isLoading: categoriesLoading } = useQuery({
    queryKey: ['blogCategories'],
    queryFn: getBlogCategories
  });

  // Fetch blog posts
  const { data: postsData, isLoading: postsLoading } = useQuery({
    queryKey: ['blogPosts', selectedCategory, searchQuery],
    queryFn: () => getBlogPosts({
      status: 'published',
      category: selectedCategory === 'all' ? undefined : selectedCategory
    })
  });

  // Update posts when data changes or when search query changes
  useEffect(() => {
    if (postsData) {
      if (searchQuery.trim() === '') {
        setPosts(postsData);
      } else {
        const filteredPosts = postsData.filter(post => 
          post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
          post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (post.excerpt && post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()))
        );
        setPosts(filteredPosts);
      }
    }
  }, [postsData, searchQuery]);

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

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Financial Insights Blog</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Expert advice, market insights, and financial planning strategies to help you achieve your financial goals.
        </p>
      </div>

      {/* Search and categories */}
      <div className="mb-8">
        <div className="bg-white rounded-[20px] shadow-sm border border-slate-100 p-4 md:p-5 mb-6">
          <div className="flex flex-wrap items-center gap-3 md:gap-4">
            <div className="relative flex-1 min-w-[240px]">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-slate-400" />
              </div>
              <Input
                placeholder="Search articles..."
                className="pl-10 h-12 rounded-[20px] bg-slate-50 border-slate-100 focus-visible:ring-brand-blue"
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-8">
          <Button 
            variant={selectedCategory === 'all' ? 'default' : 'outline'}
            className="rounded-full"
            onClick={() => setSelectedCategory('all')}
          >
            All Posts
          </Button>
          
          {categoriesData?.map((category: BlogCategory) => (
            <Button 
              key={category.id} 
              variant={selectedCategory === category.name ? 'default' : 'outline'}
              className="rounded-full"
              onClick={() => setSelectedCategory(category.name)}
            >
              {category.name}
            </Button>
          ))}
        </div>
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
                <div className="mb-4 flex flex-wrap gap-2">
                  {post.categories?.map((category, index) => (
                    <Badge 
                      key={`${post.id}-${category}-${index}`} 
                      variant="secondary"
                      className="bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-full"
                    >
                      {category}
                    </Badge>
                  ))}
                </div>
                <h2 className="text-xl font-bold mb-2 hover:text-blue-600 transition-colors">{post.title}</h2>
                <div className="text-sm text-gray-500 mb-3">
                  {formatDate(post.published_at || post.created_at)}
                </div>
                <p className="text-gray-600 mb-4 line-clamp-3 flex-grow">
                  {truncateText(post.excerpt || post.content, 160)}
                </p>
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
