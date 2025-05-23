
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getInvestmentFirms, getUniqueStates, type FirmFilter } from '@/services/investmentFirmsService';
import { FirmList } from '@/components/firms/FirmList';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

const InvestmentFirms = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FirmFilter>({});
  const [states, setStates] = useState<string[]>([]);
  
  const formValues = {
    state: filters.state || "all",
    minimumInvestment: filters.minimumInvestment || "all",
    assetClass: filters.assetClass || "all",
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

  const handleAssetClassChange = (value: string) => {
    setFilters(prev => ({ ...prev, assetClass: value === "all" ? undefined : value }));
  };

  const clearFilters = () => {
    setFilters({ searchQuery });
  };
  
  const assetClasses = [
    "Stocks",
    "Bonds", 
    "Real Estate",
    "Commodities",
    "Cash Equivalents",
    "Alternative Investments",
    "Private Equity"
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
    
    // Convert value to string before using replace
    const valueStr = value.toString();
    return `$${valueStr.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
  };
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Find Investment Firms</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Discover top investment firms that can help you achieve your financial goals
        </p>
      </div>
      
      <div className="bg-white rounded-[20px] shadow-sm border border-slate-100 p-4 md:p-5 mb-8">
        <div className="flex flex-wrap items-center gap-3 md:gap-4">
          <div className="relative flex-1 min-w-[240px]">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-slate-400" />
            </div>
            <Input
              placeholder="Search firms by name or location..."
              className="pl-10 h-12 rounded-[20px] bg-slate-50 border-slate-100 focus-visible:ring-brand-blue"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            {/* Minimum Investment Filter */}
            <Select value={formValues.minimumInvestment} onValueChange={handleMinimumChange}>
              <SelectTrigger className="w-[140px] rounded-[20px] h-12 bg-slate-50 border-slate-100">
                <SelectValue placeholder="Investment Min" />
              </SelectTrigger>
              <SelectContent className="rounded-md bg-white">
                <SelectItem value="all">All Minimums</SelectItem>
                {minimumInvestmentOptions.map((option) => (
                  <SelectItem key={option} value={option}>{option}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {/* Asset Class Filter */}
            <Select value={formValues.assetClass} onValueChange={handleAssetClassChange}>
              <SelectTrigger className="w-[180px] rounded-[20px] h-12 bg-slate-50 border-slate-100">
                <SelectValue placeholder="Asset Class" />
              </SelectTrigger>
              <SelectContent className="rounded-md bg-white">
                <SelectItem value="all">All Classes</SelectItem>
                {assetClasses.map((assetClass) => (
                  <SelectItem key={assetClass} value={assetClass}>{assetClass}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {/* State Filter */}
            <Select value={formValues.state} onValueChange={handleStateChange}>
              <SelectTrigger className="w-[180px] rounded-[20px] h-12 bg-slate-50 border-slate-100">
                <SelectValue placeholder="State" />
              </SelectTrigger>
              <SelectContent className="rounded-md bg-white">
                <SelectItem value="all">All States</SelectItem>
                {states.map((state) => (
                  <SelectItem key={state} value={state}>{state}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Clear Filters */}
            {(formValues.state !== "all" || formValues.minimumInvestment !== "all" || formValues.assetClass !== "all") && (
              <Button 
                variant="outline" 
                className="rounded-[20px] h-12 border-dashed"
                onClick={clearFilters}
              >
                Clear Filters
              </Button>
            )}
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="col-span-1 lg:hidden">
          {/* Mobile filters would go here if needed */}
        </div>
        
        <div className="col-span-1 lg:col-span-4">
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
