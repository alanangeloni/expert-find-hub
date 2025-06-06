import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
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
import { HeadshotUpload } from './HeadshotUpload';

import { CLIENT_TYPES, type ClientType } from '@/constants/clientTypes';

// Define US states as a constant array
const US_STATES = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 
  'Colorado', 'Connecticut', 'Delaware', 'District of Columbia', 'Florida', 
  'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 
  'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 
  'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 
  'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 
  'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 
  'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 
  'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
] as const satisfies readonly string[];

type USState = typeof US_STATES[number];

// Define professional designations as a const array
const DESIGNATION_VALUES = [
  'Accredited Estate Planner (AEP)',
  'Accredited Investment Fiduciary (AIF)',
  'Accredited Portfolio Manager Advisor (APMA)',
  'Certified Divorce Financial Analyst (CDFA)',
  'Certified Exit Planning Advisor (CEPA)',
  'Certified Financial Planner (CFP)',
  'Certified Kingdom Advisor (CKA)',
  'Certified Public Accountant (CPA)',
  'Certified Specialist in Planned Giving (CSPG)',
  'Certified Value Growth Advisor (CVGA)',
  'Chartered Financial Consultant (ChFC)',
  'Chartered Financial Analyst (CFA)',
  'Chartered Special Needs Consultant (ChSNC)',
  'Chartered Retirement Planning Counselor™ (CRPC®)',
  'Enrolled Agent (EA)',
  'Life Underwriting Training Council Fellow (LUTCF)',
  'Registered Financial Consultant (RFC)',
  'Registered Investment Advisor (RIA)',
  'Retirement Management Advisor (RMA®)',
  'Retirement Income Certified Professional (RICP)'
] as const;

// Define compensation types as a const array
const COMPENSATION_TYPES = [
  'Fee-Only',
  'Fee-Based',
  'Commission',
  'Hourly',
  'Flat Fee',
  'Assets Under Management'
] as const;

// Define licenses as a const array to match the advisors_licenses enum in the database
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

// Import shared services constant
import { ADVISOR_SERVICES, type AdvisorService } from '@/constants/advisorServices';

// Define service values using the shared constant
const SERVICE_VALUES = ADVISOR_SERVICES;

// Create types from the array values
type ServiceType = AdvisorService;
type DesignationType = typeof DESIGNATION_VALUES[number];
type LicenseType = typeof LICENSE_VALUES[number];
type CompensationType = typeof COMPENSATION_TYPES[number];

// Create Zod enums from the values
const serviceValues = [...SERVICE_VALUES] as const;
const serviceEnum = z.enum(serviceValues as unknown as [string, ...string[]]);

const designationValues = [...DESIGNATION_VALUES] as const;
const designationEnum = z.enum(designationValues as unknown as [string, ...string[]]);

const compensationValues = [...COMPENSATION_TYPES] as const;
const compensationEnum = z.enum(compensationValues as unknown as [string, ...string[]]);

const licenseValues = [...LICENSE_VALUES] as const;
const licenseEnum = z.enum(licenseValues as unknown as [string, ...string[]]);

const clientTypeValues = [...CLIENT_TYPES] as const;
const clientTypeEnum = z.enum(clientTypeValues as unknown as [string, ...string[]]);

const advisorSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  slug: z.string().min(1, 'Slug is required'),
  firm_name: z.string().optional(),
  position: z.string().optional(),
  personal_bio: z.string().optional(),
  firm_bio: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  phone_number: z.string().optional(),
  years_of_experience: z.number().min(0).optional(),
  state_hq: z.string().optional(),
  city: z.string().optional(),
  minimum: z.string().optional(),
  website_url: z.string().url().optional().or(z.literal('')),
  verified: z.boolean().default(false),
  premium: z.boolean().default(false),
  fiduciary: z.boolean().default(false),
  first_session_is_free: z.boolean().default(false),
  linked_firm: z.string().optional(),
  headshot_url: z.string().optional(),
  advisor_services: z.array(serviceEnum).max(10, 'Maximum 10 services allowed').optional(),
  professional_designations: z.array(designationEnum).max(10, 'Maximum 10 designations allowed').optional(),
  licenses: z.array(licenseEnum).max(15, 'Maximum 15 licenses allowed').optional(),
  compensation_types: z.array(compensationEnum).max(6, 'Maximum 6 compensation types allowed').optional(),
  client_type: z.array(clientTypeEnum).max(10, 'Maximum 10 client types allowed').optional(),
  states_registered_in: z.array(z.enum(US_STATES as unknown as [string, ...string[]])).max(50, 'Maximum 50 states allowed').optional(),
});

type AdvisorFormData = z.infer<typeof advisorSchema>;

interface AdvisorFormProps {
  advisor?: any;
  onSuccess: () => void;
}

