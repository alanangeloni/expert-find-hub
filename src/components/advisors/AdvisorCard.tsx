
import React from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { MapPin, Award, Check, DollarSign } from 'lucide-react';
import { Advisor } from '@/services/advisorsService';

interface AdvisorCardProps {
  advisor: Advisor;
}

export const AdvisorCard = ({ advisor }: AdvisorCardProps) => {
  return (
    <Link to={`/advisors/${advisor.slug}`}>
      <Card className="h-full overflow-hidden hover:shadow-lg transition-shadow duration-300">
        <div className="p-4">
          <div className="flex items-start gap-4">
            <div className="w-20 h-20 rounded-full bg-slate-200 overflow-hidden flex-shrink-0">
              {advisor.headshot_url ? (
                <img 
                  src={advisor.headshot_url} 
                  alt={advisor.name} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400">
                  Photo
                </div>
              )}
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
                {advisor.name}
                {advisor.verified && (
                  <Badge variant="outline" className="ml-2 bg-blue-50 text-blue-700 border-blue-200">
                    <Check className="h-3 w-3 mr-1" />
                    Verified
                  </Badge>
                )}
              </h3>
              <p className="text-sm text-gray-600">
                {advisor.position || "Financial Advisor"}
              </p>
              <p className="text-sm font-medium text-gray-700 mt-1">
                {advisor.firm_name || "Independent Advisor"}
              </p>
              {advisor.city && advisor.state_hq && (
                <div className="flex items-center mt-2 text-sm text-gray-500">
                  <MapPin className="h-4 w-4 mr-1 text-gray-400" />
                  <span>{advisor.city}, {advisor.state_hq}</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex justify-between items-center">
              <div>
                {advisor.minimum && (
                  <p className="text-xs text-gray-500">
                    <span className="font-medium">
                      <DollarSign className="h-3 w-3 inline-block mr-1" />
                      {advisor.minimum === "0" ? "No Minimum" : `$${advisor.minimum} min`}
                    </span>
                  </p>
                )}
              </div>
              {advisor.years_of_experience && (
                <div className="flex items-center">
                  <Award className="h-4 w-4 mr-1 text-amber-500" />
                  <span className="text-xs font-medium">{advisor.years_of_experience} yrs exp.</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
};
