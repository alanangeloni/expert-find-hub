import { supabase } from "@/integrations/supabase/client";
import { getPostCategories } from "@/utils/blogRelations";
import { uiCategoriesToDb } from "@/utils/blogCategoryMap";
import { BLOG_CATEGORIES, type BlogStatus } from "@/types/blog";
import {
  blogAuthorColumn,
  friendlyDatabaseError,
  isUuid,
  normalizeUuid,
  personName,
  resolveAuthorId,
  slugifyName,
  type AuthorCandidate,
} from "@/lib/blogAuthor";

export type BlogAuthorChoice = AuthorCandidate;

export type BlogPostWriteInput = {
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  cover_image_url?: string;
  status: BlogStatus;
  published_at?: string | null;
  author_id?: string | null;
  /**
   * Text byline already stored on the row (the "Author" column).
   * Resolved to a profile id when author_id is empty. Never written as author_id.
   */
  legacy_author_name?: string | null;
  categories?: string[];
};

const trimOrNull = (value?: string | null) => {
  if (value == null) return null;
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
};

const requiredTrim = (value: string, label: string) => {
  const trimmed = (value ?? "").trim();
  if (!trimmed) throw new Error(`${label} is required.`);
  return trimmed;
};

const isMissingAuthorRpc = (error: { code?: string; message?: string }) =>
  error.code === "PGRST202" ||
  /could not find the function/i.test(error.message ?? "") ||
  /schema cache/i.test(error.message ?? "");

export const fetchBlogAuthorChoices = async (): Promise<AuthorCandidate[]> => {
  const [profilesRes, authorsRes] = await Promise.all([
    supabase.from("profiles").select("id, first_name, last_name"),
    supabase.from("authors").select("first_name, last_name, \"author id\""),
  ]);

  const choices: AuthorCandidate[] = [];
  const seen = new Set<string>();
  const push = (id: string | null | undefined, name: string) => {
    const uuid = normalizeUuid(id);
    if (!uuid || !name || seen.has(uuid)) return;
    seen.add(uuid);
    choices.push({ id: uuid, name, slug: slugifyName(name) });
  };

  for (const profile of profilesRes.data ?? []) {
    push(profile.id, personName(profile.first_name, profile.last_name));
  }
  for (const author of authorsRes.data ?? []) {
    push(author["author id"], personName(author.first_name, author.last_name));
  }

  choices.sort((a, b) => a.name.localeCompare(b.name));
  return choices;
};

const resolveViaServerOrLocal = async (raw: string, required: boolean): Promise<string | null> => {
  const { data, error } = await supabase.rpc("resolve_blog_author", {
    raw_name: raw,
    required,
  });
  if (!error) return data ?? null;
  if (!isMissingAuthorRpc(error)) throw new Error(friendlyDatabaseError(error.message));

  let candidates: AuthorCandidate[] = [];
  try {
    candidates = await fetchBlogAuthorChoices();
  } catch {
    candidates = [];
  }
  const resolved = resolveAuthorId(raw, candidates, { required });
  if (resolved.error) throw new Error(resolved.error);
  return resolved.id;
};

const resolveAuthorForWrite = async (post: BlogPostWriteInput): Promise<string | null> => {
  const explicit = (post.author_id ?? "").trim();
  if (explicit) {
    if (isUuid(explicit)) return normalizeUuid(explicit);
    return resolveViaServerOrLocal(explicit, true);
  }

  const legacy = (post.legacy_author_name ?? "").trim();
  if (!legacy || isUuid(legacy)) return null;
  return resolveViaServerOrLocal(legacy, false);
};

const toDbRow = async (post: BlogPostWriteInput) => ({
  title: requiredTrim(post.title, "Title"),
  slug: requiredTrim(post.slug, "Slug"),
  content: requiredTrim(post.content, "Content"),
  excerpt: trimOrNull(post.excerpt),
  cover_image_url: trimOrNull(post.cover_image_url),
  status: post.status,
  // uuid column. blogAuthorColumn throws if a display name gets this far.
  author_id: blogAuthorColumn(await resolveAuthorForWrite(post)),
  published_at: trimOrNull(post.published_at),
  blog_category: uiCategoriesToDb(
    (post.categories ?? []).map((category) => category.trim()).filter(Boolean)
  ),
});

