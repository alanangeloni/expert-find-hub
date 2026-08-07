import React from "react";
import { Link } from "react-router-dom";
import type { BlogPost } from "@/services/blogService";

export const postDate = (post: BlogPost) => {
  const raw = post.published_at || post.created_at;
  if (!raw) return "";
  return new Date(raw).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
};

export const readTime = (post: BlogPost) => Math.max(1, Math.ceil((post.content || "").split(/\s+/).length / 220));

export const postExcerpt = (post: BlogPost) => {
  if (post.excerpt) return post.excerpt;
  const text = (post.content || "").replace(/[#*_`>[\]()!-]/g, " ").replace(/\s+/g, " ").trim();
  return text.length > 180 ? `${text.slice(0, 180)}…` : text;
};

export const authorHue = (name: string) => {
  let h = 0;
  for (let i = 0; i < name.length; i += 1) h = (h * 31 + name.charCodeAt(i)) % 360;
  return h;
};

interface BlogCardProps {
  post: BlogPost;
  variant?: "default" | "featured" | "compact";
}

export const BlogCard = ({ post, variant = "default" }: BlogCardProps) => {
  const category = post.categories?.[0] || "Insights";
  const author = post.authorName || "Financial Professional";
  const hue = authorHue(author);
  const href = `/blog/${post.slug}`;

  if (variant === "compact") {
    return (
      <Link to={href} className="blog-card blog-card--compact">
        <span className="badge badge--neutral badge--sm">{category}</span>
        <h3 className="blog-card__title">{post.title}</h3>
        <span className="blog-card__compact-meta">
          {postDate(post)} · {readTime(post)} min
        </span>
      </Link>
    );
  }

  const featured = variant === "featured";

  return (
    <Link to={href} className={`blog-card ${featured ? "blog-card--featured" : ""}`}>
      {featured && <div className="blog-card__featured-accent" aria-hidden="true" />}
      <div className={featured ? "blog-card__featured-body" : undefined}>
        <div className="blog-card__meta">
          <span className="badge badge--green badge--sm">{category}</span>
          <span className="blog-card__read">{readTime(post)} min read</span>
        </div>
        {featured ? (
          <h2 className="blog-card__title blog-card__title--lg">{post.title}</h2>
        ) : (
          <h3 className="blog-card__title">{post.title}</h3>
        )}
        <p className="blog-card__excerpt">{postExcerpt(post)}</p>
        <div className="blog-card__footer">
          <div className="blog-card__author">
            <span className="blog-card__avatar" style={{ background: `hsl(${hue} 42% 42%)` }} aria-hidden="true">
              {author.charAt(0)}
            </span>
            <div>
              <strong>{author}</strong>
              <span>{postDate(post)}</span>
            </div>
          </div>
          <span className="blog-card__cta">
            {featured ? "Read article" : "Read"}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  );
};

export default BlogCard;
