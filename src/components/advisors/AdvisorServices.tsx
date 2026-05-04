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
    <Card className="mb-8 p-6 rounded-2xl border-line">
      <h2 className="font-display text-2xl md:text-3xl text-blue mb-6">Services {advisorName} Offers</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {servicesArray.map((service, index) => {
          if (!service) return null;
          const serviceName = typeof service === 'string' ? service : service?.name;
          const serviceId = typeof service === 'string'
            ? `service-${index}`
            : service?.id || `service-${index}`;
          if (!serviceName) return null;
          return (
            <div
              key={serviceId}
              className="flex items-center p-4 border border-line rounded-xl hover:border-aqua hover:bg-aqua-soft/40 transition-colors"
            >
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-mint to-aqua flex items-center justify-center mr-3 flex-shrink-0">
                <div className="w-2 h-2 bg-white rounded-full" />
              </div>
              <span className="text-ink font-medium text-[15px]">{serviceName}</span>
            </div>
          );
        })}
      </div>
    </Card>
  );
};
