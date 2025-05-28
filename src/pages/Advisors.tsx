
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAdvisors, getUniqueStates, type AdvisorFilter } from '@/services/advisorsService';
import { AdvisorList } from '@/components/advisors/AdvisorList';
import { AdvisorSearchForm } from '@/components/advisors/AdvisorSearchForm';

const AdvisorSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<AdvisorFilter>({
    state: 'all',
    minimumAssets: 'all',
    specialties: [],
    clientType: 'all'
  } as AdvisorFilter);
  const [states, setStates] = useState<string[]>([]);

  // Fetch unique states for the dropdown
  useEffect(() => {
    const fetchStates = async () => {
      try {
        const uniqueStates = await getUniqueStates();
        setStates(uniqueStates);
      } catch (error) {
        console.error("Failed to fetch states:", error);
      }
    };
    
    fetchStates();
  }, []);

  const { data: advisors, isLoading } = useQuery({
    queryKey: ['advisors', filters],
    queryFn: () => getAdvisors(filters),
  });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setFilters(prev => ({ ...prev, searchQuery: e.target.value }));
  };

  const handleStateChange = (value: string) => {
    setFilters(prev => ({ ...prev, state: value === "all" ? undefined : value }));
  };

  const handleMinimumChange = (value: string) => {
    setFilters(prev => ({ ...prev, minimumAssets: value === "all" ? undefined : value }));
  };

  const handleSpecialtyChange = (specialties: string[]) => {
    setFilters(prev => ({ 
      ...prev, 
      specialties: specialties.length === 0 ? undefined : specialties 
    }));
  };

  const handleClientTypeChange = (value: string) => {
    setFilters(prev => ({ ...prev, clientType: value === "all" ? undefined : value }));
  };

  const clearFilters = () => {
    setFilters({
      state: 'all',
      minimumAssets: 'all',
      specialties: [],
      clientType: 'all',
      searchQuery
    });
  };
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Find a Financial Advisor</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Finding a trusted professional to achieve your financial goals has never been easier
        </p>
      </div>
      
      <AdvisorSearchForm
        searchQuery={searchQuery}
        filters={filters}
        states={states}
        onSearchChange={handleSearchChange}
        onStateChange={handleStateChange}
        onMinimumChange={handleMinimumChange}
        onSpecialtyChange={handleSpecialtyChange}
        onClientTypeChange={handleClientTypeChange}
        clearFilters={clearFilters}
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="col-span-1 lg:hidden">
          {/* Mobile filters would go here if needed */}
        </div>
        
        <div className="col-span-1 lg:col-span-4">
          <AdvisorList 
            advisors={advisors || []}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default AdvisorSearch;
