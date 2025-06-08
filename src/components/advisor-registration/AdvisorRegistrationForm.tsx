
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { HeadshotUpload } from '@/components/admin/HeadshotUpload';

// Import shared constants
import { ADVISOR_SERVICES, type AdvisorService } from '@/constants/advisorServices';
import { CLIENT_TYPES, type ClientType } from '@/constants/clientTypes';

// Use the license values from the enum
const LICENSE_VALUES = [
  'Annuities',
  'Health/Disability Insurance',
  'Home & Auto',
  'Insurance',
  'Life/Accident/Health',
  'Life & Health',
  'Life & Disability',
  'Life Insurance',
  'Long Term Care',
  'Series 3',
  'Series 6',
  'Series 7',
  'Series 24',
  'Series 26',
  'Series 31',
  'Series 63',
  'Series 65',
  'Series 66',
  'Series 79',
  'Series 99',
  'SIE'
] as const;

const DESIGNATION_VALUES = [
  'Accredited Estate Planner (AEP)',
  'Accredited Investment Fiduciary (AIF)',
  'Certified Financial Planner (CFP)',
  'Chartered Financial Analyst (CFA)',
  'Chartered Financial Consultant (ChFC)',
  'Certified Public Accountant (CPA)',
  'Enrolled Agent (EA)',
  'Registered Investment Advisor (RIA)',
] as const;

type LicenseType = typeof LICENSE_VALUES[number];
type DesignationType = typeof DESIGNATION_VALUES[number];

const registrationSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  firm_name: z.string().optional(),
  position: z.string().optional(),
  personal_bio: z.string().min(50, 'Please provide at least 50 characters for your bio'),
  firm_bio: z.string().optional(),
  email: z.string().email('Valid email is required'),
  phone_number: z.string().min(1, 'Phone number is required'),
  years_of_experience: z.number().min(0, 'Experience must be 0 or greater'),
  state_hq: z.string().min(1, 'State is required'),
  city: z.string().min(1, 'City is required'),
  minimum: z.string().optional(),
  website_url: z.string().url().optional().or(z.literal('')),
  fiduciary: z.boolean().default(false),
  headshot_url: z.string().optional(),
  advisor_services: z.array(z.string()).min(1, 'Please select at least one service'),
  professional_designations: z.array(z.string()).optional(),
  licenses: z.array(z.string()).optional(),
  client_type: z.array(z.string()).min(1, 'Please select at least one client type'),
});

type RegistrationFormData = z.infer<typeof registrationSchema>;

interface AdvisorFormProps {
  onSuccess: () => void;
}

