
import React from 'react';
import { Spinner } from '@/components/ui/spinner';
import { AdvisorCard } from './AdvisorCard';
import { Advisor } from '@/services/advisorsService';

interface AdvisorListProps {
  advisors: Advisor[] | undefined;
  isLoading: boolean;
}

export const AdvisorList = ({ advisors, isLoading }: AdvisorListProps) => {
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {advisors.map(advisor => (
        <AdvisorCard key={advisor.id} advisor={advisor} />
      ))}
    </div>
  );
};
