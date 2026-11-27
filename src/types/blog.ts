
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

export type BlogStatus = 'draft' | 'published' | 'scheduled';

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  cover_image_url?: string;
  status: BlogStatus;
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
  title: z.string().trim().min(1, "Title is required"),
  slug: z.string().trim().min(1, "Slug is required"),
  content: z.string().trim().min(1, "Content is required"),
  excerpt: z.string().trim().optional(),
  cover_image_url: z.string().trim().optional(),
  status: z.enum(['draft', 'published', 'scheduled']),
  categories: z.array(z.string().trim()).optional(),
  published_at: z.string().trim().optional().nullable(),
  // Profile UUID. A display name is rejected before it can reach author_id.
  author_id: z
    .string()
    .trim()
    .optional()
    .nullable()
    .refine((value) => !value || /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value), {
      message: 'Author must be a profile id (UUID), not a display name.',
    }),
});

export type BlogPostFormValues = z.infer<typeof blogPostSchema>;
