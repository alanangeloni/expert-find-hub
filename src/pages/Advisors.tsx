
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAdvisors, getUniqueStates, type AdvisorFilter } from '@/services/advisorsService';
import { AdvisorList } from '@/components/advisors/AdvisorList';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

const AdvisorSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<AdvisorFilter>({});
  const [states, setStates] = useState<string[]>([]);
  
  const formValues = {
    state: filters.state || "all",
    minimumAssets: filters.minimumAssets || "all",
    specialty: filters.specialty || "all",
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
    setFilters(prev => ({ ...prev, state: value === "all" ? undefined : value }));
  };

  const handleMinimumChange = (value: string) => {
    setFilters(prev => ({ ...prev, minimumAssets: value === "all" ? undefined : value }));
  };

  const handleSpecialtyChange = (value: string) => {
    setFilters(prev => ({ ...prev, specialty: value === "all" ? undefined : value }));
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
    "Education Planning",
    "Financial Planning"
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
      
      <div className="bg-white rounded-[20px] shadow-sm border border-slate-100 p-4 md:p-5 mb-8">
        <div className="flex flex-wrap items-center gap-3 md:gap-4">
          <div className="relative flex-1 min-w-[240px]">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-slate-400" />
            </div>
            <Input
              placeholder="Search advisors by name or firm..."
              className="pl-10 h-12 rounded-[20px] bg-slate-50 border-slate-100 focus-visible:ring-brand-blue"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            {/* Minimum Assets Filter */}
            <Select value={formValues.minimumAssets} onValueChange={handleMinimumChange}>
              <SelectTrigger className="w-[140px] rounded-[20px] h-12 bg-slate-50 border-slate-100">
                <SelectValue placeholder="Minimum Assets" />
              </SelectTrigger>
              <SelectContent className="rounded-md bg-white">
                <SelectItem value="all">All Minimums</SelectItem>
                {minimumAssetOptions.map((option) => (
                  <SelectItem key={option} value={option}>{option}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {/* Specialty Filter */}
            <Select value={formValues.specialty} onValueChange={handleSpecialtyChange}>
              <SelectTrigger className="w-[180px] rounded-[20px] h-12 bg-slate-50 border-slate-100">
                <SelectValue placeholder="Specialty" />
              </SelectTrigger>
              <SelectContent className="rounded-md bg-white">
                <SelectItem value="all">All Specialties</SelectItem>
                {specialties.map((specialty) => (
                  <SelectItem key={specialty} value={specialty}>{specialty}</SelectItem>
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
            {(formValues.state !== "all" || formValues.minimumAssets !== "all" || formValues.specialty !== "all") && (
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
