
import React from 'react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface FirmFilterSidebarProps {
  states: string[];
  minimumInvestmentOptions: string[];
  assetClasses: string[];
  onStateChange: (value: string) => void;
  onMinimumChange: (value: string) => void;
  onAssetClassChange: (value: string) => void;
  clearFilters: () => void;
  formValues: {
    state: string;
    minimumInvestment: string;
    assetClass: string;
  };
}

export function FirmFilterSidebar({
  states,
  minimumInvestmentOptions,
  assetClasses,
  onStateChange,
  onMinimumChange,
  onAssetClassChange,
  clearFilters,
  formValues
}: FirmFilterSidebarProps) {
  return (
    <Card className="p-4 shadow-sm">
      <h2 className="font-semibold text-lg mb-4">Filter Investment Firms</h2>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Location</label>
          <Select value={formValues.state} onValueChange={onStateChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a state" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All States</SelectItem>
              {states.map((state) => (
                <SelectItem key={state} value={state}>{state}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Minimum Investment</label>
          <Select value={formValues.minimumInvestment} onValueChange={onMinimumChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select minimum" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any Amount</SelectItem>
              {minimumInvestmentOptions.map((option) => (
                <SelectItem key={option} value={option}>{option}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Asset Class</label>
          <Select value={formValues.assetClass} onValueChange={onAssetClassChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select asset class" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Asset Classes</SelectItem>
              {assetClasses.map((assetClass) => (
                <SelectItem key={assetClass} value={assetClass}>{assetClass}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button 
          variant="outline" 
          onClick={clearFilters} 
          className="w-full mt-2"
        >
          Clear Filters
        </Button>
      </div>
    </Card>
  );
}
