import React from 'react';
import { Card } from '@/components/ui/card';

type Service = string | {
  id?: string;
  name: string;
};

type Props = {
  services: Service[] | null | undefined;
  advisorName?: string;
};

export const AdvisorServices = ({ services, advisorName = 'This Advisor' }: Props) => {
  // Handle loading or empty states
  if (!services || services.length === 0) {
    return null;
  }

  // Ensure services is an array before mapping
  const servicesArray = Array.isArray(services) ? services : [];

  return (
    <Card className="mb-8 p-6">
      <h2 className="text-2xl font-bold mb-8">Services {advisorName} Offers</h2>
      <div className="grid grid-cols-2 gap-4">
        {servicesArray.map((service, index) => {
          // Skip invalid service items
          if (!service) return null;
          
          const serviceName = typeof service === 'string' ? service : service?.name;
          const serviceId = typeof service === 'string' 
            ? `service-${index}` 
            : service?.id || `service-${index}`;
          
          if (!serviceName) return null;
          
          return (
            <div 
              key={serviceId}
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-blue-200 hover:bg-blue-50 transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center mr-4">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              </div>
              <span className="text-gray-800 font-medium">{serviceName}</span>
            </div>
          );
        })}
      </div>
    </Card>
  );
};
