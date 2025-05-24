
import { z } from 'zod';

// Use the existing blog_category enum from the database
export const BlogCategoryEnum = z.enum([
  'Banking',
  'Business', 
  'Loans',
  'Investing',
  'Insurance',
  'Interview',
  'Finance',
  'Taxes',
  'Real Estate',
  'Retirement',
  'Reviews'
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

// Export the available categories as a constant using the database enum values
export const BLOG_CATEGORIES: BlogCategoryType[] = [
  'Banking',
  'Business', 
  'Loans',
  'Investing',
  'Insurance',
  'Interview',
  'Finance',
  'Taxes',
  'Real Estate',
  'Retirement',
  'Reviews'
];
