
import { z } from "zod";

export const BLOG_CATEGORIES = [
  'Investment Planning',
  'Retirement Planning',
  'Tax Planning',
  'Estate Planning',
  'Financial Education',
  'Market Analysis',
  'Personal Finance',
  'Business Finance'
] as const;

export type BlogCategoryType = typeof BLOG_CATEGORIES[number];

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  cover_image_url?: string;
  status: 'draft' | 'published';
  author_id?: string;
  published_at?: string;
  created_at?: string;
  updated_at?: string;
  categories?: string[];
}

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
}

export const blogPostSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  content: z.string().min(1, "Content is required"),
  excerpt: z.string().optional(),
  cover_image_url: z.string().optional(),
  status: z.enum(['draft', 'published']),
  categories: z.array(z.string()).optional(),
  published_at: z.string().optional(),
});

export type BlogPostFormValues = z.infer<typeof blogPostSchema>;
