import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { getBlogPostsWithCount, getBlogCategories, type BlogPost, type BlogCategory } from '@/services/blogService';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { FilterBar } from '@/components/filters/FilterBar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';
import { NewsletterSignup } from '@/components/common/NewsletterSignup';
import { Seo } from '@/components/seo/Seo';
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious,
  PaginationEllipsis 
} from '@/components/ui/pagination';
const Blog = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(0);
  
  const postsPerPage = 15;

  // Get categories directly from our predefined list
  const {
    data: categoriesData,
    isLoading: categoriesLoading
  } = useQuery({
    queryKey: ['blogCategories'],
    queryFn: getBlogCategories
  });

  // Fetch blog posts with pagination
  const {
    data: postsResponse,
    isLoading: postsLoading
  } = useQuery({
    queryKey: ['blogPosts', selectedCategory, currentPage, searchQuery],
    queryFn: () => getBlogPostsWithCount({
      status: 'published',
      category: selectedCategory === 'all' ? undefined : selectedCategory,
      limit: postsPerPage,
      offset: (currentPage - 1) * postsPerPage
    })
  });

  // Update posts when data changes or when search query changes
  useEffect(() => {
    if (postsResponse) {
      setTotalCount(postsResponse.totalCount);
      if (searchQuery.trim() === '') {
        setPosts(postsResponse.posts);
      } else {
        const filteredPosts = postsResponse.posts.filter(post => 
          post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
          post.content.toLowerCase().includes(searchQuery.toLowerCase()) || 
          (post.excerpt && post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()))
        );
        setPosts(filteredPosts);
      }
    }
  }, [postsResponse, searchQuery]);

  // Reset to first page when category or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchQuery]);

  // Calculate pagination
  const totalPages = Math.ceil(totalCount / postsPerPage);
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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

      {/* Pagination */}
      {!postsLoading && posts.length > 0 && totalPages > 1 && (
        <div className="flex justify-center mt-8 mb-16">
          <Pagination>
            <PaginationContent>
              {currentPage > 1 && (
                <PaginationItem>
                  <PaginationPrevious 
                    href="#" 
                    onClick={(e) => {
                      e.preventDefault();
                      handlePageChange(currentPage - 1);
                    }}
                  />
                </PaginationItem>
              )}
              
              {/* First page */}
              {currentPage > 3 && (
                <>
                  <PaginationItem>
                    <PaginationLink 
                      href="#" 
                      onClick={(e) => {
                        e.preventDefault();
                        handlePageChange(1);
                      }}
                    >
                      1
                    </PaginationLink>
                  </PaginationItem>
                  {currentPage > 4 && (
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                  )}
                </>
              )}
              
              {/* Pages around current page */}
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(page => Math.abs(page - currentPage) <= 2)
                .map((page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      href="#"
                      isActive={page === currentPage}
                      onClick={(e) => {
                        e.preventDefault();
                        handlePageChange(page);
                      }}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}
              
              {/* Last page */}
              {currentPage < totalPages - 2 && (
                <>
                  {currentPage < totalPages - 3 && (
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                  )}
                  <PaginationItem>
                    <PaginationLink 
                      href="#" 
                      onClick={(e) => {
                        e.preventDefault();
                        handlePageChange(totalPages);
                      }}
                    >
                      {totalPages}
                    </PaginationLink>
                  </PaginationItem>
                </>
              )}
              
              {currentPage < totalPages && (
                <PaginationItem>
                  <PaginationNext 
                    href="#" 
                    onClick={(e) => {
                      e.preventDefault();
                      handlePageChange(currentPage + 1);
                    }}
                  />
                </PaginationItem>
              )}
            </PaginationContent>
          </Pagination>
        </div>
      )}

      {/* Newsletter Signup Section */}
      <div className="mt-16 mb-4">
        <NewsletterSignup />
      </div>
    </div>;
};
const BlogPage = () => {
  return (
    <>
      <Seo 
        title="Blog | Financial Professional - Increase Your Financial IQ in Minutes!"
        description="Read the latest financial articles! Learn more about investing, retirement, saving, insurance, and more."
        canonicalUrl="https://yoursite.com/blog"
      />
      <Blog />
    </>
  );
};
export default BlogPage;