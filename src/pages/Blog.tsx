import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Spinner } from "@/components/ui/spinner";
import { Calendar, Clock, Search } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { BlogPost, getBlogPosts, getBlogCategories } from "@/services/blogService";

type BlogPost = {
  id: string;
  title: string;
  excerpt: string | null;
  cover_image_url: string | null;
  created_at: string;
  published_at: string | null;
  status: string;
  slug: string;
  author_id: string | null;
  authorName?: string;
  categories?: string[];
};

export default function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [isAdmin, setIsAdmin] = useState(false);
  const [categories, setCategories] = useState<string[]>(["All"]);
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      const categoriesData = await getBlogCategories();
      setCategories(["All", ...categoriesData]);
    };
    
    fetchCategories();
  }, []);

  // Get all blog posts
  useEffect(() => {
    const fetchBlogPosts = async () => {
      setLoading(true);
      try {
        const options: {
          status?: 'draft' | 'published' | 'all';
          category?: string;
          limit?: number;
          authorId?: string;
        } = {};
        
        if (activeCategory !== "All") {
          options.category = activeCategory;
        }
        
        const postsData = await getBlogPosts(options);
        
        // Filter by published status if not admin
        const filteredPosts = isAdmin 
          ? postsData 
          : postsData.filter(post => post.status === 'published');
          
        setPosts(filteredPosts);
      } catch (error) {
        console.error('Error fetching blog posts:', error);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogPosts();
  }, [isAdmin, activeCategory]);

  // Check if user is admin
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) return;

      try {
        const { data } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', user.id)
          .single();

        setIsAdmin(data?.is_admin || false);
      } catch (error) {
        console.error('Error checking admin status:', error);
      }
    };

    checkAdminStatus();
  }, [user]);

  // Get author names
  useEffect(() => {
    const fetchAuthorsInfo = async () => {
      // Get unique author IDs
      const authorIds = [...new Set(posts.map(post => post.author_id).filter(id => id))];
      
      if (authorIds.length === 0) return;
      
      try {
        const { data } = await supabase
          .from('profiles')
          .select('id, first_name, last_name')
          .in('id', authorIds);
          
        if (data) {
          const authorsMap = data.reduce((map: {[key: string]: string}, author) => ({
            ...map,
            [author.id]: `${author.first_name} ${author.last_name}`
          }), {});
          
          setPosts(prev => prev.map(post => ({
            ...post,
            authorName: post.author_id ? authorsMap[post.author_id] : undefined
          })));
        }
      } catch (error) {
        console.error('Error fetching author info:', error);
      }
    };
    
    if (posts.length > 0) {
      fetchAuthorsInfo();
    }
  }, [posts.length]);

  // Filter posts based on search query
  const filteredPosts = posts.filter(post => {
    return post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (post.excerpt?.toLowerCase().includes(searchQuery.toLowerCase()) || false);
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="container mx-auto py-6 md:py-8 px-4 md:px-6">
        {/* Blog Header */}
        <div className="mb-8 md:mb-12 text-center">
          <h1 className="text-2xl md:text-4xl font-bold mb-3 md:mb-4">Financial Insights Blog</h1>
          <p className="text-slate-600 max-w-2xl mx-auto text-sm md:text-base">
            Expert advice, market insights, and financial planning strategies to help you achieve your financial goals.
          </p>
          
          {isAdmin && (
            <div className="mt-4">
              <Button onClick={() => navigate('/admin/blog')}>Admin Dashboard</Button>
            </div>
          )}
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8 md:mb-10">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search articles..." 
              className="pl-10" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
            <Tabs 
              defaultValue={activeCategory}
              value={activeCategory}
              onValueChange={setActiveCategory}
              className="w-full md:w-auto"
            >
              <TabsList className="h-auto flex flex-nowrap justify-start min-w-max">
                {categories.map((category) => (
                  <TabsTrigger 
                    key={category} 
                    value={category} 
                    className="text-xs md:text-sm whitespace-nowrap"
                  >
                    {category}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
        </div>

        {/* Blog Posts */}
        <div className="mb-10 md:mb-12">
          <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">
            {filteredPosts.length > 0 ? 'Latest Articles' : 'No Articles Found'}
          </h2>
          
          {loading ? (
            <div className="flex justify-center py-12">
              <Spinner size="lg" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {filteredPosts.map((post) => (
                <Card key={post.id} className="overflow-hidden border-slate-200 hover:shadow-md transition-shadow">
                  {post.cover_image_url && (
                    <div className="aspect-video w-full overflow-hidden">
                      <img
                        src={post.cover_image_url}
                        alt={post.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <CardContent className="p-4 md:p-5">
                    <div className="mb-3 flex items-center justify-between">
                      {post.status === 'draft' && isAdmin && (
                        <Badge className="bg-yellow-500 hover:bg-yellow-600">Draft</Badge>
                      )}
                    </div>
                    <h3 className="text-lg md:text-xl font-bold mb-2 line-clamp-2">{post.title}</h3>
                    {post.excerpt && (
                      <p className="text-slate-600 text-sm mb-4 line-clamp-3">{post.excerpt}</p>
                    )}
                    
                    {/* Categories badges */}
                    {post.categories && post.categories.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {post.categories.map(category => (
                          <Badge key={category} variant="outline" className="text-xs">
                            {category}
                          </Badge>
                        ))}
                      </div>
                    )}
                    
                    {post.author_id && post.authorName && (
                      <div className="flex items-center gap-2 md:gap-3">
                        <Avatar className="h-7 w-7 md:h-8 md:w-8">
                          <AvatarFallback>
                            {post.authorName
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-xs md:text-sm truncate">{post.authorName}</p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="px-4 md:px-5 py-2 md:py-3 border-t flex justify-between items-center">
                    <div className="flex items-center gap-3 md:gap-4 text-xs text-slate-500">
                      <div className="flex items-center gap-1 md:gap-1.5">
                        <Calendar className="h-3 w-3 md:h-3.5 md:w-3.5" />
                        <span className="text-[10px] md:text-xs">
                          {format(new Date(post.published_at || post.created_at), 'MMM d, yyyy')}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 md:gap-1.5">
                        <Clock className="h-3 w-3 md:h-3.5 md:w-3.5" />
                        <span className="text-[10px] md:text-xs">
                          {Math.ceil(post.excerpt?.length || 0 / 100)} min read
                        </span>
                      </div>
                    </div>
                    <Link to={`/blog/${post.slug}`}>
                      <Button variant="ghost" size="sm" className="text-xs md:text-sm px-2 md:px-3 h-8">
                        Read More
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Newsletter Signup */}
        <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-xl p-5 md:p-8 text-white">
          <div className="grid md:grid-cols-2 gap-6 items-center">
            <div>
              <h2 className="text-xl md:text-2xl font-bold mb-2">Stay Informed</h2>
              <p className="text-slate-300 mb-4 text-sm md:text-base">
                Subscribe to our newsletter for the latest financial insights, market updates, and planning strategies.
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center gap-2 text-xs md:text-sm">
                  <div className="h-1.5 w-1.5 rounded-full bg-blue-400"></div>
                  <span>Weekly market updates and analysis</span>
                </li>
                <li className="flex items-center gap-2 text-xs md:text-sm">
                  <div className="h-1.5 w-1.5 rounded-full bg-blue-400"></div>
                  <span>Exclusive financial planning tips</span>
                </li>
                <li className="flex items-center gap-2 text-xs md:text-sm">
                  <div className="h-1.5 w-1.5 rounded-full bg-blue-400"></div>
                  <span>Early access to webinars and events</span>
                </li>
              </ul>
            </div>
            <div className="bg-white/10 rounded-lg p-4 md:p-5">
              <form className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-1">
                    Name
                  </label>
                  <Input id="name" placeholder="Your name" className="bg-white/10 border-white/20" />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-1">
                    Email
                  </label>
                  <Input id="email" type="email" placeholder="Your email" className="bg-white/10 border-white/20" />
                </div>
                <Button className="w-full bg-white text-slate-900 hover:bg-slate-100">Subscribe</Button>
                <p className="text-xs text-slate-400 text-center">We respect your privacy. Unsubscribe at any time.</p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
