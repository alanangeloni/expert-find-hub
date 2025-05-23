import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  getBlogPostBySlug,
  getBlogCategories,
  BlogPost,
  createBlogPost,
  updateBlogPost,
  uploadBlogImage
} from '@/services/blogService';
import { RichTextEditor } from '@/components/editor/RichTextEditor';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Spinner } from '@/components/ui/spinner';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { getPostCategories } from '@/utils/blogRelations';

const BlogEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [isPublished, setIsPublished] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEditing);
  const [existingPost, setExistingPost] = useState<BlogPost | null>(null);
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [currentCategory, setCurrentCategory] = useState<string>('');
  
  // Admin status check
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminChecking, setAdminChecking] = useState(true);

  useEffect(() => {
    const checkAdminStatus = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setAdminChecking(false);
        return;
      }

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
    };

    checkAdminStatus();
  }, []);
  
  // Fetch available categories
  useEffect(() => {
    const fetchCategories = async () => {
      const categories = await getBlogCategories();
      setAvailableCategories(categories);
    };
    
    fetchCategories();
  }, []);

  // Load existing post data if editing
  useEffect(() => {
    const fetchPostData = async () => {
      if (!isEditing || !isAdmin) return;
      
      try {
        setInitialLoading(true);
        const post = await getBlogPostBySlug(id);
        
        if (!post) {
          throw new Error('Blog post not found');
        }
        
        setExistingPost(post);
        setTitle(post.title);
        setSlug(post.slug);
        setContent(post.content);
        setExcerpt(post.excerpt || '');
        setCoverImageUrl(post.cover_image_url || '');
        setIsPublished(post.status === 'published');
        setSelectedCategories(post.categories || []);
      } catch (error: any) {
        toast({
          title: "Error loading blog post",
          description: error.message,
          variant: "destructive",
        });
        navigate('/admin/blog');
      } finally {
        setInitialLoading(false);
      }
    };

    fetchPostData();
  }, [id, isEditing, isAdmin, navigate]);

  useEffect(() => {
    // Auto-generate slug from title
    if (!isEditing && title) {
      setSlug(title
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, '')
        .replace(/\s+/g, '-')
      );
    }
  }, [title, isEditing]);

  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverImage(file);
      
      // Preview image
      const fileReader = new FileReader();
      fileReader.onload = (e) => {
        if (typeof e.target?.result === 'string') {
          setCoverImageUrl(e.target.result);
        }
      };
      fileReader.readAsDataURL(file);
    }
  };
  
  const handleAddCategory = (categoryName: string) => {
    if (!categoryName || selectedCategories.includes(categoryName)) return;
    
    setSelectedCategories([...selectedCategories, categoryName]);
    setCurrentCategory('');
  };
  
  const handleRemoveCategory = (categoryToRemove: string) => {
    setSelectedCategories(selectedCategories.filter(cat => cat !== categoryToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !slug || !content) {
      toast({
        title: "Missing required fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setSaving(true);
      
      // Upload cover image if selected
      let finalCoverImageUrl = coverImageUrl;
      if (coverImage) {
        const imageUrl = await uploadBlogImage(coverImage);
        if (imageUrl) {
          finalCoverImageUrl = imageUrl;
        }
      }
      
      if (isEditing && existingPost) {
        // Update existing post
        await updateBlogPost({
          id: existingPost.id,
          title,
          slug,
          content,
          excerpt: excerpt || undefined,
          cover_image_url: finalCoverImageUrl || undefined,
          status: isPublished ? 'published' : 'draft',
          categories: selectedCategories
        });
        
        navigate('/admin/blog');
      } else {
        // Create new post
        const result = await createBlogPost({
          title,
          slug,
          content,
          excerpt: excerpt || undefined,
          cover_image_url: finalCoverImageUrl || undefined,
          status: isPublished ? 'published' : 'draft',
          categories: selectedCategories
        });
        
        if (result) {
          navigate('/admin/blog');
        }
      }
    } catch (error: any) {
      toast({
        title: isEditing ? "Error updating blog post" : "Error creating blog post",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
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
        <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-center mb-4">Unauthorized Access</h1>
          <p className="text-center mb-6">You do not have administrator access to edit blog posts.</p>
          <div className="flex justify-center">
            <Button onClick={() => navigate('/')}>Back to Home</Button>
          </div>
        </div>
      </div>
    );
  }

  if (initialLoading) {
    return (
      <div className="container mx-auto py-12 px-4 flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold">
            {isEditing ? 'Edit Blog Post' : 'Create New Blog Post'}
          </h1>
          <Button variant="outline" onClick={() => navigate('/admin/blog')}>
            Back to Dashboard
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input 
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Post Title"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="slug">Slug *</Label>
              <div className="flex gap-2">
                <Input 
                  id="slug"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="post-url-slug"
                  required
                  className="flex-grow"
                />
                {!isEditing && (
                  <Button 
                    type="button"
                    variant="outline"
                    onClick={() => setSlug(title
                      .toLowerCase()
                      .replace(/[^a-z0-9\s]/g, '')
                      .replace(/\s+/g, '-')
                    )}
                  >
                    Generate from Title
                  </Button>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="categories" className="mb-2 block">Categories</Label>
              <div className="mb-2">
                <Select
                  value={currentCategory}
                  onValueChange={(value) => {
                    setCurrentCategory(value);
                    handleAddCategory(value);
                  }}
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableCategories.map((category) => (
                      <SelectItem 
                        key={category} 
                        value={category}
                        disabled={selectedCategories.includes(category)}
                      >
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedCategories.map(category => (
                  <Badge key={category} variant="secondary" className="flex items-center gap-1">
                    {category}
                    <button 
                      type="button" 
                      onClick={() => handleRemoveCategory(category)}
                      className="text-xs text-gray-500 hover:text-gray-700 rounded-full ml-1"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="excerpt">Excerpt</Label>
              <Textarea 
                id="excerpt"
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="Brief summary of the post"
                className="resize-none h-20"
              />
            </div>
            
            <div>
              <Label htmlFor="coverImage">Cover Image</Label>
              <div className="mt-1 space-y-2">
                <Input 
                  id="coverImage"
                  type="file"
                  onChange={handleCoverImageChange}
                  accept="image/*"
                />
                
                {coverImageUrl && (
                  <div className="aspect-video w-full max-w-md overflow-hidden rounded border">
                    <img 
                      src={coverImageUrl} 
                      alt="Cover preview" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
            </div>
            
            <div>
              <Label htmlFor="content">Content *</Label>
              <RichTextEditor 
                value={content}
                onChange={setContent}
                placeholder="Write your blog post content here..."
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch 
                id="published" 
                checked={isPublished}
                onCheckedChange={setIsPublished}
              />
              <Label htmlFor="published">
                {isPublished ? 'Published' : 'Draft'}
              </Label>
            </div>
          </div>
          
          <div className="flex justify-end gap-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => navigate('/admin/blog')}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? (
                <>
                  <Spinner className="mr-2 h-4 w-4" />
                  Saving...
                </>
              ) : (
                isEditing ? 'Update Post' : 'Create Post'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BlogEditor;
