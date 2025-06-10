
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Advisor } from '@/services/advisorsService';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
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

import { CLIENT_TYPES, type ClientType } from '@/constants/clientTypes';
import { ADVISOR_SERVICES, type AdvisorService } from '@/constants/advisorServices';

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

// Define professional designations
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

// Define compensation types
const COMPENSATION_TYPES = [
  'Fee-Only',
  'Fee-Based',
  'Commission',
  'Hourly',
  'Flat Fee',
  'Assets Under Management'
] as const;

// Define licenses
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

type ServiceType = AdvisorService;
type DesignationType = typeof DESIGNATION_VALUES[number];
type LicenseType = typeof LICENSE_VALUES[number];
type CompensationType = typeof COMPENSATION_TYPES[number];

const editSchema = z.object({
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
  advisor_services: z.array(z.string()).max(10, 'Maximum 10 services allowed').optional(),
  professional_designations: z.array(z.string()).max(10, 'Maximum 10 designations allowed').optional(),
  licenses: z.array(z.string()).max(15, 'Maximum 15 licenses allowed').optional(),
  compensation: z.array(z.string()).max(6, 'Maximum 6 compensation types allowed').optional(),
  client_type: z.array(z.string()).max(10, 'Maximum 10 client types allowed').optional(),
  states_registered_in: z.array(z.string()).max(50, 'Maximum 50 states allowed').optional(),
  fiduciary: z.boolean().default(false),
});

type AdvisorFormData = z.infer<typeof editSchema>;

interface AdvisorProfileEditProps {
  advisor: Advisor;
  onUpdate: () => void;
}

