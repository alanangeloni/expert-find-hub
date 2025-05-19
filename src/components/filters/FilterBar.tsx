
import React, { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface FilterBarProps {
  searchPlaceholder: string;
  searchQuery: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  children?: ReactNode;
  className?: string;
}

export function FilterBar({
  searchPlaceholder,
  searchQuery,
  onSearchChange,
  children,
  className,
}: FilterBarProps) {
  return (
    <div className={cn(
      "bg-white rounded-[20px] shadow-sm border border-slate-100 p-4 md:p-5 mb-6",
      className
    )}>
      <div className="flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-[240px]">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-slate-400" />
          </div>
          <Input
            placeholder={searchPlaceholder}
            className="pl-10 h-14 rounded-[20px] bg-slate-50 border-slate-100 focus-visible:ring-brand-blue"
            value={searchQuery}
            onChange={onSearchChange}
          />
        </div>
        {children}
      </div>
    </div>
  );
}
