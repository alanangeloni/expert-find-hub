import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { AdvisorService } from '@/constants/advisorServices';
import { ClientType } from '@/constants/clientTypes';

const formSchema = z.object({
  firstName: z.string().min(2, {
    message: "First name must be at least 2 characters.",
  }),
  lastName: z.string().min(2, {
    message: "Last name must be at least 2 characters.",
  }),
  firmName: z.string().min(1, {
    message: "Firm name is required",
  }),
  position: z.string().min(1, {
    message: "Position is required",
  }),
  personalBio: z.string().min(10, {
    message: "Personal bio must be at least 10 characters",
  }),
  firmBio: z.string().min(10, {
    message: "Firm bio must be at least 10 characters",
  }),
  email: z.string().email({
    message: "Invalid email address",
  }),
  phoneNumber: z.string().min(1, {
    message: "Phone number is required",
  }),
  yearsOfExperience: z.string().min(1, {
    message: "Years of experience is required",
  }),
  stateHq: z.string().min(1, {
    message: "State is required",
  }),
  city: z.string().min(1, {
    message: "City is required",
  }),
  minimum: z.string().optional(),
  websiteUrl: z.string().url({
    message: "Invalid website URL",
  }).optional().or(z.literal("")),
  advisorServices: z.array(z.string()).min(1, {
    message: "At least one advisor service is required",
  }),
  professionalDesignations: z.array(z.string()).optional(),
  clientType: z.array(z.string()).min(1, {
    message: "At least one client type is required",
  }),
  licenses: z.array(z.string()).optional(),
  compensation: z.array(z.string()).optional(),
  fiduciary: z.boolean().default(false),
  terms: z.boolean().refine((value) => value === true, {
    message: 'You must accept the terms and conditions.',
  }),
});

