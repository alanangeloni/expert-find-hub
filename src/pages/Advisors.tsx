
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAdvisors, getUniqueStatesFromAdvisors, type AdvisorFilter } from '@/services/advisorsService';
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
    state: undefined,
    minimumAssets: undefined,
    specialties: [],
    clientType: undefined,
    searchQuery: ''
  });
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
        const uniqueStates = await getUniqueStatesFromAdvisors();
        setStates(uniqueStates);
      } catch (error) {
        console.error("Failed to fetch states:", error);
      }
    };
    
    fetchStates();
  }, []);

  // Get advisors with pagination
  const { data, isLoading } = useQuery({
    queryKey: ['advisors', { ...filters, searchQuery, page: pagination.page }],
    queryFn: () => getAdvisors({
      ...filters,
      searchQuery: searchQuery || undefined,
      page: pagination.page,
      pageSize: pagination.pageSize
    })
  });

  // Update pagination when data changes
  useEffect(() => {
    if (data) {
      setPagination(prev => ({
        ...prev,
        totalCount: data.total || 0
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
    const value = e.target.value;
    setSearchQuery(value);
    // Reset to first page when search changes
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleStateChange = (value: string) => {
    setFilters(prev => ({ ...prev, state: value === "all" ? undefined : value }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleMinimumChange = (value: string) => {
    setFilters(prev => ({ ...prev, minimumAssets: value === "all" ? undefined : value }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleSpecialtyChange = (specialties: string[]) => {
    setFilters(prev => ({ 
      ...prev, 
      specialties: specialties.length === 0 ? undefined : specialties 
    }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleClientTypeChange = (value: string) => {
    setFilters(prev => ({ ...prev, clientType: value === "all" ? undefined : value }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const clearFilters = () => {
    setSearchQuery('');
    setFilters({
      state: undefined,
      minimumAssets: undefined,
      specialties: [],
      clientType: undefined,
      searchQuery: ''
    });
    // Reset to first page when filters are cleared
    setPagination(prev => ({ ...prev, page: 1 }));
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

const AdvisorsPage = () => {
  return (
    <>
      <AdvisorSearch />
    </>
  );
};

export default AdvisorsPage;
