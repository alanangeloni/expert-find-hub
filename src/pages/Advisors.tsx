
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { FilterBar } from '@/components/filters/FilterBar';
import { getAdvisors, getUniqueStates, type AdvisorFilter } from '@/services/advisorsService';
import { AdvisorFilterSidebar } from '@/components/advisors/AdvisorFilterSidebar';
import { AdvisorList } from '@/components/advisors/AdvisorList';

const AdvisorSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<AdvisorFilter>({});
  const [states, setStates] = useState<string[]>([]);
  
  const formValues = {
    state: filters.state || "",
    minimumAssets: filters.minimumAssets || "",
    specialty: filters.specialty || "",
  };

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
    setFilters(prev => ({ ...prev, state: value === "All" ? undefined : value }));
  };

  const handleMinimumChange = (value: string) => {
    setFilters(prev => ({ ...prev, minimumAssets: value === "All" ? undefined : value }));
  };

  const handleSpecialtyChange = (value: string) => {
    setFilters(prev => ({ ...prev, specialty: value === "All" ? undefined : value }));
  };

  const clearFilters = () => {
    setFilters({ searchQuery });
  };
  
  const specialties = [
    "Retirement Planning", 
    "Investment Management", 
    "Tax Planning", 
    "Estate Planning", 
    "Insurance Planning",
    "Business Planning",
    "Education Planning"
  ];

  const minimumAssetOptions = [
    "No Minimum", 
    "Under $250k", 
    "$250k - $500k", 
    "$500k - $1M", 
    "$1M+"
  ];
  
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
      />
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <AdvisorFilterSidebar 
          states={states}
          minimumAssetOptions={minimumAssetOptions}
          specialties={specialties}
          onStateChange={handleStateChange}
          onMinimumChange={handleMinimumChange}
          onSpecialtyChange={handleSpecialtyChange}
          clearFilters={clearFilters}
          formValues={formValues}
        />
        
        <div className="col-span-1 md:col-span-3">
          <AdvisorList 
            advisors={advisors}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default AdvisorSearch;
