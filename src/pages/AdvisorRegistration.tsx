
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AdvisorForm } from '@/components/advisor-registration/AdvisorRegistrationForm';
import Footer from '@/components/layout/Footer';

const AdvisorRegistration = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="container mx-auto py-12 px-4">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-center">Sign In Required</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="mb-4">You need to sign in to register as a financial advisor.</p>
              <Button onClick={() => navigate('/auth/signin')}>
                Sign In
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="container mx-auto py-12 px-4">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-center text-green-600">Registration Submitted!</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <Alert>
                <AlertDescription>
                  Your advisor profile has been submitted for review. Our team will review your information and contact you within 2-3 business days.
                </AlertDescription>
              </Alert>
              <Button onClick={() => navigate('/')}>
                Return to Home
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-center">Financial Advisor Registration</CardTitle>
              <p className="text-center text-gray-600">
                Join our network of trusted financial advisors. Fill out your profile information below.
              </p>
            </CardHeader>
            <CardContent>
              <AdvisorForm onSuccess={() => setIsSubmitted(true)} />
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AdvisorRegistration;
