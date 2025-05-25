import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Building, ChevronRight, DollarSign, Star, ChevronDown } from "lucide-react";
import { getAccountingFirms } from "@/services/accountingFirmsService";
import { Button } from "@/components/ui/button";
import { FilterBar } from "@/components/filters/FilterBar";
import { FilterButton } from "@/components/filters/FilterButton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FirmList } from "@/components/firms/FirmList";

export default function AccountingFirmsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("All");
  const [selectedService, setSelectedService] = useState("All");
  const [selectedMinimumFee, setSelectedMinimumFee] = useState("All");
  
  // Fetch accounting firms
  const { data: firms = [], isLoading, error } = useQuery({
    queryKey: ["accountingFirms"],
    queryFn: getAccountingFirms,
  });

  // Function to properly format minimum fee values
  const formatMinimumFee = (value: number | null | undefined): string => {
    if (value === null || value === undefined) return "N/A";
    return `$${value}/mo`;
  };

  // Service categories
  const services = [
    "All", 
    "Tax Preparation", 
    "Bookkeeping", 
    "Business Formation",
    "Advisory Services",
    "Payroll Services",
    "International Tax Services"
  ];

  // Specialty categories
  const specialties = [
    "All",
    "High Net Worth Individuals",
    "Real Estate Investors",
    "VC Backed",
    "Digital Nomads",
    "International/Expats",
    "Solopreneurs",
    "SMB Owner"
  ];

  // Filter firms based on search, specialty, service, and minimum fee
  const filteredFirms = firms.filter((firm) => {
    // Filter by search query
    const matchesSearch = 
      searchQuery.trim() === "" || 
      firm.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      firm.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      false;
      
    // Filter by specialty
    const matchesSpecialty = 
      selectedSpecialty === "All" || 
      firm.specialties?.includes(selectedSpecialty as any) ||
      false;
      
    // Filter by service
    const matchesService = 
      selectedService === "All" || 
      firm.services?.includes(selectedService as any) ||
      false;
    
    // Filter by minimum fee
    let matchesMinimumFee = selectedMinimumFee === "All";
    if (firm.minimum_fee) {
      const feeMatch = firm.minimum_fee.match(/\$?(\d+)/);
      const fee = feeMatch ? parseInt(feeMatch[1], 10) : 0;
      
      if (selectedMinimumFee === "No Minimum") {
        matchesMinimumFee = fee <= 0;
      } else if (selectedMinimumFee === "Under $250/mo") {
        matchesMinimumFee = fee > 0 && fee < 250;
      } else if (selectedMinimumFee === "$250/mo+") {
        matchesMinimumFee = fee >= 250;
      }
    }
    
    return matchesSearch && matchesSpecialty && matchesService && matchesMinimumFee;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="container mx-auto py-6 md:py-8 px-4 md:px-6">
        {/* Page Header */}
        <div className="mb-6 md:mb-10">
          <h1 className="text-2xl md:text-4xl font-bold mb-2 md:mb-4">Accounting Firms</h1>
          <p className="text-slate-600 max-w-3xl text-sm md:text-base">
            Connect with top accounting firms offering a range of professional services tailored to
            meet your business and personal financial needs.
          </p>
        </div>

        {/* Search and Filter */}
        <FilterBar
          searchPlaceholder="Search accounting firms..."
          searchQuery={searchQuery}
          onSearchChange={(e) => setSearchQuery(e.target.value)}
        >
          <div className="flex flex-wrap items-center gap-3">
            {/* Fee Filter */}
            <Select value={selectedMinimumFee} onValueChange={setSelectedMinimumFee}>
              <SelectTrigger className="w-[140px] rounded-[20px] h-12 bg-slate-50 border-slate-100">
                <SelectValue placeholder="Fee" />
              </SelectTrigger>
              <SelectContent className="rounded-md bg-white">
                <SelectItem value="All">All Fees</SelectItem>
                <SelectItem value="No Minimum">No Minimum</SelectItem>
                <SelectItem value="Under $250/mo">Under $250/mo</SelectItem>
                <SelectItem value="$250/mo+">$250/mo+</SelectItem>
              </SelectContent>
            </Select>
            
            {/* Service Filter */}
            <Select value={selectedService} onValueChange={setSelectedService}>
              <SelectTrigger className="w-[180px] rounded-[20px] h-12 bg-slate-50 border-slate-100">
                <SelectValue placeholder="Service" />
              </SelectTrigger>
              <SelectContent className="rounded-md bg-white">
                {services.map((service) => (
                  <SelectItem key={service} value={service}>
                    {service}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {/* Specialty Filter */}
            <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
              <SelectTrigger className="w-[180px] rounded-[20px] h-12 bg-slate-50 border-slate-100">
                <SelectValue placeholder="Specialty" />
              </SelectTrigger>
              <SelectContent className="rounded-md bg-white">
                {specialties.map((specialty) => (
                  <SelectItem key={specialty} value={specialty}>
                    {specialty}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Clear Filters */}
            {(selectedMinimumFee !== "All" || selectedService !== "All" || selectedSpecialty !== "All") && (
              <Button 
                variant="outline" 
                className="rounded-[20px] h-12 border-dashed"
                onClick={() => {
                  setSelectedMinimumFee("All");
                  setSelectedService("All");
                  setSelectedSpecialty("All");
                }}
              >
                Clear Filters
              </Button>
            )}
          </div>
        </FilterBar>

        {/* Firm List */}
        <FirmList
          firms={filteredFirms.map(firm => ({
            ...firm,
            minimum_fee: firm.minimum_fee ? parseInt(firm.minimum_fee.replace(/[^\d]/g, ''), 10) : undefined
          }))}
          isLoading={isLoading}
          formatMinimumInvestment={formatMinimumFee}
        />
      </div>
    </div>
  );
}
