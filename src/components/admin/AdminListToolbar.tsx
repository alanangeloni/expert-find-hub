import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ReactNode } from "react";

export interface AdminListToolbarProps {
  searchQuery: string;
  onSearchQueryChange: (value: string) => void;
  searchPlaceholder?: string;
  /** Filter and sort selects */
  filters?: ReactNode;
  actions?: ReactNode;
  totalCount?: number;
  rangeStart?: number;
  rangeEnd?: number;
}

export function AdminListToolbar({
  searchQuery,
  onSearchQueryChange,
  searchPlaceholder = "Search...",
  filters,
  actions,
  totalCount,
  rangeStart,
  rangeEnd,
}: AdminListToolbarProps) {
  const showSummary =
    totalCount !== undefined &&
    totalCount > 0 &&
    rangeStart !== undefined &&
    rangeEnd !== undefined;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3 flex-1 min-w-[280px] flex-wrap">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={(e) => onSearchQueryChange(e.target.value)}
              className="pl-9"
            />
          </div>
          {filters}
        </div>
        {actions}
      </div>
      {showSummary && (
        <p className="text-sm text-muted-foreground">
          Showing {rangeStart}–{rangeEnd} of {totalCount}
        </p>
      )}
    </div>
  );
}
