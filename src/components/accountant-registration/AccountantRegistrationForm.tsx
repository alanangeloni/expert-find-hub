import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { US_STATES } from "@/constants/states";
import {
  ACCOUNTANT_CREDENTIALS,
  ACCOUNTANT_SERVICES,
  ACCOUNTANT_SPECIALTIES,
} from "@/constants/accountants";
import { isEmailVerified } from "@/lib/authHelpers";
import type { Database } from "@/integrations/supabase/types";

type AccountingService = Database["public"]["Enums"]["accounting_service_type"];
type ClientSpecialty = Database["public"]["Enums"]["client_specialty_type"];
type StateEnum = Database["public"]["Enums"]["States"];
type USState = (typeof US_STATES)[number];

const serviceValues = [...ACCOUNTANT_SERVICES] as const;
const specialtyValues = [...ACCOUNTANT_SPECIALTIES] as const;
const credentialValues = [...ACCOUNTANT_CREDENTIALS] as const;

const serviceEnum = z.enum(serviceValues as unknown as [string, ...string[]]);
const specialtyEnum = z.enum(specialtyValues as unknown as [string, ...string[]]);
const credentialEnum = z.enum(credentialValues as unknown as [string, ...string[]]);
const stateEnum = z.enum(US_STATES as unknown as [string, ...string[]]);

const formSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters."),
  lastName: z.string().min(2, "Last name must be at least 2 characters."),
  firmName: z.string().min(1, "Firm name is required"),
  position: z.string().min(1, "Position is required"),
  bio: z.string().min(10, "Bio must be at least 10 characters"),
  email: z.string().email("Invalid email address"),
  phoneNumber: z.string().min(1, "Phone number is required"),
  yearsOfExperience: z.number().min(0).optional(),
  stateHq: z.string().min(1, "State is required"),
  city: z.string().min(1, "City is required"),
  minimumFee: z.string().optional(),
  pricingNote: z.string().optional(),
  websiteUrl: z.string().url("Invalid website URL").optional().or(z.literal("")),
  services: z.array(serviceEnum).max(15, "Maximum 15 services allowed").optional(),
  clientSpecialties: z
    .array(specialtyEnum)
    .max(15, "Maximum 15 specialties allowed")
    .optional(),
  credentials: z
    .array(credentialEnum)
    .max(10, "Maximum 10 credentials allowed")
    .optional(),
  statesServed: z.array(stateEnum).max(50, "Maximum 50 states allowed").optional(),
  terms: z.boolean().refine((value) => value === true, {
    message: "You must accept the terms and conditions.",
  }),
});

type AccountantFormData = z.infer<typeof formSchema>;

export type AccountantFormInitialValues = Partial<{
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  position: string;
}>;

interface AccountantRegistrationFormProps {
  onSuccess: () => void;
  disabled?: boolean;
  initialValues?: AccountantFormInitialValues;
}

