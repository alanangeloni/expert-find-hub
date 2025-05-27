import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
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
  advisor_services: z.array(z.string()).max(10, 'Maximum 10 services allowed').optional(),
});

type AdvisorFormData = z.infer<typeof advisorSchema>;

interface AdvisorFormProps {
  advisor?: any;
  onSuccess: () => void;
}

const AVAILABLE_SERVICES = [
  'Financial Planning',
  'Retirement Planning',
  'Investment Management',
  'Estate Planning',
  'Tax Planning',
  'Insurance Planning',
  'Education Planning',
  'Business Planning',
  'Wealth Management',
  'Portfolio Management',
  'Risk Management',
  'Cash Flow Planning',
  'Debt Management',
  'College Planning',
  'Social Security Planning'
];

export function AdvisorForm({ advisor, onSuccess }: AdvisorFormProps) {
  const [selectedServices, setSelectedServices] = React.useState<string[]>(
    advisor?.advisor_services || []
  );

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
      advisor_services: advisor?.advisor_services || [],
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: AdvisorFormData) => {
      console.log('Submitting advisor data:', data);
      console.log('Selected services:', selectedServices);
      
      const advisorData = {
        name: data.name,
        slug: data.slug,
        firm_name: data.firm_name || null,
        position: data.position || null,
        personal_bio: data.personal_bio || null,
        firm_bio: data.firm_bio || null,
        email: data.email || null,
        phone_number: data.phone_number || null,
        years_of_experience: data.years_of_experience || null,
        state_hq: data.state_hq || null,
        city: data.city || null,
        minimum: data.minimum || null,
        website_url: data.website_url || null,
        verified: data.verified,
        premium: data.premium,
        fiduciary: data.fiduciary,
        first_session_is_free: data.first_session_is_free,
        advisor_services: selectedServices.length > 0 ? selectedServices : null,
      };

      console.log('Final advisor data being sent:', advisorData);

      if (advisor) {
        const { data: result, error } = await supabase
          .from('financial_advisors')
          .update(advisorData)
          .eq('id', advisor.id)
          .select();
        
        console.log('Update result:', result);
        if (error) {
          console.error('Update error:', error);
          throw error;
        }
      } else {
        const { data: result, error } = await supabase
          .from('financial_advisors')
          .insert(advisorData)
          .select();
        
        console.log('Insert result:', result);
        if (error) {
          console.error('Insert error:', error);
          throw error;
        }
      }
    },
    onSuccess: () => {
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
    console.log('Form submission data:', data);
    console.log('Current selected services:', selectedServices);
    mutation.mutate(data);
  };

  const addService = (service: string) => {
    if (selectedServices.length >= 10) {
      toast({
        title: 'Maximum services reached',
        description: 'You can only select up to 10 services.',
        variant: 'destructive'
      });
      return;
    }
    
    if (!selectedServices.includes(service)) {
      const newServices = [...selectedServices, service];
      console.log('Adding service, new services:', newServices);
      setSelectedServices(newServices);
      form.setValue('advisor_services', newServices);
    }
  };

  const removeService = (service: string) => {
    const newServices = selectedServices.filter(s => s !== service);
    console.log('Removing service, new services:', newServices);
    setSelectedServices(newServices);
    form.setValue('advisor_services', newServices);
  };

  const availableServicesToAdd = AVAILABLE_SERVICES.filter(
    service => !selectedServices.includes(service)
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  <Input 
                    type="number" 
                    {...field} 
                    onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
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
                <FormLabel>State</FormLabel>
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
                  <Input type="url" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="personal_bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Personal Bio</FormLabel>
              <FormControl>
                <Textarea {...field} rows={3} />
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
                <Textarea {...field} rows={3} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Services Offered Section */}
        <div className="space-y-4">
          <div>
            <FormLabel>Services Offered ({selectedServices.length}/10)</FormLabel>
            <p className="text-sm text-gray-500 mb-2">Select up to 10 services this advisor offers</p>
            
            {selectedServices.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {selectedServices.map((service) => (
                  <Badge key={service} variant="secondary" className="flex items-center gap-1">
                    {service}
                    <button
                      type="button"
                      onClick={() => removeService(service)}
                      className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}

            {availableServicesToAdd.length > 0 && selectedServices.length < 10 && (
              <Select onValueChange={addService}>
                <SelectTrigger>
                  <SelectValue placeholder="Add a service..." />
                </SelectTrigger>
                <SelectContent>
                  {availableServicesToAdd.map((service) => (
                    <SelectItem key={service} value={service}>
                      {service}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <FormField
            control={form.control}
            name="verified"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel>Verified</FormLabel>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="premium"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel>Premium</FormLabel>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="fiduciary"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel>Fiduciary</FormLabel>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="first_session_is_free"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel>Free First Session</FormLabel>
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? 'Saving...' : (advisor ? 'Update' : 'Create')}
          </Button>
        </div>
      </form>
    </Form>
  );
}
