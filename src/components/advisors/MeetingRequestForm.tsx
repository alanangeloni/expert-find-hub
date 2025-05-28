
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { 
  User, 
  Mail, 
  Phone, 
  MessageSquare, 
  Calendar,
  CheckCircle2
} from 'lucide-react';

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
    <div className="w-full max-w-2xl mx-auto p-4 sm:p-6">
      {/* Header Section - Mobile Optimized */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-blue-500 rounded-full mb-3">
          <Calendar className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
          Request a Meeting
        </h2>
        <p className="text-sm sm:text-base text-gray-600">
          Schedule a consultation with <span className="font-semibold">{advisorName}</span>
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Personal Information */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center text-lg">
                <User className="h-4 w-4 mr-2 text-blue-600" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="first_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">First Name *</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          className="h-11"
                          placeholder="First name"
                        />
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
                      <FormLabel className="text-sm font-medium">Last Name *</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          className="h-11"
                          placeholder="Last name"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium flex items-center">
                      <Mail className="h-4 w-4 mr-1" />
                      Email Address *
                    </FormLabel>
                    <FormControl>
                      <Input 
                        type="email" 
                        {...field} 
                        className="h-11"
                        placeholder="your@email.com"
                      />
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
                    <FormLabel className="text-sm font-medium flex items-center">
                      <Phone className="h-4 w-4 mr-1" />
                      Phone Number
                    </FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        className="h-11"
                        placeholder="(555) 123-4567"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Contact Preferences */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center text-lg">
                <MessageSquare className="h-4 w-4 mr-2 text-green-600" />
                Contact Preference
              </CardTitle>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="preferred_contact_method"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium mb-3 block">
                      How would you prefer to be contacted? *
                    </FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="space-y-3"
                      >
                        <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                          <RadioGroupItem value="email" id="email" />
                          <Label htmlFor="email" className="flex items-center cursor-pointer flex-1">
                            <Mail className="h-4 w-4 mr-2 text-blue-600" />
                            Email
                          </Label>
                        </div>
                        <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                          <RadioGroupItem value="phone" id="phone" />
                          <Label htmlFor="phone" className="flex items-center cursor-pointer flex-1">
                            <Phone className="h-4 w-4 mr-2 text-blue-600" />
                            Phone
                          </Label>
                        </div>
                        <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                          <RadioGroupItem value="either" id="either" />
                          <Label htmlFor="either" className="flex items-center cursor-pointer flex-1">
                            <CheckCircle2 className="h-4 w-4 mr-2 text-blue-600" />
                            Either Email or Phone
                          </Label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Discussion Topics */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Discussion Topics</CardTitle>
              <CardDescription className="text-sm">
                What would you like to discuss? (Select all that apply)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="interested_in_discussing"
                render={() => (
                  <FormItem>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {discussionTopics.map((topic) => (
                        <div key={topic} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                          <Checkbox
                            id={topic}
                            onCheckedChange={(checked) => handleTopicChange(topic, checked as boolean)}
                          />
                          <Label htmlFor={topic} className="text-sm cursor-pointer flex-1">
                            {topic}
                          </Label>
                        </div>
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Additional Message */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Additional Information</CardTitle>
              <CardDescription className="text-sm">
                Tell us more about your financial goals or questions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea 
                        {...field} 
                        rows={4}
                        className="resize-none"
                        placeholder="Share any specific questions or details about your financial situation..."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 pt-4">
            <Button 
              type="submit" 
              disabled={mutation.isPending}
              className="h-12 w-full bg-blue-600 hover:bg-blue-700 text-white font-medium"
            >
              {mutation.isPending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Sending Request...
                </>
              ) : (
                <>
                  <Calendar className="h-4 w-4 mr-2" />
                  Send Meeting Request
                </>
              )}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={onSuccess}
              disabled={mutation.isPending}
              className="h-12 w-full"
            >
              Cancel
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
