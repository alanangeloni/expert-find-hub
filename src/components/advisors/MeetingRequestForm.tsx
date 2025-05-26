
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
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

const meetingRequestSchema = z.object({
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  email: z.string().email('Valid email is required'),
  phone_number: z.string().optional(),
  preferred_contact_method: z.string().min(1, 'Please select a contact method'),
  interested_in_discussing: z.array(z.string()).min(1, 'Please select at least one topic'),
  message: z.string().optional(),
});

type MeetingRequestData = z.infer<typeof meetingRequestSchema>;

interface MeetingRequestFormProps {
  advisorId: string;
  advisorName: string;
  onSuccess: () => void;
}

const discussionTopics = [
  'Financial Planning',
  'Retirement Planning', 
  'Investment Management',
  'Tax Planning',
  'Estate Planning',
  'Insurance Planning',
  'Education Planning',
  'Business Planning',
  'Debt Management',
  'Other'
];

export function MeetingRequestForm({ advisorId, advisorName, onSuccess }: MeetingRequestFormProps) {
  const form = useForm<MeetingRequestData>({
    resolver: zodResolver(meetingRequestSchema),
    defaultValues: {
      first_name: '',
      last_name: '',
      email: '',
      phone_number: '',
      preferred_contact_method: '',
      interested_in_discussing: [],
      message: '',
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: MeetingRequestData) => {
      const { error } = await supabase
        .from('meeting_requests')
        .insert({
          advisor_id: advisorId,
          first_name: data.first_name,
          last_name: data.last_name,
          email: data.email,
          phone_number: data.phone_number || null,
          preferred_contact_method: data.preferred_contact_method,
          interested_in_discussing: data.interested_in_discussing,
          message: data.message || null,
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ 
        title: 'Meeting request sent successfully!',
        description: `${advisorName} will contact you soon.`
      });
      onSuccess();
    },
    onError: (error) => {
      toast({ 
        title: 'Error sending request', 
        description: error.message,
        variant: 'destructive' 
      });
    },
  });

  const onSubmit = (data: MeetingRequestData) => {
    mutation.mutate(data);
  };

  const handleTopicChange = (topic: string, checked: boolean) => {
    const currentTopics = form.getValues('interested_in_discussing');
    if (checked) {
      form.setValue('interested_in_discussing', [...currentTopics, topic]);
    } else {
      form.setValue('interested_in_discussing', currentTopics.filter(t => t !== topic));
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Request a Meeting</h2>
        <p className="text-gray-600">Schedule a consultation with {advisorName}</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="first_name"
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
              name="last_name"
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
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="preferred_contact_method"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Preferred Contact Method *</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="email" id="email" />
                      <Label htmlFor="email">Email</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="phone" id="phone" />
                      <Label htmlFor="phone">Phone</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="either" id="either" />
                      <Label htmlFor="either">Either</Label>
                    </div>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="interested_in_discussing"
            render={() => (
              <FormItem>
                <FormLabel>What are you interested in discussing? *</FormLabel>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {discussionTopics.map((topic) => (
                    <div key={topic} className="flex items-center space-x-2">
                      <Checkbox
                        id={topic}
                        onCheckedChange={(checked) => handleTopicChange(topic, checked as boolean)}
                      />
                      <Label htmlFor={topic} className="text-sm">{topic}</Label>
                    </div>
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Additional Message</FormLabel>
                <FormControl>
                  <Textarea 
                    {...field} 
                    rows={4}
                    placeholder="Tell us more about your financial goals or any specific questions you have..."
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end gap-3 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onSuccess}
              disabled={mutation.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? 'Sending...' : 'Send Request'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
