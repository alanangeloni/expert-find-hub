import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { FilterBar } from '@/components/filters/FilterBar';
import { getInvestmentFirms, getUniqueStates, type FirmFilter } from '@/services/investmentFirmsService';
import { FirmFilterSidebar } from '@/components/firms/FirmFilterSidebar';
import { FirmList } from '@/components/firms/FirmList';

const InvestmentFirms = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FirmFilter>({});
  const [states, setStates] = useState<string[]>([]);
  
  const formValues = {
    state: filters.state || "all",
    minimumInvestment: filters.minimumInvestment || "all",
    firmType: filters.firmType || "all",
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

  const { data: firms, isLoading } = useQuery({
    queryKey: ['firms', filters],
    queryFn: () => getInvestmentFirms(filters),
  });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setFilters(prev => ({ ...prev, searchQuery: e.target.value }));
  };

  const handleStateChange = (value: string) => {
    setFilters(prev => ({ ...prev, state: value === "all" ? undefined : value }));
  };

  const handleMinimumChange = (value: string) => {
    setFilters(prev => ({ ...prev, minimumInvestment: value === "all" ? undefined : value }));
  };

  const handleFirmTypeChange = (value: string) => {
    setFilters(prev => ({ ...prev, firmType: value === "all" ? undefined : value }));
  };

  const clearFilters = () => {
    setFilters({ searchQuery });
  };
  
  const firmTypes = [
    "Registered Investment Advisor", 
    "Broker-Dealer", 
    "Hybrid",
    "Family Office",
    "Wealth Management Firm"
  ];

  const minimumInvestmentOptions = [
    "No Minimum", 
    "Under $250k", 
    "$250k - $500k", 
    "$500k - $1M", 
    "$1M - $5M",
    "$5M+"
  ];

  // Function to properly format minimum investment values
  const formatMinimumInvestment = (value: number | null | undefined): string => {
    if (value === null || value === undefined) return "No minimum";
    
    // Ensure value is a string before using replace
    return `$${value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
  };
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Find Investment Firms</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Discover top investment firms that can help you achieve your financial goals
        </p>
      </div>
      
      <FilterBar 
        searchPlaceholder="Search firms by name or location..." 
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        className="mb-8"
      />
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <FirmFilterSidebar 
          states={states}
          minimumInvestmentOptions={minimumInvestmentOptions}
          firmTypes={firmTypes}
          onStateChange={handleStateChange}
          onMinimumChange={handleMinimumChange}
          onFirmTypeChange={handleFirmTypeChange}
          clearFilters={clearFilters}
          formValues={formValues}
        />
        
        <div className="col-span-1 md:col-span-3">
          <FirmList 
            firms={firms || []}
            isLoading={isLoading}
            formatMinimumInvestment={formatMinimumInvestment}
          />
        </div>
      </div>
    </div>
  );
};

export default InvestmentFirms;
