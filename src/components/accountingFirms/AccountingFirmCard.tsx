
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building, Star } from 'lucide-react';
import type { AccountingFirm } from '@/services/accountingFirmsService';

interface AccountingFirmCardProps {
  firm: AccountingFirm;
}

export const AccountingFirmCard = ({ firm }: AccountingFirmCardProps) => {
  return (
    <Link to={`/accounting-firms/${firm.slug}`}>
      <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              {firm.logo_url ? (
                <img
                  src={firm.logo_url}
                  alt={`${firm.name} logo`}
                  className="w-12 h-12 rounded-lg object-contain"
                />
              ) : (
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Building className="w-6 h-6 text-gray-400" />
                </div>
              )}
              <div>
                <h3 className="font-semibold text-lg text-gray-900 line-clamp-1">
                  {firm.name}
                </h3>
                {firm.headquarters && (
                  <p className="text-sm text-gray-500">{firm.headquarters}</p>
                )}
              </div>
            </div>
            {firm.verified && (
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Verified
              </Badge>
            )}
          </div>

          {firm.description && (
            <p className="text-gray-600 text-sm mb-4 line-clamp-3">
              {firm.description}
            </p>
          )}

          <div className="flex items-center justify-between">
            {firm.minimum_fee && (
              <div className="text-sm">
                <span className="text-gray-500">Minimum: </span>
                <span className="font-medium">{firm.minimum_fee}</span>
              </div>
            )}
            
            {firm.rating && (
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="text-sm font-medium">{firm.rating}</span>
                {firm.review_count && (
                  <span className="text-sm text-gray-500">({firm.review_count})</span>
                )}
              </div>
            )}
          </div>

          {firm.services && firm.services.length > 0 && (
            <div className="mt-4">
              <div className="flex flex-wrap gap-1">
                {firm.services.slice(0, 3).map((service, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {service}
                  </Badge>
                ))}
                {firm.services.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{firm.services.length - 3} more
                  </Badge>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
};
