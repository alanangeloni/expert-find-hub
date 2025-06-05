import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { BlogPost } from "@/services/blogService";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { Calendar, Clock, ArrowLeft, Edit } from "lucide-react";
import { format } from "date-fns";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import ReactMarkdown from "react-markdown";
import { getPostCategories } from "@/utils/blogRelations";

export default function BlogArticle() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

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

  useEffect(() => {
    const fetchBlogPost = async () => {
      if (!slug) return;
      
      setLoading(true);
      
      try {
        // Special handling for admins to see drafts
        let postData: BlogPost | null = null;
        
        if (isAdmin && user) {
          const { data } = await supabase
            .from('blog_posts')
            .select('*')
            .eq('slug', slug)
            .maybeSingle();
            
          if (data) {
            // Fetch categories separately
            const categories = await getPostCategories(data.id);
            
            postData = {
              ...data,
              categories
            } as BlogPost;
          }
        } else {
          const { data } = await supabase
            .from('blog_posts')
            .select('*')
            .eq('slug', slug)
            .eq('status', 'published')
            .maybeSingle();
            
          if (data) {
            // Fetch categories separately
            const categories = await getPostCategories(data.id);
            
            postData = {
              ...data,
              categories
            } as BlogPost;
          }
        }
        
        if (!postData) {
          setNotFound(true);
          return;
        }
        
        setPost(postData);
      } catch (error) {
        console.error('Error fetching blog post:', error);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogPost();
  }, [slug, isAdmin, user]);

  // Get author info
  useEffect(() => {
    const fetchAuthorInfo = async () => {
      if (!post?.author_id) return;
      
      try {
        const { data } = await supabase
          .from('profiles')
          .select('first_name, last_name')
          .eq('id', post.author_id)
          .single();
          
        if (data) {
          setPost(prev => prev ? {
            ...prev,
            authorName: `${data.first_name} ${data.last_name}`
          } : null);
        }
      } catch (error) {
        console.error('Error fetching author info:', error);
      }
    };
    
    fetchAuthorInfo();
  }, [post?.author_id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (notFound || !post) {
    return (
      <div className="min-h-screen bg-white pt-16 pb-12 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-4">Blog Post Not Found</h1>
          <p className="text-lg text-slate-600 mb-6">The blog post you're looking for doesn't exist or has been removed.</p>
          <Link to="/blog">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Blog
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section with Cover Image */}
      {post?.cover_image_url ? (
        <div 
          className="w-full h-[40vh] md:h-[50vh] relative bg-center bg-cover" 
          style={{ backgroundImage: `url(${post.cover_image_url})` }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-end">
            <div className="container mx-auto px-4 py-8 md:py-12 text-white">
              {post.status === 'draft' && isAdmin && (
                <Badge className="mb-4 bg-yellow-500 hover:bg-yellow-600">Draft</Badge>
              )}
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold drop-shadow-lg max-w-4xl">
                {post.title}
              </h1>
            </div>
          </div>
        </div>
      ) : (
        <div className="container mx-auto pt-10 md:pt-14 px-4">
          {post?.status === 'draft' && isAdmin && (
            <Badge className="mb-4 bg-yellow-500 hover:bg-yellow-600">Draft</Badge>
          )}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold max-w-4xl">
            {post?.title}
          </h1>
        </div>
      )}

      {/* Blog Content and Sidebar Layout */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Main Content */}
          <div className="w-full lg:w-2/3 max-w-3xl">
            {/* Categories */}
            {post?.categories && post.categories.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {post.categories.map(category => (
                  <Link to={`/blog?category=${category}`} key={category}>
                    <Badge variant="outline" className="hover:bg-slate-100">
                      {category}
                    </Badge>
                  </Link>
                ))}
              </div>
            )}

            {/* Article Meta */}
            {post && (
              <>
                <div className="flex flex-wrap items-center gap-4 mb-8 text-sm text-slate-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{format(new Date(post.published_at || post.created_at), 'MMMM d, yyyy')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>{Math.ceil(post.content.length / 1000)} min read</span>
                  </div>
                  {post.authorName && (
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback>
                          {post.authorName.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <span>{post.authorName}</span>
                    </div>
                  )}
                </div>

                {/* Admin Edit Button */}
                {isAdmin && (
                  <div className="mb-8">
                    <Button 
                      variant="outline" 
                      onClick={() => navigate(`/admin/blog/edit/${post.slug}`)}
                    >
                      <Edit className="mr-2 h-4 w-4" /> Edit Post
                    </Button>
                  </div>
                )}

                {/* Article Content */}
                <article className="prose max-w-none">
                  <ReactMarkdown>{post.content}</ReactMarkdown>
                </article>
              </>
            )}

            {/* Back to Blog */}
            <div className="mt-12 pt-8 border-t">
              <Link to="/blog">
                <Button variant="outline">
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back to Blog
                </Button>
              </Link>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="w-full lg:w-1/3 flex-shrink-0 flex flex-col gap-6">
            {/* Personalized Advice CTA */}
            <div className="bg-brand-blue rounded-2xl p-6 mb-2 text-white shadow">
              <h4 className="font-bold text-lg mb-2">Need Personalized Advice?</h4>
              <p className="mb-4 text-blue-100">Our financial advisors can help you create a retirement plan tailored to your specific needs and goals.</p>
              <button className="w-full bg-white text-blue-700 font-semibold rounded-lg py-2 hover:bg-blue-50 transition flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8s-9-3.582-9-8 4.03-8 9-8 9 3.582 9 8z" /></svg>
                Schedule a Consultation
              </button>
            </div>

            {/* Popular Articles */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-2">
              <h4 className="font-semibold text-base mb-4">Popular Articles</h4>
              <ul className="space-y-4">
                {[{
                  title: "Navigating Market Volatility: Strategies for Uncertain Times",
                  date: "May 28, 2023",
                  slug: "navigating-market-volatility"
                }, {
                  title: "Tax Optimization Strategies for High-Income Earners",
                  date: "May 15, 2023",
                  slug: "tax-optimization-high-income"
                }, {
                  title: "The Complete Guide to Estate Planning for Families",
                  date: "April 30, 2023",
                  slug: "estate-planning-families"
                }].map((art, idx) => (
                  <li key={art.slug} className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded bg-slate-100 flex items-center justify-center text-slate-300">
                      <span className="text-xl">📰</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <Link to={`/blog/${art.slug}`} className="block font-medium text-slate-900 hover:text-blue-700 truncate">{art.title}</Link>
                      <div className="text-xs text-slate-500">{art.date}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Categories */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-2">
              <h4 className="font-semibold text-base mb-3">Categories</h4>
              <div className="flex flex-wrap gap-2">
                {[
                  { name: 'Retirement', color: 'bg-blue-100 text-blue-700' },
                  { name: 'Investing', color: 'bg-green-100 text-green-700' },
                  { name: 'Tax Planning', color: 'bg-purple-100 text-purple-700' },
                  { name: 'Estate Planning', color: 'bg-yellow-100 text-yellow-700' },
                  { name: 'Market Insights', color: 'bg-pink-100 text-pink-700' },
                  { name: 'Financial Education', color: 'bg-slate-100 text-slate-700' }
                ].map(cat => (
                  <span key={cat.name} className={`px-3 py-1 rounded-full text-xs font-semibold ${cat.color}`}>{cat.name}</span>
                ))}
              </div>
            </div>

            {/* Newsletter Signup */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <h4 className="font-semibold text-base mb-2">Subscribe to Our Newsletter</h4>
              <p className="text-sm text-slate-600 mb-4">Get the latest financial insights and planning strategies delivered to your inbox.</p>
              <form className="flex flex-col gap-3">
                <input type="email" className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Your email address" />
                <button type="submit" className="bg-black text-white rounded-lg py-2 font-semibold hover:bg-slate-800 transition">Subscribe</button>
              </form>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
