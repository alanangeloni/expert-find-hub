
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { advisorServices } from '@/constants/advisorServices';

const advisorSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  firm_name: z.string().min(1, 'Firm name is required'),
  position: z.string().min(1, 'Position is required'),
  personal_bio: z.string().min(50, 'Personal bio must be at least 50 characters'),
  firm_bio: z.string().min(50, 'Firm bio must be at least 50 characters'),
  email: z.string().email('Invalid email address'),
  phone_number: z.string().min(1, 'Phone number is required'),
  years_of_experience: z.number().min(0, 'Years of experience must be positive'),
  state_hq: z.string().min(1, 'State is required'),
  advisor_services: z.array(z.string()).min(1, 'Select at least one service'),
  licenses: z.array(z.string()).optional(),
  certifications: z.array(z.string()).optional(),
  advisor_sec_crd: z.string().optional(),
  firm_sec_crd: z.string().optional(),
  advisor_finra_brokercheck: z.string().optional(),
  firm_finra_brokercheck: z.string().optional(),
  linkedin_url: z.string().optional(),
  website_url: z.string().optional(),
  facebook_url: z.string().optional(),
  twitter_url: z.string().optional(),
  youtube_video_id: z.string().optional(),
});

type AdvisorFormData = z.infer<typeof advisorSchema>;

interface AdvisorFormProps {
  onSuccess: () => void;
}

