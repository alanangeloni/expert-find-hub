import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getInvestmentFirms, type FirmFilter, type InvestmentFirm } from '@/services/investmentFirmsService';
import { FirmList } from '@/components/firms/FirmList';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';


const InvestmentFirms = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FirmFilter>({});
  
  const formValues = {
    minimumInvestment: filters.minimumInvestment || "all",
    assetClass: filters.assetClass || "all",
  };

  // These will be populated from the actual data
  const [assetClasses, setAssetClasses] = useState<string[]>([]);
  
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 15;
  
  const { data: firmsData, isLoading } = useQuery({
    queryKey: ['firms', filters, currentPage],
    queryFn: () => getInvestmentFirms({ ...filters, page: currentPage, pageSize }),
  });
  
  const firms = firmsData?.data || [];

  // Function to properly format minimum investment values
  const formatMinimumInvestment = (value: number | null | undefined): string => {
    if (value === null || value === undefined) return "No minimum";
    
    // Convert value to string before using replace
    const valueStr = value.toString();
    return `$${valueStr.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
  };

  // Update asset classes when firms data changes
  React.useEffect(() => {
    if (firms) {
      const uniqueAssetClasses = new Set<string>();
      firms.forEach(firm => {
        if (firm.asset_classes) {
          firm.asset_classes.forEach(ac => uniqueAssetClasses.add(ac));
        }
      });
      setAssetClasses(Array.from(uniqueAssetClasses).sort());
    }
  }, [firms]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setFilters(prev => ({ ...prev, searchQuery: e.target.value }));
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
  
  const minimumInvestmentOptions = [
    { label: "No Minimum", value: "0" },
    { label: "Under $250k", value: "250000" },
    { label: "$250k - $500k", value: "250000-500000" },
    { label: "$500k - $1M", value: "500000-1000000" },
    { label: "$1M - $5M", value: "1000000-5000000" },
    { label: "$5M+", value: "5000000" }
  ];
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Browse Investment Firms</h1>
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
                  <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
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
                {assetClasses.length > 0 ? (
                  assetClasses.map((assetClass) => (
                    <SelectItem key={assetClass} value={assetClass}>{assetClass}</SelectItem>
                  ))
                ) : (
                  <SelectItem value="all" disabled>Loading asset classes...</SelectItem>
                )}
              </SelectContent>
            </Select>
            
            {/* Clear Filters */}
            {(formValues.minimumInvestment !== "all" || formValues.assetClass !== "all") && (
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
            firms={firms}
            isLoading={isLoading}
            formatMinimumInvestment={formatMinimumInvestment}
            basePath="/firms"
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            totalCount={firmsData?.total || 0}
            pageSize={pageSize}
          />
        </div>
      </div>
    </div>
  );
};

const InvestmentFirmsPage = () => {
  return (
    <>
      <InvestmentFirms />
    </>
  );
};

export default InvestmentFirmsPage;
