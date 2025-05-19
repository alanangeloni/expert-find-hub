
import React, { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface FilterButtonProps {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
  className?: string;
}

export function FilterButton({
  active,
  onClick,
  children,
  className,
}: FilterButtonProps) {
  return (
    <Button
      variant={active ? "default" : "outline"}
      size="sm"
      className={cn(
        "rounded-[20px] h-10 px-4 text-xs md:text-sm bg-white border border-slate-200 whitespace-nowrap",
        active && "bg-brand-blue text-white border-brand-blue",
        className
      )}
      onClick={onClick}
    >
      {children}
    </Button>
  );
}
