
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { AdvisorForm } from './AdvisorForm';
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

export function AdvisorManagement() {
  const [selectedAdvisor, setSelectedAdvisor] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data: advisors = [], isLoading } = useQuery({
    queryKey: ['advisors-admin'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('financial_advisors')
        .select('*')
        .order('name');
      
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
    console.log('Edit clicked for advisor:', advisor);
    setSelectedAdvisor(advisor);
    setIsFormOpen(true);
  };

  const handleAdd = () => {
    console.log('Add new advisor clicked');
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

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Financial Advisors ({advisors.length})</h2>
        <Button onClick={handleAdd}>
          <Plus className="h-4 w-4 mr-2" />
          Add Advisor
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {advisors.map((advisor) => (
          <Card key={advisor.id}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-base">{advisor.name}</CardTitle>
                  <p className="text-sm text-gray-500">{advisor.firm_name}</p>
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
            <CardContent className="space-y-2">
              <div className="text-sm text-gray-600">
                <p>Experience: {advisor.years_of_experience || 'N/A'} years</p>
                <p>State: {advisor.state_hq || 'N/A'}</p>
                <p>Minimum: {advisor.minimum || 'No minimum'}</p>
              </div>
              <div className="flex gap-2 pt-2">
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
        ))}
      </div>

      {/* Dialog for Add/Edit Advisor */}
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
        </AlertDialogFooter>
      </AlertDialog>
    </div>
  );
}
