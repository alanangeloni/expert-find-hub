import { supabase } from "@/integrations/supabase/client";
import { getPostCategories } from "@/utils/blogRelations";
import { BLOG_CATEGORIES, type BlogCategoryType } from "@/types/blog";

// Export the BlogPost interface
export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  cover_image_url?: string;
  status: 'draft' | 'published';
  published_at?: string;
  created_at: string;
  updated_at: string;
  author_id?: string;
  categories?: string[];
  authorName?: string;
}

// Export the BlogCategory interface
export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
}

export interface BlogPostsResponse {
  posts: BlogPost[];
  totalCount: number;
}

export type BlogAdminSort = "newest" | "oldest" | "title_asc" | "title_desc";

/** Categories stored on `blog_posts.blog_category` (Supabase enum). */
export const ADMIN_BLOG_DB_CATEGORIES = [
  "Banking",
  "Business",
  "Loans",
  "Investing",
  "Insurance",
  "Interview",
  "Finance",
  "Taxes",
  "Real Estate",
  "Retirement",
  "Reviews",
] as const;

export type AdminBlogDbCategory = (typeof ADMIN_BLOG_DB_CATEGORIES)[number];

function mapBlogPostRow(
  post: Record<string, unknown>
): BlogPost {
  const blogCategory = post.blog_category as string | null | undefined;
  return {
    ...(post as BlogPost),
    status: post.status as "draft" | "published",
    categories: blogCategory ? [blogCategory] : [],
  };
}

function applyBlogAdminSort<T extends { order: (...args: never[]) => T }>(
  query: T,
  sort: BlogAdminSort = "newest"
): T {
  switch (sort) {
    case "oldest":
      return query.order("created_at", { ascending: true });
    case "title_asc":
      return query.order("title", { ascending: true });
    case "title_desc":
      return query.order("title", { ascending: false });
    default:
      return query
        .order("published_at", { ascending: false, nullsFirst: false })
        .order("created_at", { ascending: false });
  }
}

