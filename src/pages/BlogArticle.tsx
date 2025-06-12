import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { BlogPost, getBlogPosts } from "@/services/blogService";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { Calendar, Clock, ArrowLeft, Edit, Newspaper } from "lucide-react";
import { format, parseISO } from "date-fns";
import { useAuth } from "@/contexts/AuthContext";
import { Seo } from "@/components/seo/Seo";
import { supabase } from "@/integrations/supabase/client";
import ReactMarkdown from "react-markdown";
import { getPostCategories } from "@/utils/blogRelations";

const BlogArticle = () => {
  const {
    slug
  } = useParams<{
    slug: string;
  }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [popularArticles, setPopularArticles] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const {
    user
  } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) return;
      try {
        const {
          data
        } = await supabase.from('profiles').select('is_admin').eq('id', user.id).single();
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
          const {
            data
          } = await supabase.from('blog_posts').select('*').eq('slug', slug).maybeSingle();
          if (data) {
            // Fetch categories separately
            const categories = await getPostCategories(data.id);
            postData = {
              ...data,
              categories
            } as BlogPost;
          }
        } else {
          const {
            data
          } = await supabase.from('blog_posts').select('*').eq('slug', slug).eq('status', 'published').maybeSingle();
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
        const {
          data
        } = await supabase.from('profiles').select('first_name, last_name').eq('id', post.author_id).single();
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

  // Fetch popular articles
  useEffect(() => {
    const fetchPopularArticles = async () => {
      try {
        // Get 3 most recent published articles, excluding the current one
        const articles = await getBlogPosts({
          status: 'published',
          limit: 3
        });

        // Filter out the current article if it's loaded
        const filteredArticles = post ? articles.filter(article => article.slug !== post.slug).slice(0, 3) : articles;
        setPopularArticles(filteredArticles);
      } catch (error) {
        console.error('Error fetching popular articles:', error);
      }
    };
    fetchPopularArticles();
  }, [post?.slug]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>;
  }
  if (notFound || !post) {
    return <div className="min-h-screen bg-white pt-16 pb-12 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-4">Blog Post Not Found</h1>
          <p className="text-lg text-slate-600 mb-6">The blog post you're looking for doesn't exist or has been removed.</p>
          <Link to="/blog">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Blog
            </Button>
          </Link>
        </div>
      </div>;
  }
  return (
    <div className="min-h-screen bg-gray-50">
      {post && (
        <Seo 
          title={post.title}
          description={post.excerpt || post.content.substring(0, 155) + '...'}
        />
      )}
      {/* Hero Section with Cover Image */}
      {post?.cover_image_url ? <div className="w-full h-[40vh] md:h-[50vh] relative bg-center bg-cover" style={{
      backgroundImage: `url(${post.cover_image_url})`
    }}>
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-end">
            <div className="container mx-auto px-4 py-8 md:py-12 text-white">
              {post.status === 'draft' && isAdmin && <Badge className="mb-4 bg-yellow-500 hover:bg-yellow-600">Draft</Badge>}
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold drop-shadow-lg max-w-4xl">
                {post.title}
              </h1>
            </div>
          </div>
        </div> : <div className="container mx-auto pt-10 md:pt-14 px-4">
          {post?.status === 'draft' && isAdmin && <Badge className="mb-4 bg-yellow-500 hover:bg-yellow-600">Draft</Badge>}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold max-w-4xl">
            {post?.title}
          </h1>
        </div>}

      {/* Blog Content and Sidebar Layout */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Main Content */}
          <div className="w-full lg:w-2/3 max-w-3xl">
            {/* Categories */}
            {post?.categories && post.categories.length > 0 && <div className="flex flex-wrap gap-2 mb-6">
                {post.categories.map(category => <Link to={`/blog?category=${category}`} key={category}>
                    <Badge variant="outline" className="hover:bg-slate-100">
                      {category}
                    </Badge>
                  </Link>)}
              </div>}

            {/* Article Meta */}
            {post && <>
                <div className="flex flex-wrap items-center gap-4 mb-8 text-sm text-slate-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{format(new Date(post.published_at || post.created_at), 'MMMM d, yyyy')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>{Math.ceil(post.content.length / 1000)} min read</span>
                  </div>
                  {post.authorName && <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback>
                          {post.authorName.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <span>{post.authorName}</span>
                    </div>}
                </div>

                {/* Admin Edit Button */}
                {isAdmin && <div className="mb-8">
                    <Button variant="outline" onClick={() => navigate(`/admin/blog/edit/${post.slug}`)}>
                      <Edit className="mr-2 h-4 w-4" /> Edit Post
                    </Button>
                  </div>}

                {/* Article Content */}
                <article className="prose max-w-none">
                  <ReactMarkdown>{post.content}</ReactMarkdown>
                </article>
              </>}

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
              {popularArticles.length > 0 ? <ul className="space-y-4">
                  {popularArticles.map(article => <li key={article.slug} className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded bg-slate-100 flex items-center justify-center text-slate-400">
                        <Newspaper className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <Link to={`/blog/${article.slug}`} className="block font-medium text-slate-900 hover:text-blue-700 line-clamp-2 text-sm leading-snug">
                          {article.title}
                        </Link>
                        <div className="text-xs text-slate-500 mt-1">
                          {format(parseISO(article.published_at || article.created_at), 'MMMM d, yyyy')}
                        </div>
                      </div>
                    </li>)}
                </ul> : <div className="text-sm text-slate-500">Loading articles...</div>}
            </div>

            {/* Categories */}
            

            {/* Newsletter Signup */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <h4 className="font-semibold text-base mb-2">Subscribe to Our Newsletter</h4>
              <p className="text-sm text-slate-600 mb-4">Get the latest financial insights and planning strategies delivered to your inbox.</p>
              <form className="flex flex-col gap-3">
                <input type="email" className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-300" placeholder="Your email address" />
                <button type="submit" className="bg-teal-500 text-white rounded-lg py-2 font-semibold hover:bg-teal-600 transition focus:ring-2 focus:ring-teal-300 focus:outline-none">Subscribe</button>
              </form>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default BlogArticle;