
import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Textarea } from '@/components/ui/textarea';

interface AdvisorApprovalActionsProps {
  advisor: any;
  onUpdate: () => void;
}

export function AdvisorApprovalActions({ advisor, onUpdate }: AdvisorApprovalActionsProps) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [rejectionReason, setRejectionReason] = React.useState('');

  const approveMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('financial_advisors')
        .update({
          status: 'approved',
          approved_by: user?.id,
          approved_at: new Date().toISOString(),
          verified: true,
        })
        .eq('id', advisor.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: 'Advisor approved successfully' });
      queryClient.invalidateQueries({ queryKey: ['advisors-admin'] });
      onUpdate();
    },
    onError: (error) => {
      toast({ 
        title: 'Error approving advisor', 
        description: error.message,
        variant: 'destructive' 
      });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: async (reason: string) => {
      const { error } = await supabase
        .from('financial_advisors')
        .update({
          status: 'rejected',
          approved_by: user?.id,
          approved_at: new Date().toISOString(),
          rejection_reason: reason,
        })
        .eq('id', advisor.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: 'Advisor registration rejected' });
      queryClient.invalidateQueries({ queryKey: ['advisors-admin'] });
      onUpdate();
      setRejectionReason('');
    },
    onError: (error) => {
      toast({ 
        title: 'Error rejecting advisor', 
        description: error.message,
        variant: 'destructive' 
      });
    },
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Approved</Badge>;
      case 'pending_approval':
        return <Badge className="bg-yellow-100 text-yellow-800"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800"><XCircle className="h-3 w-3 mr-1" />Rejected</Badge>;
      case 'draft':
        return <Badge variant="outline"><AlertCircle className="h-3 w-3 mr-1" />Draft</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (advisor.status === 'approved') {
    return (
      <div className="flex items-center justify-between">
        {getStatusBadge(advisor.status)}
        <span className="text-sm text-gray-500">
          Approved on {new Date(advisor.approved_at).toLocaleDateString()}
        </span>
      </div>
    );
  }

  if (advisor.status === 'rejected') {
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          {getStatusBadge(advisor.status)}
          <span className="text-sm text-gray-500">
            Rejected on {new Date(advisor.approved_at).toLocaleDateString()}
          </span>
        </div>
        {advisor.rejection_reason && (
          <p className="text-sm text-gray-600 bg-red-50 p-2 rounded">
            <strong>Reason:</strong> {advisor.rejection_reason}
          </p>
        )}
      </div>
    );
  }

  if (advisor.status === 'pending_approval') {
    return (
      <div className="space-y-3">
        {getStatusBadge(advisor.status)}
        <div className="flex gap-2">
          <Button
            size="sm"
            onClick={() => approveMutation.mutate()}
            disabled={approveMutation.isPending}
            className="bg-green-600 hover:bg-green-700"
          >
            <CheckCircle className="h-3 w-3 mr-1" />
            Approve
          </Button>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                size="sm"
                variant="outline"
                className="text-red-600 border-red-600 hover:bg-red-50"
              >
                <XCircle className="h-3 w-3 mr-1" />
                Reject
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Reject Advisor Registration</AlertDialogTitle>
                <AlertDialogDescription>
                  Please provide a reason for rejecting this advisor's registration. This will help them understand what needs to be improved.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <Textarea
                placeholder="Reason for rejection..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
              />
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => rejectMutation.mutate(rejectionReason)}
                  disabled={!rejectionReason.trim() || rejectMutation.isPending}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Reject Registration
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    );
  }

  return getStatusBadge(advisor.status);
}
