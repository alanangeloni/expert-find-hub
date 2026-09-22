import { createContext, useContext, useEffect } from 'react';

export const SummaryContext = createContext<(summary: string) => void>(() => {});

export function useReportSummary(summary: string) {
  const report = useContext(SummaryContext);
  useEffect(() => {
    report(summary);
  }, [report, summary]);
}
