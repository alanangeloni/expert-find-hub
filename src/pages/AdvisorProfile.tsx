
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AdvisorProfileEdit } from '@/components/advisor-profile/AdvisorProfileEdit';
import { MeetingRequestsList } from '@/components/advisor-profile/MeetingRequestsList';
import { Advisor } from '@/services/advisorsService';
import Footer from '@/components/layout/Footer';

const AdvisorProfile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [advisor, setAdvisor] = useState<Advisor | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    if (user) {
      fetchAdvisorProfile();
    }
  }, [user]);

  const fetchAdvisorProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('financial_advisors')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;
      setAdvisor(data);
    } catch (error: any) {
      console.error('Error fetching advisor profile:', error);
      toast({
        title: "Error",
        description: "Failed to load advisor profile",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'pending_approval':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="container mx-auto py-12 px-4">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-center">Sign In Required</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p>You need to sign in to view your advisor profile.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div>Loading...</div>
      </div>
    );
  }

  if (!advisor) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="container mx-auto py-12 px-4">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-center">No Advisor Profile Found</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p>You haven't created an advisor profile yet.</p>
              <Button onClick={() => window.location.href = '/advisor-registration'}>
                Create Advisor Profile
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
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Your Advisor Profile</h1>
            <div className="flex items-center gap-2 mt-2">
              <Badge className={getStatusColor(advisor.status || 'draft')}>
                {advisor.status?.replace('_', ' ').toUpperCase() || 'DRAFT'}
              </Badge>
              {advisor.status === 'rejected' && advisor.rejection_reason && (
                <Alert className="mt-4">
                  <AlertDescription>
                    <strong>Rejection Reason:</strong> {advisor.rejection_reason}
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="profile">Profile Details</TabsTrigger>
              <TabsTrigger value="meetings">Meeting Requests</TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="mt-6">
              <AdvisorProfileEdit 
                advisor={advisor} 
                onUpdate={fetchAdvisorProfile}
              />
            </TabsContent>

            <TabsContent value="meetings" className="mt-6">
              <MeetingRequestsList advisorId={advisor.id} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AdvisorProfile;
