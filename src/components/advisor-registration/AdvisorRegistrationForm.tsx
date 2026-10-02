import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
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
import { ADVISOR_SERVICES, type AdvisorService } from '@/constants/advisorServices';
import { isEmailVerified } from '@/lib/authHelpers';

const US_STATES = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California',
  'Colorado', 'Connecticut', 'Delaware', 'District of Columbia', 'Florida',
  'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas',
  'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan',
  'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada',
  'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina',
  'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Puerto Rico', 'Rhode Island',
  'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont',
  'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
] as const satisfies readonly string[];

type USState = typeof US_STATES[number];

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

const COMPENSATION_TYPES = [
  'Fee-Only',
  'Fee-Based',
  'Commission',
  'Hourly',
  'Flat Fee',
  'Assets Under Management'
] as const;

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

const SERVICE_VALUES = ADVISOR_SERVICES;

type ServiceType = AdvisorService;
type DesignationType = typeof DESIGNATION_VALUES[number];
type LicenseType = typeof LICENSE_VALUES[number];
type CompensationType = typeof COMPENSATION_TYPES[number];

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

const AVAILABLE_SERVICES: ServiceType[] = [...SERVICE_VALUES];
const AVAILABLE_DESIGNATIONS: DesignationType[] = [...DESIGNATION_VALUES];
const AVAILABLE_LICENSES: LicenseType[] = [...LICENSE_VALUES];
const AVAILABLE_COMPENSATION_TYPES: CompensationType[] = [...COMPENSATION_TYPES];
const AVAILABLE_CLIENT_TYPES: ClientType[] = [...CLIENT_TYPES];

export type AdvisorFormInitialValues = Partial<{
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  position: string;
}>;

interface AdvisorFormProps {
  onSuccess: () => void;
  disabled?: boolean;
  initialValues?: AdvisorFormInitialValues;
}

