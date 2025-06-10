
// Blog category types - using the enum values from the database
export const BLOG_CATEGORIES = [
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
  authorName?: string;
  published_at?: string;
  created_at: string;
  updated_at: string;
  categories?: string[];
}

export interface BlogCategory {
  id: string;
  name: BlogCategoryType;
  slug: string;
}
