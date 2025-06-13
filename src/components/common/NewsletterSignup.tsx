
import React, { useState } from 'react';
import { subscribeToNewsletter } from '@/services/newsletterService';
import { useToast } from '@/hooks/use-toast';

interface NewsletterSignupProps {
  title?: string;
  description?: string;
  backgroundImage?: string;
  className?: string;
  children?: React.ReactNode;
}

export const NewsletterSignup: React.FC<NewsletterSignupProps> = ({
  title = 'Stay Informed',
  description = 'Subscribe to our newsletter for the latest financial insights, market updates, and planning strategies.',
  backgroundImage = 'https://wqtvpeuhjgqcjbdozzuv.supabase.co/storage/v1/object/public/website-wide-images//Group%20122.png',
  className = '',
  children
}) => {
  const [name, setName] = useState('');
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
        Name: name.trim() || undefined,
        Email: email.trim()
      });
      
      toast({
        title: "Successfully subscribed!",
        description: "Thank you for subscribing to our newsletter.",
      });
      
      // Reset form
      setName('');
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
    <div 
      className={`rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden bg-cover bg-center bg-no-repeat border border-gray-200 shadow-sm ${className}`}
      style={{
        backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.85), rgba(255, 255, 255, 0.85)), url(${backgroundImage})`
      }}
    >
      <div className="relative z-10 text-slate-900 flex-1 min-w-[220px]">
        <h3 className="text-2xl font-bold mb-3">{title}</h3>
        <p className="mb-4 text-slate-700">{description}</p>
        {children || (
          <ul className="mb-4 space-y-2 text-slate-700 text-sm list-disc pl-5">
            <li>Weekly market updates and analysis</li>
            <li>Exclusive financial planning tips</li>
            <li>Early access to webinars and events</li>
          </ul>
        )}
      </div>
      <form onSubmit={handleSubmit} className="relative z-10 bg-slate-800 rounded-xl p-6 flex flex-col gap-4 w-full max-w-xs min-w-[220px]">
        <label className="text-slate-200 text-sm font-medium">
          Name
          <input 
            type="text" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full rounded-md bg-slate-700 border border-slate-600 text-white p-2 focus:outline-none focus:ring-2 focus:ring-blue-500" 
            placeholder="Your name" 
          />
        </label>
        <label className="text-slate-200 text-sm font-medium">
          Email
          <input 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-md bg-slate-700 border border-slate-600 text-white p-2 focus:outline-none focus:ring-2 focus:ring-blue-500" 
            placeholder="Your email" 
            required 
          />
        </label>
        <button 
          type="submit" 
          disabled={isSubmitting}
          className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-400 text-white font-bold py-2 px-4 rounded-md transition-colors"
        >
          {isSubmitting ? 'Subscribing...' : 'Subscribe'}
        </button>
        <span className="text-xs text-slate-400 mt-2">
          We respect your privacy. Unsubscribe at any time.
        </span>
      </form>
    </div>
  );
};

export default NewsletterSignup;
