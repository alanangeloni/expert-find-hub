import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from '@/components/ui/dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { getAdvisorBySlug } from '@/services/advisorsService';
import { MeetingRequestForm } from '@/components/advisors/MeetingRequestForm';
import { AdvisorServices } from '@/components/advisors/AdvisorServices';
import { Seo } from '@/components/seo/Seo';
import {
  Calendar, MapPin, Award, ShieldCheck, Globe,
  FileText, DollarSign, Shield, MessageCircle, Users, Building
} from 'lucide-react';

const ACCENTS: Array<[string, string]> = [
  ['hsl(var(--aqua))', 'hsl(var(--blue))'],
  ['hsl(var(--mint))', 'hsl(var(--aqua))'],
  ['hsl(var(--blue-3))', 'hsl(var(--blue))'],
  ['hsl(var(--mint-2))', 'hsl(var(--blue))'],
];
const getInitials = (name: string) =>
  name.split(' ').filter(Boolean).slice(0, 2).map(n => n[0]?.toUpperCase()).join('');

const AdvisorDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [isMeetingDialogOpen, setIsMeetingDialogOpen] = useState(false);
  const { data: advisor, isLoading } = useQuery({
    queryKey: ['advisor', slug],
    queryFn: () => getAdvisorBySlug(slug || ''),
    enabled: !!slug,
  });

  if (isLoading) {
    return (
      <div className="container mx-auto py-16 flex justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!advisor) {
    return (
      <div className="container mx-auto py-16 text-center">
        <h1 className="font-display text-3xl text-blue mb-3">Advisor not found</h1>
        <p className="text-muted-foreground">The advisor you're looking for doesn't exist or has been removed.</p>
      </div>
    );
  }

  const accentIdx = (advisor.id?.charCodeAt(0) ?? 0) % ACCENTS.length;
  const [a1, a2] = ACCENTS[accentIdx];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue via-blue-3 to-aqua text-white">
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage:
              'radial-gradient(circle at 20% 30%, white 1px, transparent 1px), radial-gradient(circle at 80% 70%, white 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
        <div className="container mx-auto px-4 py-12 md:py-16 relative">
          <div className="flex flex-col md:flex-row items-start gap-6 md:gap-8">
            {/* Avatar */}
            <div
              className="h-24 w-24 md:h-28 md:w-28 rounded-2xl flex items-center justify-center text-white font-semibold text-2xl flex-shrink-0 overflow-hidden ring-4 ring-white/15 shadow-[var(--shadow-lg)]"
              style={{ background: `linear-gradient(135deg, ${a1}, ${a2})` }}
            >
              {advisor.headshot_url ? (
                <img src={advisor.headshot_url} alt={advisor.name} className="h-full w-full object-cover" />
              ) : (
                getInitials(advisor.name) || <Users className="h-10 w-10" />
              )}
            </div>

            {/* Identity + actions */}
            <div className="flex-1 flex flex-col md:flex-row justify-between gap-6 w-full">
              <div className="space-y-3">
                {advisor.fiduciary && (
                  <span className="inline-flex items-center gap-1.5 text-[12px] font-semibold uppercase tracking-wider bg-mint/20 text-mint px-2.5 py-1 rounded-full border border-mint/30">
                    <ShieldCheck className="h-3.5 w-3.5" /> Verified fiduciary
                  </span>
                )}
                <h1 className="font-display text-3xl md:text-5xl font-medium tracking-tight text-white">
                  {advisor.name}
                </h1>
                {(advisor.position || advisor.firm_name) && (
                  <p className="text-white/85 text-base md:text-lg">
                    {advisor.position || 'Financial Advisor'}
                    {advisor.firm_name && <span className="text-white/70"> at {advisor.firm_name}</span>}
                  </p>
                )}
                <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-white/80 text-sm pt-1">
                  {advisor.city && advisor.state_hq && (
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1.5" />
                      <span>{advisor.city}, {advisor.state_hq}</span>
                    </div>
                  )}
                  {advisor.years_of_experience && (
                    <div className="flex items-center">
                      <Award className="h-4 w-4 mr-1.5" />
                      <span>{advisor.years_of_experience} years experience</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 md:items-center">
                <Dialog open={isMeetingDialogOpen} onOpenChange={setIsMeetingDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      size="lg"
                      className="bg-mint text-blue hover:bg-mint-2 hover:text-white font-semibold w-full sm:w-auto rounded-full px-6"
                    >
                      <Calendar className="h-4 w-4 mr-2" />
                      Request Meeting
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <VisuallyHidden>
                      <DialogTitle>Schedule a Meeting with {advisor.name}</DialogTitle>
                    </VisuallyHidden>
                    <MeetingRequestForm
                      advisorId={advisor.id}
                      advisorName={advisor.name}
                      onSuccess={() => setIsMeetingDialogOpen(false)}
                    />
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main */}
      <div className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left */}
            <div className="lg:col-span-2 space-y-8">
              <Card className="p-6 md:p-8 rounded-2xl border-line">
                <span className="eyebrow mb-3">About</span>
                <h2 className="font-display text-2xl md:text-3xl text-blue mt-3 mb-4">About {advisor.name}</h2>
                {advisor.personal_bio ? (
                  <p className="text-ink-3 whitespace-pre-line leading-relaxed">{advisor.personal_bio}</p>
                ) : (
                  <p className="text-muted-foreground italic">No biography available</p>
                )}
              </Card>

              {advisor.advisor_services && advisor.advisor_services.length > 0 && (
                <AdvisorServices services={advisor.advisor_services} advisorName={advisor.name} />
              )}

              {advisor.firm_bio && (
                <Card className="p-6 md:p-8 rounded-2xl border-line">
                  <span className="eyebrow mb-3">The Firm</span>
                  <h2 className="font-display text-2xl md:text-3xl text-blue mt-3 mb-4">
                    About {advisor.firm_name || 'Their Firm'}
                  </h2>
                  <p className="text-ink-3 whitespace-pre-line leading-relaxed">{advisor.firm_bio}</p>
                  {advisor.firm_name && advisor.firm_logo_url && (
                    <div className="mt-6 flex items-center">
                      <img src={advisor.firm_logo_url} alt={advisor.firm_name} className="h-12 mr-3" />
                    </div>
                  )}
                </Card>
              )}

              {advisor.disclaimer && (
                <div className="bg-sand-2/50 p-6 rounded-2xl border border-line">
                  <h3 className="font-display text-lg text-blue mb-3">Disclaimer</h3>
                  <p className="text-muted-foreground text-sm whitespace-pre-line leading-relaxed">{advisor.disclaimer}</p>
                </div>
              )}
            </div>

            {/* Right */}
            <aside className="space-y-6">
              <Card className="p-6 rounded-2xl border-line">
                <h3 className="font-display text-xl text-blue mb-4">Get in Touch</h3>
                {advisor.website_url && (
                  <a
                    href={advisor.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 mb-4 text-aqua hover:text-blue transition-colors"
                  >
                    <Globe className="h-5 w-5" />
                    Visit Website
                  </a>
                )}
                <Dialog open={isMeetingDialogOpen} onOpenChange={setIsMeetingDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full justify-start border-line rounded-full">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Request Meeting
                    </Button>
                  </DialogTrigger>
                </Dialog>
              </Card>

              <Card className="p-6 rounded-2xl border-line">
                <h3 className="font-display text-xl text-blue mb-5">Professional Details</h3>
                <div className="space-y-5">
                  {advisor.professional_designations && advisor.professional_designations.length > 0 && (
                    <div className="flex">
                      <Award className="h-5 w-5 mr-3 text-aqua flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-sm text-ink mb-2">Designations</p>
                        <div className="flex flex-wrap gap-1.5">
                          {advisor.professional_designations.map((d, i) => (
                            <Badge key={i} variant="outline" className="bg-aqua-soft text-blue border-aqua/30 font-semibold">
                              {d}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {advisor.compensation && advisor.compensation.length > 0 && (
                    <div className="flex">
                      <DollarSign className="h-5 w-5 mr-3 text-aqua flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-sm text-ink mb-2">Compensation</p>
                        <div className="flex flex-wrap gap-1.5">
                          {advisor.compensation.map((c, i) => (
                            <Badge key={i} variant="outline" className="border-line">
                              {c}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {advisor.minimum && (
                    <div className="flex">
                      <Building className="h-5 w-5 mr-3 text-aqua flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-sm text-ink">Minimum Investment</p>
                        <p className="text-ink-3">${advisor.minimum}</p>
                      </div>
                    </div>
                  )}

                  {advisor.fiduciary && (
                    <div className="flex">
                      <Shield className="h-5 w-5 mr-3 text-mint-2 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-sm text-ink">Fiduciary</p>
                        <p className="text-ink-3 text-sm">Legally obligated to act in your best interest</p>
                      </div>
                    </div>
                  )}

                  {advisor.licenses && advisor.licenses.length > 0 && (
                    <div className="flex">
                      <FileText className="h-5 w-5 mr-3 text-aqua flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-sm text-ink mb-2">Licenses</p>
                        <div className="flex flex-wrap gap-1.5">
                          {advisor.licenses.map((l, i) => (
                            <Badge key={i} variant="outline" className="border-line">
                              {l}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </Card>

              <Card className="p-6 rounded-2xl text-center bg-gradient-to-br from-blue to-aqua text-white border-none">
                <h3 className="font-display text-xl mb-2 text-white">Ready to get started?</h3>
                <p className="text-white/80 mb-4 text-sm">Schedule a meeting to discuss your goals.</p>
                <Dialog open={isMeetingDialogOpen} onOpenChange={setIsMeetingDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      size="lg"
                      className="w-full bg-mint text-blue hover:bg-mint-2 hover:text-white font-semibold rounded-full"
                    >
                      <Calendar className="h-4 w-4 mr-2" />
                      Request Meeting
                    </Button>
                  </DialogTrigger>
                </Dialog>
              </Card>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
};

const AdvisorDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: advisor } = useQuery({
    queryKey: ['advisor', slug],
    queryFn: () => getAdvisorBySlug(slug || ''),
    enabled: !!slug,
  });

  const pageTitle = advisor?.name || 'Financial Advisor';
  const pageDescription = advisor
    ? `${advisor.position || 'Financial Advisor'} at ${advisor.firm_name || 'their firm'}. ${advisor.personal_bio?.substring(0, 155) || 'Contact for professional financial advice'}...`
    : 'Professional financial advisor profile and contact information.';

  return (
    <>
      <Seo title={pageTitle} description={pageDescription} canonicalUrl={`https://yoursite.com/advisors/${slug}`} />
      <AdvisorDetail />
    </>
  );
};

export default AdvisorDetailPage;
