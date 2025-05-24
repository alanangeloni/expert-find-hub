
import { z } from 'zod';

// Define blog category enum
export const BlogCategoryEnum = z.enum([
  'Technology',
  'Finance',
  'Investment',
  'Market Analysis',
  'Personal Finance',
  'Business',
  'Economics',
  'Cryptocurrency',
  'Real Estate',
  'Insurance',
  'Retirement Planning',
  'Tax Planning'
]);

export const blogPostSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters." }),
  slug: z.string().min(3, { message: "Slug must be at least 3 characters." }),
  content: z.string().min(10, { message: "Content must be at least 10 characters." }),
  excerpt: z.string().optional(),
  cover_image_url: z.string().optional(),
  status: z.enum(['draft', 'published']),
  categories: z.array(BlogCategoryEnum).optional(),
});

export type BlogPostFormValues = z.infer<typeof blogPostSchema>;
export type BlogCategoryType = z.infer<typeof BlogCategoryEnum>;

export interface BlogCategory {
  id: string;
  name: BlogCategoryType;
  slug: string;
}

// Export the available categories as a constant
export const BLOG_CATEGORIES: BlogCategoryType[] = [
  'Technology',
  'Finance',
  'Investment',
  'Market Analysis',
  'Personal Finance',
  'Business',
  'Economics',
  'Cryptocurrency',
  'Real Estate',
  'Insurance',
  'Retirement Planning',
  'Tax Planning'
];
