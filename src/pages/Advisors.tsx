import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { getAdvisors, getUniqueStates, type AdvisorFilter } from '@/services/advisorsService';
import { AdvisorList } from '@/components/advisors/AdvisorList';
import { AdvisorSearchForm } from '@/components/advisors/AdvisorSearchForm';
import { NewsletterSignup } from '@/components/common/NewsletterSignup';
import { Seo } from '@/components/seo/Seo';

type PaginationState = {
  page: number;
  pageSize: number;
  totalCount: number;
};

const AdvisorSearch = () => {
  const [searchParams] = useSearchParams();
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

  // Initialize filters from URL parameters
  useEffect(() => {
    const specialtiesParam = searchParams.get('specialties');
    const stateParam = searchParams.get('state');
    const clientTypeParam = searchParams.get('clientType');
    const minimumAssetsParam = searchParams.get('minimumAssets');
    
    setFilters({
      specialties: specialtiesParam ? [specialtiesParam] : [],
      state: stateParam || undefined,
      clientType: clientTypeParam || undefined,
      minimumAssets: minimumAssetsParam || undefined,
      searchQuery: ''
    });
  }, [searchParams]);

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
      specialties: specialties.length === 0 ? [] : specialties 
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
    <div className="min-h-screen bg-background">
      {/* Hero header */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue via-blue-3 to-aqua text-white">
        <div className="absolute inset-0 opacity-[0.08]" style={{
          backgroundImage: 'radial-gradient(circle at 20% 30%, white 1px, transparent 1px), radial-gradient(circle at 80% 70%, white 1px, transparent 1px)',
          backgroundSize: '48px 48px'
        }} />
        <div className="container mx-auto px-4 py-14 md:py-20 relative">
          <div className="max-w-3xl mx-auto text-center">
            <span className="eyebrow !text-mint mb-4">Advisor Directory</span>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight text-white mt-4 mb-4">
              Find a Financial Advisor
            </h1>
            <p className="text-base md:text-lg text-white/80 max-w-2xl mx-auto">
              Browse vetted, fiduciary professionals — filter by specialty, location, and minimums to find your match.
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto py-8 md:py-10 px-4 -mt-8 md:-mt-10 relative z-10">
        
        {/* Search Form - Mobile Responsive */}
        <div className="mb-6 md:mb-8">
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
        </div>
        
        {/* Results Grid */}
        <div className="w-full">
          <AdvisorList 
            advisors={advisors}
            isLoading={isLoading}
            currentPage={pagination.page}
            totalCount={pagination.totalCount}
            pageSize={pagination.pageSize}
            onPageChange={handlePageChange}
          />
        </div>
        
        {/* Newsletter Signup Section */}
        <div className="mt-16 mb-4">
          <NewsletterSignup />
        </div>
      </div>
    </div>
  );
};

const AdvisorsPage = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SearchResultsPage",
    "name": "Financial Advisors Directory",
    "description": "Browse financial advisors to find the one best suited to help you achieve your financial goals",
    "url": "https://yoursite.com/advisors"
  };

  return (
    <>
      <Seo 
        title="Find a Financial Advisor"
        description="Browse financial advisors to find the one best suited to help you achieve your financial goals"
        structuredData={structuredData}
        canonicalUrl="https://yoursite.com/advisors"
      />
      <AdvisorSearch />
    </>
  );
};

export default AdvisorsPage;
