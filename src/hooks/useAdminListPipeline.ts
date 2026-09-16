import { useEffect, useMemo, useState } from "react";

export type AdminSortCompare<T> = (a: T, b: T) => number;

export interface UseAdminListPipelineOptions<T> {
  items: T[];
  pageSize?: number;
  searchQuery?: string;
  /** Extra filter beyond search (e.g. status tab, verified). */
  filterFn?: (item: T) => boolean;
  /** When provided, items must match the current searchQuery. */
  searchMatch?: (item: T, query: string) => boolean;
  sortKey: string;
  sortCompare: Record<string, AdminSortCompare<T>>;
  /** When these change, page resets to 1. */
  resetDeps?: unknown[];
}

export function useAdminListPipeline<T>({
  items,
  pageSize = 12,
  searchQuery = "",
  filterFn,
  searchMatch,
  sortKey,
  sortCompare,
  resetDeps = [],
}: UseAdminListPipelineOptions<T>) {
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- resetDeps supplied by caller
  }, [searchQuery, sortKey, pageSize, ...resetDeps]);

  const filteredSorted = useMemo(() => {
    let list = items;
    if (filterFn) {
      list = list.filter(filterFn);
    }
    if (searchMatch && searchQuery.trim()) {
      list = list.filter((item) => searchMatch(item, searchQuery));
    }
    const compare = sortCompare[sortKey] ?? sortCompare.newest;
    if (compare) {
      list = [...list].sort(compare);
    }
    return list;
  }, [items, filterFn, searchMatch, searchQuery, sortKey, sortCompare]);

  const totalCount = filteredSorted.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const paginatedItems = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredSorted.slice(start, start + pageSize);
  }, [filteredSorted, page, pageSize]);

  const rangeStart = totalCount === 0 ? 0 : (page - 1) * pageSize + 1;
  const rangeEnd = Math.min(page * pageSize, totalCount);

  return {
    paginatedItems,
    totalCount,
    totalPages,
    page,
    setPage,
    rangeStart,
    rangeEnd,
  };
}

/** Case-insensitive match across string fields on an object. */
export function matchesSearchQuery(
  q: string,
  fields: (string | null | undefined)[]
): boolean {
  const needle = q.trim().toLowerCase();
  if (!needle) return true;
  return fields.some((f) => (f ?? "").toLowerCase().includes(needle));
}

export function compareByDateField<T>(
  getDate: (item: T) => string | null | undefined,
  ascending: boolean
): AdminSortCompare<T> {
  return (a, b) => {
    const ta = new Date(getDate(a) || 0).getTime();
    const tb = new Date(getDate(b) || 0).getTime();
    return ascending ? ta - tb : tb - ta;
  };
}

export function compareByStringField<T>(
  getString: (item: T) => string | null | undefined,
  ascending: boolean
): AdminSortCompare<T> {
  return (a, b) => {
    const sa = (getString(a) ?? "").toLowerCase();
    const sb = (getString(b) ?? "").toLowerCase();
    const cmp = sa.localeCompare(sb);
    return ascending ? cmp : -cmp;
  };
}
