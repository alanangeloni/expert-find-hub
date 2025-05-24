
import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { type AdvisorFilter } from '@/services/advisorsService';

interface AdvisorSearchFormProps {
  searchQuery: string;
  filters: AdvisorFilter;
  states: string[];
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onStateChange: (value: string) => void;
  onMinimumChange: (value: string) => void;
  onSpecialtyChange: (value: string) => void;
  clearFilters: () => void;
}

export const AdvisorSearchForm = ({
  searchQuery,
  filters,
  states,
  onSearchChange,
  onStateChange,
  onMinimumChange,
  onSpecialtyChange,
  clearFilters
}: AdvisorSearchFormProps) => {
  const formValues = {
    state: filters.state || "all",
    minimumAssets: filters.minimumAssets || "all",
    specialty: filters.specialty || "all",
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
            onChange={onSearchChange}
          />
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <Select value={formValues.minimumAssets} onValueChange={onMinimumChange}>
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
          
          <Select value={formValues.specialty} onValueChange={onSpecialtyChange}>
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
          
          <Select value={formValues.state} onValueChange={onStateChange}>
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
  );
};
