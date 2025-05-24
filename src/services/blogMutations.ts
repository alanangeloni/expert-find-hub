
import { BlogPost } from '@/services/blogService';

export const createBlogPost = async (postData: {
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  cover_image_url?: string;
  status: "draft" | "published";
  categories?: string[];
}): Promise<BlogPost> => {
  const response = await fetch('/api/blog/posts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(postData),
  });
  
  if (!response.ok) {
    throw new Error('Failed to create blog post');
  }
  
  return response.json();
};

export const updateBlogPost = async (postData: {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  cover_image_url?: string;
  status: "draft" | "published";
  categories?: string[];
  published_at?: string;
}): Promise<BlogPost> => {
  const response = await fetch(`/api/blog/posts/${postData.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(postData),
  });
  
  if (!response.ok) {
    throw new Error('Failed to update blog post');
  }
  
  return response.json();
};