export function AdvisorForm({ onSuccess }: AdvisorFormProps) {
  const { user } = useAuth();
  const form = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
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
      city: '',
      minimum: '',
      website_url: '',
      fiduciary: false,
      headshot_url: '',
      advisor_services: [],
      professional_designations: [],
      licenses: [],
      client_type: [],
    },
  });

  const currentSelectedServices = form.watch('advisor_services') || [];
  const currentSelectedDesignations = form.watch('professional_designations') || [];
  const currentSelectedLicenses = form.watch('licenses') || [];
  const currentSelectedClientTypes = form.watch('client_type') || [];

  const mutation = useMutation({
    mutationFn: async (formData: RegistrationFormData) => {
      if (!user) throw new Error('User not authenticated');

      // Generate slug from name
      const slug = formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

      const advisorData = {
        user_id: user.id,
        name: formData.name,
        slug,
        firm_name: formData.firm_name || null,
        position: formData.position || null,
        personal_bio: formData.personal_bio,
        firm_bio: formData.firm_bio || null,
        email: formData.email,
        phone_number: formData.phone_number,
        years_of_experience: formData.years_of_experience,
        state_hq: formData.state_hq,
        city: formData.city,
        minimum: formData.minimum || null,
        website_url: formData.website_url || null,
        fiduciary: formData.fiduciary,
        headshot_url: formData.headshot_url || null,
        advisor_services: formData.advisor_services,
        professional_designations: formData.professional_designations || [],
        licenses: formData.licenses || [],
        client_type: formData.client_type,
        status: 'pending_approval',
        submitted_at: new Date().toISOString(),
        verified: false,
        premium: false,
      };

      const { data, error } = await supabase
        .from('financial_advisors')
        .insert(advisorData)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({ title: 'Registration submitted successfully!' });
      onSuccess();
    },
    onError: (error) => {
      console.error('Registration error:', error);
      toast({ 
        title: 'Error submitting registration', 
        description: error.message,
        variant: 'destructive' 
      });
    },
  });

  const addService = (service: string) => {
    if (!currentSelectedServices.includes(service)) {
      const newServices = [...currentSelectedServices, service];
      form.setValue('advisor_services', newServices);
    }
  };

  const removeService = (serviceToRemove: string) => {
    const newServices = currentSelectedServices.filter(service => service !== serviceToRemove);
    form.setValue('advisor_services', newServices);
  };

  const addDesignation = (designation: string) => {
    if (!currentSelectedDesignations.includes(designation)) {
      const newDesignations = [...currentSelectedDesignations, designation];
      form.setValue('professional_designations', newDesignations);
    }
  };

  const removeDesignation = (designationToRemove: string) => {
    const newDesignations = currentSelectedDesignations.filter(designation => designation !== designationToRemove);
    form.setValue('professional_designations', newDesignations);
  };

  const addLicense = (license: string) => {
    if (!currentSelectedLicenses.includes(license)) {
      const newLicenses = [...currentSelectedLicenses, license];
      form.setValue('licenses', newLicenses);
    }
  };

  const removeLicense = (licenseToRemove: string) => {
    const newLicenses = currentSelectedLicenses.filter(license => license !== licenseToRemove);
    form.setValue('licenses', newLicenses);
  };

  const addClientType = (clientType: string) => {
    if (!currentSelectedClientTypes.includes(clientType)) {
      const newClientTypes = [...currentSelectedClientTypes, clientType];
      form.setValue('client_type', newClientTypes);
    }
  };

  const removeClientType = (clientTypeToRemove: string) => {
    const newClientTypes = currentSelectedClientTypes.filter(type => type !== clientTypeToRemove);
    form.setValue('client_type', newClientTypes);
  };

  const onSubmit = (data: RegistrationFormData) => {
    mutation.mutate(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name *</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email *</FormLabel>
                <FormControl>
                  <Input type="email" {...field} />
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
                <FormLabel>Phone Number *</FormLabel>
                <FormControl>
                  <Input {...field} />
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
                <FormLabel>Years of Experience *</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    {...field} 
                    onChange={e => field.onChange(e.target.value === '' ? 0 : Number(e.target.value))} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="state_hq"
            render={({ field }) => (
              <FormItem>
                <FormLabel>State *</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>City *</FormLabel>
                <FormControl>
                  <Input {...field} />
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
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="position"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Position/Title</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="minimum"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Minimum Investment</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="e.g., 250000" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="website_url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Website URL</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="https://..." />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="headshot_url"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Professional Headshot</FormLabel>
                <FormControl>
                  <HeadshotUpload
                    currentHeadshotUrl={field.value}
                    onHeadshotChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="fiduciary"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>I am a Fiduciary</FormLabel>
                  <FormDescription>
                    I am legally obligated to act in my clients' best interests.
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="personal_bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Personal Bio *</FormLabel>
              <FormControl>
                <Textarea 
                  {...field} 
                  rows={5} 
                  placeholder="Tell potential clients about your background, experience, and approach to financial planning..."
                />
              </FormControl>
              <FormDescription>
                Minimum 50 characters. This will be displayed on your public profile.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="firm_bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Firm Description</FormLabel>
              <FormControl>
                <Textarea 
                  {...field} 
                  rows={3} 
                  placeholder="Optional: Describe your firm's mission, values, and services..."
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormItem>
          <FormLabel>Services Offered *</FormLabel>
          <Select onValueChange={addService}>
            <SelectTrigger>
              <SelectValue placeholder="Select services you offer" />
            </SelectTrigger>
            <SelectContent>
              {ADVISOR_SERVICES.map((service) => (
                <SelectItem key={service} value={service}>
                  {service}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="mt-2 flex flex-wrap gap-2">
            {currentSelectedServices.map((service) => (
              <Badge key={service} variant="secondary" className="pr-1">
                {service}
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="ml-1 h-auto p-0"
                  onClick={() => removeService(service)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
          </div>
          <FormMessage />
        </FormItem>

        <FormItem>
          <FormLabel>Client Types *</FormLabel>
          <Select onValueChange={addClientType}>
            <SelectTrigger>
              <SelectValue placeholder="Select client types you serve" />
            </SelectTrigger>
            <SelectContent>
              {CLIENT_TYPES.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="mt-2 flex flex-wrap gap-2">
            {currentSelectedClientTypes.map((type) => (
              <Badge key={type} variant="secondary" className="pr-1">
                {type}
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="ml-1 h-auto p-0"
                  onClick={() => removeClientType(type)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
          </div>
          <FormMessage />
        </FormItem>

        <FormItem>
          <FormLabel>Professional Designations</FormLabel>
          <Select onValueChange={addDesignation}>
            <SelectTrigger>
              <SelectValue placeholder="Select your professional designations" />
            </SelectTrigger>
            <SelectContent>
              {DESIGNATION_VALUES.map((designation) => (
                <SelectItem key={designation} value={designation}>
                  {designation}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="mt-2 flex flex-wrap gap-2">
            {currentSelectedDesignations.map((designation) => (
              <Badge key={designation} variant="secondary" className="pr-1">
                {designation}
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="ml-1 h-auto p-0"
                  onClick={() => removeDesignation(designation)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
          </div>
        </FormItem>

        <FormItem>
          <FormLabel>Licenses</FormLabel>
          <Select onValueChange={addLicense}>
            <SelectTrigger>
              <SelectValue placeholder="Select your licenses" />
            </SelectTrigger>
            <SelectContent>
              {LICENSE_VALUES.map((license) => (
                <SelectItem key={license} value={license}>
                  {license}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="mt-2 flex flex-wrap gap-2">
            {currentSelectedLicenses.map((license) => (
              <Badge key={license} variant="secondary" className="pr-1">
                {license}
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="ml-1 h-auto p-0"
                  onClick={() => removeLicense(license)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
          </div>
        </FormItem>

        <Button type="submit" disabled={mutation.isPending} className="w-full">
          {mutation.isPending ? 'Submitting...' : 'Submit for Review'}
        </Button>
      </form>
    </Form>
  );
}
