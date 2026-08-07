
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
    <div className={`newsletter-cta ${className}`}>
      <div className="newsletter-cta__intro">
        <span className="keyline" />
        <p className="newsletter-cta__eyebrow">Newsletter</p>
        <h3>{title}</h3>
        <p className="newsletter-cta__desc">{description}</p>
        {children || (
          <ul className="newsletter-cta__list">
            <li>Weekly market updates and analysis</li>
            <li>Exclusive financial planning tips</li>
            <li>Early access to webinars and events</li>
          </ul>
        )}
      </div>

      <form onSubmit={handleSubmit} className="newsletter-cta__form">
        <label>
          <span>Name</span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
          />
        </label>
        <label>
          <span>Email</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
          />
        </label>
        <button type="submit" className="btn btn--green btn--md" disabled={isSubmitting}>
          {isSubmitting ? "Subscribing…" : "Subscribe"}
        </button>
        <p className="newsletter-cta__note">We respect your privacy. Unsubscribe at any time.</p>
      </form>
    </div>
  );
};

export default NewsletterSignup;
