import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { getBlogPosts, getBlogCategories, type BlogPost, type BlogCategory } from '@/services/blogService';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { FilterBar } from '@/components/filters/FilterBar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';
const Blog = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [posts, setPosts] = useState<BlogPost[]>([]);

  // Get categories directly from our predefined list
  const {
    data: categoriesData,
    isLoading: categoriesLoading
  } = useQuery({
    queryKey: ['blogCategories'],
    queryFn: getBlogCategories
  });

  // Fetch blog posts
  const {
    data: postsData,
    isLoading: postsLoading
  } = useQuery({
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
        const filteredPosts = postsData.filter(post => post.title.toLowerCase().includes(searchQuery.toLowerCase()) || post.content.toLowerCase().includes(searchQuery.toLowerCase()) || post.excerpt && post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()));
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
  return <div className="container mx-auto py-8 px-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Financial Insights Blog</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Expert advice, market insights, and financial planning strategies to help you achieve your financial goals.
        </p>
      </div>

      {/* Search and Filter Bar */}
      <FilterBar searchPlaceholder="Search articles..." searchQuery={searchQuery} onSearchChange={handleSearchChange} className="mb-8">
        <div className="flex items-center gap-2">
          <label htmlFor="category-filter" className="text-sm font-medium text-slate-700 whitespace-nowrap">
            Category:
          </label>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger id="category-filter" className="w-[180px] h-10 rounded-[20px] bg-slate-50 border-slate-100">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent className="bg-white border border-slate-200 shadow-lg">
              <SelectItem value="all">All Posts</SelectItem>
              {categoriesData?.map((category: BlogCategory) => <SelectItem key={category.id} value={category.name}>
                  {category.name}
                </SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </FilterBar>

      {/* Loading state */}
      {(postsLoading || categoriesLoading) && <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>}

      {/* Latest Articles section heading */}
      <h2 className="text-2xl font-semibold mb-6">Latest Articles</h2>
      
      {/* Blog posts grid */}
      {!postsLoading && posts.length > 0 ? <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {posts.map(post => <Card key={post.id} className="overflow-hidden flex flex-col bg-white rounded-xl border border-slate-200 shadow-sm">
              {/* Image area - slightly larger */}
              <div className="h-40 w-full bg-slate-100 flex items-center justify-center relative">
                {post.cover_image_url ? <img src={post.cover_image_url} alt={post.title} className="w-full h-full object-cover" /> : <svg className="w-14 h-14 text-slate-300" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 48 48"><rect x="4" y="4" width="40" height="40" rx="8" fill="#f1f5f9" /><path stroke="#cbd5e1" strokeWidth="2" d="M16 32l6-8 6 8 8-12" /><circle cx="16" cy="20" r="2" fill="#cbd5e1" /></svg>}
              </div>
              {/* Card Content - slightly larger */}
              <CardContent className="flex flex-col flex-grow p-5 pb-4">
                {/* Category Badge */}
                {post.categories?.[0] && <span className="inline-block mb-2 px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 text-xs font-semibold">{post.categories[0]}</span>}
                {/* Title */}
                <h2 className="text-[17px] font-bold mb-1 text-slate-900 leading-tight line-clamp-2">{post.title}</h2>
                {/* Excerpt */}
                <p className="text-slate-600 mb-2 text-[15px] leading-snug line-clamp-2">{truncateText(post.excerpt || post.content, 100)}</p>
                {/* Author Section */}
                <div className="flex items-center gap-2 mb-2">
                  {/* Avatar */}
                  <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center text-slate-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 8-4 8-4s8 0 8 4" /></svg>
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900 text-xs">{post.authorName || 'Author Name'}</div>
                    
                  </div>
                </div>
                {/* Footer - one line, small */}
                <div className="flex items-center justify-between text-xs text-slate-500 border-t pt-2 mt-auto">
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1"><svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>{formatDate(post.published_at || post.created_at)}</span>
                    <span className="flex items-center gap-1"><svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" /></svg>{Math.ceil((post.content?.length || 1000) / 1000)} min read</span>
                  </div>
                  <Link to={`/blog/${post.slug}`} className="font-semibold text-slate-900 hover:text-blue-700 transition">Read More</Link>
                </div>
              </CardContent>
            </Card>)}
        </div> : !postsLoading ? <div className="text-center py-12">
          <p className="text-lg text-gray-600">No articles found for this category.</p>
        </div> : null}

      {/* Stay Informed Newsletter Section */}
      <div className="bg-slate-900 rounded-2xl mt-16 mb-4 p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="text-white flex-1 min-w-[220px]">
          <h3 className="text-2xl font-bold mb-3">Stay Informed</h3>
          <p className="mb-4 text-slate-200">Subscribe to our newsletter for the latest financial insights, market updates, and planning strategies.</p>
          <ul className="mb-4 space-y-2 text-slate-200 text-sm list-disc pl-5">
            <li>Weekly market updates and analysis</li>
            <li>Exclusive financial planning tips</li>
            <li>Early access to webinars and events</li>
          </ul>
        </div>
        <form className="bg-slate-800 rounded-xl p-6 flex flex-col gap-4 w-full max-w-xs min-w-[220px]">
          <label className="text-slate-200 text-sm font-medium">Name
            <input type="text" className="mt-1 w-full rounded-md bg-slate-700 border border-slate-600 text-white p-2 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Your name" />
          </label>
          <label className="text-slate-200 text-sm font-medium">Email
            <input type="email" className="mt-1 w-full rounded-md bg-slate-700 border border-slate-600 text-white p-2 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Your email" />
          </label>
          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold">Subscribe</Button>
          <span className="text-xs text-slate-400 mt-2">We respect your privacy. Unsubscribe at any time.</span>
        </form>
      </div>
    </div>;
};
const BlogPage = () => {
  return <>
      <Blog />
    </>;
};
export default BlogPage;