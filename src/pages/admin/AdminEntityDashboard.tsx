
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
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Entity Management Dashboard</h1>
        <p className="text-gray-600">Manage financial advisors, accounting firms, and investment firms</p>
      </div>

      <Tabs defaultValue="advisors" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="advisors">Financial Advisors</TabsTrigger>
          <TabsTrigger value="accounting">Accounting Firms</TabsTrigger>
          <TabsTrigger value="investment">Investment Firms</TabsTrigger>
        </TabsList>

        <TabsContent value="advisors" className="mt-6">
          <AdvisorManagement />
        </TabsContent>

        <TabsContent value="accounting" className="mt-6">
          <AccountingFirmManagement />
        </TabsContent>

        <TabsContent value="investment" className="mt-6">
          <InvestmentFirmManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminEntityDashboard;
