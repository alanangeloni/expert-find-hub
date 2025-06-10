
import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getAdvisors } from '@/services/advisorsService';
import { getAccountingFirms } from '@/services/accountingFirmsService';
import { AdvisorCard } from '@/components/advisors/AdvisorCard';
import { AccountingFirmCard } from '@/components/accountingFirms/AccountingFirmCard';

const IndexPage = () => {
  const { data: advisors = [], isLoading: advisorsLoading } = useQuery({
    queryKey: ['featuredAdvisors'],
    queryFn: () => getAdvisors({ page: 1, pageSize: 6 })
  });

  const { data: accountingFirms = [], isLoading: accountingFirmsLoading } = useQuery({
    queryKey: ['featuredAccountingFirms'],
    queryFn: () => getAccountingFirms()
  });

  return (
    <div>
      {/* Hero Section */}
      <section className="py-20 bg-brand-blue text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Your Path to Financial Success Starts Here</h1>
          <p className="text-lg mb-8">Find trusted financial advisors and accounting firms to help you achieve your goals.</p>
          <Link to="/advisors" className="bg-brand-teal text-brand-blue font-bold py-3 px-8 rounded-full hover:bg-teal-300 transition-colors">
            Find an Advisor
          </Link>
        </div>
      </section>

      {/* Featured Advisors Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Featured Financial Advisors</h2>
          {advisorsLoading ? (
            <div className="text-center">Loading advisors...</div>
          ) : advisors && advisors.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {advisors.slice(0, 6).map((advisor) => (
                <AdvisorCard key={advisor.id} advisor={advisor} />
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-600">No advisors available at the moment.</div>
          )}
        </div>
      </section>

      {/* Featured Accounting Firms Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Featured Accounting Firms</h2>
          {accountingFirmsLoading ? (
            <div className="text-center">Loading accounting firms...</div>
          ) : accountingFirms && accountingFirms.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {accountingFirms.slice(0, 6).map((firm) => (
                <AccountingFirmCard key={firm.id} firm={firm} />
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-600">No accounting firms available at the moment.</div>
          )}
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 bg-brand-teal text-brand-blue">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Take Control of Your Finances?</h2>
          <p className="text-lg mb-8">Explore our resources and connect with professionals who can guide you.</p>
          <div className="flex justify-center gap-4">
            <Link to="/advisors" className="bg-white font-bold py-3 px-8 rounded-full hover:bg-gray-100 transition-colors">
              Find an Advisor
            </Link>
            <Link to="/accounting-firms" className="bg-white font-bold py-3 px-8 rounded-full hover:bg-gray-100 transition-colors">
              Find an Accounting Firm
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default IndexPage;
