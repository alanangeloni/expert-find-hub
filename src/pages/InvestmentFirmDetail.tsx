
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { getInvestmentFirmBySlug, getSimilarFirms } from "@/services/investmentFirmsService";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  Award,
  Building,
  Calendar,
  CheckCircle,
  ChevronRight,
  Coins,
  DollarSign,
  ExternalLink,
  FileText,
  Globe,
  Info,
  Landmark,
  Shield,
  Star,
  Users,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";

export default function InvestmentFirmDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { toast } = useToast();

  // Fetch firm data with corrected error handling
  const { data: firm, isLoading, error } = useQuery({
    queryKey: ["investmentFirm", slug],
    queryFn: () => getInvestmentFirmBySlug(slug || ""),
    enabled: !!slug,
    meta: {
      onError: () => {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load investment firm details.",
        });
      }
    }
  });
  
  // Fetch similar firms
  const { data: similarFirms = [] } = useQuery({
    queryKey: ["similarFirms", firm?.id],
    queryFn: () => getSimilarFirms(firm?.id || ""),
    enabled: !!firm?.id,
  });
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (error || !firm) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white p-6">
        <div className="container mx-auto">
          <div className="text-center py-20">
            <h1 className="text-3xl font-bold mb-4">Investment Firm Not Found</h1>
            <p className="text-slate-600 mb-6">The investment firm you're looking for doesn't exist or cannot be loaded.</p>
            <Link to="/investment-firms">
              <Button>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Investment Firms
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Extract related data with optional chaining to avoid errors
  const features = firm.investment_firm_features?.map(f => f.feature) || [];
  const leadership = firm.investment_firm_leadership || [];
  const moneyMakingMethods = firm.money_making_methods || [];
  const registrations = firm.investment_firm_regulatory_info?.map(r => r.registration) || [];
  const clientTypes = firm.investment_firm_clients?.map(c => c.client_type) || [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="container mx-auto py-8 px-4 md:px-6">
        {/* Back to Directory */}
        <div className="mb-6">
          <Link to="/investment-firms" className="inline-flex items-center text-slate-600 hover:text-slate-900">
            <ArrowLeft className="mr-2 h-4 w-4" />
            <span>Back to Investment Firms</span>
          </Link>
        </div>

        {/* Firm Header Card */}
        <Card className="overflow-hidden border-slate-200 mb-8">
          <CardContent className="p-0">
            <div className="grid md:grid-cols-2 gap-0">
              <div className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="h-16 w-16 rounded-lg overflow-hidden bg-slate-100 flex items-center justify-center">
                    <img src={firm.logo_url || "/placeholder.svg"} alt={firm.name} className="h-12 w-12 object-contain" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h1 className="text-2xl font-bold">{firm.name}</h1>
                      {firm.verified && (
                        <div className="text-blue-500">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="w-5 h-5"
                          >
                            <path
                              fillRule="evenodd"
                              d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < Math.floor(Number(firm.rating) || 0)
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-slate-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm font-medium">{firm.rating}</span>
                      <span className="text-xs text-slate-500">({firm.review_count || 0} reviews)</span>
                    </div>
                  </div>
                </div>

                <p className="text-slate-600 mb-4">{firm.description}</p>

                <div className="flex flex-wrap gap-1.5 mb-4">
                  {firm.asset_classes?.map((asset) => (
                    <Badge key={asset} variant="secondary" className="px-2 py-0.5 text-xs bg-slate-100">
                      {asset}
                    </Badge>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <div className="text-xs text-slate-500 mb-1">Minimum Investment</div>
                    <div className="font-semibold">{firm.minimum_investment || "N/A"}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 mb-1">Target Return</div>
                    <div className="font-semibold">{firm.target_return || "N/A"}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 mb-1">Liquidity</div>
                    <div className="font-semibold">{firm.liquidity || "N/A"}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 mb-1">Fees</div>
                    <div className="font-semibold">{firm.fees || "N/A"}</div>
                  </div>
                </div>

                <div className="flex gap-3 mt-4">
                  <Button className="bg-blue-600 hover:bg-blue-700">Invest Now</Button>
                  {firm.website && (
                    <Button variant="outline">
                      <Link
                        to={`https://${firm.website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1"
                      >
                        Visit Website
                        <ExternalLink className="h-3.5 w-3.5 ml-1" />
                      </Link>
                    </Button>
                  )}
                </div>
              </div>

              <div className="aspect-video bg-slate-100 overflow-hidden">
                {firm.video_url ? (
                  <iframe
                    className="w-full h-full"
                    src={firm.video_url}
                    title={firm.video_title || `${firm.name} video`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <img 
                      src={firm.large_image_url || "/placeholder.svg"} 
                      alt={firm.name} 
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-6">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="w-full grid grid-cols-2 mb-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="leadership">Leadership</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <Card className="border-none shadow-sm">
                  <CardContent className="p-6">
                    <h2 className="text-xl font-semibold mb-4">About {firm.name}</h2>
                    <p className="text-slate-600 text-sm leading-relaxed mb-6">{firm.long_description}</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Only show if there is investment approach data */}
                      {firm.description && (
                        <div>
                          <h3 className="text-base font-semibold mb-3 flex items-center gap-2">
                            <Shield className="h-4 w-4 text-blue-600" />
                            Investment Approach
                          </h3>
                          <p className="text-sm text-slate-600 leading-relaxed">{firm.description}</p>
                        </div>
                      )}

                      {/* Only show if there are features */}
                      {features.length > 0 && (
                        <div>
                          <h3 className="text-base font-semibold mb-3 flex items-center gap-2">
                            <Award className="h-4 w-4 text-blue-600" />
                            Key Features
                          </h3>
                          <ul className="space-y-2">
                            {features.map((feature, index) => (
                              <li key={index} className="flex items-start gap-2 text-sm">
                                <CheckCircle className="h-4 w-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                                <span className="text-slate-600">{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    <Separator className="my-6" />

                    <h2 className="text-xl font-semibold mb-4">How It Works</h2>

                    {moneyMakingMethods.length > 0 && (
                      <>
                        <h3 className="text-base font-semibold mb-3">How You Make Money</h3>
                        <div className="space-y-4 mb-6">
                          {moneyMakingMethods.map((method) => (
                            <div key={method.id} className="bg-slate-50 p-4 rounded-lg">
                              <h4 className="font-medium mb-2">{method.title}</h4>
                              <p className="text-sm text-slate-600">{method.description}</p>
                            </div>
                          ))}
                        </div>
                      </>
                    )}

                    {firm.how_company_makes_money && (
                      <>
                        <h3 className="text-base font-semibold mb-3">How They Make Money</h3>
                        <p className="text-sm text-slate-600 mb-6">{firm.how_company_makes_money}</p>
                      </>
                    )}

                    {firm.investment_risks && (
                      <>
                        <h3 className="text-base font-semibold mb-3">Investment Risks</h3>
                        <div className="bg-slate-50 p-4 rounded-lg">
                          <div className="flex items-start gap-2">
                            <Info className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-slate-600">{firm.investment_risks}</p>
                          </div>
                        </div>
                      </>
                    )}

                    <Separator className="my-6" />

                    {clientTypes.length > 0 && (
                      <div className="mt-6">
                        <h3 className="text-base font-semibold mb-3 flex items-center gap-2">
                          <Users className="h-4 w-4 text-blue-600" />
                          Client Types
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {clientTypes.map((type, index) => (
                            <Badge key={index} className="bg-blue-50 text-blue-700 hover:bg-blue-100">
                              {type}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {registrations.length > 0 && (
                      <div className="mt-6">
                        <h3 className="text-base font-semibold mb-3 flex items-center gap-2">
                          <Landmark className="h-4 w-4 text-blue-600" />
                          Regulatory Information
                        </h3>
                        <div className="bg-slate-50 p-4 rounded-lg">
                          <div className="flex flex-wrap gap-2 mb-3">
                            {registrations.map((reg, index) => (
                              <Badge key={index} variant="outline">
                                {reg}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="leadership" className="space-y-6">
                <Card className="border-none shadow-sm">
                  <CardContent className="p-6">
                    <h2 className="text-xl font-semibold mb-4">Leadership Team</h2>
                    <p className="text-sm text-slate-600 mb-6">
                      Meet the key executives who guide {firm.name}'s investment strategy and operations.
                    </p>

                    {leadership.length > 0 ? (
                      <div className="grid gap-6 md:grid-cols-3">
                        {leadership.map((leader) => (
                          <div key={leader.id} className="bg-slate-50 p-4 rounded-lg">
                            <div className="flex items-center gap-3 mb-3">
                              <Avatar className="h-12 w-12">
                                <AvatarImage src={leader.avatar_url || "/placeholder.svg"} alt={leader.name} />
                                <AvatarFallback>
                                  {leader.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <h3 className="font-semibold">{leader.name}</h3>
                                <p className="text-xs text-slate-500">{leader.position}</p>
                              </div>
                            </div>
                            <p className="text-sm text-slate-600">{leader.bio}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="bg-slate-50 p-6 rounded-lg text-center">
                        <p className="text-slate-600">No leadership information available at this time.</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            <Card className="border-none shadow-sm">
              <CardContent className="p-4">
                <h3 className="font-medium text-base mb-3">Key Information</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                    <div className="flex items-center gap-2 text-slate-600">
                      <Building className="h-4 w-4" />
                      <span>Founded</span>
                    </div>
                    <div className="font-medium">
                      {firm.established ? new Date(firm.established).getFullYear() : "N/A"}
                    </div>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                    <div className="flex items-center gap-2 text-slate-600">
                      <Globe className="h-4 w-4" />
                      <span>Headquarters</span>
                    </div>
                    <div className="font-medium">{firm.headquarters || "N/A"}</div>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                    <div className="flex items-center gap-2 text-slate-600">
                      <Coins className="h-4 w-4" />
                      <span>AUM</span>
                    </div>
                    <div className="font-medium">{firm.aum || "N/A"}</div>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                    <div className="flex items-center gap-2 text-slate-600">
                      <DollarSign className="h-4 w-4" />
                      <span>Min Investment</span>
                    </div>
                    <div className="font-medium">{firm.minimum_investment || "N/A"}</div>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                    <div className="flex items-center gap-2 text-slate-600">
                      <Calendar className="h-4 w-4" />
                      <span>Payout Frequency</span>
                    </div>
                    <div className="font-medium">{firm.payout || "N/A"}</div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2 text-slate-600">
                      <FileText className="h-4 w-4" />
                      <span>Management Fees</span>
                    </div>
                    <div className="font-medium">{firm.fees || "N/A"}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm overflow-hidden">
              <CardContent className="p-0">
                <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-4 text-white">
                  <h3 className="font-semibold text-lg mb-2">Ready to Invest?</h3>
                  <p className="text-sm text-blue-100 mb-4">
                    Get started with {firm.name} today and build a portfolio aligned with your financial goals.
                  </p>
                  <div className="space-y-2">
                    <Button className="w-full bg-white text-blue-800 hover:bg-blue-50">Open an Account</Button>
                    <Button variant="outline" className="w-full border-white text-white hover:bg-white/10">
                      Schedule a Consultation
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Similar Investment Firms */}
            {similarFirms.length > 0 && (
              <Card className="border-none shadow-sm">
                <CardContent className="p-4">
                  <h3 className="font-medium text-base mb-4">Similar Investment Firms</h3>
                  <div className="space-y-4">
                    {similarFirms.map((similar) => (
                      <Link
                        key={similar.id}
                        to={`/investment-firms/${similar.slug}`}
                        className="flex items-start gap-3 p-3 rounded-lg border border-slate-200 hover:shadow-sm transition-shadow"
                      >
                        <div className="h-10 w-10 rounded-md overflow-hidden bg-slate-100 flex items-center justify-center">
                          <img
                            src={similar.logo_url || "/placeholder.svg"}
                            alt={similar.name}
                            className="h-6 w-6 object-contain"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm">{similar.name}</h4>
                          <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                            <span>From: {similar.minimum_investment || "N/A"}</span>
                            <span className="text-slate-300">•</span>
                            <span>Return: {similar.target_return || "N/A"}</span>
                          </div>
                        </div>
                        <ChevronRight className="h-4 w-4 text-slate-400" />
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
