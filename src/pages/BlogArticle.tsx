import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { BlogPost, getBlogPosts } from "@/services/blogService";
import { Spinner } from "@/components/ui/spinner";
import { useAuth } from "@/contexts/AuthContext";
import { Seo } from "@/components/seo/Seo";
import { supabase } from "@/integrations/supabase/client";
import ReactMarkdown from "react-markdown";
import { getPostCategories } from "@/utils/blogRelations";
import { BlogCard, postDate, readTime, postExcerpt, authorHue } from "@/components/blog/BlogCard";

const BlogArticle = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [related, setRelated] = useState<BlogPost[]>([]);
  const [allCategories, setAllCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) return;
      try {
        const { data } = await supabase.from("profiles").select("is_admin").eq("id", user.id).single();
        setIsAdmin(data?.is_admin || false);
      } catch (error) {
        console.error("Error checking admin status:", error);
      }
    };
    checkAdminStatus();
  }, [user]);

  useEffect(() => {
    const fetchBlogPost = async () => {
      if (!slug) return;
      setLoading(true);
      try {
        let queryBuilder = supabase.from("blog_posts").select("*").eq("slug", slug);
        if (!(isAdmin && user)) queryBuilder = queryBuilder.eq("status", "published");
        const { data } = await queryBuilder.maybeSingle();

        if (!data) {
          setNotFound(true);
          return;
        }
        const categories = await getPostCategories(data.id);
        setPost({ ...data, categories } as BlogPost);
      } catch (error) {
        console.error("Error fetching blog post:", error);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogPost();
  }, [slug, isAdmin, user]);

  useEffect(() => {
    const fetchAuthorInfo = async () => {
      if (!post?.author_id) return;
      try {
        const { data } = await supabase
          .from("profiles")
          .select("first_name, last_name")
          .eq("id", post.author_id)
          .single();
        if (data) {
          setPost((prev) => (prev ? { ...prev, authorName: `${data.first_name} ${data.last_name}` } : null));
        }
      } catch (error) {
        console.error("Error fetching author info:", error);
      }
    };
    fetchAuthorInfo();
  }, [post?.author_id]);

  useEffect(() => {
    const fetchRelated = async () => {
      try {
        const articles = await getBlogPosts({ status: "published", limit: 12 });
        setAllCategories(Array.from(new Set(articles.flatMap((a) => a.categories || []))));
        const others = articles.filter((a) => a.slug !== post?.slug);
        const primary = post?.categories?.[0];
        const sorted = primary
          ? [...others].sort(
              (a, b) =>
                Number((b.categories || []).includes(primary)) - Number((a.categories || []).includes(primary))
            )
          : others;
        setRelated(sorted.slice(0, 3));
      } catch (error) {
        console.error("Error fetching related articles:", error);
      }
    };
    fetchRelated();
  }, [post?.slug, post?.categories]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (notFound || !post) {
    return (
      <div className="blog-post blog-post--missing page-enter">
        <div className="container">
          <h1>Article not found</h1>
          <p>This piece may have moved or been unpublished.</p>
          <Link to="/blog" className="btn btn--primary btn--md">
            Back to journal
          </Link>
        </div>
      </div>
    );
  }

  const category = post.categories?.[0] || "Insights";
  const author = post.authorName || "Financial Professional";
  const sideCategories = allCategories.filter((c) => c !== category).slice(0, 3);

  return (
    <div className="blog-post page-enter">
      <Seo
        title={post.title}
        description={postExcerpt(post).slice(0, 155)}
        canonicalUrl={`https://financialprofessional.com/blog/${slug}`}
        ogType="article"
        ogImage={post.cover_image_url || undefined}
        structuredData={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Article",
              headline: post.title,
              description: postExcerpt(post).slice(0, 155),
              image: post.cover_image_url || undefined,
              datePublished: post.published_at || undefined,
              dateModified: post.updated_at || post.published_at || undefined,
              author: { "@type": "Person", name: author },
              publisher: { "@type": "Organization", name: "Financial Professional" },
              mainEntityOfPage: `https://financialprofessional.com/blog/${slug}`,
            },
            {
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Home", item: "https://financialprofessional.com/" },
                { "@type": "ListItem", position: 2, name: "Journal", item: "https://financialprofessional.com/blog" },
                {
                  "@type": "ListItem",
                  position: 3,
                  name: post.title,
                  item: `https://financialprofessional.com/blog/${slug}`,
                },
              ],
            },
          ],
        }}
      />


      <div className="blog-post__top">
        <div className="container">
          <div className="blog-post__breadcrumb">
            <Link to="/blog">Journal</Link>
            <span>/</span>
            <Link to={`/blog?category=${encodeURIComponent(category)}`}>{category}</Link>
            <span>/</span>
            <span className="blog-post__crumb-current">Article</span>
          </div>

          <header className="blog-post__header">
            <div className="blog-post__badges">
              <span className="badge badge--green badge--md">{category}</span>
              <span className="blog-post__read">{readTime(post)} min read</span>
              {post.status === "draft" && isAdmin && <span className="badge badge--neutral badge--md">Draft</span>}
            </div>
            <h1>{post.title}</h1>
            <p className="blog-post__dek">{postExcerpt(post)}</p>

            <div className="blog-post__byline">
              <span
                className="blog-post__avatar"
                style={{ background: `hsl(${authorHue(author)} 42% 42%)` }}
                aria-hidden="true"
              >
                {author
                  .split(" ")
                  .map((w) => w[0])
                  .slice(0, 2)
                  .join("")}
              </span>
              <div>
                <strong>{author}</strong>
                <span>{postDate(post)}</span>
              </div>
            </div>

            {isAdmin && (
              <div className="mt-4">
                <button
                  type="button"
                  className="btn btn--outline btn--sm"
                  onClick={() => navigate(`/admin/blog/edit/${post.slug}`)}
                >
                  Edit post
                </button>
              </div>
            )}
          </header>
        </div>
      </div>

      <div className="container blog-post__layout">
        <article className="blog-post__article">
          <div className="blog-post__keyline" aria-hidden="true" />
          {post.cover_image_url && (
            <img
              src={post.cover_image_url}
              alt={post.title}
              className="w-full rounded-2xl mb-8 object-cover"
              loading="lazy"
            />
          )}
          <div className="blog-post__content">
            <ReactMarkdown>{post.content}</ReactMarkdown>
          </div>

          {(post.categories || []).length > 0 && (
            <div className="blog-post__tags">
              <span className="blog-post__tags-label">Topics</span>
              <div className="blog-post__tag-row">
                {(post.categories || []).map((tag) => (
                  <Link key={tag} to={`/blog?category=${encodeURIComponent(tag)}`} className="blog-post__tag">
                    {tag}
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className="blog-post__share-card">
            <div>
              <h2>Found this useful?</h2>
              <p>Match with fiduciary advisors who align with what you just read.</p>
            </div>
            <div className="blog-post__share-actions">
              <Link to="/#match" className="btn btn--primary btn--md">
                Take the quiz
              </Link>
              <Link to="/advisors" className="btn btn--outline btn--md">
                Browse advisors
              </Link>
            </div>
          </div>
        </article>

        <aside className="blog-post__sidebar">
          <div className="blog-post__side-card">
            <h3>In this journal</h3>
            <p>
              Guides on fees, fiduciary duty, and life-money transitions written to help you choose advice with
              confidence.
            </p>
            <Link to="/blog" className="btn btn--secondary btn--md btn--full">
              All articles
            </Link>
          </div>

          <div className="blog-post__side-card blog-post__side-card--accent">
            <span className="blog-post__side-eyebrow">Next step</span>
            <h3>Get matched in 2 minutes</h3>
            <p>Tell us your goals, fee style, and values. We'll rank fiduciaries who fit.</p>
            <Link to="/#match" className="btn btn--green btn--md btn--full">
              Start matching quiz
            </Link>
          </div>

          {sideCategories.length > 0 && (
            <div className="blog-post__side-card">
              <h3>Categories</h3>
              <div className="blog-post__side-cats">
                <Link to={`/blog?category=${encodeURIComponent(category)}`} className="blog-post__side-cat">
                  {category}
                </Link>
                {sideCategories.map((cat) => (
                  <Link key={cat} to={`/blog?category=${encodeURIComponent(cat)}`} className="blog-post__side-cat">
                    {cat}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>

      {related.length > 0 && (
        <section className="blog-post__related">
          <div className="container">
            <div className="blog-post__related-header">
              <div>
                <span className="keyline" />
                <p className="blog-post__related-eyebrow">Keep reading</p>
                <h2>Related articles</h2>
              </div>
              <Link to="/blog" className="btn btn--outline btn--md">
                View all
              </Link>
            </div>
            <div className="blog-post__related-grid">
              {related.map((p) => (
                <BlogCard key={p.id} post={p} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default BlogArticle;