export const AdvisorForm: React.FC<AdvisorFormProps> = ({ onSuccess }) => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<AdvisorFormData>({
    resolver: zodResolver(advisorSchema),
    defaultValues: {
      name: '',
      firm_name: '',
      position: '',
      personal_bio: '',
      firm_bio: '',
      email: '',
      phone_number: '',
      years_of_experience: 0,
      state_hq: '',
      advisor_services: [],
      licenses: [],
      certifications: [],
      advisor_sec_crd: '',
      firm_sec_crd: '',
      advisor_finra_brokercheck: '',
      firm_finra_brokercheck: '',
      linkedin_url: '',
      website_url: '',
      facebook_url: '',
      twitter_url: '',
      youtube_video_id: '',
    },
  });

  const licensesOptions = [
    'Annuities', 'Health/Disability Insurance', 'Home & Auto', 'Insurance',
    'Life/Accident/Health', 'Life & Health', 'Life & Disability', 'Life Insurance',
    'Long Term Care', 'Series 3', 'Series 6', 'Series 7', 'Series 24',
    'Series 26', 'Series 31', 'Series 63', 'Series 65', 'Series 66',
    'Series 79', 'Series 99', 'SIE'
  ];

  const certificationsOptions = [
    'CFP', 'CFA', 'ChFC', 'CLU', 'CRPC', 'CRPS', 'FRM', 'PFS', 'RFC', 'RIA'
  ];

  const onSubmit = async (data: AdvisorFormData) => {
    if (!user) {
      toast({
        title: 'Error',
        description: 'You must be logged in to submit an advisor profile',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Generate slug from name
      const slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

      // Cast advisor_services to the correct enum type
      const advisorData = {
        user_id: user.id,
        name: data.name,
        slug,
        firm_name: data.firm_name,
        position: data.position,
        personal_bio: data.personal_bio,
        firm_bio: data.firm_bio,
        email: data.email,
        phone_number: data.phone_number,
        years_of_experience: data.years_of_experience,
        state_hq: data.state_hq,
        advisor_services: data.advisor_services as any, // Type assertion to match enum
        licenses: data.licenses || [],
        certifications: data.certifications || [],
        advisor_sec_crd: data.advisor_sec_crd || null,
        firm_sec_crd: data.firm_sec_crd || null,
        advisor_finra_brokercheck: data.advisor_finra_brokercheck || null,
        firm_finra_brokercheck: data.firm_finra_brokercheck || null,
        linkedin_url: data.linkedin_url || null,
        website_url: data.website_url || null,
        facebook_url: data.facebook_url || null,
        twitter_url: data.twitter_url || null,
        youtube_video_id: data.youtube_video_id || null,
        status: 'pending_approval',
        submitted_at: new Date().toISOString(),
        verified: false,
        premium: false,
      };

      const { error } = await supabase
        .from('financial_advisors')
        .insert([advisorData]);

      if (error) throw error;

      toast({
        title: 'Success!',
        description: 'Your advisor profile has been submitted for review.',
      });

      onSuccess();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to submit advisor profile',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Basic Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="John Doe" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="firm_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Firm Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="ABC Financial Services" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="position"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Position</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Senior Financial Advisor" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="years_of_experience"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Years of Experience</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      type="number" 
                      placeholder="10"
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} type="email" placeholder="john@example.com" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="+1 (555) 123-4567" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="state_hq"
            render={({ field }) => (
              <FormItem>
                <FormLabel>State (Headquarters)</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="California" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Services */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Services Offered</h3>
          <FormField
            control={form.control}
            name="advisor_services"
            render={() => (
              <FormItem>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {advisorServices.map((service) => (
                    <FormField
                      key={service}
                      control={form.control}
                      name="advisor_services"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={service}
                            className="flex flex-row items-start space-x-3 space-y-0"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(service)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...field.value, service])
                                    : field.onChange(
                                        field.value?.filter(
                                          (value) => value !== service
                                        )
                                      );
                                }}
                              />
                            </FormControl>
                            <FormLabel className="text-sm font-normal">
                              {service}
                            </FormLabel>
                          </FormItem>
                        );
                      }}
                    />
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Licenses */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Licenses</h3>
          <FormField
            control={form.control}
            name="licenses"
            render={() => (
              <FormItem>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {licensesOptions.map((license) => (
                    <FormField
                      key={license}
                      control={form.control}
                      name="licenses"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={license}
                            className="flex flex-row items-start space-x-3 space-y-0"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(license)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...(field.value || []), license])
                                    : field.onChange(
                                        field.value?.filter(
                                          (value) => value !== license
                                        ) || []
                                      );
                                }}
                              />
                            </FormControl>
                            <FormLabel className="text-sm font-normal">
                              {license}
                            </FormLabel>
                          </FormItem>
                        );
                      }}
                    />
                  ))}
                </div>
              </FormItem>
            )}
          />
        </div>

        {/* Certifications */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Certifications</h3>
          <FormField
            control={form.control}
            name="certifications"
            render={() => (
              <FormItem>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {certificationsOptions.map((cert) => (
                    <FormField
                      key={cert}
                      control={form.control}
                      name="certifications"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={cert}
                            className="flex flex-row items-start space-x-3 space-y-0"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(cert)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...(field.value || []), cert])
                                    : field.onChange(
                                        field.value?.filter(
                                          (value) => value !== cert
                                        ) || []
                                      );
                                }}
                              />
                            </FormControl>
                            <FormLabel className="text-sm font-normal">
                              {cert}
                            </FormLabel>
                          </FormItem>
                        );
                      }}
                    />
                  ))}
                </div>
              </FormItem>
            )}
          />
        </div>

        {/* Bio Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Bio Information</h3>
          
          <FormField
            control={form.control}
            name="personal_bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Personal Bio</FormLabel>
                <FormControl>
                  <Textarea 
                    {...field} 
                    placeholder="Tell us about yourself, your background, and your approach to financial advising..."
                    rows={4}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="firm_bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Firm Bio</FormLabel>
                <FormControl>
                  <Textarea 
                    {...field} 
                    placeholder="Tell us about your firm, its history, and services..."
                    rows={4}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Professional Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Professional Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="advisor_sec_crd"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Advisor SEC CRD Number</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="123456" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="firm_sec_crd"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Firm SEC CRD Number</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="123456" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="advisor_finra_brokercheck"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Advisor FINRA BrokerCheck URL</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="https://brokercheck.finra.org/..." />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="firm_finra_brokercheck"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Firm FINRA BrokerCheck URL</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="https://brokercheck.finra.org/..." />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Social Media & Web Presence */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Online Presence</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="website_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Website URL</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="https://www.yourwebsite.com" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="linkedin_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>LinkedIn URL</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="https://linkedin.com/in/yourprofile" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="facebook_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Facebook URL</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="https://facebook.com/yourpage" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="twitter_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Twitter URL</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="https://twitter.com/youraccount" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="youtube_video_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>YouTube Video ID (Optional)</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="dQw4w9WgXcQ" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? 'Submitting...' : 'Submit for Review'}
        </Button>
      </form>
    </Form>
  );
};
