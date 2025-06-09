
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
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

// Define licenses as a const array
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

const formSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters."),
  lastName: z.string().min(2, "Last name must be at least 2 characters."),
  firmName: z.string().min(1, "Firm name is required"),
  position: z.string().min(1, "Position is required"),
  personalBio: z.string().min(10, "Personal bio must be at least 10 characters"),
  firmBio: z.string().min(10, "Firm bio must be at least 10 characters"),
  email: z.string().email("Invalid email address"),
  phoneNumber: z.string().min(1, "Phone number is required"),
  yearsOfExperience: z.number().min(0).optional(),
  stateHq: z.string().min(1, "State is required"),
  city: z.string().min(1, "City is required"),
  minimum: z.string().optional(),
  websiteUrl: z.string().url("Invalid website URL").optional().or(z.literal("")),
  advisor_services: z.array(serviceEnum).max(10, 'Maximum 10 services allowed').optional(),
  professional_designations: z.array(designationEnum).max(10, 'Maximum 10 designations allowed').optional(),
  licenses: z.array(licenseEnum).max(15, 'Maximum 15 licenses allowed').optional(),
  compensation: z.array(compensationEnum).max(6, 'Maximum 6 compensation types allowed').optional(),
  client_type: z.array(clientTypeEnum).max(10, 'Maximum 10 client types allowed').optional(),
  states_registered_in: z.array(z.enum(US_STATES as unknown as [string, ...string[]])).max(50, 'Maximum 50 states allowed').optional(),
  fiduciary: z.boolean().default(false),
  terms: z.boolean().refine((value) => value === true, {
    message: 'You must accept the terms and conditions.',
  }),
});

type AdvisorFormData = z.infer<typeof formSchema>;

// Use the exact enumerated values from the database schema
const AVAILABLE_SERVICES: ServiceType[] = [...SERVICE_VALUES];
const AVAILABLE_DESIGNATIONS: DesignationType[] = [...DESIGNATION_VALUES];
const AVAILABLE_LICENSES: LicenseType[] = [...LICENSE_VALUES];
const AVAILABLE_COMPENSATION_TYPES: CompensationType[] = [...COMPENSATION_TYPES];
const AVAILABLE_CLIENT_TYPES: ClientType[] = [...CLIENT_TYPES];

export const AdvisorForm = ({ onSuccess }: { onSuccess: () => void }) => {
  const { user } = useAuth();
  const { toast } = useToast();

  const form = useForm<AdvisorFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      firmName: '',
      position: '',
      personalBio: '',
      firmBio: '',
      email: '',
      phoneNumber: '',
      yearsOfExperience: undefined,
      stateHq: '',
      city: '',
      minimum: '',
      websiteUrl: '',
      advisor_services: [],
      professional_designations: [],
      licenses: [],
      compensation: [],
      client_type: [],
      states_registered_in: [],
      fiduciary: false,
      terms: false,
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
  const currentSelectedCompensationTypes = form.watch('compensation') || [];
  const currentSelectedClientTypes = form.watch('client_type') || [];
  const currentSelectedStates = form.watch('states_registered_in') || [];

  const mutation = useMutation({
    mutationFn: async (formData: AdvisorFormData) => {
      if (!user) {
        throw new Error("You must be logged in to submit an advisor profile");
      }

      const advisorData = {
        user_id: user.id,
        name: `${formData.firstName} ${formData.lastName}`,
        slug: `${formData.firstName.toLowerCase()}-${formData.lastName.toLowerCase()}-${Date.now()}`,
        firm_name: formData.firmName,
        position: formData.position,
        personal_bio: formData.personalBio,
        firm_bio: formData.firmBio,
        email: formData.email,
        phone_number: formData.phoneNumber,
        years_of_experience: formData.yearsOfExperience,
        state_hq: formData.stateHq as USState,
        city: formData.city,
        minimum: formData.minimum,
        website_url: formData.websiteUrl || null,
        advisor_services: (formData.advisor_services || []) as ServiceType[],
        professional_designations: (formData.professional_designations || []) as DesignationType[],
        licenses: (formData.licenses || []) as LicenseType[],
        compensation: (formData.compensation || []) as CompensationType[],
        client_type: (formData.client_type || []) as ClientType[],
        states_registered_in: (formData.states_registered_in || []) as USState[],
        fiduciary: formData.fiduciary,
        verified: false,
        status: 'pending_approval'
      };

      const { error } = await supabase
        .from('financial_advisors')
        .insert([advisorData]);

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "Your advisor profile has been submitted for review."
      });
      onSuccess();
    },
    onError: (error: any) => {
      console.error('Error submitting advisor profile:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to submit advisor profile",
        variant: "destructive"
      });
    },
  });

  const onSubmit = (data: AdvisorFormData) => {
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
      form.setValue('compensation', newTypes, { shouldValidate: true, shouldDirty: true });
    }
  };

  const removeCompensationType = (typeToRemove: CompensationType) => {
    const newTypes = currentSelectedCompensationTypes.filter(type => type !== typeToRemove);
    form.setValue('compensation', newTypes, { shouldValidate: true, shouldDirty: true });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic form fields */}
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name *</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name *</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="firmName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Firm Name *</FormLabel>
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
                <FormLabel>Position *</FormLabel>
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
            name="phoneNumber"
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
            name="yearsOfExperience"
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
            name="stateHq"
            render={({ field }) => (
              <FormItem>
                <FormLabel>State HQ *</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a state" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {US_STATES.map((state) => (
                      <SelectItem key={state} value={state}>
                        {state}
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
            name="websiteUrl"
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

          <FormField
            control={form.control}
            name="fiduciary"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm">
                <FormControl>
                  <input
                    type="checkbox"
                    checked={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Fiduciary</FormLabel>
                </div>
              </FormItem>
            )}
          />

          {/* Personal Bio */}
          <FormField
            control={form.control}
            name="personalBio"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Personal Bio *</FormLabel>
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
            name="firmBio"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Firm Bio *</FormLabel>
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

          {/* Terms and Conditions */}
          <FormField
            control={form.control}
            name="terms"
            render={({ field }) => (
              <FormItem className="md:col-span-2 flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm">
                <FormControl>
                  <input
                    type="checkbox"
                    checked={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>
                    I agree to the <a href="/terms" className="text-blue-500">terms and conditions</a> *
                  </FormLabel>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? 'Submitting...' : 'Submit'}
        </Button>
      </form>
    </Form>
  );
};
