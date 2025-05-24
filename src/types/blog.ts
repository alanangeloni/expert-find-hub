
import { z } from 'zod';

export const blogPostSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters." }),
  slug: z.string().min(3, { message: "Slug must be at least 3 characters." }),
  content: z.string().min(10, { message: "Content must be at least 10 characters." }),
  excerpt: z.string().optional(),
  cover_image_url: z.string().optional(),
  status: z.enum(['draft', 'published']),
  categories: z.array(z.string()).optional(),
});

export type BlogPostFormValues = z.infer<typeof blogPostSchema>;

export interface BlogCategory {
  id: string;
  name: string;
}