export const AdvisorForm = ({ onSuccess }: { onSuccess: () => void }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: any) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to submit an advisor profile",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const advisorData = {
        user_id: user.id,
        name: `${data.firstName} ${data.lastName}`,
        slug: `${data.firstName.toLowerCase()}-${data.lastName.toLowerCase()}-${Date.now()}`,
        firm_name: data.firmName,
        position: data.position,
        personal_bio: data.personalBio,
        firm_bio: data.firmBio,
        email: data.email,
        phone_number: data.phoneNumber,
        years_of_experience: parseInt(data.yearsOfExperience),
        state_hq: data.stateHq,
        city: data.city,
        minimum: data.minimum,
        website_url: data.websiteUrl,
        advisor_services: data.advisorServices as AdvisorService[],
        professional_designations: data.professionalDesignations,
        client_type: data.clientType as ClientType[],
        licenses: data.licenses,
        compensation: data.compensation,
        fiduciary: data.fiduciary,
        verified: false,
        premium: false,
        status: 'pending_approval'
      };

      const { error } = await supabase
        .from('financial_advisors')
        .insert([advisorData]);

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Your advisor profile has been submitted for review."
      });

      onSuccess();
    } catch (error: any) {
      console.error('Error submitting advisor profile:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to submit advisor profile",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            {...register("firstName")}
            type="text"
            placeholder="John"
          />
          {errors.firstName && (
            <p className="text-sm text-red-500">{errors.firstName.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            {...register("lastName")}
            type="text"
            placeholder="Doe"
          />
          {errors.lastName && (
            <p className="text-sm text-red-500">{errors.lastName.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="firmName">Firm Name</Label>
        <Input
          id="firmName"
          {...register("firmName")}
          type="text"
          placeholder="Acme Corp"
        />
        {errors.firmName && (
          <p className="text-sm text-red-500">{errors.firmName.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="position">Position</Label>
        <Input
          id="position"
          {...register("position")}
          type="text"
          placeholder="Financial Advisor"
        />
        {errors.position && (
          <p className="text-sm text-red-500">{errors.position.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="personalBio">Personal Bio</Label>
        <Textarea
          id="personalBio"
          {...register("personalBio")}
          placeholder="Tell us about yourself"
          rows={3}
        />
        {errors.personalBio && (
          <p className="text-sm text-red-500">{errors.personalBio.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="firmBio">Firm Bio</Label>
        <Textarea
          id="firmBio"
          {...register("firmBio")}
          placeholder="Tell us about your firm"
          rows={3}
        />
        {errors.firmBio && (
          <p className="text-sm text-red-500">{errors.firmBio.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            {...register("email")}
            type="email"
            placeholder="you@example.com"
          />
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phoneNumber">Phone Number</Label>
          <Input
            id="phoneNumber"
            {...register("phoneNumber")}
            type="tel"
            placeholder="+1 (555) 123-4567"
          />
          {errors.phoneNumber && (
            <p className="text-sm text-red-500">{errors.phoneNumber.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="yearsOfExperience">Years of Experience</Label>
          <Input
            id="yearsOfExperience"
            {...register("yearsOfExperience")}
            type="number"
            placeholder="5"
          />
          {errors.yearsOfExperience && (
            <p className="text-sm text-red-500">{errors.yearsOfExperience.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="stateHq">State</Label>
          <Input
            id="stateHq"
            {...register("stateHq")}
            type="text"
            placeholder="NY"
          />
          {errors.stateHq && (
            <p className="text-sm text-red-500">{errors.stateHq.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="city">City</Label>
          <Input
            id="city"
            {...register("city")}
            type="text"
            placeholder="New York"
          />
          {errors.city && (
            <p className="text-sm text-red-500">{errors.city.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="minimum">Minimum Investment</Label>
          <Input
            id="minimum"
            {...register("minimum")}
            type="text"
            placeholder="$100,000"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="websiteUrl">Website URL</Label>
        <Input
          id="websiteUrl"
          {...register("websiteUrl")}
          type="url"
          placeholder="https://example.com"
        />
        {errors.websiteUrl && (
          <p className="text-sm text-red-500">{errors.websiteUrl.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Advisor Services</Label>
        {Object.values(AdvisorService).map((service) => (
          <div key={service} className="flex items-center space-x-2">
            <Checkbox
              id={`advisorServices-${service}`}
              value={service}
              {...register("advisorServices")}
            />
            <Label htmlFor={`advisorServices-${service}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              {service}
            </Label>
          </div>
        ))}
        {errors.advisorServices && (
          <p className="text-sm text-red-500">{errors.advisorServices.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Client Type</Label>
        {Object.values(ClientType).map((type) => (
          <div key={type} className="flex items-center space-x-2">
            <Checkbox
              id={`clientType-${type}`}
              value={type}
              {...register("clientType")}
            />
            <Label htmlFor={`clientType-${type}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              {type}
            </Label>
          </div>
        ))}
        {errors.clientType && (
          <p className="text-sm text-red-500">{errors.clientType.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Professional Designations</Label>
        <Input
          id="professionalDesignations"
          {...register("professionalDesignations")}
          type="text"
          placeholder="CFP, CFA"
        />
      </div>

      <div className="space-y-2">
        <Label>Licenses</Label>
        <Input
          id="licenses"
          {...register("licenses")}
          type="text"
          placeholder="Series 7, Series 66"
        />
      </div>

      <div className="space-y-2">
        <Label>Compensation</Label>
        <Input
          id="compensation"
          {...register("compensation")}
          type="text"
          placeholder="Fee-based, Commission-based"
        />
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="fiduciary"
          {...register("fiduciary")}
        />
        <Label htmlFor="fiduciary" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          I am a fiduciary
        </Label>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="terms"
          {...register("terms")}
        />
        <Label htmlFor="terms" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          I agree to the <a href="/terms" className="text-blue-500">terms and conditions</a>
        </Label>
        {errors.terms && (
          <p className="text-sm text-red-500">{errors.terms.message}</p>
        )}
      </div>

      <div>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit"}
        </Button>
      </div>
    </form>
  );
};