export const AdvisorProfileEdit: React.FC<AdvisorProfileEditProps> = ({ advisor, onUpdate }) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<AdvisorFormData>({
    resolver: zodResolver(editSchema),
    defaultValues: {
      firmName: advisor.firm_name || '',
      position: advisor.position || '',
      personalBio: advisor.personal_bio || '',
      firmBio: advisor.firm_bio || '',
      email: advisor.email || '',
      phoneNumber: advisor.phone_number || '',
      yearsOfExperience: advisor.years_of_experience || undefined,
      stateHq: advisor.state_hq || '',
      city: advisor.city || '',
      minimum: advisor.minimum || '',
      websiteUrl: advisor.website_url || '',
      advisor_services: advisor.advisor_services || [],
      professional_designations: advisor.professional_designations || [],
      licenses: advisor.licenses || [],
      compensation: advisor.compensation || [],
      client_type: advisor.client_type || [],
      states_registered_in: advisor.states_registered_in || [],
      fiduciary: advisor.fiduciary || false,
    }
  });

  // Get current values from form state
  const currentSelectedServices = form.watch('advisor_services') || [];
  const currentSelectedDesignations = form.watch('professional_designations') || [];
  const currentSelectedLicenses = form.watch('licenses') || [];
  const currentSelectedCompensationTypes = form.watch('compensation') || [];
  const currentSelectedClientTypes = form.watch('client_type') || [];
  const currentSelectedStates = form.watch('states_registered_in') || [];

  const onSubmit = async (data: AdvisorFormData) => {
    setIsSubmitting(true);

    try {
      const updateData = {
        firm_name: data.firmName,
        position: data.position,
        personal_bio: data.personalBio,
        firm_bio: data.firmBio,
        email: data.email,
        phone_number: data.phoneNumber,
        years_of_experience: data.yearsOfExperience,
        state_hq: data.stateHq,
        city: data.city,
        minimum: data.minimum,
        website_url: data.websiteUrl || null,
        advisor_services: data.advisor_services || [],
        professional_designations: data.professional_designations || [],
        licenses: data.licenses || [],
        compensation: data.compensation || [],
        client_type: data.client_type || [],
        states_registered_in: data.states_registered_in || [],
        fiduciary: data.fiduciary,
        updated_at: new Date().toISOString(),
      } as any; // Type assertion to bypass strict typing

      const { error } = await supabase
        .from('financial_advisors')
        .update(updateData)
        .eq('id', advisor.id);

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Your profile has been updated."
      });

      onUpdate();
    } catch (error: any) {
      console.error('Error updating advisor profile:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update profile",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const canEdit = advisor.status !== 'approved';

  // Helper functions for multi-select fields
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

  const addState = (state: USState) => {
    if (currentSelectedStates.length >= 50) {
      toast({
        title: 'Maximum states reached',
        description: 'You can only select up to 50 states.',
        variant: 'destructive'
      });
      return;
    }
    
    if (!currentSelectedStates.includes(state)) {
      const newStates = [...currentSelectedStates, state];
      form.setValue('states_registered_in', newStates, { shouldValidate: true, shouldDirty: true });
    } else {
      toast({
        title: 'State already added',
        description: 'This state has already been added.',
        variant: 'destructive'
      });
    }
  };

  const removeState = (stateToRemove: string) => {
    const newStates = currentSelectedStates.filter(state => state !== stateToRemove);
    form.setValue('states_registered_in', newStates, { shouldValidate: true, shouldDirty: true });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
        {!canEdit && (
          <p className="text-sm text-gray-600">
            Your profile is approved and cannot be edited. Contact support if you need to make changes.
          </p>
        )}
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="firmName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Firm Name *</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={!canEdit} />
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
                      <Input {...field} disabled={!canEdit} />
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
                      <Input type="email" {...field} disabled={!canEdit} />
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
                      <Input {...field} disabled={!canEdit} />
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
                      <Input 
                        type="number" 
                        {...field} 
                        onChange={e => field.onChange(e.target.value === '' ? undefined : Number(e.target.value))}
                        disabled={!canEdit} 
                      />
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
                    <Select onValueChange={field.onChange} value={field.value} disabled={!canEdit}>
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
                      <Input {...field} disabled={!canEdit} />
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
                      <Input {...field} disabled={!canEdit} />
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
                      <Input {...field} disabled={!canEdit} />
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
                        disabled={!canEdit}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Fiduciary</FormLabel>
                    </div>
                  </FormItem>
                )}
              />
            </div>

            {/* Personal Bio */}
            <FormField
              control={form.control}
              name="personalBio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Personal Bio *</FormLabel>
                  <FormControl>
                    <Textarea {...field} rows={4} disabled={!canEdit} />
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
                <FormItem>
                  <FormLabel>Firm Bio *</FormLabel>
                  <FormControl>
                    <Textarea {...field} rows={4} disabled={!canEdit} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Advisor Services Multi-select */}
            <FormItem>
              <FormLabel>Advisor Services</FormLabel>
              <Select onValueChange={addService} disabled={!canEdit}>
                <SelectTrigger>
                  <SelectValue placeholder="Select services" />
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
                {currentSelectedServices.map((service: ServiceType) => (
                  <Badge key={service} variant="secondary" className="pr-1">
                    {service}
                    {canEdit && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="ml-1 h-auto p-0"
                        onClick={() => removeService(service)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    )}
                  </Badge>
                ))}
              </div>
              <FormMessage />
            </FormItem>

            {/* Professional Designations Multi-select */}
            <FormItem>
              <FormLabel>Professional Designations</FormLabel>
              <Select onValueChange={addDesignation} disabled={!canEdit}>
                <SelectTrigger>
                  <SelectValue placeholder="Select professional designations" />
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
                {currentSelectedDesignations.map((designation: DesignationType) => (
                  <Badge key={designation} variant="secondary" className="pr-1">
                    {designation}
                    {canEdit && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="ml-1 h-auto p-0"
                        onClick={() => removeDesignation(designation)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    )}
                  </Badge>
                ))}
              </div>
              <FormMessage />
            </FormItem>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Compensation Types Multi-select */}
              <FormItem>
                <FormLabel>Compensation Types</FormLabel>
                <Select onValueChange={addCompensationType} disabled={!canEdit}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select compensation types" />
                  </SelectTrigger>
                  <SelectContent>
                    {COMPENSATION_TYPES.map((type) => (
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
                      {canEdit && (
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
                      )}
                    </Badge>
                  ))}
                </div>
                <FormMessage />
              </FormItem>

              {/* Licenses Multi-select */}
              <FormItem>
                <FormLabel>Licenses</FormLabel>
                <Select onValueChange={addLicense} disabled={!canEdit}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select licenses" />
                  </SelectTrigger>
                  <SelectContent>
                    {LICENSE_VALUES.map((license) => (
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
                      {canEdit && (
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
                      )}
                    </Badge>
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            </div>

            {/* Client Types Multi-select */}
            <FormItem>
              <FormLabel>Client Types</FormLabel>
              <Select onValueChange={addClientType} disabled={!canEdit}>
                <SelectTrigger>
                  <SelectValue placeholder="Select client types" />
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
                {currentSelectedClientTypes.map((type: ClientType) => (
                  <Badge key={type} variant="secondary" className="pr-1">
                    {type}
                    {canEdit && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="ml-1 h-auto p-0"
                        onClick={() => removeClientType(type)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    )}
                  </Badge>
                ))}
              </div>
              <FormMessage />
            </FormItem>

            {/* States Registered In Multi-select */}
            <FormItem>
              <FormLabel>States Registered In</FormLabel>
              <Select onValueChange={addState} disabled={!canEdit} value="">
                <SelectTrigger>
                  <SelectValue placeholder="Select a state" />
                </SelectTrigger>
                <SelectContent>
                  {US_STATES.map((state) => (
                    <SelectItem 
                      key={state} 
                      value={state}
                      disabled={currentSelectedStates.includes(state)}
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
                    {canEdit && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="ml-1 h-auto p-0"
                        onClick={() => removeState(state)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    )}
                  </Badge>
                ))}
              </div>
              <FormMessage />
            </FormItem>

            {canEdit && (
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Updating..." : "Update Profile"}
              </Button>
            )}
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