export const uploadBlogImage = async (file: File): Promise<string | null> => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `blog-images/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('blog-images')
      .upload(filePath, file);

    if (uploadError) {
      console.error('Error uploading image:', uploadError);
      return null;
    }

    const { data } = supabase.storage
      .from('blog-images')
      .getPublicUrl(filePath);

    return data.publicUrl;
  } catch (error) {
    console.error('Error uploading blog image:', error);
    return null;
  }
};

export const getBlogPosts = async (options: {
  status?: 'draft' | 'published' | 'all';
  category?: string;
  limit?: number;
  offset?: number;
  authorId?: string;
} = {}): Promise<BlogPost[]> => {
  try {
    let query = supabase.from('blog_posts').select('*');

    // Apply filters
    if (options.status && options.status !== 'all') {
      query = query.eq('status', options.status);
    }
    
    if (options.authorId) {
      query = query.eq('author_id', options.authorId);
    }
    
    if (options.limit) {
      query = query.limit(options.limit);
    }

    if (options.offset) {
      query = query.range(options.offset, options.offset + (options.limit || 50) - 1);
    }
    
    // Order by published date or created date
    query = query.order('published_at', { ascending: false })
                 .order('created_at', { ascending: false });

    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching blog posts:', error);
      return [];
    }
    
    if (!data) return [];
    
    // Get categories for each post using our utility function
    const posts = await Promise.all(data.map(async (post) => {
      const postCategories = await getPostCategories(post.id);
      return {
        ...post,
        categories: postCategories,
        status: post.status as 'draft' | 'published'
      } as BlogPost;
    }));
    
    // Filter by category if specified
    if (options.category) {
      return posts.filter(post => 
        post.categories && post.categories.includes(options.category)
      );
    }
    
    return posts;
  } catch (error) {
    console.error('Error in getBlogPosts:', error);
    return [];
  }
};

export const getBlogPostsWithCount = async (options: {
  status?: "draft" | "published" | "all";
  category?: string;
  blogCategory?: string;
  searchQuery?: string;
  sort?: BlogAdminSort;
  limit?: number;
  offset?: number;
  authorId?: string;
  /** When true, skip N+1 category fetch (admin list). */
  adminList?: boolean;
} = {}): Promise<BlogPostsResponse> => {
  try {
    let query = supabase.from("blog_posts").select("*", { count: "exact" });

    if (options.status && options.status !== "all") {
      query = query.eq("status", options.status);
    }

    if (options.authorId) {
      query = query.eq("author_id", options.authorId);
    }

    if (options.blogCategory && options.blogCategory !== "all") {
      query = query.eq("blog_category", options.blogCategory);
    }

    const search = options.searchQuery?.trim();
    if (search) {
      const pattern = `%${search.replace(/[%_\\]/g, "\\$&")}%`;
      query = query.or(
        `title.ilike.${pattern},excerpt.ilike.${pattern},slug.ilike.${pattern}`
      );
    }

    query = applyBlogAdminSort(query, options.sort ?? "newest");

    if (options.offset !== undefined && options.limit) {
      query = query.range(
        options.offset,
        options.offset + options.limit - 1
      );
    } else if (options.limit) {
      query = query.limit(options.limit);
    }

    const { data, error, count } = await query;

    if (error) {
      console.error("Error fetching blog posts with count:", error);
      return { posts: [], totalCount: 0 };
    }

    if (!data) return { posts: [], totalCount: 0 };

    if (options.adminList) {
      return {
        posts: data.map((post) => mapBlogPostRow(post as Record<string, unknown>)),
        totalCount: count ?? 0,
      };
    }

    const posts = await Promise.all(
      data.map(async (post) => {
        const postCategories = await getPostCategories(post.id);
        return {
          ...post,
          categories: postCategories,
          status: post.status as "draft" | "published",
        } as BlogPost;
      })
    );

    let filteredPosts = posts;
    if (options.category) {
      filteredPosts = posts.filter(
        (post) => post.categories && post.categories.includes(options.category!)
      );
    }

    return { posts: filteredPosts, totalCount: count || 0 };
  } catch (error) {
    console.error("Error in getBlogPostsWithCount:", error);
    return { posts: [], totalCount: 0 };
  }
};

export const getBlogPostBySlug = async (slug: string): Promise<BlogPost | null> => {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error || !data) {
      console.error(`Error fetching blog post with slug ${slug}:`, error);
      return null;
    }

    // Get categories for the post
    const categories = await getPostCategories(data.id);

    return { 
      ...data, 
      categories,
      status: data.status as 'draft' | 'published'
    } as BlogPost;
  } catch (error: any) {
    console.error(`Error fetching blog post with slug ${slug}:`, error);
    return null;
  }
};

export const getBlogCategories = async (): Promise<BlogCategory[]> => {
  return BLOG_CATEGORIES.map((category, index) => ({
    id: `category-${index}`,
    name: category,
    slug: category.toLowerCase().replace(/\s+/g, '-')
  }));
};

export const createBlogPost = async (post: Omit<BlogPost, 'id' | 'created_at' | 'updated_at'>): Promise<BlogPost | null> => {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .insert([{
        title: post.title,
        slug: post.slug,
        content: post.content,
        excerpt: post.excerpt,
        cover_image_url: post.cover_image_url,
        status: post.status,
        author_id: post.author_id,
        published_at: post.published_at
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating blog post:', error);
      return null;
    }

    return data as BlogPost;
  } catch (error) {
    console.error('Error creating blog post:', error);
    return null;
  }
};

export const updateBlogPost = async (id: string, updates: Partial<BlogPost>): Promise<BlogPost | null> => {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating blog post:', error);
      return null;
    }

    return data as BlogPost;
  } catch (error) {
    console.error('Error updating blog post:', error);
    return null;
  }
};

export const deleteBlogPost = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('blog_posts')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting blog post:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error deleting blog post:', error);
    return false;
  }
};
