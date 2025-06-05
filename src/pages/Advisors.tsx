
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAdvisors, getUniqueStates, type AdvisorFilter } from '@/services/advisorsService';
import { AdvisorList } from '@/components/advisors/AdvisorList';
import { AdvisorSearchForm } from '@/components/advisors/AdvisorSearchForm';

type PaginationState = {
  page: number;
  pageSize: number;
  totalCount: number;
};

const AdvisorSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<AdvisorFilter>({
    state: 'all',
    minimumAssets: 'all',
    specialties: [],
    clientType: 'all'
  } as AdvisorFilter);
    const [states, setStates] = useState<string[]>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    pageSize: 15,
    totalCount: 0
  });

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

  // Get advisors with pagination
  const { data, isLoading } = useQuery({
    queryKey: ['advisors', { ...filters, page: pagination.page }],
    queryFn: () => getAdvisors({
      ...filters,
      page: pagination.page,
      pageSize: pagination.pageSize
    })
  });

  // Update pagination when data changes
  useEffect(() => {
    if (data) {
      setPagination(prev => ({
        ...prev,
        totalCount: data.count || 0
      }));
    }
  }, [data]);

  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({
      ...prev,
      page: newPage
    }));
    // Scroll to top of the list when changing pages
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Get advisors from response or empty array if not available
  const advisors = data?.data || [];

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
    // Reset to first page when filters are cleared
    setPagination(prev => ({
      ...prev,
      page: 1
    }));
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
            advisors={advisors}
            isLoading={isLoading}
            currentPage={pagination.page}
            totalCount={pagination.totalCount}
            pageSize={pagination.pageSize}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  );
};

export default AdvisorSearch;
