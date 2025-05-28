
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
import { Badge } from '@/components/ui/badge';
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
  CheckCircle2,
  Star
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
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Header Section */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-teal-500 rounded-full mb-4">
          <Calendar className="h-8 w-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
          Request a Meeting
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Schedule a personalized consultation with <span className="font-semibold text-gray-800">{advisorName}</span> to discuss your financial goals and create a path to success.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Personal Information Section */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-t-lg">
              <CardTitle className="flex items-center text-xl">
                <User className="h-5 w-5 mr-2 text-blue-600" />
                Personal Information
              </CardTitle>
              <CardDescription>
                Let us know how to reach you for your consultation
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="first_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold text-gray-700">First Name *</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          className="h-12 border-2 border-gray-200 focus:border-blue-500 transition-colors"
                          placeholder="Enter your first name"
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
                      <FormLabel className="text-sm font-semibold text-gray-700">Last Name *</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          className="h-12 border-2 border-gray-200 focus:border-blue-500 transition-colors"
                          placeholder="Enter your last name"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold text-gray-700 flex items-center">
                        <Mail className="h-4 w-4 mr-1" />
                        Email Address *
                      </FormLabel>
                      <FormControl>
                        <Input 
                          type="email" 
                          {...field} 
                          className="h-12 border-2 border-gray-200 focus:border-blue-500 transition-colors"
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
                      <FormLabel className="text-sm font-semibold text-gray-700 flex items-center">
                        <Phone className="h-4 w-4 mr-1" />
                        Phone Number
                      </FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          className="h-12 border-2 border-gray-200 focus:border-blue-500 transition-colors"
                          placeholder="(555) 123-4567"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Contact Preferences Section */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-100 rounded-t-lg">
              <CardTitle className="flex items-center text-xl">
                <MessageSquare className="h-5 w-5 mr-2 text-green-600" />
                Contact Preferences
              </CardTitle>
              <CardDescription>
                How would you prefer to be contacted?
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <FormField
                control={form.control}
                name="preferred_contact_method"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-gray-700 mb-4 block">
                      Preferred Contact Method *
                    </FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="grid grid-cols-1 md:grid-cols-3 gap-4"
                      >
                        <div className="flex items-center space-x-3 p-4 border-2 border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all">
                          <RadioGroupItem value="email" id="email" className="text-blue-600" />
                          <Label htmlFor="email" className="flex items-center cursor-pointer flex-1">
                            <Mail className="h-4 w-4 mr-2 text-blue-600" />
                            Email
                          </Label>
                        </div>
                        <div className="flex items-center space-x-3 p-4 border-2 border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all">
                          <RadioGroupItem value="phone" id="phone" className="text-blue-600" />
                          <Label htmlFor="phone" className="flex items-center cursor-pointer flex-1">
                            <Phone className="h-4 w-4 mr-2 text-blue-600" />
                            Phone
                          </Label>
                        </div>
                        <div className="flex items-center space-x-3 p-4 border-2 border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all">
                          <RadioGroupItem value="either" id="either" className="text-blue-600" />
                          <Label htmlFor="either" className="flex items-center cursor-pointer flex-1">
                            <CheckCircle2 className="h-4 w-4 mr-2 text-blue-600" />
                            Either
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

          {/* Discussion Topics Section */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-indigo-100 rounded-t-lg">
              <CardTitle className="flex items-center text-xl">
                <Star className="h-5 w-5 mr-2 text-purple-600" />
                Discussion Topics
              </CardTitle>
              <CardDescription>
                What financial topics are you most interested in discussing?
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <FormField
                control={form.control}
                name="interested_in_discussing"
                render={() => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-gray-700 mb-4 block">
                      Select all that apply *
                    </FormLabel>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {discussionTopics.map((topic) => (
                        <div key={topic} className="flex items-center space-x-3 p-4 border-2 border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-all">
                          <Checkbox
                            id={topic}
                            onCheckedChange={(checked) => handleTopicChange(topic, checked as boolean)}
                            className="text-purple-600"
                          />
                          <Label htmlFor={topic} className="text-sm font-medium cursor-pointer flex-1">
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

          {/* Additional Message Section */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-orange-50 to-amber-100 rounded-t-lg">
              <CardTitle className="flex items-center text-xl">
                <MessageSquare className="h-5 w-5 mr-2 text-orange-600" />
                Additional Information
              </CardTitle>
              <CardDescription>
                Share any specific questions or details about your financial situation
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-gray-700">Additional Message</FormLabel>
                    <FormControl>
                      <Textarea 
                        {...field} 
                        rows={5}
                        className="border-2 border-gray-200 focus:border-orange-500 transition-colors resize-none"
                        placeholder="Tell us more about your financial goals, current situation, or any specific questions you have. This helps us prepare for a more productive conversation..."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-6">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onSuccess}
              disabled={mutation.isPending}
              className="h-12 px-8 text-base border-2"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={mutation.isPending}
              className="h-12 px-8 text-base bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white font-semibold shadow-lg"
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
          </div>
        </form>
      </Form>
    </div>
  );
}
