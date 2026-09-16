import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface AdminPaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function AdminPagination({
  page,
  totalPages,
  onPageChange,
  className,
}: AdminPaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div
      className={`flex items-center justify-between gap-4 flex-wrap ${className ?? ""}`}
    >
      <Button
        type="button"
        variant="outline"
        onClick={() => onPageChange(Math.max(1, page - 1))}
        disabled={page === 1}
        className="flex items-center gap-2"
      >
        <ChevronLeft className="h-4 w-4" />
        Previous
      </Button>

      <div className="flex items-center gap-2">
        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
          let pageNum = i + 1;
          if (totalPages > 5) {
            if (page <= 3) {
              pageNum = i + 1;
            } else if (page >= totalPages - 2) {
              pageNum = totalPages - 4 + i;
            } else {
              pageNum = page - 2 + i;
            }
          }

          return (
            <Button
              key={pageNum}
              type="button"
              variant={pageNum === page ? "default" : "outline"}
              onClick={() => onPageChange(pageNum)}
              className="w-10 h-10 p-0 flex items-center justify-center"
            >
              {pageNum}
            </Button>
          );
        })}
        {totalPages > 5 && page < totalPages - 2 && (
          <span className="px-2 text-muted-foreground">...</span>
        )}
        {totalPages > 5 && page < totalPages - 1 && (
          <Button
            type="button"
            variant={page === totalPages ? "default" : "outline"}
            onClick={() => onPageChange(totalPages)}
            className="w-10 h-10 p-0 flex items-center justify-center"
          >
            {totalPages}
          </Button>
        )}
      </div>

      <Button
        type="button"
        variant="outline"
        onClick={() => onPageChange(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
        className="flex items-center gap-2"
      >
        Next
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