export const AdvisorForm = ({
  onSuccess,
  disabled = false,
  initialValues,
}: AdvisorFormProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const prefilledRef = useRef(false);

  const form = useForm<AdvisorFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: initialValues?.firstName || '',
      lastName: initialValues?.lastName || '',
      firmName: '',
      position: initialValues?.position || '',
      personalBio: '',
      firmBio: '',
      email: initialValues?.email || '',
      phoneNumber: initialValues?.phoneNumber || '',
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

  // Prefill from auth metadata / parent + profiles table when available
  useEffect(() => {
    if (!user || prefilledRef.current) return;

    let cancelled = false;

    const applyPrefill = (values: AdvisorFormInitialValues) => {
      const current = form.getValues();
      if (values.firstName && !current.firstName) {
        form.setValue('firstName', values.firstName, { shouldDirty: false });
      }
      if (values.lastName && !current.lastName) {
        form.setValue('lastName', values.lastName, { shouldDirty: false });
      }
      if (values.email && !current.email) {
        form.setValue('email', values.email, { shouldDirty: false });
      }
      if (values.phoneNumber && !current.phoneNumber) {
        form.setValue('phoneNumber', values.phoneNumber, { shouldDirty: false });
      }
      if (values.position && !current.position) {
        form.setValue('position', values.position, { shouldDirty: false });
      }
    };

    applyPrefill(initialValues || {});

    (async () => {
      const { data } = await supabase
        .from('profiles')
        .select('first_name, last_name, phone_number, professional_type')
        .eq('id', user.id)
        .maybeSingle();

      if (cancelled || !data) {
        prefilledRef.current = true;
        return;
      }

      applyPrefill({
        firstName: data.first_name || '',
        lastName: data.last_name || '',
        phoneNumber: data.phone_number || '',
        position: data.professional_type || '',
        email: user.email || '',
      });
      prefilledRef.current = true;
    })();

    return () => {
      cancelled = true;
    };
  }, [user, initialValues, form]);

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
      if (!isEmailVerified(user)) {
        throw new Error("Please verify your email before submitting your advisor profile");
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
    onError: (error: unknown) => {
      console.error('Error submitting advisor profile:', error);
      const message =
        error instanceof Error ? error.message : "Failed to submit advisor profile";
      toast({
        title: "Error",
        description: message,
        variant: "destructive"
      });
    },
  });

  const onSubmit = (data: AdvisorFormData) => {
    if (disabled || !isEmailVerified(user)) {
      toast({
        title: "Email verification required",
        description: "Verify your email before submitting your advisor profile.",
        variant: "destructive",
      });
      return;
    }
    mutation.mutate(data);
  };

  const addService = (service: ServiceType) => {
    if (disabled) return;
    if (currentSelectedServices.length >= 10) {
      toast({
        title: 'Maximum services reached',
        description: 'You can only select up to 10 services.',
        variant: 'destructive'
      });
      return;
    }
    if (!currentSelectedServices.includes(service)) {
      form.setValue('advisor_services', [...currentSelectedServices, service], {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  };

  const removeService = (serviceToRemove: ServiceType) => {
    if (disabled) return;
    form.setValue(
      'advisor_services',
      currentSelectedServices.filter((service) => service !== serviceToRemove),
      { shouldValidate: true, shouldDirty: true }
    );
  };

  const addDesignation = (designation: DesignationType) => {
    if (disabled) return;
    if (currentSelectedDesignations.length >= 10) {
      toast({
        title: 'Maximum designations reached',
        description: 'You can only select up to 10 designations.',
        variant: 'destructive'
      });
      return;
    }
    if (!currentSelectedDesignations.includes(designation)) {
      form.setValue(
        'professional_designations',
        [...currentSelectedDesignations, designation],
        { shouldValidate: true, shouldDirty: true }
      );
    }
  };

  const removeDesignation = (designationToRemove: DesignationType) => {
    if (disabled) return;
    form.setValue(
      'professional_designations',
      currentSelectedDesignations.filter((d) => d !== designationToRemove),
      { shouldValidate: true, shouldDirty: true }
    );
  };

  const addLicense = (license: LicenseType) => {
    if (disabled) return;
    if (currentSelectedLicenses.length >= 15) {
      toast({
        title: 'Maximum licenses reached',
        description: 'You can only select up to 15 licenses.',
        variant: 'destructive'
      });
      return;
    }
    if (!currentSelectedLicenses.includes(license)) {
      form.setValue('licenses', [...currentSelectedLicenses, license], {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  };

  const removeLicense = (licenseToRemove: LicenseType) => {
    if (disabled) return;
    form.setValue(
      'licenses',
      currentSelectedLicenses.filter((license) => license !== licenseToRemove),
      { shouldValidate: true, shouldDirty: true }
    );
  };

  const addClientType = (clientType: ClientType) => {
    if (disabled) return;
    if (currentSelectedClientTypes.length >= 10) {
      toast({
        title: 'Maximum client types reached',
        description: 'You can only select up to 10 client types.',
        variant: 'destructive'
      });
      return;
    }
    if (!currentSelectedClientTypes.includes(clientType)) {
      form.setValue('client_type', [...currentSelectedClientTypes, clientType], {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  };

  const removeClientType = (clientTypeToRemove: ClientType) => {
    if (disabled) return;
    form.setValue(
      'client_type',
      currentSelectedClientTypes.filter((type) => type !== clientTypeToRemove),
      { shouldValidate: true, shouldDirty: true }
    );
  };

  const addCompensationType = (type: CompensationType) => {
    if (disabled) return;
    if (currentSelectedCompensationTypes.length >= 6) {
      toast({
        title: 'Maximum compensation types reached',
        description: 'You can only select up to 6 compensation types.',
        variant: 'destructive'
      });
      return;
    }
    if (!currentSelectedCompensationTypes.includes(type)) {
      form.setValue('compensation', [...currentSelectedCompensationTypes, type], {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  };

  const removeCompensationType = (typeToRemove: CompensationType) => {
    if (disabled) return;
    form.setValue(
      'compensation',
      currentSelectedCompensationTypes.filter((type) => type !== typeToRemove),
      { shouldValidate: true, shouldDirty: true }
    );
  };

  const fieldDisabled = disabled;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-0"
        aria-busy={mutation.isPending}
      >
        <fieldset disabled={fieldDisabled} className="contents">
          {/* Section 1: About you */}
          <section className="onboard-section">
            <div className="onboard-section__header">
              <h3>About you</h3>
              <p>We’ll use this for your public listing and how clients reach you.</p>
            </div>
            <div className="onboard-grid onboard-grid--2">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First name *</FormLabel>
                    <FormControl>
                      <Input
                        className="auth-input"
                        required
                        aria-required="true"
                        autoComplete="given-name"
                        {...field}
                      />
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
                    <FormLabel>Last name *</FormLabel>
                    <FormControl>
                      <Input
                        className="auth-input"
                        required
                        aria-required="true"
                        autoComplete="family-name"
                        {...field}
                      />
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
                      <Input
                        type="email"
                        className="auth-input"
                        required
                        aria-required="true"
                        autoComplete="email"
                        {...field}
                      />
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
                    <FormLabel>Phone number *</FormLabel>
                    <FormControl>
                      <Input
                        type="tel"
                        className="auth-input"
                        required
                        aria-required="true"
                        autoComplete="tel"
                        {...field}
                      />
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
                    <FormLabel>Position / advisor type *</FormLabel>
                    <FormControl>
                      <Input
                        className="auth-input"
                        required
                        aria-required="true"
                        placeholder="e.g. Financial Advisor"
                        {...field}
                      />
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
                    <FormLabel>Years of experience</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        className="auth-input"
                        min={0}
                        {...field}
                        value={field.value ?? ''}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value === '' ? undefined : Number(e.target.value)
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </section>

          {/* Section 2: Practice */}
          <section className="onboard-section">
            <div className="onboard-section__header">
              <h3>Your practice</h3>
              <p>Firm details, location, and how you work with clients.</p>
            </div>
            <div className="onboard-grid onboard-grid--2">
              <FormField
                control={form.control}
                name="firmName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Firm name *</FormLabel>
                    <FormControl>
                      <Input className="auth-input" required aria-required="true" {...field} />
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
                      <Input
                        type="url"
                        className="auth-input"
                        placeholder="https://"
                        {...field}
                      />
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
                      <Input className="auth-input" required aria-required="true" {...field} />
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
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={fieldDisabled}
                    >
                      <FormControl>
                        <SelectTrigger
                          className="auth-select"
                          aria-required="true"
                        >
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
                name="minimum"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Minimum investment</FormLabel>
                    <FormControl>
                      <Input className="auth-input" placeholder="e.g. $250,000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="fiduciary"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-xl border border-gray-200 bg-white p-4">
                    <FormControl>
                      <Checkbox
                        className="auth-check__control"
                        checked={field.value}
                        onCheckedChange={(checked) => field.onChange(checked === true)}
                        disabled={fieldDisabled}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>I am a fiduciary</FormLabel>
                      <p className="text-sm text-muted-foreground">
                        Shown on your public profile as a trust signal.
                      </p>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="personalBio"
                render={({ field }) => (
                  <FormItem className="onboard-field-span">
                    <FormLabel>Personal bio *</FormLabel>
                    <FormControl>
                      <Textarea
                        className="auth-textarea"
                        rows={5}
                        required
                        aria-required="true"
                        placeholder="Share your background, approach, and who you help best."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="firmBio"
                render={({ field }) => (
                  <FormItem className="onboard-field-span">
                    <FormLabel>Firm bio *</FormLabel>
                    <FormControl>
                      <Textarea
                        className="auth-textarea"
                        rows={5}
                        required
                        aria-required="true"
                        placeholder="Describe your firm’s philosophy, team, and client experience."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </section>

          {/* Section 3: Credentials */}
          <section className="onboard-section">
            <div className="onboard-section__header">
              <h3>Credentials & focus</h3>
              <p>Help people filter by specialties, licenses, and who you serve.</p>
            </div>
            <div className="onboard-grid onboard-grid--2">
              <FormItem className="onboard-field-span">
                <FormLabel>Advisor services</FormLabel>
                <Select onValueChange={addService} disabled={fieldDisabled}>
                  <SelectTrigger className="auth-select">
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
                <div className="onboard-chips">
                  {currentSelectedServices.map((service: ServiceType) => (
                    <Badge key={service} variant="secondary" className="pr-1">
                      {service}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="ml-1 h-auto p-0"
                        onClick={() => removeService(service)}
                        disabled={fieldDisabled}
                        aria-label={`Remove ${service}`}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              </FormItem>

              <div className="space-y-2">
                <FormLabel>Compensation types</FormLabel>
                <Select onValueChange={addCompensationType} disabled={fieldDisabled}>
                  <SelectTrigger className="auth-select">
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
                <div className="onboard-chips">
                  {currentSelectedCompensationTypes.map((type: CompensationType) => (
                    <Badge key={type} variant="secondary" className="flex items-center gap-1">
                      {type}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          removeCompensationType(type);
                        }}
                        className="ml-1 rounded-full hover:bg-gray-200 p-0.5"
                        disabled={fieldDisabled}
                        aria-label={`Remove ${type}`}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <FormLabel>Licenses</FormLabel>
                <Select onValueChange={addLicense} disabled={fieldDisabled}>
                  <SelectTrigger className="auth-select">
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
                <div className="onboard-chips">
                  {currentSelectedLicenses.map((license: LicenseType) => (
                    <Badge key={license} variant="secondary" className="flex items-center gap-1">
                      {license}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          removeLicense(license);
                        }}
                        className="ml-1 rounded-full hover:bg-gray-200 p-0.5"
                        disabled={fieldDisabled}
                        aria-label={`Remove ${license}`}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>

              <FormItem className="onboard-field-span">
                <FormLabel>Client types</FormLabel>
                <Select onValueChange={addClientType} disabled={fieldDisabled}>
                  <SelectTrigger className="auth-select">
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
                <div className="onboard-chips">
                  {currentSelectedClientTypes.map((type: ClientType) => (
                    <Badge key={type} variant="secondary" className="pr-1">
                      {type}
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="ml-1 h-auto p-0"
                        onClick={() => removeClientType(type)}
                        disabled={fieldDisabled}
                        aria-label={`Remove ${type}`}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              </FormItem>

              <FormItem className="onboard-field-span">
                <FormLabel>States registered in</FormLabel>
                <Select
                  onValueChange={(value: USState) => {
                    if (disabled) return;
                    if (!currentSelectedStates.includes(value)) {
                      form.setValue(
                        'states_registered_in',
                        [...currentSelectedStates, value] as USState[],
                        { shouldValidate: true, shouldDirty: true }
                      );
                    } else {
                      toast({
                        title: 'State already added',
                        description: 'This state has already been added.',
                        variant: 'destructive'
                      });
                    }
                  }}
                  value=""
                  disabled={fieldDisabled}
                >
                  <SelectTrigger className="auth-select">
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
                <div className="onboard-chips">
                  {currentSelectedStates.map((state: string) => (
                    <Badge key={state} variant="secondary" className="pr-1">
                      {state}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="ml-1 h-auto p-0"
                        onClick={() => {
                          form.setValue(
                            'states_registered_in',
                            currentSelectedStates.filter((s) => s !== state) as USState[],
                            { shouldValidate: true, shouldDirty: true }
                          );
                        }}
                        disabled={fieldDisabled}
                        aria-label={`Remove ${state}`}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              </FormItem>

              <FormItem className="onboard-field-span">
                <FormLabel>Professional designations</FormLabel>
                <Select onValueChange={addDesignation} disabled={fieldDisabled}>
                  <SelectTrigger className="auth-select">
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
                <div className="onboard-chips">
                  {currentSelectedDesignations.map((designation: DesignationType) => (
                    <Badge key={designation} variant="secondary" className="pr-1">
                      {designation}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="ml-1 h-auto p-0"
                        onClick={() => removeDesignation(designation)}
                        disabled={fieldDisabled}
                        aria-label={`Remove ${designation}`}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              </FormItem>
            </div>
          </section>

          {/* Section 4: Review */}
          <section className="onboard-section">
            <div className="onboard-section__header">
              <h3>Review & submit</h3>
              <p>Confirm the legal terms, then send your profile for review.</p>
            </div>

            <FormField
              control={form.control}
              name="terms"
              render={({ field }) => (
                <FormItem className="auth-check rounded-xl border border-gray-200 bg-white p-4">
                  <FormControl>
                    <Checkbox
                      id="advisor-terms"
                      className="auth-check__control"
                      checked={field.value}
                      onCheckedChange={(checked) => field.onChange(checked === true)}
                      disabled={fieldDisabled}
                      required
                      aria-required="true"
                      aria-describedby="advisor-terms-help"
                    />
                  </FormControl>
                  <div className="auth-check__body">
                    <FormLabel htmlFor="advisor-terms" className="auth-check__label !mt-0">
                      I agree to the Terms of Service and Privacy Policy *
                    </FormLabel>
                    <p id="advisor-terms-help">
                      Please review our{" "}
                      <Link to="/terms" target="_blank" rel="noopener noreferrer">
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link to="/privacy" target="_blank" rel="noopener noreferrer">
                        Privacy Policy
                      </Link>
                      .
                    </p>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            <div className="onboard-submit">
              <p>
                {disabled
                  ? "Verify your email to unlock this form and submit your public profile."
                  : "Profiles are reviewed before they appear in the directory — usually within a few business days."}
              </p>
              <button
                type="submit"
                className="btn btn--green btn--lg"
                disabled={mutation.isPending || disabled}
              >
                {mutation.isPending ? 'Submitting…' : 'Submit profile for review'}
              </button>
            </div>
          </section>
        </fieldset>
      </form>
    </Form>
  );
};
