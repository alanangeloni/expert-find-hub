
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { type InvestmentFirm } from "@/services/investmentFirmsService";
import { Spinner } from "@/components/ui/spinner";

interface FirmListProps {
  firms: InvestmentFirm[];
  isLoading: boolean;
  formatMinimumInvestment: (value: number | null | undefined) => string;
}

export function FirmList({ firms, isLoading, formatMinimumInvestment }: FirmListProps) {
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
        <Card key={firm.id} className="overflow-hidden p-5 rounded-lg border border-slate-200 flex flex-col h-full">
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
                  <h3 className="text-base font-semibold leading-tight">{firm.name}</h3>
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
              {firm.minimum_investment !== null && (
                <Badge variant="outline" className="px-2 py-0.5 text-xs bg-blue-50 text-blue-700 border-blue-200">
                  Min: {formatMinimumInvestment(firm.minimum_investment)}
                </Badge>
              )}
              {firm.aum && (
                <Badge variant="outline" className="px-2 py-0.5 text-xs bg-purple-50 text-purple-700 border-purple-200">
                  AUM: {firm.aum}
                </Badge>
              )}
              {firm.asset_classes && firm.asset_classes.length > 0 && firm.asset_classes.map((assetClass, index) => (
                <Badge 
                  key={index} 
                  variant="outline" 
                  className="px-2 py-0.5 text-xs bg-amber-50 text-amber-700 border-amber-200"
                >
                  {assetClass}
                </Badge>
              ))}
            </div>
          </CardContent>
          
          <CardFooter className="pt-0 px-2 pb-2 mt-auto">
            <Button asChild variant="default" className="h-8 px-5 text-base rounded-full font-semibold" style={{ backgroundColor: '#004C6D', color: '#fff' }}>
              <Link to={`/investment-firms/${firm.slug}`}>View Details</Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