// Use the exact enumerated values from the database schema
const AVAILABLE_SERVICES: ServiceType[] = [...SERVICE_VALUES];
const AVAILABLE_DESIGNATIONS: DesignationType[] = [...DESIGNATION_VALUES];
const AVAILABLE_LICENSES: LicenseType[] = [...LICENSE_VALUES];
const AVAILABLE_COMPENSATION_TYPES: CompensationType[] = [...COMPENSATION_TYPES];
const AVAILABLE_CLIENT_TYPES: ClientType[] = [...CLIENT_TYPES];

export function AdvisorForm({ advisor, onSuccess }: AdvisorFormProps) {
  const form = useForm<AdvisorFormData>({
    resolver: zodResolver(advisorSchema),
    defaultValues: {
      name: advisor?.name || '',
      slug: advisor?.slug || '',
      firm_name: advisor?.firm_name || '',
      position: advisor?.position || '',
      personal_bio: advisor?.personal_bio || '',
      firm_bio: advisor?.firm_bio || '',
      email: advisor?.email || '',
      phone_number: advisor?.phone_number || '',
      years_of_experience: advisor?.years_of_experience || undefined,
      state_hq: advisor?.state_hq || '',
      city: advisor?.city || '',
      minimum: advisor?.minimum || '',
      website_url: advisor?.website_url || '',
      verified: advisor?.verified || false,
      premium: advisor?.premium || false,
      fiduciary: advisor?.fiduciary || false,
      first_session_is_free: advisor?.first_session_is_free || false,
      linked_firm: advisor?.linked_firm || '',
      headshot_url: advisor?.headshot_url || '',
      advisor_services: advisor?.advisor_services || [],
      professional_designations: advisor?.professional_designations || [],
      licenses: advisor?.licenses || [],
      compensation_types: advisor?.compensation_types || [],
      client_type: advisor?.client_type || [],
      states_registered_in: advisor?.states_registered_in || [],
    },
  });

  // Fetch investment firms for the dropdown
  const { data: investmentFirms } = useQuery({
    queryKey: ['investment-firms'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('investment_firms')
        .select('id, name')
        .order('name');
      
      if (error) throw error;
      return data;
    },
  });

  // Get the current values from the form state
  const currentSelectedServices = form.watch('advisor_services') || [];
  const currentSelectedDesignations = form.watch('professional_designations') || [];
  const currentSelectedLicenses = form.watch('licenses') || [];
  const currentSelectedCompensationTypes = form.watch('compensation_types') || [];
  const currentSelectedClientTypes = form.watch('client_type') || [];
  const currentSelectedStates = form.watch('states_registered_in') || [];

  const mutation = useMutation({
    mutationFn: async (formData: AdvisorFormData) => {
      try {
        console.log('Submitting advisor data:', formData);
        
        // Create a properly typed advisor data object
        const advisorData = {
          name: formData.name,
          slug: formData.slug,
          firm_name: formData.firm_name || null,
          position: formData.position || null,
          personal_bio: formData.personal_bio || null,
          firm_bio: formData.firm_bio || null,
          email: formData.email || null,
          phone_number: formData.phone_number || null,
          years_of_experience: formData.years_of_experience || null,
          state_hq: (formData.state_hq || null) as any,
          city: formData.city || null,
          minimum: formData.minimum || null,
          website_url: formData.website_url || null,
          verified: formData.verified || false,
          premium: formData.premium || false,
          fiduciary: formData.fiduciary || false,
          headshot_url: formData.headshot_url || null,
          advisor_services: (formData.advisor_services || null) as any,
          professional_designations: (formData.professional_designations || null) as any,
          licenses: (formData.licenses || null) as any,
          client_type: (formData.client_type || null) as any,
          states_registered_in: (formData.states_registered_in || null) as any,
          updated_at: new Date().toISOString(),
        };


      } catch (error) {
        console.error('Error in mutation function:', error);
        throw error;
      }
    },
    onSuccess: (result) => {
      console.log('Mutation success, result:', result);
      toast({ 
        title: advisor ? 'Advisor updated successfully' : 'Advisor created successfully' 
      });
      onSuccess();
    },
    onError: (error) => {
      console.error('Mutation error:', error);
      toast({ 
        title: 'Error saving advisor', 
        description: error.message,
        variant: 'destructive' 
      });
    },
  });

  const onSubmit = (data: AdvisorFormData) => {
    console.log('onSubmit called. Form submission data:', data);
    mutation.mutate(data);
  };

  const addService = (service: ServiceType) => {
    if (currentSelectedServices.length >= 10) {
      toast({
        title: 'Maximum services reached',
        description: 'You can only select up to 10 services.',
        variant: 'destructive'
      });
      return;
    }
    
    if (!currentSelectedServices.includes(service)) {
      const newServices = [...currentSelectedServices, service];
      form.setValue('advisor_services', newServices, { shouldValidate: true, shouldDirty: true });
    }
  };

  const removeService = (serviceToRemove: ServiceType) => {
    const newServices = currentSelectedServices.filter(service => service !== serviceToRemove);
    form.setValue('advisor_services', newServices, { shouldValidate: true, shouldDirty: true });
  };

  const addDesignation = (designation: DesignationType) => {
    if (currentSelectedDesignations.length >= 10) {
      toast({
        title: 'Maximum designations reached',
        description: 'You can only select up to 10 designations.',
        variant: 'destructive'
      });
      return;
    }
    
    if (!currentSelectedDesignations.includes(designation)) {
      const newDesignations = [...currentSelectedDesignations, designation];
      form.setValue('professional_designations', newDesignations, { shouldValidate: true, shouldDirty: true });
    }
  };

  const removeDesignation = (designationToRemove: DesignationType) => {
    const newDesignations = currentSelectedDesignations.filter(designation => designation !== designationToRemove);
    form.setValue('professional_designations', newDesignations, { shouldValidate: true, shouldDirty: true });
  };

  const addLicense = (license: LicenseType) => {
    if (currentSelectedLicenses.length >= 15) {
      toast({
        title: 'Maximum licenses reached',
        description: 'You can only select up to 15 licenses.',
        variant: 'destructive'
      });
      return;
    }
    
    if (!currentSelectedLicenses.includes(license)) {
      const newLicenses = [...currentSelectedLicenses, license];
      form.setValue('licenses', newLicenses, { shouldValidate: true, shouldDirty: true });
    }
  };

  const removeLicense = (licenseToRemove: LicenseType) => {
    const newLicenses = currentSelectedLicenses.filter(license => license !== licenseToRemove);
    form.setValue('licenses', newLicenses, { shouldValidate: true, shouldDirty: true });
  };

  const addClientType = (clientType: ClientType) => {
    if (currentSelectedClientTypes.length >= 10) {
      toast({
        title: 'Maximum client types reached',
        description: 'You can only select up to 10 client types.',
        variant: 'destructive'
      });
      return;
    }
    
    if (!currentSelectedClientTypes.includes(clientType)) {
      const newClientTypes = [...currentSelectedClientTypes, clientType];
      form.setValue('client_type', newClientTypes, { shouldValidate: true, shouldDirty: true });
    }
  };

  const removeClientType = (clientTypeToRemove: ClientType) => {
    const newClientTypes = currentSelectedClientTypes.filter(type => type !== clientTypeToRemove);
    form.setValue('client_type', newClientTypes, { shouldValidate: true, shouldDirty: true });
  };

  const addCompensationType = (type: CompensationType) => {
    if (currentSelectedCompensationTypes.length >= 6) {
      toast({
        title: 'Maximum compensation types reached',
        description: 'You can only select up to 6 compensation types.',
        variant: 'destructive'
      });
      return;
    }
    
    if (!currentSelectedCompensationTypes.includes(type)) {
      const newTypes = [...currentSelectedCompensationTypes, type];
      form.setValue('compensation_types', newTypes, { shouldValidate: true, shouldDirty: true });
    }
  };

  const removeCompensationType = (typeToRemove: CompensationType) => {
    const newTypes = currentSelectedCompensationTypes.filter(type => type !== typeToRemove);
    form.setValue('compensation_types', newTypes, { shouldValidate: true, shouldDirty: true });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic form fields */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name *</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="slug"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Slug *</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Headshot Upload */}
          <FormField
            control={form.control}
            name="headshot_url"
            render={({ field }) => (
              <FormItem>
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

          {/* ... keep existing code (firm_name through website_url fields) */}
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
                <FormLabel>Position</FormLabel>
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
                <FormLabel>Email</FormLabel>
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
                <FormLabel>Phone Number</FormLabel>
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
                <FormLabel>Years of Experience</FormLabel>
                <FormControl>
                  <Input type="number" {...field} onChange={e => field.onChange(e.target.value === '' ? undefined : Number(e.target.value))} />
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
                <FormLabel>State HQ</FormLabel>
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
                <FormLabel>City</FormLabel>
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
                  <Input {...field} />
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
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Linked Investment Firm */}
          <FormField
            control={form.control}
            name="linked_firm"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Linked Investment Firm</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an investment firm" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="none">No firm linked</SelectItem>
                    {investmentFirms?.map((firm) => (
                      <SelectItem key={firm.id} value={firm.id}>
                        {firm.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="fiduciary"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Fiduciary</FormLabel>
                  <FormDescription>
                    Mark this advisor as a fiduciary.
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />

          {/* Personal Bio */}
          <FormField
            control={form.control}
            name="personal_bio"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Personal Bio</FormLabel>
                <FormControl>
                  <Textarea {...field} rows={5} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Firm Bio */}
          <FormField
            control={form.control}
            name="firm_bio"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Firm Bio</FormLabel>
                <FormControl>
                  <Textarea {...field} rows={5} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Advisor Services Multi-select */}
          <FormItem className="md:col-span-2">
            <FormLabel>Advisor Services</FormLabel>
            <Select onValueChange={addService}>
              <SelectTrigger>
                <SelectValue placeholder="Select services" />
              </SelectTrigger>
              <SelectContent>
                {AVAILABLE_SERVICES.map((service) => (
                  <SelectItem key={service} value={service}>
                    {service}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="mt-2 flex flex-wrap gap-2">
              {currentSelectedServices.map((service: ServiceType) => (
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

          {/* Compensation Types Multi-select */}
          <div className="space-y-2">
            <FormLabel>Compensation Types</FormLabel>
            <Select onValueChange={addCompensationType}>
              <SelectTrigger>
                <SelectValue placeholder="Select compensation types" />
              </SelectTrigger>
              <SelectContent>
                {AVAILABLE_COMPENSATION_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex flex-wrap gap-2 mt-2">
              {currentSelectedCompensationTypes.map((type: CompensationType) => (
                <Badge key={type} variant="secondary" className="flex items-center gap-1">
                  {type}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      removeCompensationType(type);
                    }}
                    className="ml-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
            <FormMessage />
          </div>

          {/* Licenses Multi-select */}
          <div className="space-y-2">
            <FormLabel>Licenses</FormLabel>
            <Select onValueChange={addLicense}>
              <SelectTrigger>
                <SelectValue placeholder="Select licenses" />
              </SelectTrigger>
              <SelectContent>
                {AVAILABLE_LICENSES.map((license) => (
                  <SelectItem key={license} value={license}>
                    {license}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex flex-wrap gap-2 mt-2">
              {currentSelectedLicenses.map((license: LicenseType) => (
                <Badge key={license} variant="secondary" className="flex items-center gap-1">
                  {license}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      removeLicense(license);
                    }}
                    className="ml-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
            <FormMessage />
          </div>

          {/* Client Types Multi-select */}
          <FormItem className="md:col-span-2">
            <FormLabel>Client Types</FormLabel>
            <Select onValueChange={addClientType}>
              <SelectTrigger>
                <SelectValue placeholder="Select client types" />
              </SelectTrigger>
              <SelectContent>
                {AVAILABLE_CLIENT_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="mt-2 flex flex-wrap gap-2">
              {currentSelectedClientTypes.map((type: ClientType) => (
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

          {/* States Registered In Multi-select */}
          <FormItem className="md:col-span-2">
            <FormLabel>States Registered In</FormLabel>
            <Select 
              onValueChange={(value: USState) => {
                if (!currentSelectedStates.includes(value)) {
                  const newStates = [...currentSelectedStates, value] as USState[];
                  form.setValue('states_registered_in', newStates, { shouldValidate: true, shouldDirty: true });
                } else {
                  toast({
                    title: 'State already added',
                    description: 'This state has already been added.',
                    variant: 'destructive'
                  });
                }
              }}
              value=""
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a state" />
              </SelectTrigger>
              <SelectContent>
                {US_STATES.map((state) => (
                  <SelectItem 
                    key={state} 
                    value={state}
                    disabled={currentSelectedStates.includes(state as USState)}
                  >
                    {state}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="mt-2 flex flex-wrap gap-2">
              {currentSelectedStates.map((state: string) => (
                <Badge key={state} variant="secondary" className="pr-1">
                  {state}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="ml-1 h-auto p-0"
                    onClick={() => {
                      const newStates = currentSelectedStates.filter(s => s !== state) as USState[];
                      form.setValue('states_registered_in', newStates, { shouldValidate: true, shouldDirty: true });
                    }}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
            <FormMessage />
          </FormItem>

          {/* Professional Designations Multi-select */}
          <FormItem className="md:col-span-2">
            <FormLabel>Professional Designations</FormLabel>
            <Select onValueChange={addDesignation}>
              <SelectTrigger>
                <SelectValue placeholder="Select professional designations" />
              </SelectTrigger>
              <SelectContent>
                {AVAILABLE_DESIGNATIONS.map((designation) => (
                  <SelectItem key={designation} value={designation}>
                    {designation}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="mt-2 flex flex-wrap gap-2">
              {currentSelectedDesignations.map((designation: DesignationType) => (
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
            <FormMessage />
          </FormItem>
        </div>

        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? 'Saving...' : 'Save Advisor'}
        </Button>
      </form>
    </Form>
  );
}
