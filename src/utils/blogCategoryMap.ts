import type { Database } from "@/integrations/supabase/types";
import type { BlogCategoryType } from "@/types/blog";

export type DbBlogCategory = Database["public"]["Enums"]["blog_category"];

/** Maps editor checkbox labels to the Supabase `blog_category` enum. */
const UI_TO_DB: Record<BlogCategoryType, DbBlogCategory> = {
  "Investment Planning": "Investing",
  "Retirement Planning": "Retirement",
  "Tax Planning": "Taxes",
  "Estate Planning": "Finance",
  "Financial Education": "Finance",
  "Market Analysis": "Investing",
  "Personal Finance": "Finance",
  "Business Finance": "Business",
};

const DB_TO_UI: Partial<Record<DbBlogCategory, BlogCategoryType>> = {
  Banking: "Personal Finance",
  Business: "Business Finance",
  Loans: "Personal Finance",
  Investing: "Investment Planning",
  Insurance: "Personal Finance",
  Interview: "Financial Education",
  Finance: "Personal Finance",
  Taxes: "Tax Planning",
  "Real Estate": "Estate Planning",
  Retirement: "Retirement Planning",
  Reviews: "Market Analysis",
};

export const uiCategoriesToDb = (categories?: string[]): DbBlogCategory | null => {
  if (!categories?.length) return null;
  const first = categories[0] as BlogCategoryType;
  return UI_TO_DB[first] ?? null;
};

export const dbCategoryToUiLabels = (category: DbBlogCategory | null | undefined): string[] => {
  if (!category) return [];
  const label = DB_TO_UI[category];
  return label ? [label] : [];
};
