
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { 
  getBlogPosts, 
  BlogPost, 
  deleteBlogPost 
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
import { Badge } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/spinner';
import { toast } from '@/hooks/use-toast';
import { Edit, Trash2, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';

const AdminDashboard = () => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  const [isAdmin, setIsAdmin] = useState(false);
  const [adminChecking, setAdminChecking] = useState(true);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) {
        setAdminChecking(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error fetching admin status:', error);
          setAdminChecking(false);
          return;
        }

        setIsAdmin(data?.is_admin || false);
        setAdminChecking(false);
      } catch (error) {
        console.error('Error checking admin status:', error);
        setAdminChecking(false);
      }
    };

    checkAdminStatus();
  }, [user]);

  useEffect(() => {
    const loadBlogPosts = async () => {
      if (!isAdmin || adminChecking) return;
      
      setLoading(true);
      const posts = await getBlogPosts();
      setBlogPosts(posts);
      setLoading(false);
    };

    loadBlogPosts();
  }, [isAdmin, adminChecking]);

  const handleDeletePost = async () => {
    if (!deleteId) return;
    
    const success = await deleteBlogPost(deleteId);
    if (success) {
      setBlogPosts(blogPosts.filter(post => post.id !== deleteId));
    }
    setDeleteId(null);
  };

  // If still checking admin status, show loading
  if (adminChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  // If not admin, show unauthorized
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

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl md:text-3xl font-bold">Blog Admin Dashboard</h1>
        <Button onClick={() => navigate('/admin/blog/new')}>Create New Post</Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      ) : blogPosts.length === 0 ? (
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
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogPosts.map((post) => (
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
                    onClick={() => navigate(`/admin/blog/edit/${post.id}`)}
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
