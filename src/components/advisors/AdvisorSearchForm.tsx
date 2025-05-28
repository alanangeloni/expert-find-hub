
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { type AdvisorFilter } from '@/services/advisorsService';
import { CLIENT_TYPES } from '@/constants/clientTypes';
import { ADVISOR_SERVICES } from '@/constants/advisorServices';

interface AdvisorSearchFormProps {
  searchQuery: string;
  filters: AdvisorFilter;
  states: string[];
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onStateChange: (value: string) => void;
  onMinimumChange: (value: string) => void;
  onSpecialtyChange: (specialties: string[]) => void;
  onClientTypeChange: (value: string) => void;
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
  onClientTypeChange,
  clearFilters
}: AdvisorSearchFormProps) => {
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);
  const [localState, setLocalState] = useState("all");
  const [localMinimumAssets, setLocalMinimumAssets] = useState("all");
  const [localClientType, setLocalClientType] = useState("all");

  // Sync local state with filters
  useEffect(() => {
    setSelectedSpecialties(filters?.specialties || []);
    setLocalState(filters?.state || "all");
    setLocalMinimumAssets(filters?.minimumAssets || "all");
    setLocalClientType(filters?.clientType || "all");
  }, [filters]);

  const specialties = ADVISOR_SERVICES;

  const minimumAssetOptions = [
    "No Minimum", 
    "Under $250k", 
    "$250k - $500k", 
    "$500k - $1M", 
    "$1M+"
  ];
  
  const clientTypes = CLIENT_TYPES;

  const handleSpecialtyToggle = (value: string) => {
    let newSpecialties: string[] = [];
    
    if (value === "all") {
      newSpecialties = [];
    } else if (selectedSpecialties.includes(value)) {
      newSpecialties = selectedSpecialties.filter(s => s !== value);
    } else {
      newSpecialties = [...selectedSpecialties, value];
    }
    
    setSelectedSpecialties(newSpecialties);
    onSpecialtyChange(newSpecialties);
  };
  
  const removeSpecialty = (specialty: string) => {
    const newSpecialties = selectedSpecialties.filter(s => s !== specialty);
    setSelectedSpecialties(newSpecialties);
    onSpecialtyChange(newSpecialties);
  };

  return (
    <div className="bg-white rounded-[20px] shadow-sm border border-slate-100 p-4 md:p-5 mb-8">
      <div className="flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
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

        {/* State Selector */}
        <Select 
          value={localState} 
          onValueChange={(value) => {
            setLocalState(value);
            onStateChange(value);
          }}
        >
          <SelectTrigger className="w-[140px] h-12 rounded-[20px] bg-slate-50 border-slate-100">
            <SelectValue placeholder="State" />
          </SelectTrigger>
          <SelectContent className="rounded-md bg-white">
            <SelectItem value="all">All States</SelectItem>
            {states.map((state) => (
              <SelectItem key={state} value={state}>{state}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        {/* Client Type Selector */}
        <Select 
          value={localClientType}
          onValueChange={(value) => {
            setLocalClientType(value);
            onClientTypeChange(value);
          }}
        >
          <SelectTrigger className="w-[160px] h-12 rounded-[20px] bg-slate-50 border-slate-100">
            <SelectValue placeholder="Client Type" />
          </SelectTrigger>
          <SelectContent className="rounded-md bg-white">
            <SelectItem value="all">All Client Types</SelectItem>
            {clientTypes.map((type) => (
              <SelectItem key={type} value={type}>{type}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Specialties Selector */}
        <div className="relative min-w-[200px] flex-1">
          <Select 
            value=""
            onValueChange={handleSpecialtyToggle}
          >
            <SelectTrigger className="h-12 rounded-[20px] bg-slate-50 border-slate-100">
              <SelectValue placeholder="Specialties" />
            </SelectTrigger>
            <SelectContent className="w-full max-h-[300px] overflow-y-auto">
              {specialties.map((specialty) => (
                <SelectItem key={specialty} value={specialty}>
                  {specialty}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Clear Filters Button */}
        <Button 
          variant="outline" 
          onClick={clearFilters}
          className="h-12 rounded-[20px] border-slate-200 text-slate-600 hover:bg-slate-50 whitespace-nowrap"
        >
          Clear Filters
        </Button>

        {/* Selected Specialties Chips */}
        {selectedSpecialties.length > 0 && (
          <div className="w-full flex flex-wrap gap-2 mt-2">
            {selectedSpecialties.map(specialty => (
              <div 
                key={specialty}
                className="bg-slate-100 text-slate-800 text-sm px-3 py-1.5 rounded-full flex items-center gap-1"
              >
                <span>{specialty}</span>
                <button 
                  type="button"
                  onClick={() => removeSpecialty(specialty)}
                  className="ml-1 text-slate-500 hover:text-slate-700"
                  aria-label={`Remove ${specialty}`}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
