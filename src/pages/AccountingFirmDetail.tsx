
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Star, MapPin, Globe, Clock, DollarSign, Award, Building } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { getAccountingFirmBySlug } from "@/services/accountingFirmsService";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const AccountingFirmDetailComponent = () => {
  const { slug } = useParams<{ slug: string }>();
  
  const { data: firm, isLoading, error } = useQuery({
    queryKey: ["accountingFirm", slug],
    queryFn: () => getAccountingFirmBySlug(slug || ""),
    enabled: !!slug,
  });

  if (isLoading) {
    return (
      <div>
        <Header />
        <div className="container mx-auto py-12">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-blue"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !firm) {
    return (
      <div>
        <Header />
        <div className="container mx-auto py-12">
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Accounting firm not found</h2>
            <p>We couldn't find the accounting firm you're looking for. Please check the URL and try again.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero section */}
      <div className="bg-white border-b">
        <div className="container mx-auto py-8 px-4">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-8">
            <div className="h-16 w-16 md:h-24 md:w-24 bg-slate-100 rounded-lg flex items-center justify-center">
              {firm.logo_url ? (
                <img src={firm.logo_url} alt={firm.name} className="h-12 w-12 md:h-16 md:w-16 object-contain" />
              ) : (
                <Building className="h-8 w-8 md:h-10 md:w-10 text-slate-400" />
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl md:text-4xl font-bold">{firm.name}</h1>
                {firm.verified && (
                  <span className="text-blue-500 mt-1 md:mt-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-5 h-5 md:w-6 md:h-6"
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
              
              <div className="flex items-center gap-2 mt-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 md:h-5 md:w-5 ${
                        i < Math.floor(Number(firm.rating) || 0)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm md:text-base font-medium">{firm.rating}</span>
                <span className="text-xs md:text-sm text-gray-500">({firm.review_count || 0} reviews)</span>
              </div>
              
              <div className="mt-2 text-sm md:text-base text-gray-600">{firm.description}</div>
              
              <div className="flex flex-wrap gap-2 mt-3">
                {firm.services?.map(service => (
                  <Badge key={service} variant="secondary" className="bg-slate-100">
                    {service}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="w-full md:w-auto flex flex-col gap-3 mt-4 md:mt-0">
              <Button className="w-full md:w-auto bg-brand-blue hover:bg-brand-blue/90">
                Contact Firm
              </Button>
              <Button variant="outline" className="w-full md:w-auto">
                Visit Website
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="container mx-auto py-8 px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left column - Tabs content */}
          <div className="md:col-span-2">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="w-full justify-start border-b mb-6 bg-transparent p-0 h-auto">
                <TabsTrigger 
                  value="overview" 
                  className="border-b-2 border-transparent data-[state=active]:border-brand-blue rounded-none py-3 px-5 data-[state=active]:bg-transparent text-gray-600 data-[state=active]:text-brand-blue"
                >
                  Overview
                </TabsTrigger>
                <TabsTrigger 
                  value="services" 
                  className="border-b-2 border-transparent data-[state=active]:border-brand-blue rounded-none py-3 px-5 data-[state=active]:bg-transparent text-gray-600 data-[state=active]:text-brand-blue"
                >
                  Services
                </TabsTrigger>
                <TabsTrigger 
                  value="specialties" 
                  className="border-b-2 border-transparent data-[state=active]:border-brand-blue rounded-none py-3 px-5 data-[state=active]:bg-transparent text-gray-600 data-[state=active]:text-brand-blue"
                >
                  Client Specialties
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="p-0 mt-0">
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-xl font-semibold mb-4">About {firm.name}</h2>
                    <p className="text-gray-600">
                      {firm.long_description || firm.description || `${firm.name} is a professional accounting firm specializing in providing top-tier financial services to clients. With a focus on excellence and client satisfaction, we strive to deliver the best accounting solutions tailored to your specific needs.`}
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                      <div>
                        <h3 className="font-medium text-lg mb-3">Firm Details</h3>
                        <ul className="space-y-3 text-sm">
                          <li className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-gray-500" />
                            <span>{firm.headquarters || 'Location not specified'}</span>
                          </li>
                          {firm.established && (
                            <li className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-gray-500" />
                              <span>Established {firm.established}</span>
                            </li>
                          )}
                          {firm.employees && (
                            <li className="flex items-center gap-2">
                              <Building className="h-4 w-4 text-gray-500" />
                              <span>{firm.employees}</span>
                            </li>
                          )}
                          {firm.website && (
                            <li className="flex items-center gap-2">
                              <Globe className="h-4 w-4 text-gray-500" />
                              <a href={firm.website} target="_blank" rel="noopener noreferrer" className="text-brand-blue hover:underline">
                                Visit Website
                              </a>
                            </li>
                          )}
                        </ul>
                      </div>
                      
                      <div>
                        <h3 className="font-medium text-lg mb-3">Pricing</h3>
                        <div className="bg-slate-50 p-4 rounded-lg">
                          <div className="flex items-center gap-2 mb-3">
                            <DollarSign className="h-5 w-5 text-emerald-600" />
                            <span className="font-semibold">Minimum Fee</span>
                          </div>
                          <p className="text-lg font-medium">{firm.minimum_fee || 'Contact for pricing'}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="services" className="p-0 mt-0">
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-xl font-semibold mb-4">Services Offered</h2>
                    
                    {firm.services && firm.services.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {firm.services.map((service) => (
                          <div key={service} className="bg-slate-50 p-4 rounded-lg">
                            <h3 className="font-medium text-brand-blue">{service}</h3>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-600">No specific services information available.</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="specialties" className="p-0 mt-0">
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-xl font-semibold mb-4">Client Specialties</h2>
                    
                    {firm.specialties && firm.specialties.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {firm.specialties.map((specialty) => (
                          <div key={specialty} className="bg-slate-50 p-4 rounded-lg">
                            <h3 className="font-medium">{specialty}</h3>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-600">No specific client specialties information available.</p>
                    )}
                    
                    {firm.industries && firm.industries.length > 0 && (
                      <div className="mt-6">
                        <h3 className="font-medium text-lg mb-3">Industry Focus</h3>
                        <div className="flex flex-wrap gap-2">
                          {firm.industries.map((industry) => (
                            <Badge key={industry} className="bg-slate-100 px-3 py-1">
                              {industry}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Right column - Contact card */}
          <div>
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Contact {firm.name}</h2>
                <p className="text-gray-600 mb-4">
                  Interested in learning more about how {firm.name} can help with your accounting needs? Get in touch with them today.
                </p>
                
                <Button className="w-full bg-brand-blue hover:bg-brand-blue/90 mb-3">
                  Request Information
                </Button>
                
                <Button variant="outline" className="w-full">
                  Visit Website
                </Button>
                
                <Separator className="my-6" />
                
                {firm.verified && (
                  <div className="flex items-center gap-3 text-sm text-emerald-700 bg-emerald-50 p-3 rounded-lg">
                    <Award className="h-5 w-5 text-emerald-600" />
                    <div>
                      <span className="font-medium">Verified Firm</span>
                      <p className="text-xs text-emerald-600 mt-0.5">This firm has been verified by our team</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

const AccountingFirmDetail = () => {
  return (
    <>
      <AccountingFirmDetailComponent />
      <Footer />
    </>
  );
};

export default AccountingFirmDetail;
