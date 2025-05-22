
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { FilterBar } from '@/components/filters/FilterBar';
import { FilterButton } from '@/components/filters/FilterButton';
import { getAdvisors, type AdvisorFilter } from '@/services/advisorsService';
import { MapPin, Award, Check } from 'lucide-react';

const AdvisorSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<AdvisorFilter>({});

  const { data: advisors, isLoading } = useQuery({
    queryKey: ['advisors', filters],
    queryFn: () => getAdvisors(filters),
  });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setFilters(prev => ({ ...prev, searchQuery: e.target.value }));
  };
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Find a Financial Advisor</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Finding a trusted professional to achieve your financial goals has never been easier
        </p>
      </div>
      
      <FilterBar 
        searchPlaceholder="Search advisors by name or firm..." 
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        className="mb-8"
      >
        <div className="flex flex-wrap gap-2">
          <FilterButton 
            active={!filters.state}
            onClick={() => setFilters(prev => ({ ...prev, state: undefined }))}
          >
            All States
          </FilterButton>
          <FilterButton 
            active={filters.state === "California"}
            onClick={() => setFilters(prev => ({ ...prev, state: "California" }))}
          >
            California
          </FilterButton>
          <FilterButton 
            active={filters.state === "Texas"}
            onClick={() => setFilters(prev => ({ ...prev, state: "Texas" }))}
          >
            Texas
          </FilterButton>
          <FilterButton 
            active={filters.state === "New York"}
            onClick={() => setFilters(prev => ({ ...prev, state: "New York" }))}
          >
            New York
          </FilterButton>
        </div>
      </FilterBar>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      ) : advisors && advisors.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {advisors.map(advisor => (
            <Link key={advisor.id} to={`/advisors/${advisor.slug}`}>
              <Card className="h-full overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="w-20 h-20 rounded-full bg-slate-200 overflow-hidden flex-shrink-0">
                      {advisor.headshot_url ? (
                        <img 
                          src={advisor.headshot_url} 
                          alt={advisor.name} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400">
                          Photo
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
                        {advisor.name}
                        {advisor.verified && (
                          <Badge variant="outline" className="ml-2 bg-blue-50 text-blue-700 border-blue-200">
                            <Check className="h-3 w-3 mr-1" />
                            Verified
                          </Badge>
                        )}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {advisor.position || "Financial Advisor"}
                      </p>
                      <p className="text-sm font-medium text-gray-700 mt-1">
                        {advisor.firm_name || "Independent Advisor"}
                      </p>
                      {advisor.city && advisor.state_hq && (
                        <div className="flex items-center mt-2 text-sm text-gray-500">
                          <MapPin className="h-4 w-4 mr-1 text-gray-400" />
                          <span>{advisor.city}, {advisor.state_hq}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex justify-between items-center">
                      <div>
                        {advisor.minimum && (
                          <p className="text-xs text-gray-500">
                            Minimum Assets: <span className="font-medium">${advisor.minimum}</span>
                          </p>
                        )}
                      </div>
                      {advisor.years_of_experience && (
                        <div className="flex items-center">
                          <Award className="h-4 w-4 mr-1 text-amber-500" />
                          <span className="text-xs font-medium">{advisor.years_of_experience} yrs exp.</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">No advisors found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};

export default AdvisorSearch;
