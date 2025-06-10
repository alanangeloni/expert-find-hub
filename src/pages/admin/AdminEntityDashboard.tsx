
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { AdvisorManagement } from '@/components/admin/AdvisorManagement';
import { AccountingFirmManagement } from '@/components/admin/AccountingFirmManagement';
import { InvestmentFirmManagement } from '@/components/admin/InvestmentFirmManagement';
import { MeetingRequestsManagement } from '@/components/admin/MeetingRequestsManagement';

const AdminEntityDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminChecking, setAdminChecking] = useState(true);

  // Check admin status
  const { data: adminData, isLoading: adminLoading } = useQuery({
    queryKey: ['adminStatus', user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  React.useEffect(() => {
    if (adminData) {
      setIsAdmin(adminData.is_admin || false);
      setAdminChecking(false);
    } else if (!adminLoading && user) {
      setAdminChecking(false);
    }
  }, [adminData, adminLoading, user]);

  if (adminChecking || adminLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="container mx-auto py-12 px-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Unauthorized Access</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p>You do not have administrator access.</p>
            <Button onClick={() => navigate('/')} className="mt-4">
              Back to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Tabs defaultValue="advisors" className="w-full">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Entity Management</h1>
            <p className="text-muted-foreground">Manage financial advisors, firms, and meeting requests</p>
          </div>
          <TabsList className="grid w-full sm:w-auto grid-cols-2 sm:grid-cols-4">
            <TabsTrigger value="advisors" className="text-xs sm:text-sm">Advisors</TabsTrigger>
            <TabsTrigger value="accounting" className="text-xs sm:text-sm">Accounting</TabsTrigger>
            <TabsTrigger value="investment" className="text-xs sm:text-sm">Investment</TabsTrigger>
            <TabsTrigger value="meetings" className="text-xs sm:text-sm">Meetings</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="advisors" className="mt-0">
          <AdvisorManagement />
        </TabsContent>

        <TabsContent value="accounting" className="mt-0">
          <AccountingFirmManagement />
        </TabsContent>

        <TabsContent value="investment" className="mt-0">
          <InvestmentFirmManagement />
        </TabsContent>

        <TabsContent value="meetings" className="mt-0">
          <MeetingRequestsManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminEntityDashboard;
