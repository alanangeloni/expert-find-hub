import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { 
  getAdvisorBySlug, 
  getAdvisorServices, 
  getAdvisorProfessionalDesignations,
  getAdvisorCompensationTypes
} from '@/services/advisorsService';
import { MeetingRequestForm } from '@/components/advisors/MeetingRequestForm';
import { 
  Calendar, 
  MapPin, 
  Building, 
  Award, 
  Check, 
  Phone, 
  Mail, 
  Globe, 
  FileText, 
  DollarSign,
  Shield,
  MessageCircle,
  Users
} from 'lucide-react';

const AdvisorDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [isMeetingDialogOpen, setIsMeetingDialogOpen] = useState(false);
  
  const { data: advisor, isLoading: isLoadingAdvisor } = useQuery({
    queryKey: ['advisor', slug],
    queryFn: () => getAdvisorBySlug(slug || ''),
    enabled: !!slug
  });

  const { data: services = [] } = useQuery({
    queryKey: ['advisorServices', advisor?.id],
    queryFn: () => getAdvisorServices(advisor?.id || ''),
    enabled: !!advisor?.id
  });

  const { data: designations = [] } = useQuery({
    queryKey: ['advisorDesignations', advisor?.id],
    queryFn: () => getAdvisorProfessionalDesignations(advisor?.id || ''),
    enabled: !!advisor?.id
  });

  const { data: compensationTypes = [] } = useQuery({
    queryKey: ['advisorCompensation', advisor?.id],
    queryFn: () => getAdvisorCompensationTypes(advisor?.id || ''),
    enabled: !!advisor?.id
  });

  if (isLoadingAdvisor) {
    return (
      <div className="container mx-auto py-16 flex justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!advisor) {
    return (
      <div className="container mx-auto py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Advisor not found</h2>
        <p className="text-gray-600">The advisor you're looking for doesn't exist or has been removed.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="bg-gradient-to-r from-teal-600 to-blue-700 rounded-lg p-8 mb-8 text-white">
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          <div className="w-32 h-32 rounded-full bg-white/20 overflow-hidden flex-shrink-0">
            {advisor.headshot_url ? (
              <img 
                src={advisor.headshot_url} 
                alt={advisor.name} 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-white/10 text-white/70">
                Photo
              </div>
            )}
          </div>

          <div className="flex-grow">
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-3xl font-bold">{advisor.name}</h1>
              {advisor.verified && (
                <Badge className="bg-white/20 text-white border-none">
                  <Check className="h-3 w-3 mr-1" />
                  Verified
                </Badge>
              )}
            </div>
            
            <p className="text-xl opacity-90 mb-2">
              {advisor.position || "Financial Advisor"}
              {advisor.firm_name && ` at ${advisor.firm_name}`}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-sm opacity-80 mt-2">
              {advisor.city && advisor.state_hq && (
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{advisor.city}, {advisor.state_hq}</span>
                </div>
              )}
              
              {advisor.years_of_experience && (
                <div className="flex items-center">
                  <Award className="h-4 w-4 mr-1" />
                  <span>{advisor.years_of_experience} years experience</span>
                </div>
              )}
            </div>
          </div>

          <div className="md:text-right flex flex-col gap-3">
            <Dialog open={isMeetingDialogOpen} onOpenChange={setIsMeetingDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  className="bg-white text-blue-700 hover:bg-blue-50 w-full md:w-auto"
                  size="lg"
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Request Meeting
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <MeetingRequestForm
                  advisorId={advisor.id}
                  advisorName={advisor.name}
                  onSuccess={() => setIsMeetingDialogOpen(false)}
                />
              </DialogContent>
            </Dialog>

            {advisor.scheduling_link && (
              <Button 
                className="bg-green-600 text-white hover:bg-green-700 w-full md:w-auto"
                size="lg"
                onClick={() => window.open(advisor.scheduling_link, '_blank')}
              >
                <Users className="h-4 w-4 mr-2" />
                Book Direct
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* About Section */}
          <Card className="mb-8 p-6">
            <h2 className="text-2xl font-bold mb-4">About {advisor.name}</h2>
            {advisor.personal_bio ? (
              <p className="text-gray-700 whitespace-pre-line">{advisor.personal_bio}</p>
            ) : (
              <p className="text-gray-500 italic">No biography available</p>
            )}
          </Card>

          {/* Services Section */}
          {services.length > 0 && (
            <Card className="mb-8 p-6">
              <h2 className="text-2xl font-bold mb-4">Services Offered</h2>
              <div className="flex flex-wrap gap-2">
                {services.map((service, index) => (
                  <Badge key={index} variant="secondary" className="text-sm py-1 px-3">
                    {service}
                  </Badge>
                ))}
              </div>
            </Card>
          )}

          {/* About Firm Section */}
          {advisor.firm_bio && (
            <Card className="mb-8 p-6">
              <h2 className="text-2xl font-bold mb-4">
                About {advisor.firm_name || "Their Firm"}
              </h2>
              <p className="text-gray-700 whitespace-pre-line">{advisor.firm_bio}</p>
              
              {advisor.firm_name && advisor.firm_logo_url && (
                <div className="mt-4 flex items-center">
                  <img 
                    src={advisor.firm_logo_url} 
                    alt={advisor.firm_name} 
                    className="h-12 mr-3" 
                  />
                  <span className="text-lg font-medium">{advisor.firm_name}</span>
                </div>
              )}
            </Card>
          )}
        </div>

        <div>
          {/* Contact Section */}
          <Card className="mb-8 p-6">
            <h3 className="text-xl font-bold mb-4">Get in Touch</h3>
            
            {advisor.website_url && (
              <div className="flex items-center mb-6">
                <Globe className="h-5 w-5 mr-3 text-gray-500" />
                <a 
                  href={advisor.website_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Visit Website
                </a>
              </div>
            )}

            <Dialog open={isMeetingDialogOpen} onOpenChange={setIsMeetingDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                >
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
              {designations.length > 0 && (
                <div className="flex">
                  <Award className="h-5 w-5 mr-3 text-gray-500 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-sm text-gray-700 mb-1">Professional Designations</p>
                    <div className="flex flex-wrap gap-1">
                      {designations.map((designation, index) => (
                        <Badge key={index} variant="outline" className="whitespace-nowrap">
                          {designation}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {compensationTypes.length > 0 && (
                <div className="flex">
                  <DollarSign className="h-5 w-5 mr-3 text-gray-500 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-sm text-gray-700 mb-1">Compensation Structure</p>
                    <div className="flex flex-wrap gap-1">
                      {compensationTypes.map((type, index) => (
                        <Badge key={index} variant="outline" className="whitespace-nowrap">
                          {type}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {advisor.minimum && (
                <div className="flex">
                  <Building className="h-5 w-5 mr-3 text-gray-500 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-sm text-gray-700">Minimum Investment</p>
                    <p>${advisor.minimum}</p>
                  </div>
                </div>
              )}

              {advisor.fiduciary && (
                <div className="flex">
                  <Shield className="h-5 w-5 mr-3 text-gray-500 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-sm text-gray-700">Fiduciary</p>
                    <p>Yes - Legally obligated to act in your best interest</p>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* First Session Info */}
          {advisor.first_session_is_free && (
            <Card className="bg-green-50 border-green-200 mb-8 p-6">
              <h3 className="text-xl font-bold mb-2 flex items-center text-green-800">
                <Check className="h-5 w-5 mr-2" />
                First Session is Free
              </h3>
              <p className="text-green-700">
                Schedule your complimentary initial consultation to see if this advisor is right for you.
              </p>
            </Card>
          )}

          {/* CTA */}
          <Card className="p-6 text-center">
            <h3 className="text-xl font-bold mb-3">Ready to get started?</h3>
            <p className="text-gray-600 mb-4">
              Schedule a meeting to discuss your financial goals.
            </p>
            <Dialog open={isMeetingDialogOpen} onOpenChange={setIsMeetingDialogOpen}>
              <DialogTrigger asChild>
                <Button className="w-full" size="lg">
                  <Calendar className="h-4 w-4 mr-2" />
                  Request Meeting
                </Button>
              </DialogTrigger>
            </Dialog>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdvisorDetail;
