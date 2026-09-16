
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import {
  getBlogPostsWithCount,
  deleteBlogPost,
  ADMIN_BLOG_DB_CATEGORIES,
  type BlogPost,
  type BlogAdminSort,
} from '@/services/blogService';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/spinner';
import { Edit, Trash2, Calendar, Filter } from 'lucide-react';
import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { AdminListToolbar } from '@/components/admin/AdminListToolbar';
import { AdminPagination } from '@/components/admin/AdminPagination';

const BLOG_PAGE_SIZE = 12;

const AdminDashboard = () => {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'draft' | 'published'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [sort, setSort] = useState<BlogAdminSort>('newest');
  const [page, setPage] = useState(1);
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: adminData, isLoading: adminChecking } = useQuery({
    queryKey: ['adminStatus', user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', user.id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const isAdmin = adminData?.is_admin ?? false;

  const listQueryKey = [
    'admin-blog-posts',
    statusFilter,
    categoryFilter,
    sort,
    searchQuery,
    page,
  ] as const;

  const { data: listData, isLoading: postsLoading } = useQuery({
    queryKey: listQueryKey,
    queryFn: () =>
      getBlogPostsWithCount({
        status: statusFilter,
        blogCategory: categoryFilter,
        searchQuery,
        sort,
        limit: BLOG_PAGE_SIZE,
        offset: (page - 1) * BLOG_PAGE_SIZE,
        adminList: true,
      }),
    enabled: isAdmin && !adminChecking,
  });

  const blogPosts = listData?.posts ?? [];
  const totalCount = listData?.totalCount ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / BLOG_PAGE_SIZE));
  const rangeStart = totalCount === 0 ? 0 : (page - 1) * BLOG_PAGE_SIZE + 1;
  const rangeEnd = Math.min(page * BLOG_PAGE_SIZE, totalCount);

  const resetFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setCategoryFilter('all');
    setSort('newest');
    setPage(1);
  };

  const handleFilterChange = <T,>(setter: (v: T) => void, value: T) => {
    setter(value);
    setPage(1);
  };

  const handleDeletePost = async () => {
    if (!deleteId) return;

    const success = await deleteBlogPost(deleteId);
    if (success) {
      await queryClient.invalidateQueries({ queryKey: ['admin-blog-posts'] });
    }
    setDeleteId(null);
  };

  if (adminChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="container mx-auto py-12 px-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Unauthorized Access</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p>You do not have administrator access.</p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button onClick={() => navigate('/')}>Back to Home</Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    statusFilter !== 'all' ||
    categoryFilter !== 'all' ||
    sort !== 'newest';

  const loading = postsLoading;

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">Blog Admin Dashboard</h1>
        <Button onClick={() => navigate('/admin/blog/new')}>Create New Post</Button>
      </div>

      <AdminListToolbar
        searchQuery={searchQuery}
        onSearchQueryChange={(v) => {
          setSearchQuery(v);
          setPage(1);
        }}
        searchPlaceholder="Search by title, excerpt, or slug..."
        totalCount={totalCount}
        rangeStart={rangeStart}
        rangeEnd={rangeEnd}
        filters={
          <>
            <Select
              value={statusFilter}
              onValueChange={(v) =>
                handleFilterChange(setStatusFilter, v as typeof statusFilter)
              }
            >
              <SelectTrigger className="w-[150px]">
                <Filter className="h-4 w-4 mr-2 shrink-0" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={categoryFilter}
              onValueChange={(v) => handleFilterChange(setCategoryFilter, v)}
            >
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All categories</SelectItem>
                {ADMIN_BLOG_DB_CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={sort}
              onValueChange={(v) => handleFilterChange(setSort, v as BlogAdminSort)}
            >
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Sort" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="oldest">Oldest</SelectItem>
                <SelectItem value="title_asc">Title A–Z</SelectItem>
                <SelectItem value="title_desc">Title Z–A</SelectItem>
              </SelectContent>
            </Select>
          </>
        }
      />

      {loading ? (
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      ) : totalCount === 0 && !hasActiveFilters ? (
        <Card>
          <CardHeader>
            <CardTitle>No Blog Posts Found</CardTitle>
            <CardDescription>Create your first blog post to get started.</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button onClick={() => navigate('/admin/blog/new')}>
              Create New Post
            </Button>
          </CardFooter>
        </Card>
      ) : totalCount === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No matching posts</CardTitle>
            <CardDescription>Try adjusting your search or filters.</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button variant="outline" onClick={resetFilters}>
              Clear filters
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {blogPosts.map((post: BlogPost) => (
              <Card key={post.id} className="flex flex-col">
                <CardHeader>
                  <div className="flex justify-between items-start gap-2">
                    <CardTitle className="line-clamp-2">{post.title}</CardTitle>
                    <Badge variant={post.status === 'published' ? 'default' : 'secondary'}>
                      {post.status === 'published' ? 'Published' : 'Draft'}
                    </Badge>
                  </div>
                  {post.excerpt && (
                    <CardDescription className="line-clamp-2">{post.excerpt}</CardDescription>
                  )}
                </CardHeader>
                <CardContent className="flex-grow">
                  {post.cover_image_url && (
                    <div className="aspect-video w-full mb-4 overflow-hidden rounded">
                      <img
                        src={post.cover_image_url}
                        alt={post.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="flex items-center text-sm text-gray-500 gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>
                      Created: {format(new Date(post.created_at), 'MMM d, yyyy')}
                    </span>
                  </div>
                  {post.published_at && (
                    <div className="flex items-center text-sm text-gray-500 gap-1 mt-1">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>
                        Published: {format(new Date(post.published_at), 'MMM d, yyyy')}
                      </span>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="border-t pt-4 flex justify-between">
                  <Link to={`/blog/${post.slug}`} target="_blank">
                    <Button variant="outline" size="sm">
                      View
                    </Button>
                  </Link>
                  <div className="space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => navigate(`/admin/blog/edit/${post.slug}`)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setDeleteId(post.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
          <AdminPagination
            className="mt-8"
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </>
      )}

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the blog post.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeletePost} className="bg-red-500 hover:bg-red-600">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminDashboard;
