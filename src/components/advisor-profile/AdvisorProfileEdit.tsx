
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Advisor } from '@/services/advisorsService';
import { AdvisorService } from '@/constants/advisorServices';
import { ClientType } from '@/constants/clientTypes';

const editSchema = z.object({
  firmName: z.string().min(1, "Firm name is required"),
  position: z.string().min(1, "Position is required"),
  personalBio: z.string().min(10, "Personal bio must be at least 10 characters"),
  firmBio: z.string().min(10, "Firm bio must be at least 10 characters"),
  email: z.string().email("Invalid email address"),
  phoneNumber: z.string().min(1, "Phone number is required"),
  yearsOfExperience: z.string().min(1, "Years of experience is required"),
  city: z.string().min(1, "City is required"),
  minimum: z.string().optional(),
  websiteUrl: z.string().url("Invalid website URL").optional().or(z.literal("")),
});

interface AdvisorProfileEditProps {
  advisor: Advisor;
  onUpdate: () => void;
}

export const AdvisorProfileEdit: React.FC<AdvisorProfileEditProps> = ({ advisor, onUpdate }) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(editSchema),
    defaultValues: {
      firmName: advisor.firm_name || '',
      position: advisor.position || '',
      personalBio: advisor.personal_bio || '',
      firmBio: advisor.firm_bio || '',
      email: advisor.email || '',
      phoneNumber: advisor.phone_number || '',
      yearsOfExperience: advisor.years_of_experience?.toString() || '',
      city: advisor.city || '',
      minimum: advisor.minimum || '',
      websiteUrl: advisor.website_url || '',
    }
  });

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);

    try {
      const updateData = {
        firm_name: data.firmName,
        position: data.position,
        personal_bio: data.personalBio,
        firm_bio: data.firmBio,
        email: data.email,
        phone_number: data.phoneNumber,
        years_of_experience: parseInt(data.yearsOfExperience),
        city: data.city,
        minimum: data.minimum,
        website_url: data.websiteUrl || null,
        updated_at: new Date().toISOString(),
      };

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
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="firmName">Firm Name</Label>
              <Input
                id="firmName"
                {...register('firmName')}
                disabled={!canEdit}
              />
              {errors.firmName && (
                <p className="text-sm text-red-600">{errors.firmName.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="position">Position</Label>
              <Input
                id="position"
                {...register('position')}
                disabled={!canEdit}
              />
              {errors.position && (
                <p className="text-sm text-red-600">{errors.position.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="personalBio">Personal Bio</Label>
            <Textarea
              id="personalBio"
              {...register('personalBio')}
              rows={4}
              disabled={!canEdit}
            />
            {errors.personalBio && (
              <p className="text-sm text-red-600">{errors.personalBio.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="firmBio">Firm Bio</Label>
            <Textarea
              id="firmBio"
              {...register('firmBio')}
              rows={4}
              disabled={!canEdit}
            />
            {errors.firmBio && (
              <p className="text-sm text-red-600">{errors.firmBio.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                {...register('email')}
                disabled={!canEdit}
              />
              {errors.email && (
                <p className="text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                {...register('phoneNumber')}
                disabled={!canEdit}
              />
              {errors.phoneNumber && (
                <p className="text-sm text-red-600">{errors.phoneNumber.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="yearsOfExperience">Years of Experience</Label>
              <Input
                id="yearsOfExperience"
                type="number"
                {...register('yearsOfExperience')}
                disabled={!canEdit}
              />
              {errors.yearsOfExperience && (
                <p className="text-sm text-red-600">{errors.yearsOfExperience.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                {...register('city')}
                disabled={!canEdit}
              />
              {errors.city && (
                <p className="text-sm text-red-600">{errors.city.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="minimum">Minimum Investment</Label>
              <Input
                id="minimum"
                {...register('minimum')}
                placeholder="e.g., $100,000"
                disabled={!canEdit}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="websiteUrl">Website URL</Label>
            <Input
              id="websiteUrl"
              type="url"
              {...register('websiteUrl')}
              placeholder="https://..."
              disabled={!canEdit}
            />
            {errors.websiteUrl && (
              <p className="text-sm text-red-600">{errors.websiteUrl.message}</p>
            )}
          </div>

          {canEdit && (
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Updating..." : "Update Profile"}
            </Button>
          )}
        </form>
      </CardContent>
    </Card>
  );
};
