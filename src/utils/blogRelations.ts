
import { supabase } from "@/integrations/supabase/client";
import { dbCategoryToUiLabels, uiCategoriesToDb } from "@/utils/blogCategoryMap";
import type { Database } from "@/integrations/supabase/types";

type DbBlogCategory = Database["public"]["Enums"]["blog_category"];

export const getPostCategories = async (postId: string): Promise<string[]> => {
  try {
    const { data, error } = await supabase
      .from("blog_posts")
      .select("blog_category")
      .eq("id", postId)
      .maybeSingle();

    if (error) {
      console.error("Error fetching post category:", error);
      return [];
    }

    return dbCategoryToUiLabels(data?.blog_category as DbBlogCategory | null);
  } catch (error) {
    console.error("Error fetching post categories:", error);
    return [];
  }
};

export const setPostCategory = async (
  postId: string,
  categories?: string[]
): Promise<void> => {
  const blog_category = uiCategoriesToDb(categories);

  const { error } = await supabase
    .from("blog_posts")
    .update({ blog_category })
    .eq("id", postId);

  if (error) {
    throw new Error(error.message);
  }
};

/** @deprecated Use setPostCategory — only one category is stored in `blog_category`. */
export const addCategoryToPost = async (postId: string, category: string): Promise<void> => {
  await setPostCategory(postId, [category]);
};

/** @deprecated Use setPostCategory with an empty list to clear. */
export const removeCategoryFromPost = async (_postId: string, _category: string): Promise<void> => {
  console.warn("removeCategoryFromPost is a no-op; update categories via the blog editor save.");
};
