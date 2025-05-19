
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Building, ChevronRight, DollarSign, Star } from "lucide-react";
import { getAccountingFirms } from "@/services/accountingFirmsService";
import Header from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { FilterBar } from "@/components/filters/FilterBar";
import { FilterButton } from "@/components/filters/FilterButton";

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
      <Header />
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
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
            <div className="text-sm font-medium text-slate-700">Minimum fee:</div>
            <div className="flex flex-wrap gap-2">
              <FilterButton
                active={selectedMinimumFee === "No Minimum"}
                onClick={() => setSelectedMinimumFee("No Minimum")}
              >
                No Minimum
              </FilterButton>
              <FilterButton
                active={selectedMinimumFee === "Under $250/mo"}
                onClick={() => setSelectedMinimumFee("Under $250/mo")}
              >
                Under $250/mo
              </FilterButton>
              <FilterButton
                active={selectedMinimumFee === "$250/mo+"}
                onClick={() => setSelectedMinimumFee("$250/mo+")}
              >
                $250/mo+
              </FilterButton>
              {selectedMinimumFee !== "All" && (
                <FilterButton
                  active={false}
                  onClick={() => setSelectedMinimumFee("All")}
                  className="border-dashed"
                >
                  Clear
                </FilterButton>
              )}
            </div>
          </div>
        </FilterBar>

        {/* Service Tabs */}
        <div className="mb-6 md:mb-8 overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
          <Tabs defaultValue="All" value={selectedService} onValueChange={setSelectedService}>
            <TabsList className="h-auto flex-nowrap justify-start w-max md:w-full rounded-[20px] p-1.5 bg-slate-100/80">
              {services.map((service) => (
                <TabsTrigger 
                  key={service} 
                  value={service} 
                  className="text-xs md:text-sm whitespace-nowrap rounded-[15px] px-4 py-2 data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm"
                >
                  {service}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {/* Specialties Tabs */}
        <div className="mb-6 md:mb-8 overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
          <Tabs defaultValue="All" value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
            <TabsList className="h-auto flex-nowrap justify-start w-max md:w-full rounded-[20px] p-1.5 bg-slate-100/80">
              {specialties.map((specialty) => (
                <TabsTrigger 
                  key={specialty} 
                  value={specialty} 
                  className="text-xs md:text-sm whitespace-nowrap rounded-[15px] px-4 py-2 data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm"
                >
                  {specialty}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-12 md:py-20">
            <div className="animate-spin rounded-full h-10 w-10 md:h-12 md:w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative mb-6 text-sm md:text-base">
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline"> Failed to load accounting firms. Please try again later.</span>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && filteredFirms.length === 0 && (
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 md:p-8 text-center">
            <h3 className="text-base md:text-lg font-medium mb-2">No accounting firms found</h3>
            <p className="text-sm md:text-base text-slate-500">Try adjusting your search or filters to find more results.</p>
          </div>
        )}

        {/* Accounting Firms List */}
        <div className="space-y-4 md:space-y-5">
          {filteredFirms.map((firm) => (
            <Link key={firm.id} to={`/accounting-firms/${firm.slug}`} className="block">
              <Card className="overflow-hidden border-slate-200 hover:shadow-md transition-shadow rounded-[20px]">
                <CardContent className="p-0">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 md:p-6">
                    <div className="md:col-span-2">
                      <div className="flex items-start gap-3 md:gap-4 mb-2">
                        <div className="h-10 w-10 md:h-12 md:w-12 rounded-lg overflow-hidden bg-slate-100 flex items-center justify-center flex-shrink-0">
                          <img
                            src={firm.logo_url || "/placeholder.svg"}
                            alt={firm.name}
                            className="h-6 w-6 md:h-8 md:w-8 object-contain"
                          />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h2 className="text-lg md:text-xl font-semibold">{firm.name}</h2>
                            {firm.verified && (
                              <span className="text-blue-500">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 24 24"
                                  fill="currentColor"
                                  className="w-4 h-4 md:w-5 md:h-5"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-3 w-3 md:h-4 md:w-4 ${
                                    i < Math.floor(Number(firm.rating) || 0)
                                      ? "fill-yellow-400 text-yellow-400"
                                      : "text-slate-300"
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-xs md:text-sm font-medium">{firm.rating}</span>
                            <span className="text-[10px] md:text-xs text-slate-500">({firm.review_count || 0} reviews)</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-slate-600 text-xs md:text-sm mb-3">{firm.description}</p>
                      <div className="flex flex-wrap gap-1.5">
                        {firm.services?.slice(0, 3).map((service) => (
                          <Badge
                            key={service}
                            variant="secondary"
                            className="px-1.5 md:px-2 py-0.5 text-[10px] md:text-xs bg-slate-100"
                          >
                            {service}
                          </Badge>
                        ))}
                        {firm.services && firm.services.length > 3 && (
                          <Badge variant="secondary" className="px-1.5 md:px-2 py-0.5 text-[10px] md:text-xs bg-slate-100">
                            +{firm.services.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    {/* Mobile view - key details */}
                    <div className="grid grid-cols-2 gap-3 md:hidden mt-3">
                      <div className="p-2 bg-slate-50 rounded-md">
                        <div className="text-[10px] text-slate-500 mb-1">Minimum Fee</div>
                        <div className="font-semibold text-xs flex items-center gap-1">
                          <DollarSign className="h-3 w-3 text-emerald-600" />
                          {firm.minimum_fee || "N/A"}
                        </div>
                      </div>
                      <div className="p-2 bg-slate-50 rounded-md">
                        <div className="text-[10px] text-slate-500 mb-1">Location</div>
                        <div className="font-semibold text-xs">{firm.headquarters || "N/A"}</div>
                      </div>
                    </div>

                    {/* Desktop view - additional details */}
                    <div className="hidden md:block space-y-3">
                      <div>
                        <div className="text-xs text-slate-500 mb-1">Minimum Fee</div>
                        <div className="font-semibold flex items-center gap-1">
                          <DollarSign className="h-4 w-4 text-emerald-600" />
                          {firm.minimum_fee || "N/A"}
                        </div>
                      </div>
                      <Separator />
                      <div>
                        <div className="text-xs text-slate-500 mb-1">Client Specialties</div>
                        <div className="font-semibold">
                          {firm.specialties && firm.specialties.length > 0 
                            ? firm.specialties[0]
                            : "Various Clients"}
                        </div>
                      </div>
                    </div>

                    <div className="hidden md:flex md:items-center">
                      <div className="space-y-3 w-full">
                        <div>
                          <div className="text-xs text-slate-500 mb-1">Team Size</div>
                          <div className="font-semibold">{firm.employees || "N/A"}</div>
                        </div>
                        <Separator />
                        <div>
                          <div className="text-xs text-slate-500 mb-1">Headquarters</div>
                          <div className="flex items-center gap-1">
                            <Building className="h-3.5 w-3.5 text-slate-400" />
                            <span className="font-semibold">{firm.headquarters || "N/A"}</span>
                          </div>
                        </div>
                        <div className="flex justify-end mt-6">
                          <Button className="bg-brand-blue text-white hover:bg-brand-blue/90">
                            <span>View Details</span>
                            <ChevronRight className="h-4 w-4 ml-1" />
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Mobile view button */}
                    <div className="flex md:hidden justify-end mt-4">
                      <Button className="bg-brand-blue text-white hover:bg-brand-blue/90 text-xs w-full">
                        <span>View Details</span>
                        <ChevronRight className="h-3.5 w-3.5 ml-1" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
