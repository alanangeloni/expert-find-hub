
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

const firmSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  slug: z.string().min(1, 'Slug is required'),
  description: z.string().optional(),
  long_description: z.string().optional(),
  address: z.string().optional(),
  website: z.string().url().optional().or(z.literal('')),
  headquarters: z.string().optional(),
  minimum_fee: z.string().optional(),
  employees: z.string().optional(),
  established: z.string().optional(),
  verified: z.boolean().default(false),
  premium: z.boolean().default(false),
  rating: z.number().min(0).max(5).optional(),
  review_count: z.number().min(0).optional(),
});

type FirmFormData = z.infer<typeof firmSchema>;

interface AccountingFirmFormProps {
  firm?: any;
  onSuccess: () => void;
}

export function AccountingFirmForm({ firm, onSuccess }: AccountingFirmFormProps) {
  const form = useForm<FirmFormData>({
    resolver: zodResolver(firmSchema),
    defaultValues: {
      name: firm?.name || '',
      slug: firm?.slug || '',
      description: firm?.description || '',
      long_description: firm?.long_description || '',
      address: firm?.address || '',
      website: firm?.website || '',
      headquarters: firm?.headquarters || '',
      minimum_fee: firm?.minimum_fee || '',
      employees: firm?.employees || '',
      established: firm?.established || '',
      verified: firm?.verified || false,
      premium: firm?.premium || false,
      rating: firm?.rating || undefined,
      review_count: firm?.review_count || undefined,
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: FirmFormData) => {
      const firmData = {
        name: data.name,
        slug: data.slug,
        description: data.description || null,
        long_description: data.long_description || null,
        address: data.address || null,
        website: data.website || null,
        headquarters: data.headquarters || null,
        minimum_fee: data.minimum_fee || null,
        employees: data.employees || null,
        established: data.established ? new Date(data.established).toISOString().split('T')[0] : null,
        verified: data.verified,
        premium: data.premium,
        rating: data.rating || null,
        review_count: data.review_count || null,
      };

      if (firm) {
        const { error } = await supabase
          .from('accounting_firms')
          .update(firmData)
          .eq('id', firm.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('accounting_firms')
          .insert(firmData);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast({ 
        title: firm ? 'Firm updated successfully' : 'Firm created successfully' 
      });
      onSuccess();
    },
    onError: (error) => {
      toast({ 
        title: 'Error saving firm', 
        description: error.message,
        variant: 'destructive' 
      });
    },
  });

  const onSubmit = (data: FirmFormData) => {
    mutation.mutate(data);
  };

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
            name="headquarters"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Headquarters</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="website"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Website</FormLabel>
                <FormControl>
                  <Input type="url" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="minimum_fee"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Minimum Fee</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="employees"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Employees</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="established"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Established</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="rating"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Rating</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    step="0.1"
                    min="0"
                    max="5"
                    {...field} 
                    onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="review_count"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Review Count</FormLabel>
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
        </div>

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Textarea {...field} rows={2} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea {...field} rows={3} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="long_description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Long Description</FormLabel>
              <FormControl>
                <Textarea {...field} rows={5} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
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
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? 'Saving...' : (firm ? 'Update' : 'Create')}
          </Button>
        </div>
      </form>
    </Form>
  );
}
