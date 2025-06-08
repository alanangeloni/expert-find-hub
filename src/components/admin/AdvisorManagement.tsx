
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Plus, Eye } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { AdvisorForm } from './AdvisorForm';
import { AdvisorApprovalActions } from './AdvisorApprovalActions';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';

export function AdvisorManagement() {
  const [selectedAdvisor, setSelectedAdvisor] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('pending');
  const queryClient = useQueryClient();

  const { data: advisors = [], isLoading } = useQuery({
    queryKey: ['advisors-admin'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('financial_advisors')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('financial_advisors')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['advisors-admin'] });
      toast({ title: 'Advisor deleted successfully' });
      setDeleteId(null);
    },
    onError: (error) => {
      toast({ 
        title: 'Error deleting advisor', 
        description: error.message,
        variant: 'destructive' 
      });
    },
  });

  const handleEdit = (advisor: any) => {
    setSelectedAdvisor(advisor);
    setIsFormOpen(true);
  };

  const handleView = (advisor: any) => {
    setSelectedAdvisor(advisor);
    setIsViewOpen(true);
  };

  const handleAdd = () => {
    setSelectedAdvisor(null);
    setIsFormOpen(true);
  };

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    setSelectedAdvisor(null);
    queryClient.invalidateQueries({ queryKey: ['advisors-admin'] });
  };

  const handleDialogOpenChange = (open: boolean) => {
    setIsFormOpen(open);
    if (!open) {
      setSelectedAdvisor(null);
    }
  };

  const handleViewDialogOpenChange = (open: boolean) => {
    setIsViewOpen(open);
    if (!open) {
      setSelectedAdvisor(null);
    }
  };

  // Filter advisors by status
  const pendingAdvisors = advisors.filter(a => a.status === 'pending_approval');
  const approvedAdvisors = advisors.filter(a => a.status === 'approved');
  const rejectedAdvisors = advisors.filter(a => a.status === 'rejected');
  const draftAdvisors = advisors.filter(a => a.status === 'draft');

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Spinner size="lg" />
      </div>
    );
  }

  const renderAdvisorCard = (advisor: any) => (
    <Card key={advisor.id}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-base">{advisor.name}</CardTitle>
            <p className="text-sm text-gray-500">{advisor.firm_name}</p>
            {advisor.submitted_at && (
              <p className="text-xs text-gray-400">
                Submitted: {new Date(advisor.submitted_at).toLocaleDateString()}
              </p>
            )}
          </div>
          <div className="flex gap-1">
            {advisor.verified && (
              <Badge variant="outline" className="text-xs">Verified</Badge>
            )}
            {advisor.premium && (
              <Badge variant="default" className="text-xs">Premium</Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="text-sm text-gray-600">
          <p>Experience: {advisor.years_of_experience || 'N/A'} years</p>
          <p>State: {advisor.state_hq || 'N/A'}</p>
          <p>Minimum: {advisor.minimum || 'No minimum'}</p>
        </div>
        
        <AdvisorApprovalActions 
          advisor={advisor} 
          onUpdate={() => queryClient.invalidateQueries({ queryKey: ['advisors-admin'] })}
        />
        
        <div className="flex gap-2 pt-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => handleView(advisor)}
          >
            <Eye className="h-3 w-3 mr-1" />
            View
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => handleEdit(advisor)}
          >
            <Edit className="h-3 w-3 mr-1" />
            Edit
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setDeleteId(advisor.id)}
            className="text-red-500 hover:text-red-700"
          >
            <Trash2 className="h-3 w-3 mr-1" />
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Financial Advisors Management</h2>
        <Button onClick={handleAdd}>
          <Plus className="h-4 w-4 mr-2" />
          Add Advisor
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="pending">
            Pending ({pendingAdvisors.length})
          </TabsTrigger>
          <TabsTrigger value="approved">
            Approved ({approvedAdvisors.length})
          </TabsTrigger>
          <TabsTrigger value="rejected">
            Rejected ({rejectedAdvisors.length})
          </TabsTrigger>
          <TabsTrigger value="drafts">
            Drafts ({draftAdvisors.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pendingAdvisors.map(renderAdvisorCard)}
            {pendingAdvisors.length === 0 && (
              <p className="text-gray-500 col-span-full text-center py-8">
                No pending advisor registrations.
              </p>
            )}
          </div>
        </TabsContent>

        <TabsContent value="approved">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {approvedAdvisors.map(renderAdvisorCard)}
            {approvedAdvisors.length === 0 && (
              <p className="text-gray-500 col-span-full text-center py-8">
                No approved advisors.
              </p>
            )}
          </div>
        </TabsContent>

        <TabsContent value="rejected">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {rejectedAdvisors.map(renderAdvisorCard)}
            {rejectedAdvisors.length === 0 && (
              <p className="text-gray-500 col-span-full text-center py-8">
                No rejected advisor registrations.
              </p>
            )}
          </div>
        </TabsContent>

        <TabsContent value="drafts">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {draftAdvisors.map(renderAdvisorCard)}
            {draftAdvisors.length === 0 && (
              <p className="text-gray-500 col-span-full text-center py-8">
                No draft advisor profiles.
              </p>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* View Advisor Dialog */}
      <Dialog open={isViewOpen} onOpenChange={handleViewDialogOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Advisor Details: {selectedAdvisor?.name}
            </DialogTitle>
          </DialogHeader>
          {selectedAdvisor && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><strong>Email:</strong> {selectedAdvisor.email}</div>
                <div><strong>Phone:</strong> {selectedAdvisor.phone_number}</div>
                <div><strong>Experience:</strong> {selectedAdvisor.years_of_experience} years</div>
                <div><strong>Location:</strong> {selectedAdvisor.city}, {selectedAdvisor.state_hq}</div>
                <div><strong>Firm:</strong> {selectedAdvisor.firm_name || 'N/A'}</div>
                <div><strong>Position:</strong> {selectedAdvisor.position || 'N/A'}</div>
              </div>
              
              {selectedAdvisor.personal_bio && (
                <div>
                  <strong>Personal Bio:</strong>
                  <p className="mt-1 text-gray-700">{selectedAdvisor.personal_bio}</p>
                </div>
              )}
              
              {selectedAdvisor.advisor_services?.length > 0 && (
                <div>
                  <strong>Services:</strong>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedAdvisor.advisor_services.map((service: string) => (
                      <Badge key={service} variant="outline">{service}</Badge>
                    ))}
                  </div>
                </div>
              )}
              
              {selectedAdvisor.professional_designations?.length > 0 && (
                <div>
                  <strong>Designations:</strong>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedAdvisor.professional_designations.map((designation: string) => (
                      <Badge key={designation} variant="outline">{designation}</Badge>
                    ))}
                  </div>
                </div>
              )}

              {selectedAdvisor.licenses?.length > 0 && (
                <div>
                  <strong>Licenses:</strong>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedAdvisor.licenses.map((license: string) => (
                      <Badge key={license} variant="outline">{license}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Advisor Dialog */}
      <Dialog open={isFormOpen} onOpenChange={handleDialogOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedAdvisor ? 'Edit Advisor' : 'Add New Advisor'}
            </DialogTitle>
          </DialogHeader>
          {isFormOpen && (
            <AdvisorForm 
              advisor={selectedAdvisor}
              onSuccess={handleFormSuccess}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the advisor.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => deleteId && deleteMutation.mutate(deleteId)}
              className="bg-red-500 hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
