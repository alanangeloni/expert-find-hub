import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building, ChevronRight, DollarSign, Star, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
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

const AccountingFirmsPage = () => {
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
    <div className="container mx-auto py-8 px-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Find Accounting Firms</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Connect with top accounting firms that can help manage your business finances
        </p>
      </div>
      
      <div className="bg-white rounded-[20px] shadow-sm border border-slate-100 p-4 md:p-5 mb-8">
        <div className="flex flex-wrap items-center gap-3 md:gap-4">
          <div className="relative flex-1 min-w-[240px]">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-slate-400" />
            </div>
            <Input
              type="text"
              placeholder="Search firms by name or services..."
              className="pl-10 h-12 w-full rounded-[20px] bg-slate-50 border-slate-200 focus-visible:ring-brand-blue"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
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
      </div>
      <FirmList 
        firms={filteredFirms}
        isLoading={isLoading}
        formatMinimumInvestment={formatMinimumFee}
        basePath="/accounting-firms"
        firmType="accounting"
      />
    </div>
  );
};

const AccountingFirmsPageWithFooter = () => {
  return (
    <>
      <AccountingFirmsPage />
    </>
  );
};

export default AccountingFirmsPageWithFooter;
