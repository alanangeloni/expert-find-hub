
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
    <div className="space-y-6">
      {firms.map((firm) => (
        <Card key={firm.id} className="overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div className="flex items-center space-x-4">
                {firm.logo_url && (
                  <div className="h-16 w-16 flex-shrink-0">
                    <img 
                      src={firm.logo_url} 
                      alt={`${firm.name} logo`} 
                      className="h-full w-full object-contain"
                    />
                  </div>
                )}
                <div>
                  <h3 className="text-xl font-semibold">{firm.name}</h3>
                  <p className="text-sm text-gray-500">
                    {firm.headquarters && `${firm.headquarters}`}
                    {firm.established && ` • Established ${new Date(firm.established).getFullYear()}`}
                  </p>
                </div>
              </div>
              {firm.verified && (
                <Badge variant="outline" className="ml-2 bg-green-50 text-green-700 border-green-200">
                  Verified
                </Badge>
              )}
            </div>
          </CardHeader>

          <CardContent className="pb-3">
            {firm.description && <p className="text-gray-700">{firm.description}</p>}
            
            <div className="mt-4 flex flex-wrap gap-2">
              {firm.minimum_investment !== null && (
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  Min: {formatMinimumInvestment(firm.minimum_investment)}
                </Badge>
              )}
              {firm.aum && (
                <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                  AUM: {firm.aum}
                </Badge>
              )}
            </div>
          </CardContent>
          
          <CardFooter className="pt-0">
            <Button asChild variant="default">
              <Link to={`/investment-firms/${firm.slug}`}>View Details</Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