export const AccountantRegistrationForm = ({
  onSuccess,
  disabled = false,
  initialValues,
}: AccountantRegistrationFormProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const prefilledRef = useRef(false);
  const fieldDisabled = disabled;

  const form = useForm<AccountantFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: initialValues?.firstName || "",
      lastName: initialValues?.lastName || "",
      firmName: "",
      position: initialValues?.position || "",
      bio: "",
      email: initialValues?.email || "",
      phoneNumber: initialValues?.phoneNumber || "",
      yearsOfExperience: undefined,
      stateHq: "",
      city: "",
      minimumFee: "",
      pricingNote: "",
      websiteUrl: "",
      services: [],
      clientSpecialties: [],
      credentials: [],
      statesServed: [],
      terms: false,
    },
  });

  useEffect(() => {
    if (!user || prefilledRef.current) return;

    let cancelled = false;

    const applyPrefill = (values: AccountantFormInitialValues) => {
      const current = form.getValues();
      if (values.firstName && !current.firstName) {
        form.setValue("firstName", values.firstName, { shouldDirty: false });
      }
      if (values.lastName && !current.lastName) {
        form.setValue("lastName", values.lastName, { shouldDirty: false });
      }
      if (values.email && !current.email) {
        form.setValue("email", values.email, { shouldDirty: false });
      }
      if (values.phoneNumber && !current.phoneNumber) {
        form.setValue("phoneNumber", values.phoneNumber, { shouldDirty: false });
      }
      if (values.position && !current.position) {
        form.setValue("position", values.position, { shouldDirty: false });
      }
    };

    applyPrefill(initialValues || {});

    (async () => {
      const { data } = await supabase
        .from("profiles")
        .select("first_name, last_name, phone_number, professional_type")
        .eq("id", user.id)
        .maybeSingle();

      if (cancelled || !data) {
        prefilledRef.current = true;
        return;
      }

      applyPrefill({
        firstName: data.first_name || "",
        lastName: data.last_name || "",
        phoneNumber: data.phone_number || "",
        position: data.professional_type || "",
        email: user.email || "",
      });
      prefilledRef.current = true;
    })();

    return () => {
      cancelled = true;
    };
  }, [user, initialValues, form]);

  const currentServices = form.watch("services") || [];
  const currentSpecialties = form.watch("clientSpecialties") || [];
  const currentCredentials = form.watch("credentials") || [];
  const currentStates = form.watch("statesServed") || [];

  const mutation = useMutation({
    mutationFn: async (formData: AccountantFormData) => {
      if (!user) {
        throw new Error("You must be logged in to submit an accountant profile");
      }
      if (!isEmailVerified(user)) {
        throw new Error("Please verify your email before submitting your accountant profile");
      }

      const accountantData: Database["public"]["Tables"]["accountants"]["Insert"] = {
        user_id: user.id,
        name: `${formData.firstName} ${formData.lastName}`,
        slug: `${formData.firstName.toLowerCase()}-${formData.lastName.toLowerCase()}-${Date.now()}`,
        firm_name: formData.firmName,
        position: formData.position,
        bio: formData.bio,
        email: formData.email,
        phone_number: formData.phoneNumber,
        years_of_experience: formData.yearsOfExperience ?? null,
        state_hq: formData.stateHq as StateEnum,
        city: formData.city,
        minimum_fee: formData.minimumFee || null,
        pricing_note: formData.pricingNote || null,
        website_url: formData.websiteUrl || null,
        services: (formData.services || []) as AccountingService[],
        client_specialties: (formData.clientSpecialties || []) as ClientSpecialty[],
        credentials: formData.credentials || [],
        states_served: (formData.statesServed || []) as string[],
        verified: false,
        status: "pending_approval",
        submitted_at: new Date().toISOString(),
      };

      const { error } = await supabase.from("accountants").insert([accountantData]);

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "Your accountant profile has been submitted for review.",
      });
      onSuccess();
    },
    onError: (error: unknown) => {
      console.error("Error submitting accountant profile:", error);
      const message =
        error instanceof Error ? error.message : "Failed to submit accountant profile";
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: AccountantFormData) => {
    if (disabled || !isEmailVerified(user)) {
      toast({
        title: "Email verification required",
        description: "Verify your email before submitting your accountant profile.",
        variant: "destructive",
      });
      return;
    }
    mutation.mutate(data);
  };

  const addToArray = <T extends string>(
    field: "services" | "clientSpecialties" | "credentials" | "statesServed",
    value: T,
    current: T[],
    max: number,
    label: string
  ) => {
    if (disabled) return;
    if (current.length >= max) {
      toast({
        title: `Maximum ${label} reached`,
        description: `You can only select up to ${max} ${label}.`,
        variant: "destructive",
      });
      return;
    }
    if (!current.includes(value)) {
      form.setValue(field, [...current, value] as never, {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  };

  const removeFromArray = <T extends string>(
    field: "services" | "clientSpecialties" | "credentials" | "statesServed",
    value: T,
    current: T[]
  ) => {
    if (disabled) return;
    form.setValue(
      field,
      current.filter((item) => item !== value) as never,
      { shouldValidate: true, shouldDirty: true }
    );
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="onboard-form space-y-8">
        <fieldset disabled={fieldDisabled} className="space-y-8 border-0 p-0 m-0">
          <section className="onboard-section">
            <div className="onboard-section__header">
              <h3>About you</h3>
              <p>Basic contact details for your public accountant profile.</p>
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
                    <FormLabel>Position / title *</FormLabel>
                    <FormControl>
                      <Input
                        className="auth-input"
                        required
                        aria-required="true"
                        placeholder="e.g. CPA & Founder"
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
                        value={field.value ?? ""}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value === "" ? undefined : Number(e.target.value)
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
                        <SelectTrigger className="auth-select" aria-required="true">
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
                name="minimumFee"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Minimum fee</FormLabel>
                    <FormControl>
                      <Input
                        className="auth-input"
                        placeholder="e.g. $500 / return"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="pricingNote"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pricing note</FormLabel>
                    <FormControl>
                      <Input
                        className="auth-input"
                        placeholder="Optional note about fees"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem className="onboard-field-span">
                    <FormLabel>Professional bio *</FormLabel>
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
            </div>
          </section>

          <section className="onboard-section">
            <div className="onboard-section__header">
              <h3>Credentials & focus</h3>
              <p>Help people filter by services, specialties, and credentials.</p>
            </div>
            <div className="onboard-grid onboard-grid--2">
              <FormItem className="onboard-field-span">
                <FormLabel>Services offered</FormLabel>
                <Select
                  onValueChange={(value) =>
                    addToArray("services", value, currentServices, 15, "services")
                  }
                  disabled={fieldDisabled}
                >
                  <SelectTrigger className="auth-select">
                    <SelectValue placeholder="Select services" />
                  </SelectTrigger>
                  <SelectContent>
                    {ACCOUNTANT_SERVICES.map((service) => (
                      <SelectItem key={service} value={service}>
                        {service}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="onboard-chips">
                  {currentServices.map((service) => (
                    <Badge key={service} variant="secondary" className="pr-1">
                      {service}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="ml-1 h-auto p-0"
                        onClick={() => removeFromArray("services", service, currentServices)}
                        disabled={fieldDisabled}
                        aria-label={`Remove ${service}`}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              </FormItem>

              <FormItem className="onboard-field-span">
                <FormLabel>Client specialties</FormLabel>
                <Select
                  onValueChange={(value) =>
                    addToArray(
                      "clientSpecialties",
                      value,
                      currentSpecialties,
                      15,
                      "specialties"
                    )
                  }
                  disabled={fieldDisabled}
                >
                  <SelectTrigger className="auth-select">
                    <SelectValue placeholder="Select client specialties" />
                  </SelectTrigger>
                  <SelectContent>
                    {ACCOUNTANT_SPECIALTIES.map((specialty) => (
                      <SelectItem key={specialty} value={specialty}>
                        {specialty}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="onboard-chips">
                  {currentSpecialties.map((specialty) => (
                    <Badge key={specialty} variant="secondary" className="pr-1">
                      {specialty}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="ml-1 h-auto p-0"
                        onClick={() =>
                          removeFromArray("clientSpecialties", specialty, currentSpecialties)
                        }
                        disabled={fieldDisabled}
                        aria-label={`Remove ${specialty}`}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              </FormItem>

              <FormItem className="onboard-field-span">
                <FormLabel>Credentials</FormLabel>
                <Select
                  onValueChange={(value) =>
                    addToArray(
                      "credentials",
                      value,
                      currentCredentials,
                      10,
                      "credentials"
                    )
                  }
                  disabled={fieldDisabled}
                >
                  <SelectTrigger className="auth-select">
                    <SelectValue placeholder="Select credentials" />
                  </SelectTrigger>
                  <SelectContent>
                    {ACCOUNTANT_CREDENTIALS.map((credential) => (
                      <SelectItem key={credential} value={credential}>
                        {credential}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="onboard-chips">
                  {currentCredentials.map((credential) => (
                    <Badge key={credential} variant="secondary" className="pr-1">
                      {credential}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="ml-1 h-auto p-0"
                        onClick={() =>
                          removeFromArray("credentials", credential, currentCredentials)
                        }
                        disabled={fieldDisabled}
                        aria-label={`Remove ${credential}`}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              </FormItem>

              <FormItem className="onboard-field-span">
                <FormLabel>States served</FormLabel>
                <Select
                  onValueChange={(value: USState) => {
                    if (disabled) return;
                    if (!currentStates.includes(value)) {
                      form.setValue("statesServed", [...currentStates, value], {
                        shouldValidate: true,
                        shouldDirty: true,
                      });
                    } else {
                      toast({
                        title: "State already added",
                        description: "This state has already been added.",
                        variant: "destructive",
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
                        disabled={currentStates.includes(state)}
                      >
                        {state}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="onboard-chips">
                  {currentStates.map((state) => (
                    <Badge key={state} variant="secondary" className="pr-1">
                      {state}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="ml-1 h-auto p-0"
                        onClick={() =>
                          form.setValue(
                            "statesServed",
                            currentStates.filter((s) => s !== state),
                            { shouldValidate: true, shouldDirty: true }
                          )
                        }
                        disabled={fieldDisabled}
                        aria-label={`Remove ${state}`}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              </FormItem>
            </div>
          </section>

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
                      id="accountant-terms"
                      className="auth-check__control"
                      checked={field.value}
                      onCheckedChange={(checked) => field.onChange(checked === true)}
                      disabled={fieldDisabled}
                      required
                      aria-required="true"
                      aria-describedby="accountant-terms-help"
                    />
                  </FormControl>
                  <div className="auth-check__body">
                    <FormLabel htmlFor="accountant-terms" className="auth-check__label !mt-0">
                      I agree to the Terms of Service and Privacy Policy *
                    </FormLabel>
                    <p id="accountant-terms-help">
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
                {mutation.isPending ? "Submitting…" : "Submit profile for review"}
              </button>
            </div>
          </section>
        </fieldset>
      </form>
    </Form>
  );
};
