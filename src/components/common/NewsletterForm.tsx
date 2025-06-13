
import React, { useState } from 'react';
import { subscribeToNewsletter } from '@/services/newsletterService';
import { useToast } from '@/hooks/use-toast';

export const NewsletterForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Email required",
        description: "Please enter your email address.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      await subscribeToNewsletter({
        Email: email.trim()
      });
      
      toast({
        title: "Successfully subscribed!",
        description: "Thank you for subscribing to our newsletter.",
      });
      
      // Reset form
      setEmail('');
    } catch (error) {
      toast({
        title: "Subscription failed",
        description: "There was an error subscribing to the newsletter. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <input 
        type="email" 
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-300" 
        placeholder="Your email address"
        required
      />
      <button 
        type="submit" 
        disabled={isSubmitting}
        className="bg-teal-500 text-white rounded-lg py-2 font-semibold hover:bg-teal-600 disabled:bg-teal-400 transition focus:ring-2 focus:ring-teal-300 focus:outline-none"
      >
        {isSubmitting ? 'Subscribing...' : 'Subscribe'}
      </button>
    </form>
  );
};

export default NewsletterForm;
