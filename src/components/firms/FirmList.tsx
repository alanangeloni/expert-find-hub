import React from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from 'react-router-dom';
import { Spinner } from "@/components/ui/spinner";
import { DollarSign, ChevronRight } from 'lucide-react';

interface FirmListProps {
  firms: any[];
  isLoading: boolean;
  formatMinimumInvestment: (value: number | null | undefined) => string;
  basePath: string;
  firmType?: 'investment' | 'accounting';
}

export function FirmList({ firms, isLoading, formatMinimumInvestment, basePath, firmType = 'investment' }: FirmListProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  if (firms.length === 0) {
    return (
      <Card className="text-center p-8">
        <h3 className="text-xl font-semibold mb-2">No firms match your criteria</h3>
        <p className="text-gray-600">Try adjusting your filters to see more results.</p>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {firms.map((firm) => (
        <Link 
          key={firm.id} 
          to={`${basePath}/${firm.slug}`} 
          className="block h-full hover:no-underline"
          aria-label={`View details for ${firm.name}`}
        >
          <Card className="h-full overflow-hidden p-5 rounded-lg border border-slate-200 hover:shadow-md transition-shadow">
            <CardHeader className="pb-2 px-2 pt-0">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  {firm.logo_url && (
                    <div className="h-10 w-10 flex-shrink-0">
                      <img 
                        src={firm.logo_url} 
                        alt={`${firm.name} logo`} 
                        className="h-full w-full object-contain"
                      />
                    </div>
                  )}
                  <div>
                    <h3 className="text-base font-semibold leading-tight text-gray-900">{firm.name}</h3>
                    <p className="text-xs text-gray-500 leading-snug">
                      {firm.headquarters && `${firm.headquarters}`}
                      {firm.established && ` • Established ${new Date(firm.established).getFullYear()}`}
                    </p>
                  </div>
                </div>
                {firm.verified && (
                  <Badge variant="outline" className="ml-1 px-2 py-0.5 text-xs bg-green-50 text-green-700 border-green-200">
                    Verified
                  </Badge>
                )}
              </div>
            </CardHeader>

            <CardContent className="pb-2 pt-0 px-2">
              {firm.description && <p className="text-gray-700 text-xs leading-snug mb-2">{firm.description}</p>}
              
              <div className="mt-1 flex flex-wrap gap-1">
                {firmType === 'accounting' ? (
                  <div className="w-full flex items-center justify-between mt-2">
                    <div className="flex items-center text-sm">
                      <DollarSign className="h-4 w-4 mr-1 text-gray-500" />
                      <span className="text-gray-700 font-medium">
                        {firm.minimum_fee ? `${firm.minimum_fee}` : 'Contact for pricing'}
                      </span>
                    </div>
                    <div className="text-sm font-medium text-brand-blue flex items-center">
                      View details <ChevronRight className="h-4 w-4 ml-1" />
                    </div>
                  </div>
                ) : (
                  <>
                    {firm.minimum_investment !== null && (
                      <Badge variant="outline" className="px-2 py-0.5 text-xs bg-mint-50 text-mint-900 border-mint-200">
                        Min: {formatMinimumInvestment(firm.minimum_investment)}
                      </Badge>
                    )}
                    {firm.aum && (
                      <Badge variant="outline" className="px-2 py-0.5 text-xs bg-mint-50 text-mint-900 border-mint-200">
                        AUM: {firm.aum}
                      </Badge>
                    )}
                    {firm.asset_classes?.map((assetClass, index) => (
                      <Badge 
                        key={index} 
                        variant="outline" 
                        className="px-2 py-0.5 text-xs bg-mint-50 text-mint-900 border-mint-200"
                      >
                        {assetClass}
                      </Badge>
                    ))}
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
