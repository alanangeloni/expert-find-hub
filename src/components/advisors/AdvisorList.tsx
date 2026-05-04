
import React from 'react';
import { Spinner } from '@/components/ui/spinner';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { AdvisorCard } from './AdvisorCard';
import { Advisor } from '@/services/advisorsService';

interface AdvisorListProps {
  advisors: Advisor[] | undefined;
  isLoading: boolean;
  totalCount?: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  pageSize?: number;
}

export const AdvisorList = ({ 
  advisors, 
  isLoading, 
  totalCount = 0,
  currentPage = 1,
  onPageChange,
  pageSize = 15 
}: AdvisorListProps) => {
  const totalPages = Math.ceil(totalCount / pageSize);

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }


  if (!advisors || advisors.length === 0) {
    return (
      <div className="text-center py-12 bg-slate-50 rounded-lg border border-slate-100">
        <p className="text-gray-500 mb-2">No advisors found matching your criteria.</p>
        <p className="text-sm text-gray-400">Try adjusting your filters or search term.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {advisors.map(advisor => (
          <AdvisorCard key={advisor.id} advisor={advisor} />
        ))}
      </div>
      
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-8">
          <Button
            variant="outline"
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          
          <div className="flex items-center gap-2">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              // Show pages around current page
              let pageNum = i + 1;
              if (totalPages > 5) {
                if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
              }
              
              return (
                <Button
                  key={pageNum}
                  variant={pageNum === currentPage ? "default" : "outline"}
                  onClick={() => onPageChange(pageNum)}
                  className="w-10 h-10 p-0 flex items-center justify-center"
                >
                  {pageNum}
                </Button>
              );
            })}
            {totalPages > 5 && currentPage < totalPages - 2 && (
              <span className="px-2">...</span>
            )}
            {totalPages > 5 && currentPage < totalPages - 1 && (
              <Button
                variant={currentPage === totalPages ? "default" : "outline"}
                onClick={() => onPageChange(totalPages)}
                className="w-10 h-10 p-0 flex items-center justify-center"
              >
                {totalPages}
              </Button>
            )}
          </div>
          
          <Button
            variant="outline"
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="flex items-center gap-2"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};
