import React, { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getBlogPosts, getBlogCategories, type BlogPost, type BlogCategory } from "@/services/blogService";
import { Spinner } from "@/components/ui/spinner";
import { Seo } from "@/components/seo/Seo";
import { BlogCard, postExcerpt, readTime } from "@/components/blog/BlogCard";

const Blog = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const category = searchParams.get("category") || "";
  const [query, setQuery] = useState<string>(searchParams.get("q") || "");
  const [sort, setSort] = useState<"newest" | "oldest" | "read-time">("newest");

  const { data: categoriesData = [] } = useQuery({
    queryKey: ["blogCategories"],
    queryFn: getBlogCategories,
  });

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ["blogPosts", "all"],
    queryFn: () => getBlogPosts({ status: "published", limit: 200 }),
  });

  const featured = posts[0];

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = posts.filter((p: BlogPost) => p.id !== featured?.id);

    if (category) list = posts.filter((p) => (p.categories || []).includes(category));

    if (q) {
      const pool = category ? list : posts;
      list = pool.filter((p) =>
        [p.title, postExcerpt(p), p.authorName || "", ...(p.categories || [])]
          .join(" ")
          .toLowerCase()
          .includes(q)
      );
    }

    const time = (p: BlogPost) => new Date(p.published_at || p.created_at || 0).getTime();
    return [...list].sort((a, b) => {
      if (sort === "oldest") return time(a) - time(b);
      if (sort === "read-time") return readTime(a) - readTime(b);
      return time(b) - time(a);
    });
  }, [posts, featured, category, query, sort]);

  const showFeatured = !category && !query.trim() && Boolean(featured);

  const applyCategory = (cat: string) => {
    const next = new URLSearchParams(searchParams);
    if (cat) next.set("category", cat);
    else next.delete("category");
    setSearchParams(next, { replace: true });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const next = new URLSearchParams(searchParams);
    if (query.trim()) next.set("q", query.trim());
    else next.delete("q");
    setSearchParams(next, { replace: true });
  };

  return (
    <div className="blog-page page-enter">
      <Seo
        title="Financial Journal | Financial Professional"
        description="Practical guides on fiduciaries, fees, life transitions, and finding financial advice that actually fits."
        canonicalUrl="https://financialprofessional.com/blog"
      />

      <div className="blog-page__hero">
        <div className="container blog-page__hero-inner">
          <div className="blog-page__hero-copy">
            <span className="keyline" />
            <p className="blog-page__eyebrow">The Journal</p>
            <h1>
              Clarity for every
              <br />
              <em>money decision</em>
            </h1>
            <p className="blog-page__sub">
              Practical guides on fiduciaries, fees, life transitions, and how to find advice that actually
              fits written without the jargon fog.
            </p>
          </div>
          <div className="blog-page__hero-cta">
            <Link to="/#match" className="btn btn--primary btn--lg">
              Take the matching quiz
            </Link>
            <Link to="/advisors" className="btn btn--outline btn--lg">
              Browse advisors
            </Link>
          </div>
        </div>
      </div>

      <div className="container blog-page__body">
        <form className="blog-page__toolbar" onSubmit={handleSearch}>
          <div className="blog-page__search">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <input
              type="search"
              placeholder="Search articles…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search articles"
            />
          </div>
          <select value={sort} onChange={(e) => setSort(e.target.value as typeof sort)} aria-label="Sort articles">
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="read-time">Shortest read</option>
          </select>
        </form>

        <div className="blog-page__categories" role="tablist" aria-label="Categories">
          <button
            type="button"
            role="tab"
            aria-selected={!category}
            className={`blog-page__cat ${!category ? "is-on" : ""}`}
            onClick={() => applyCategory("")}
          >
            All
          </button>
          {categoriesData.map((cat: BlogCategory) => (
            <button
              key={cat.id}
              type="button"
              role="tab"
              aria-selected={category === cat.name}
              className={`blog-page__cat ${category === cat.name ? "is-on" : ""}`}
              onClick={() => applyCategory(cat.name)}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="flex justify-center py-16">
            <Spinner size="lg" />
          </div>
        ) : (
          <>
            {showFeatured && featured && (
              <section className="blog-page__featured" aria-label="Featured article">
                <BlogCard post={featured} variant="featured" />
              </section>
            )}

            <section className="blog-page__list" aria-label="Articles">
              <div className="blog-page__list-header">
                <h2>{category ? category : showFeatured ? "More articles" : "All articles"}</h2>
                <p>
                  <strong>{results.length}</strong> article{results.length !== 1 ? "s" : ""}
                </p>
              </div>

              {results.length === 0 ? (
                <div className="blog-page__empty">
                  <div className="blog-page__empty-icon">
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="11" cy="11" r="8" />
                      <path d="m21 21-4.3-4.3" />
                    </svg>
                  </div>
                  <h3>No articles match</h3>
                  <p>Try another category or clear your search.</p>
                  <button
                    type="button"
                    className="btn btn--primary btn--md"
                    onClick={() => {
                      setQuery("");
                      setSearchParams(new URLSearchParams(), { replace: true });
                    }}
                  >
                    Reset filters
                  </button>
                </div>
              ) : (
                <div className="blog-page__grid">
                  {results.map((post) => (
                    <BlogCard key={post.id} post={post} />
                  ))}
                </div>
              )}
            </section>
          </>
        )}

        <section className="blog-page__band">
          <div className="blog-page__band-copy">
            <h2>Ready to put this into practice?</h2>
            <p>Match with fiduciary advisors who fit your goals, or compare a shortlist side by side.</p>
          </div>
          <div className="blog-page__band-actions">
            <Link to="/#match" className="btn btn--green btn--lg">
              Get matched
            </Link>
            <Link to="/advisors" className="btn btn--outline btn--lg blog-page__band-secondary">
              Search advisors
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Blog;
