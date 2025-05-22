
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { FilterBar } from '@/components/filters/FilterBar';
import { FilterButton } from '@/components/filters/FilterButton';
import { getAdvisors, getUniqueStates, type AdvisorFilter } from '@/services/advisorsService';
import { MapPin, Award, Check, DollarSign } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Form, 
  FormControl,
  FormField, 
  FormItem, 
  FormLabel 
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useForm } from "react-hook-form";
import { Separator } from '@/components/ui/separator';

const AdvisorSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<AdvisorFilter>({});
  const [states, setStates] = useState<string[]>([]);

  const form = useForm({
    defaultValues: {
      state: "",
      minimumAssets: "",
      specialty: "",
    },
  });

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
    form.setValue("state", value);
    setFilters(prev => ({ ...prev, state: value === "All" ? undefined : value }));
  };

  const handleMinimumChange = (value: string) => {
    form.setValue("minimumAssets", value);
    setFilters(prev => ({ ...prev, minimumAssets: value === "All" ? undefined : value }));
  };

  const handleSpecialtyChange = (value: string) => {
    form.setValue("specialty", value);
    setFilters(prev => ({ ...prev, specialty: value === "All" ? undefined : value }));
  };

  const clearFilters = () => {
    form.reset({
      state: "",
      minimumAssets: "",
      specialty: "",
    });
    setFilters({ searchQuery });
  };
  
  const specialties = [
    "Retirement Planning", 
    "Investment Management", 
    "Tax Planning", 
    "Estate Planning", 
    "Insurance Planning",
    "Business Planning",
    "Education Planning"
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
      
      <FilterBar 
        searchPlaceholder="Search advisors by name or firm..." 
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        className="mb-8"
      />
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="col-span-1 bg-white rounded-lg border border-slate-100 p-4 shadow-sm">
          <h2 className="font-semibold text-lg mb-4">Filters</h2>
          
          <Form {...form}>
            <div className="space-y-6">
              {/* State Filter */}
              <div className="space-y-2">
                <FormLabel>State</FormLabel>
                <Select value={form.watch("state")} onValueChange={handleStateChange}>
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
                  onValueChange={handleMinimumChange}
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
                <Select value={form.watch("specialty")} onValueChange={handleSpecialtyChange}>
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
        
        <div className="col-span-1 md:col-span-3">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Spinner size="lg" />
            </div>
          ) : advisors && advisors.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {advisors.map(advisor => (
                <Link key={advisor.id} to={`/advisors/${advisor.slug}`}>
                  <Card className="h-full overflow-hidden hover:shadow-lg transition-shadow duration-300">
                    <div className="p-4">
                      <div className="flex items-start gap-4">
                        <div className="w-20 h-20 rounded-full bg-slate-200 overflow-hidden flex-shrink-0">
                          {advisor.headshot_url ? (
                            <img 
                              src={advisor.headshot_url} 
                              alt={advisor.name} 
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400">
                              Photo
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
                            {advisor.name}
                            {advisor.verified && (
                              <Badge variant="outline" className="ml-2 bg-blue-50 text-blue-700 border-blue-200">
                                <Check className="h-3 w-3 mr-1" />
                                Verified
                              </Badge>
                            )}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {advisor.position || "Financial Advisor"}
                          </p>
                          <p className="text-sm font-medium text-gray-700 mt-1">
                            {advisor.firm_name || "Independent Advisor"}
                          </p>
                          {advisor.city && advisor.state_hq && (
                            <div className="flex items-center mt-2 text-sm text-gray-500">
                              <MapPin className="h-4 w-4 mr-1 text-gray-400" />
                              <span>{advisor.city}, {advisor.state_hq}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <div className="flex justify-between items-center">
                          <div>
                            {advisor.minimum && (
                              <p className="text-xs text-gray-500">
                                <span className="font-medium">
                                  <DollarSign className="h-3 w-3 inline-block mr-1" />
                                  {advisor.minimum === "0" ? "No Minimum" : `$${advisor.minimum} min`}
                                </span>
                              </p>
                            )}
                          </div>
                          {advisor.years_of_experience && (
                            <div className="flex items-center">
                              <Award className="h-4 w-4 mr-1 text-amber-500" />
                              <span className="text-xs font-medium">{advisor.years_of_experience} yrs exp.</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-slate-50 rounded-lg border border-slate-100">
              <p className="text-gray-500 mb-2">No advisors found matching your criteria.</p>
              <p className="text-sm text-gray-400">Try adjusting your filters or search term.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdvisorSearch;
