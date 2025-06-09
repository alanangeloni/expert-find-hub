import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
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
  FileText,
  Globe,
  Info,
  Landmark,
  Link as LinkIconLucide, 
  Shield,
  Star,
  Users,
  Briefcase,
  TrendingUp,
  PiggyBank,
  ExternalLink as ExternalLinkIcon,
  AlertTriangle, 
  BookOpen, 
  UserCheck, 
  ScrollText
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import Footer from "@/components/layout/Footer";

interface Feature {
  title: string;
  description?: string;
}
interface LeadershipMember {
  name: string;
  title: string;
  image_url?: string;
  linkedin_url?: string;
}
interface Registration {
  name: string;
}
interface ClientType {
  name: string;
}
interface MoneyMakingMethod {
    id?: string; 
    title: string;
    description: string;
}

interface ExtendedFirmData {
    long_description?: string;
    money_making_methods?: MoneyMakingMethod[];
    how_company_makes_money?: string;
    investment_risks?: string;
    employees_count?: string | number;
}

const InvestmentFirmDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { toast } = useToast();

  const { data: firmData, isLoading, error } = useQuery<any & ExtendedFirmData>({
    queryKey: ["investmentFirm", slug],
    queryFn: () => getInvestmentFirmBySlug(slug || ""),
    enabled: !!slug,
    meta: {
      onError: (err: any) => {
        toast({
          variant: "destructive",
          title: "Error loading firm",
          description: err.message || "Failed to load investment firm details.",
        });
      },
    },
  });

  const firm = firmData;

  const { data: similarFirms = [] } = useQuery({
    queryKey: ["similarFirms", firm?.id],
    queryFn: () => getSimilarFirms(firm?.id || ""),
    enabled: !!firm?.id,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !firm) {
    return (
      <div className="min-h-screen bg-slate-50 p-6 flex flex-col items-center justify-center text-center">
        <Info className="h-16 w-16 text-red-500 mb-4" />
        <h1 className="text-2xl font-semibold text-slate-800 mb-2">Investment Firm Not Found</h1>
        <p className="text-slate-600 mb-6 max-w-md">
          The investment firm you're looking for doesn't exist or an error occurred while loading its details.
        </p>
        <Link to="/investment-firms">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Investment Firms
          </Button>
        </Link>
      </div>
    );
  }

  const features: Feature[] = firm.investment_firm_features?.map((f: any) => f.feature).filter(Boolean) || [];
  const leadership: LeadershipMember[] = firm.investment_firm_leadership?.filter(Boolean) || [];
  const registrations: Registration[] = firm.investment_firm_regulatory_info?.map((r: any) => r.registration).filter(Boolean) || [];
  const clientTypes: ClientType[] = firm.investment_firm_clients?.map((c: any) => c.client_type).filter(Boolean) || [];
  const moneyMakingMethods: MoneyMakingMethod[] = firm.money_making_methods || [];
  const firmType = (firm.asset_classes && firm.asset_classes.length > 0) ? firm.asset_classes.join(', ') : "N/A";

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container max-w-6xl mx-auto py-8 px-4 md:px-6">
        <div className="mb-6">
          <Link
            to="/investment-firms"
            className="inline-flex items-center text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Investment Firms
          </Link>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
          <div className="container mx-auto p-6 sm:p-8">
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
                  {firm.rating && (
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
                  )}
                  {firm.rating && <span className="text-sm md:text-base font-medium">{firm.rating.toFixed(1)}</span>}
                  {firm.rating && firm.review_count && (
                    <span className="text-xs md:text-sm text-gray-500">({firm.review_count} reviews)</span>
                  )}
                </div>
                
                {firm.description && (
                  <div className="mt-2 text-sm md:text-base text-gray-600">{firm.description}</div>
                )}
                
                <div className="flex flex-wrap gap-2 mt-3">
                  {firm.asset_classes?.map((assetClass: string, index: number) => (
                    <Badge key={index} variant="secondary" className="bg-slate-100">
                      {assetClass}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="w-full md:w-auto flex flex-col gap-3 mt-4 md:mt-0">
                <div className="grid grid-cols-2 gap-3 w-full">
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="flex items-center text-xs text-slate-500 mb-0.5 uppercase tracking-wider">
                      <PiggyBank className="h-3.5 w-3.5 mr-1.5 flex-shrink-0" />
                      Min. Invest
                    </div>
                    <p className="text-base font-semibold text-slate-800">{firm.minimum_investment || "N/A"}</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="flex items-center text-xs text-slate-500 mb-0.5 uppercase tracking-wider">
                      <TrendingUp className="h-3.5 w-3.5 mr-1.5 flex-shrink-0" />
                      Target Return
                    </div>
                    <p className="text-base font-semibold text-slate-800">{firm.target_return || "N/A"}</p>
                  </div>
                </div>
                <Button 
                  asChild 
                  size="lg" 
                  className="bg-mint-500 hover:bg-mint-600 text-white"
                >
                  <a 
                    href={firm.firm_link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center"
                  >
                    Invest Now
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6 container mx-auto px-4">
          {firm.website_url && (
            <Button asChild size="lg" variant="outline" className="text-brand-blue border-brand-blue/50 hover:bg-brand-blue/5 hover:text-brand-blue hover:border-brand-blue flex-grow sm:flex-grow-0 min-w-[150px]">
              <a href={firm.website_url} target="_blank" rel="noopener noreferrer">
                Visit Website
                <ExternalLinkIcon className="ml-2 h-4 w-4" />
              </a>
            </Button>
          )}
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-2/3 space-y-8">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-2 md:w-auto mb-6 border-b-0 bg-slate-100 p-1 rounded-lg">
                <TabsTrigger value="overview" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">Overview</TabsTrigger>
                <TabsTrigger value="leadership" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">Leadership</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-2 space-y-6">
                {(firm.long_description || firm.about) && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-xl flex items-center"><Info className="mr-2.5 h-5 w-5 text-blue-600 flex-shrink-0"/>About {firm.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="prose prose-slate max-w-none text-slate-700 leading-relaxed">
                      <p>{firm.long_description || firm.about}</p>
                    </CardContent>
                  </Card>
                )}
                {features.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-xl flex items-center"><Award className="mr-2.5 h-5 w-5 text-blue-600 flex-shrink-0"/>Investment Approach</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3.5">
                        {features.map((feature, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                            <div>
                              <h4 className="font-medium text-slate-800">{feature.title}</h4>
                              {feature.description && <p className="text-sm text-slate-600">{feature.description}</p>}
                            </div>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}
                {firm.how_you_make_money && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-xl flex items-center">
                        <DollarSign className="mr-2.5 h-5 w-5 text-blue-600 flex-shrink-0"/>
                        How You Make Money
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="prose prose-slate max-w-none text-slate-700 leading-relaxed">
                      <p>{firm.how_you_make_money}</p>
                    </CardContent>
                  </Card>
                )}
                {(moneyMakingMethods.length > 0 || firm.how_company_makes_money) && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-xl flex items-center">
                              <TrendingUp className="mr-2.5 h-5 w-5 text-blue-600 flex-shrink-0"/>
                              How {firm.name} Makes Money
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {moneyMakingMethods.map((method, index) => (
                                <div key={method.id || index}>
                                    <h4 className="font-semibold text-slate-800">{method.title}</h4>
                                    <p className="text-sm text-slate-600 leading-relaxed">{method.description}</p>
                                </div>
                            ))}
                            {firm.how_company_makes_money && (
                                <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed">
                                    <p>{firm.how_company_makes_money}</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}
                {firm.investment_risks && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-xl flex items-center"><AlertTriangle className="mr-2.5 h-5 w-5 text-amber-600 flex-shrink-0"/>Investment Risks</CardTitle>
                        </CardHeader>
                        <CardContent className="prose prose-slate max-w-none text-slate-700 leading-relaxed">
                            <p>{firm.investment_risks}</p>
                        </CardContent>
                    </Card>
                )}
                {clientTypes.length > 0 && (
                    <Card>
                    <CardHeader>
                        <CardTitle className="text-xl flex items-center"><UserCheck className="mr-2.5 h-5 w-5 text-blue-600 flex-shrink-0"/>Client Types</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-2">
                        {clientTypes.map((type, index) => (
                            <Badge key={index} variant="secondary" className="bg-slate-100 text-slate-700 font-normal px-2.5 py-1">
                            {type.name}
                            </Badge>
                        ))}
                        </div>
                    </CardContent>
                    </Card>
                )}
                {registrations.length > 0 && (
                    <Card>
                    <CardHeader>
                        <CardTitle className="text-xl flex items-center"><ScrollText className="mr-2.5 h-5 w-5 text-blue-600 flex-shrink-0"/>Regulatory Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-2">
                        {registrations.map((reg, index) => (
                            <Badge key={index} variant="outline" className="border-slate-300 text-slate-700 font-normal px-2.5 py-1">
                            {reg.name}
                            </Badge>
                        ))}
                        </div>
                    </CardContent>
                    </Card>
                )}
              </TabsContent>

              <TabsContent value="leadership" className="mt-2">
                {leadership.length > 0 ? (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-xl flex items-center"><Users className="mr-2.5 h-5 w-5 text-blue-600 flex-shrink-0"/>Leadership Team</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
                        {leadership.map((person, index) => (
                          <div key={index} className="flex items-start gap-4 p-4 border rounded-lg bg-slate-50/50">
                            <Avatar className="h-20 w-20 sm:h-16 sm:w-16 md:h-14 md:w-14 rounded-md">
                              <AvatarImage src={person.image_url || undefined} alt={person.name} />
                              <AvatarFallback className="bg-slate-200 text-slate-500 text-xl sm:text-base">
                                {person.name ? person.name.charAt(0) : '-'}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <h4 className="font-semibold text-slate-800">{person.name}</h4>
                              <p className="text-sm text-slate-600">{person.title}</p>
                              {person.linkedin_url && (
                                  <a href={person.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 hover:underline mt-1 inline-flex items-center">
                                      LinkedIn <ExternalLinkIcon className="ml-1 h-3 w-3" />
                                  </a>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="text-center py-8 text-slate-600">
                    <Users className="h-12 w-12 mx-auto text-slate-400 mb-3" />
                    <p>Leadership information is not yet available for this firm.</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>

          <div className="lg:w-1/3 space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg flex items-center"><FileText className="mr-2 h-4.5 w-4.5 text-blue-600 flex-shrink-0"/>Key Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-1 text-sm">
                    {renderDetailItem("Founded", firm.established ? new Date(firm.established).getFullYear().toString() : "N/A", <Landmark className="h-4 w-4 text-slate-500" />)}
                    {renderDetailItem("Headquarters", firm.headquarters, <Globe className="h-4 w-4 text-slate-500" />)}
                    {renderDetailItem("Employees", firm.employees_count, <Users className="h-4 w-4 text-slate-500" />)}
                    {renderDetailItem("AUM", firm.aum, <Coins className="h-4 w-4 text-slate-500" />)}
                    {renderDetailItem("Min. Investment", firm.minimum_investment, <PiggyBank className="h-4 w-4 text-slate-500" />)}
                    {renderDetailItem("Payout Frequency", firm.payout, <Calendar className="h-4 w-4 text-slate-500" />)}
                    {renderDetailItem("Management Fees", firm.fees, <DollarSign className="h-4 w-4 text-slate-500" />)}
                </CardContent>
            </Card>

            <Card className="bg-brand-blue text-white">
                <CardHeader>
                    <CardTitle className="text-lg">Ready to Invest?</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm opacity-90 mb-4">Get started with {firm.name} today and build a portfolio aligned with your financial goals.</p>
                    <Button asChild variant="secondary" className="w-full bg-white text-brand-blue hover:bg-slate-100">
                      <a 
                        href={firm.firm_link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center justify-center"
                      >
                        Open an Account
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </a>
                    </Button>
                </CardContent>
            </Card>

            {similarFirms.length > 0 && (
              <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Similar Investment Firms</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {similarFirms.slice(0,3).map((similarFirm: any) => (
                    <Link key={similarFirm.id} to={`/investment-firms/${similarFirm.slug}`} className="block group p-3 rounded-lg border hover:bg-mint-100 transition-colors">
                      <div className="flex items-start gap-3">
                        <Avatar className="h-10 w-10 rounded-md border bg-slate-100 flex-shrink-0">
                          <AvatarImage src={similarFirm.logo_url || undefined} alt={similarFirm.name} className="object-contain p-1"/>
                          <AvatarFallback className="bg-slate-200 text-slate-500 text-xs">{similarFirm.name ? similarFirm.name.substring(0,1) : '-'}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h4 className="text-sm font-semibold group-hover:text-brand-blue transition-colors leading-tight">{similarFirm.name}</h4>
                          <div className="text-xs text-slate-500 mt-0.5">
                            <span>Min: <span className="font-medium text-slate-700">{similarFirm.minimum_investment || "N/A"}</span></span>
                            <span className="mx-1.5">•</span>
                            <span>Return: <span className="font-medium text-slate-700">{similarFirm.target_return || "N/A"}</span></span>
                          </div>
                        </div>
                        <ChevronRight className="h-4 w-4 text-slate-400 self-center" />
                      </div>
                    </Link>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const InvestmentFirmDetailPageWrapper = () => {
  return (
    <>
      <InvestmentFirmDetailPage />
      <Footer />
    </>
  );
};

export default InvestmentFirmDetailPageWrapper;

const renderDetailItem = (label: string, value: string | number | undefined | null, icon: React.ReactNode) => {
  if (value === null || value === undefined || String(value).trim() === '') return null;
  return (
    <div className="flex justify-between items-center py-2 border-b border-slate-100 last:border-b-0">
      <div className="flex items-center gap-2 text-slate-600">
        {icon}
        <span>{label}</span>
      </div>
      <div className="font-medium text-slate-800 text-right break-words">{String(value)}</div>
    </div>
  );
};