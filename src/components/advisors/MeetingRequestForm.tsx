
import React, { useState } from 'react';
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
import { 
  User, 
  Mail, 
  Phone, 
  MessageSquare, 
  Calendar,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Loader2
} from 'lucide-react';
import { ADVISOR_SERVICES } from '@/constants/advisorServices';

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

const discussionTopics = [...ADVISOR_SERVICES, 'Other'];

const steps = [
  { id: 1, label: 'About you', fields: ['first_name', 'last_name', 'email', 'phone_number', 'preferred_contact_method'] },
  { id: 2, label: 'Topics', fields: ['interested_in_discussing'] },
  { id: 3, label: 'Message', fields: ['message'] },
];

export function MeetingRequestForm({ advisorId, advisorName, onSuccess }: MeetingRequestFormProps) {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);

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
      setSubmitted(true);
      toast({ 
        title: 'Meeting request sent successfully!',
        description: `${advisorName} will contact you soon.`
      });
      setTimeout(() => {
        onSuccess();
      }, 2500);
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
      form.setValue('interested_in_discussing', [...currentTopics, topic], { shouldValidate: true });
    } else {
      form.setValue('interested_in_discussing', currentTopics.filter(t => t !== topic), { shouldValidate: true });
    }
  };

  const validateStep = async () => {
    const currentFields = steps[step - 1].fields as Array<keyof MeetingRequestData>;
    const result = await form.trigger(currentFields);
    return result;
  };

  const handleNext = async () => {
    const isValid = await validateStep();
    if (isValid) {
      setStep((s) => Math.min(s + 1, steps.length));
    }
  };

  const handleBack = () => {
    setStep((s) => Math.max(s - 1, 1));
  };

  if (submitted) {
    return (
      <div className="meeting-form">
        <div className="meeting-form__success">
          <div className="meeting-form__success-icon">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <h3 className="meeting-form__success-title">Request Sent</h3>
          <p className="meeting-form__success-text">
            Thank you. {advisorName} will reach out to you soon to schedule your meeting.
          </p>
          <button className="btn btn--primary btn--full" onClick={onSuccess}>
            Done
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="meeting-form">
      {/* Header */}
      <div className="meeting-form__header">
        <div className="meeting-form__icon">
          <Calendar className="h-6 w-6" />
        </div>
        <h2 className="meeting-form__title">Request a Meeting</h2>
        <p className="meeting-form__subtitle">
          Schedule a consultation with <strong>{advisorName}</strong>
        </p>
      </div>

      {/* Stepper */}
      <div className="meeting-form__stepper">
        {steps.map((s, index) => (
          <React.Fragment key={s.id}>
            <div 
              className={`meeting-form__step ${
                step === s.id ? 'meeting-form__step--active' : ''
              } ${step > s.id ? 'meeting-form__step--complete' : ''}`}
            >
              <span className="meeting-form__step-number">
                {step > s.id ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  s.id
                )}
              </span>
              <span className="meeting-form__step-label">{s.label}</span>
            </div>
            {index < steps.length - 1 && <div className="meeting-form__step-line" />}
          </React.Fragment>
        ))}
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          {/* Step 1: Personal Information */}
          {step === 1 && (
            <div className="meeting-form__card">
              <h3 className="meeting-form__card-title">1. Tell us about yourself</h3>
              <div className="meeting-form__grid meeting-form__grid--2">
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

              <div className="meeting-form__grid mt-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium flex items-center gap-1">
                        <Mail className="h-3.5 w-3.5" />
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
                      <FormLabel className="text-sm font-medium flex items-center gap-1">
                        <Phone className="h-3.5 w-3.5" />
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
              </div>
            </div>
          )}

          {/* Step 2: Contact Preference */}
          {step === 2 && (
            <div className="meeting-form__card">
              <h3 className="meeting-form__card-title">2. How should {advisorName} reach you?</h3>
              <FormField
                control={form.control}
                name="preferred_contact_method"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        value={field.value}
                        className="meeting-form__options"
                      >
                        <div className="meeting-form__option">
                          <RadioGroupItem value="email" id="email" />
                          <Mail className="h-4 w-4 meeting-form__option-icon" />
                          <Label htmlFor="email" className="meeting-form__option-label">
                            Email
                          </Label>
                        </div>
                        <div className="meeting-form__option">
                          <RadioGroupItem value="phone" id="phone" />
                          <Phone className="h-4 w-4 meeting-form__option-icon" />
                          <Label htmlFor="phone" className="meeting-form__option-label">
                            Phone
                          </Label>
                        </div>
                        <div className="meeting-form__option">
                          <RadioGroupItem value="either" id="either" />
                          <CheckCircle2 className="h-4 w-4 meeting-form__option-icon" />
                          <Label htmlFor="either" className="meeting-form__option-label">
                            Either Email or Phone
                          </Label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage className="mt-3" />
                  </FormItem>
                )}
              />
            </div>
          )}

          {/* Step 3: Discussion Topics */}
          {step === 3 && (
            <div className="meeting-form__card">
              <h3 className="meeting-form__card-title">3. What would you like to discuss?</h3>
              <FormField
                control={form.control}
                name="interested_in_discussing"
                render={() => (
                  <FormItem>
                    <div className="meeting-form__topics">
                      {discussionTopics.map((topic) => (
                        <div 
                          key={topic} 
                          className="meeting-form__topic"
                          data-state={form.watch('interested_in_discussing').includes(topic) ? 'checked' : 'unchecked'}
                        >
                          <Checkbox
                            id={topic}
                            checked={form.watch('interested_in_discussing').includes(topic)}
                            onCheckedChange={(checked) => handleTopicChange(topic, checked as boolean)}
                          />
                          <Label htmlFor={topic} className="meeting-form__topic-text">
                            {topic}
                          </Label>
                        </div>
                      ))}
                    </div>
                    <FormMessage className="mt-3" />
                  </FormItem>
                )}
              />
            </div>
          )}

          {/* Step 4: Additional Message */}
          {step === 4 && (
            <div className="meeting-form__card">
              <h3 className="meeting-form__card-title">4. Anything else to share?</h3>
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium flex items-center gap-1 mb-2">
                      <MessageSquare className="h-3.5 w-3.5" />
                      Additional Information
                    </FormLabel>
                    <FormControl>
                      <Textarea 
                        {...field} 
                        rows={5}
                        className="resize-none"
                        placeholder="Share any specific questions or details about your financial situation..."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}

          {/* Actions */}
          <div className="meeting-form__actions">
            {step < steps.length ? (
              <Button
                type="button"
                onClick={handleNext}
                className="btn btn--primary btn--full btn--lg h-12"
              >
                Next: {steps[step].label}
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={mutation.isPending}
                className="btn btn--primary btn--green btn--full btn--lg h-12"
              >
                {mutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Sending Request...
                  </>
                ) : (
                  <>
                    <Calendar className="h-4 w-4 mr-2" />
                    Send Meeting Request
                  </>
                )}
              </Button>
            )}

            <div className="meeting-form__actions-row">
              <Button
                type="button"
                variant="outline"
                onClick={handleBack}
                disabled={step === 1 || mutation.isPending}
                className="btn btn--outline btn--full h-11"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={onSuccess}
                disabled={mutation.isPending}
                className="btn btn--outline btn--full h-11"
              >
                Cancel
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
