
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Building, ChevronRight, DollarSign, Search, Star } from "lucide-react";
import { Link } from "react-router-dom";

export default function InvestmentFirmsPage() {
  // Sample investment firms data
  const firms = [
    {
      id: "vanguard",
      name: "Vanguard",
      logo: "/placeholder.svg",
      description:
        "One of the world's largest investment companies, offering low-cost mutual funds, ETFs, advice, and related services.",
      assetClasses: ["Equities", "Fixed Income", "Multi-Asset"],
      minimumInvestment: "$1,000",
      targetReturn: "6% - 10%",
      rating: 4.7,
      reviewCount: 203,
      aum: "$7.2 trillion",
      headquarters: "Valley Forge, PA",
      verified: true,
    },
    {
      id: "blackrock",
      name: "BlackRock",
      logo: "/placeholder.svg",
      description:
        "Global investment manager and technology provider helping investors achieve financial well-being.",
      assetClasses: ["Equities", "Fixed Income", "Alternatives", "Multi-Asset"],
      minimumInvestment: "$1,000",
      targetReturn: "7% - 12%",
      rating: 4.8,
      reviewCount: 156,
      aum: "$9.1 trillion",
      headquarters: "New York, NY",
      verified: true,
    },
    {
      id: "fidelity",
      name: "Fidelity Investments",
      logo: "/placeholder.svg",
      description:
        "Financial services corporation offering investment management, retirement planning, and more.",
      assetClasses: ["Equities", "Fixed Income", "Alternatives", "Multi-Asset"],
      minimumInvestment: "$0",
      targetReturn: "7% - 11%",
      rating: 4.6,
      reviewCount: 178,
      aum: "$4.5 trillion",
      headquarters: "Boston, MA",
      verified: true,
    },
  ];

  // Asset class categories
  const assetClasses = ["All", "Equities", "Fixed Income", "Multi-Asset", "Alternatives", "Real Estate"];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="container mx-auto py-8 px-4 md:px-6">
        {/* Page Header */}
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Investment Firms</h1>
          <p className="text-slate-600 max-w-3xl">
            Discover and compare top investment firms offering a range of investment products and services tailored to
            meet your financial goals.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 mb-8">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search investment firms..."
                  className="pl-10 bg-slate-50 border-slate-200"
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium">Filter by minimum investment</div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                <Button variant="outline" size="sm" className="text-xs">
                  No Minimum
                </Button>
                <Button variant="outline" size="sm" className="text-xs">
                  Under $10k
                </Button>
                <Button variant="outline" size="sm" className="text-xs">
                  $10k+
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Asset Class Tabs */}
        <div className="mb-8">
          <Tabs defaultValue="All">
            <TabsList className="h-auto flex-wrap justify-start w-full">
              {assetClasses.map((assetClass) => (
                <TabsTrigger key={assetClass} value={assetClass} className="text-sm">
                  {assetClass}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {/* Investment Firms List */}
        <div className="space-y-5">
          {firms.map((firm) => (
            <Link key={firm.id} to={`/investment-firms/${firm.id}`} className="block">
              <Card className="overflow-hidden border-slate-200 hover:shadow-md transition-shadow">
                <CardContent className="p-0">
                  <div className="grid md:grid-cols-4 gap-4 p-6">
                    <div className="col-span-2">
                      <div className="flex items-start gap-4 mb-2">
                        <div className="h-12 w-12 rounded-lg overflow-hidden bg-slate-100 flex items-center justify-center flex-shrink-0">
                          <img
                            src={firm.logo}
                            alt={firm.name}
                            className="h-8 w-8 object-contain"
                          />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h2 className="text-xl font-semibold">{firm.name}</h2>
                            {firm.verified && (
                              <span className="text-blue-500">
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
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < Math.floor(firm.rating)
                                      ? "fill-yellow-400 text-yellow-400"
                                      : "text-slate-300"
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-sm font-medium">{firm.rating}</span>
                            <span className="text-xs text-slate-500">({firm.reviewCount} reviews)</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-slate-600 text-sm mb-3">{firm.description}</p>
                      <div className="flex flex-wrap gap-1.5">
                        {firm.assetClasses.map((asset) => (
                          <Badge
                            key={asset}
                            variant="secondary"
                            className="px-2 py-0.5 text-xs bg-slate-100"
                          >
                            {asset}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <div className="text-xs text-slate-500 mb-1">Minimum Investment</div>
                        <div className="font-semibold flex items-center gap-1">
                          <DollarSign className="h-4 w-4 text-emerald-600" />
                          {firm.minimumInvestment}
                        </div>
                      </div>
                      <Separator />
                      <div>
                        <div className="text-xs text-slate-500 mb-1">Target Return</div>
                        <div className="font-semibold">{firm.targetReturn}</div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="space-y-3 w-full">
                        <div>
                          <div className="text-xs text-slate-500 mb-1">Assets Under Management</div>
                          <div className="font-semibold">{firm.aum}</div>
                        </div>
                        <Separator />
                        <div>
                          <div className="text-xs text-slate-500 mb-1">Headquarters</div>
                          <div className="flex items-center gap-1">
                            <Building className="h-3.5 w-3.5 text-slate-400" />
                            <span className="font-semibold">{firm.headquarters}</span>
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