// A post is live when it is published, or scheduled and its time has arrived.
const applyLiveFilter = (query: any) => {
  const now = new Date().toISOString();
  return query.or(
    `and(status.eq.published,published_at.is.null),and(status.eq.published,published_at.lte.${now}),and(status.eq.scheduled,published_at.lte.${now})`
  );
};

// Export the BlogPost interface
export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  cover_image_url?: string;
  status: BlogStatus;
  published_at?: string | null;
  created_at: string;
  updated_at: string;
  author_id?: string;
  /** Legacy text byline. Not an id. */
  Author?: string | null;
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
  status?: 'draft' | 'published' | 'scheduled' | 'all';
  category?: string;
  limit?: number;
  offset?: number;
  authorId?: string;
} = {}): Promise<BlogPost[]> => {
  try {
    let query = supabase.from('blog_posts').select('*');

    // Apply filters
    if (options.status === 'published') {
      query = applyLiveFilter(query);
    } else if (options.status && options.status !== 'all') {
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
        status: post.status as BlogStatus
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

// Get blog posts with pagination count
export const getBlogPostsWithCount = async (options: {
  status?: 'draft' | 'published' | 'scheduled' | 'all';
  category?: string;
  limit?: number;
  offset?: number;
  authorId?: string;
} = {}): Promise<BlogPostsResponse> => {
  try {
    let query = supabase.from('blog_posts').select('*', { count: 'exact' });

    // Apply filters
    if (options.status === 'published') {
      query = applyLiveFilter(query);
    } else if (options.status && options.status !== 'all') {
      query = query.eq('status', options.status);
    }
    
    if (options.authorId) {
      query = query.eq('author_id', options.authorId);
    }
    
    // Order by published date or created date
    query = query.order('published_at', { ascending: false })
                 .order('created_at', { ascending: false });

    if (options.offset && options.limit) {
      query = query.range(options.offset, options.offset + options.limit - 1);
    } else if (options.limit) {
      query = query.limit(options.limit);
    }

    const { data, error, count } = await query;
    
    if (error) {
      console.error('Error fetching blog posts with count:', error);
      return { posts: [], totalCount: 0 };
    }
    
    if (!data) return { posts: [], totalCount: 0 };
    
    // Get categories for each post using our utility function
    const posts = await Promise.all(data.map(async (post) => {
      const postCategories = await getPostCategories(post.id);
      return {
        ...post,
        categories: postCategories,
        status: post.status as BlogStatus
      } as BlogPost;
    }));
    
    // Filter by category if specified
    let filteredPosts = posts;
    if (options.category) {
      filteredPosts = posts.filter(post => 
        post.categories && post.categories.includes(options.category)
      );
    }
    
    return { posts: filteredPosts, totalCount: count || 0 };
  } catch (error) {
    console.error('Error in getBlogPostsWithCount:', error);
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
      status: data.status as BlogStatus
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

export const createBlogPost = async (post: BlogPostWriteInput): Promise<BlogPost> => {
  const { data, error } = await supabase
    .from("blog_posts")
    .insert([await toDbRow(post)])
    .select()
    .single();

  if (error) {
    console.error("Error creating blog post:", error);
    throw new Error(friendlyDatabaseError(error.message));
  }

  const categories = await getPostCategories(data.id);
  return { ...data, categories, status: data.status as BlogStatus } as BlogPost;
};

export const updateBlogPost = async (id: string, updates: BlogPostWriteInput): Promise<BlogPost> => {
  const { data, error } = await supabase
    .from("blog_posts")
    .update(await toDbRow(updates))
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating blog post:", error);
    throw new Error(friendlyDatabaseError(error.message));
  }

  const categories = await getPostCategories(data.id);
  return { ...data, categories, status: data.status as BlogStatus } as BlogPost;
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
