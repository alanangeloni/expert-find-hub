
import React from 'react';
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AdvisorFilterSidebarProps {
  states: string[];
  minimumAssetOptions: string[];
  specialties: string[];
  onStateChange: (value: string) => void;
  onMinimumChange: (value: string) => void;
  onSpecialtyChange: (value: string) => void;
  clearFilters: () => void;
  formValues: {
    state: string;
    minimumAssets: string;
    specialty: string;
  };
}

export const AdvisorFilterSidebar = ({
  states,
  minimumAssetOptions,
  specialties,
  onStateChange,
  onMinimumChange,
  onSpecialtyChange,
  clearFilters,
  formValues,
}: AdvisorFilterSidebarProps) => {
  const form = useForm({
    defaultValues: formValues
  });

  return (
    <div className="col-span-1 bg-white rounded-lg border border-slate-100 p-4 shadow-sm">
      <h2 className="font-semibold text-lg mb-4">Filters</h2>
      
      <Form {...form}>
        <div className="space-y-6">
          {/* State Filter */}
          <div className="space-y-2">
            <FormLabel>State</FormLabel>
            <Select value={form.watch("state")} onValueChange={onStateChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select state" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All States</SelectItem>
                {states.map((state) => (
                  <SelectItem key={state} value={state}>{state}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <Separator />
          
          {/* Minimum Assets Filter */}
          <div className="space-y-3">
            <FormLabel>Minimum Assets</FormLabel>
            <RadioGroup 
              value={form.watch("minimumAssets")} 
              onValueChange={onMinimumChange}
              className="flex flex-col space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="" id="all-min" />
                <FormLabel className="cursor-pointer font-normal" htmlFor="all-min">All</FormLabel>
              </div>
              
              {minimumAssetOptions.map((option) => (
                <div key={option} className="flex items-center space-x-2">
                  <RadioGroupItem value={option} id={option} />
                  <FormLabel className="cursor-pointer font-normal" htmlFor={option}>{option}</FormLabel>
                </div>
              ))}
            </RadioGroup>
          </div>
          
          <Separator />
          
          {/* Specialty Filter */}
          <div className="space-y-2">
            <FormLabel>Specialty</FormLabel>
            <Select value={form.watch("specialty")} onValueChange={onSpecialtyChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select specialty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Specialties</SelectItem>
                {specialties.map((specialty) => (
                  <SelectItem key={specialty} value={specialty}>{specialty}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Clear Filters Button */}
          {(form.watch("state") || form.watch("minimumAssets") || form.watch("specialty")) && (
            <div className="pt-2">
              <button
                onClick={clearFilters}
                type="button"
                className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </Form>
    </div>
  );
};
