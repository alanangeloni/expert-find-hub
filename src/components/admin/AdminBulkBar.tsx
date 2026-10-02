import { Button } from "@/components/ui/button";
import { ReactNode } from "react";

export interface AdminBulkBarProps {
  selectedCount: number;
  onClear: () => void;
  children?: ReactNode;
}

export function AdminBulkBar({ selectedCount, onClear, children }: AdminBulkBarProps) {
  if (selectedCount === 0) return null;

  return (
    <div className="flex items-center justify-between gap-3 flex-wrap rounded-md border border-border bg-muted/40 px-3 py-2">
      <div className="flex items-center gap-3 text-sm">
        <span className="font-medium">{selectedCount} selected</span>
        <Button type="button" variant="ghost" size="sm" onClick={onClear}>
          Clear
        </Button>
      </div>
      <div className="flex items-center gap-2 flex-wrap">{children}</div>
    </div>
  );
}
