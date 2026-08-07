import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "fp_compare_advisors";
export const MAX_COMPARE = 3;

interface CompareContextValue {
  compareIds: string[];
  toggleCompare: (id: string) => { ok: boolean; reason?: string };
  removeCompare: (id: string) => void;
  clearCompare: () => void;
  isComparing: (id: string) => boolean;
  open: boolean;
  setOpen: (open: boolean) => void;
  max: number;
}

const CompareContext = createContext<CompareContextValue | null>(null);

export const CompareProvider = ({ children }: { children: React.ReactNode }) => {
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setCompareIds(parsed.slice(0, MAX_COMPARE));
      }
    } catch {
      /* ignore */
    }
  }, []);

  const persist = useCallback((ids: string[]) => {
    setCompareIds(ids);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
    } catch {
      /* ignore */
    }
  }, []);

  const toggleCompare = useCallback(
    (id: string) => {
      if (compareIds.includes(id)) {
        persist(compareIds.filter((x) => x !== id));
        return { ok: true };
      }
      if (compareIds.length >= MAX_COMPARE) {
        return { ok: false, reason: `You can compare up to ${MAX_COMPARE} advisors` };
      }
      persist([...compareIds, id]);
      return { ok: true };
    },
    [compareIds, persist]
  );

  const removeCompare = useCallback((id: string) => persist(compareIds.filter((x) => x !== id)), [compareIds, persist]);
  const clearCompare = useCallback(() => {
    persist([]);
    setOpen(false);
  }, [persist]);
  const isComparing = useCallback((id: string) => compareIds.includes(id), [compareIds]);

  const value = useMemo(
    () => ({ compareIds, toggleCompare, removeCompare, clearCompare, isComparing, open, setOpen, max: MAX_COMPARE }),
    [compareIds, toggleCompare, removeCompare, clearCompare, isComparing, open]
  );

  return <CompareContext.Provider value={value}>{children}</CompareContext.Provider>;
};

export const useCompareAdvisors = () => {
  const ctx = useContext(CompareContext);
  if (!ctx) throw new Error("useCompareAdvisors must be used within a CompareProvider");
  return ctx;
};
