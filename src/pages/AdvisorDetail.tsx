
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from '@/components/ui/dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { getAdvisorBySlug, Advisor } from '@/services/advisorsService';
import { MeetingRequestForm } from '@/components/advisors/MeetingRequestForm';
import { AdvisorServices } from '@/components/advisors/AdvisorServices';
import { Calendar, MapPin, Building, Award, Star, Check, Phone, Mail, Globe, FileText, DollarSign, Shield, MessageCircle, Users } from 'lucide-react';

const AdvisorDetail = () => {
  const {
    slug
  } = useParams<{
    slug: string;
  }>();
  const [isMeetingDialogOpen, setIsMeetingDialogOpen] = useState(false);
  const {
    data: advisor,
    isLoading: isLoadingAdvisor
  } = useQuery({
    queryKey: ['advisor', slug],
    queryFn: () => getAdvisorBySlug(slug || ''),
    enabled: !!slug
  });

  if (isLoadingAdvisor) {
    return <div className="container mx-auto py-16 flex justify-center">
        <Spinner size="lg" />
      </div>;
  }
  if (!advisor) {
    return <div className="container mx-auto py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Advisor not found</h2>
        <p className="text-gray-600">The advisor you're looking for doesn't exist or has been removed.</p>
      </div>;
  }
  return <div className="min-h-screen bg-slate-50">
      {/* Hero section */}
      <div className="bg-white border-b">
        <div className="container mx-auto py-8 px-4">
          <div className="flex flex-col md:flex-row items-start gap-6 md:gap-8">
            {/* Profile Image */}
            <div className="h-24 w-24 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
              {advisor.headshot_url ? <img src={advisor.headshot_url} alt={advisor.name} className="h-full w-full object-cover" /> : <Users className="h-10 w-10 text-slate-400" />}
            </div>

            {/* Profile Info and Actions */}
            <div className="flex-1 flex flex-col md:flex-row justify-between gap-6">
              {/* Profile Details */}
              <div className="space-y-3">
              {/* Name and Verification */}
              <div className="flex items-center gap-2">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{advisor.name}</h1>
                {advisor.verified && <span className="text-blue-500" title="Verified Professional">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                      <path fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                    </svg>
                  </span>}
              </div>
              
              {/* Position and Firm */}
              {(advisor.position || advisor.firm_name) && <p className="text-gray-700">
                  {advisor.position || "Financial Advisor"}
                  {advisor.firm_name && <span className="text-gray-600"> at {advisor.firm_name}</span>}
                </p>}
              
              {/* Location and Experience */}
              <div className="flex flex-wrap items-center gap-4 text-gray-600 text-sm">
                {advisor.city && advisor.state_hq && <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1.5" />
                    <span>{advisor.city}, {advisor.state_hq}</span>
                  </div>}
                
                {advisor.years_of_experience && <div className="flex items-center">
                    <Award className="h-4 w-4 mr-1.5" />
                    <span>{advisor.years_of_experience} years experience</span>
                  </div>}
              </div>
              
              </div>

              {/* Action Buttons - Right Aligned */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2 md:pt-0 md:items-center">
                <Dialog open={isMeetingDialogOpen} onOpenChange={setIsMeetingDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-[#1a365d] hover:bg-[#2c5282] text-white w-full sm:w-auto transition-colors duration-200" size="lg">
                      <Calendar className="h-4 w-4 mr-2" />
                      Request Meeting
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <VisuallyHidden>
                      <DialogTitle>Schedule a Meeting with {advisor.name}</DialogTitle>
                    </VisuallyHidden>
                    <MeetingRequestForm advisorId={advisor.id} advisorName={advisor.name} onSuccess={() => setIsMeetingDialogOpen(false)} />
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-12 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-8">
              {/* About Section */}
              <Card className="p-6">
                <h2 className="text-2xl font-bold mb-4">About {advisor.name}</h2>
                {advisor.personal_bio ? <p className="text-gray-700 whitespace-pre-line">{advisor.personal_bio}</p> : <p className="text-gray-500 italic">No biography available</p>}
              </Card>

          {/* Services Section */}
          {advisor.advisor_services && advisor.advisor_services.length > 0 && <div className="mb-8">
              <AdvisorServices services={advisor.advisor_services} advisorName={advisor.name} />
            </div>}

          {/* About Firm Section */}
          {advisor.firm_bio && <Card className="mb-8 p-6">
              <h2 className="text-2xl font-bold mb-4">
                About {advisor.firm_name || "Their Firm"}
              </h2>
              <p className="text-gray-700 whitespace-pre-line">{advisor.firm_bio}</p>
              
              {advisor.firm_name && advisor.firm_logo_url && <div className="mt-4 flex items-center">
                  <img src={advisor.firm_logo_url} alt={advisor.firm_name} className="h-12 mr-3" />
                  <span className="text-lg font-medium">{advisor.firm_name}</span>
                </div>}
            </Card>}
        </div>

        <div>
          {/* Contact Section */}
          <Card className="mb-8 p-6">
            <h3 className="text-xl font-bold mb-4">Get in Touch</h3>
            
            {advisor.website_url && <div className="flex items-center mb-6">
                <Globe className="h-5 w-5 mr-3 text-gray-500" />
                <a href={advisor.website_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  Visit Website
                </a>
              </div>}

            <Dialog open={isMeetingDialogOpen} onOpenChange={setIsMeetingDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full justify-start">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Request Meeting
                </Button>
              </DialogTrigger>
            </Dialog>
          </Card>

          {/* Professional Details */}
          <Card className="mb-8 p-6">
            <h3 className="text-xl font-bold mb-4">Professional Details</h3>
            
            <div className="space-y-4">
              {advisor.professional_designations && advisor.professional_designations.length > 0 && <div className="flex">
                  <Award className="h-5 w-5 mr-3 text-gray-500 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-sm text-gray-700 mb-1">Professional Designations</p>
                    <div className="flex flex-wrap gap-1">
                      {advisor.professional_designations.map((designation, index) => <Badge key={index} variant="outline" className="whitespace-nowrap">
                          {designation}
                        </Badge>)}
                    </div>
                  </div>
                </div>}

              {advisor.compensation && advisor.compensation.length > 0 && <div className="flex">
                  <DollarSign className="h-5 w-5 mr-3 text-gray-500 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-sm text-gray-700 mb-1">Compensation Structure</p>
                    <div className="flex flex-wrap gap-1">
                      {advisor.compensation.map((type, index) => <Badge key={index} variant="outline" className="whitespace-nowrap">
                          {type}
                        </Badge>)}
                    </div>
                  </div>
                </div>}

              {advisor.minimum && <div className="flex">
                  <Building className="h-5 w-5 mr-3 text-gray-500 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-sm text-gray-700">Minimum Investment</p>
                    <p>${advisor.minimum}</p>
                  </div>
                </div>}

              {advisor.fiduciary && <div className="flex">
                  <Shield className="h-5 w-5 mr-3 text-gray-500 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-sm text-gray-700">Fiduciary</p>
                    <p>Legally obligated to act in your best interest</p>
                  </div>
                </div>}

              {advisor.licenses && advisor.licenses.length > 0 && <div className="flex">
                  <FileText className="h-5 w-5 mr-3 text-gray-500 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-sm text-gray-700 mb-1">Licenses</p>
                    <div className="flex flex-wrap gap-1">
                      {advisor.licenses.map((license, index) => (
                        <Badge key={index} variant="outline" className="whitespace-nowrap">
                          {license}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>}
            </div>
          </Card>

              {/* CTA */}
              <Card className="p-6 text-center">
                <h3 className="text-xl font-bold mb-3">Ready to get started?</h3>
                <p className="text-gray-600 mb-4">
                  Schedule a meeting to discuss your financial goals.
                </p>
                <Dialog open={isMeetingDialogOpen} onOpenChange={setIsMeetingDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="w-full bg-[#1a365d] hover:bg-[#2c5282] transition-colors duration-200" size="lg">
                      <Calendar className="h-4 w-4 mr-2" />
                      Request Meeting
                    </Button>
                  </DialogTrigger>
                </Dialog>
              </Card>
            </div>
          </div>
        </div>
        
        {/* Disclaimer Section */}
        {advisor.disclaimer && (
          <div className="lg:col-span-2">
            <div className="px-4">
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mt-8">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Disclaimer</h3>
                <p className="text-gray-600 text-sm whitespace-pre-line">{advisor.disclaimer}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>;
};
const AdvisorDetailPage = () => {
  return (
    <>
      <AdvisorDetail />
    </>
  );
};

export default AdvisorDetailPage;
