
import React, { useMemo, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { AccountingFirmForm } from './AccountingFirmForm';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AdminListToolbar } from '@/components/admin/AdminListToolbar';
import { AdminPagination } from '@/components/admin/AdminPagination';
import {
  compareByDateField,
  compareByStringField,
  matchesSearchQuery,
  useAdminListPipeline,
} from '@/hooks/useAdminListPipeline';

type AccountingFirmRow = {
  id: string;
  name: string;
  headquarters?: string | null;
  slug?: string | null;
  verified?: boolean | null;
  created_at?: string | null;
  minimum_fee?: string | null;
  established?: string | null;
  employees?: number | null;
  premium?: boolean | null;
};

export function AccountingFirmManagement() {
  const [selectedFirm, setSelectedFirm] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [verifiedFilter, setVerifiedFilter] = useState('all');
  const [sortKey, setSortKey] = useState('name_asc');
  const queryClient = useQueryClient();

  const sortCompare = useMemo(
    () => ({
      name_asc: compareByStringField<AccountingFirmRow>((f) => f.name, true),
      name_desc: compareByStringField<AccountingFirmRow>((f) => f.name, false),
      newest: compareByDateField<AccountingFirmRow>((f) => f.created_at, false),
    }),
    []
  );

  const { data: firms = [], isLoading } = useQuery({
    queryKey: ['accounting-firms-admin'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('accounting_firms')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('accounting_firms')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounting-firms-admin'] });
      toast({ title: 'Accounting firm deleted successfully' });
      setDeleteId(null);
    },
    onError: (error) => {
      toast({ 
        title: 'Error deleting firm', 
        description: error.message,
        variant: 'destructive' 
      });
    },
  });

  const handleEdit = (firm: any) => {
    setSelectedFirm(firm);
    setIsFormOpen(true);
  };

  const handleAdd = () => {
    setSelectedFirm(null);
    setIsFormOpen(true);
  };

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    setSelectedFirm(null);
    queryClient.invalidateQueries({ queryKey: ['accounting-firms-admin'] });
  };

  const {
    paginatedItems: visibleFirms,
    totalCount,
    totalPages,
    page,
    setPage,
    rangeStart,
    rangeEnd,
  } = useAdminListPipeline({
    items: firms as AccountingFirmRow[],
    searchQuery,
    searchMatch: (f, q) =>
      matchesSearchQuery(q, [f.name, f.headquarters, f.slug]),
    filterFn: (f) => {
      if (verifiedFilter === 'verified') return Boolean(f.verified);
      if (verifiedFilter === 'unverified') return !f.verified;
      return true;
    },
    sortKey,
    sortCompare,
    resetDeps: [verifiedFilter],
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-semibold">Accounting Firms</h2>
          <Badge variant="secondary">{firms.length}</Badge>
        </div>
      </div>

      <AdminListToolbar
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
        searchPlaceholder="Search by name, headquarters, or slug..."
        totalCount={totalCount}
        rangeStart={rangeStart}
        rangeEnd={rangeEnd}
        filters={
          <>
            <Select value={verifiedFilter} onValueChange={setVerifiedFilter}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Verified" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All firms</SelectItem>
                <SelectItem value="verified">Verified</SelectItem>
                <SelectItem value="unverified">Not verified</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortKey} onValueChange={setSortKey}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Sort" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name_asc">Name A–Z</SelectItem>
                <SelectItem value="name_desc">Name Z–A</SelectItem>
                <SelectItem value="newest">Newest</SelectItem>
              </SelectContent>
            </Select>
          </>
        }
        actions={
          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleAdd}>
                <Plus className="h-4 w-4 mr-2" />
                Add Firm
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {selectedFirm ? 'Edit Accounting Firm' : 'Add New Accounting Firm'}
                </DialogTitle>
              </DialogHeader>
              <AccountingFirmForm
                firm={selectedFirm}
                onSuccess={handleFormSuccess}
              />
            </DialogContent>
          </Dialog>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {visibleFirms.map((firm) => (
          <Card key={firm.id}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-base">{firm.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{firm.headquarters}</p>
                </div>
                <div className="flex gap-1">
                  {firm.verified && (
                    <Badge variant="outline" className="text-xs">Verified</Badge>
                  )}
                  {firm.premium && (
                    <Badge variant="default" className="text-xs">Premium</Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-sm text-muted-foreground">
                <p>Fee: {firm.minimum_fee || 'N/A'}</p>
                <p>Established: {firm.established ? new Date(firm.established).getFullYear() : 'N/A'}</p>
                <p>Employees: {firm.employees || 'N/A'}</p>
              </div>
              <div className="flex gap-2 pt-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleEdit(firm)}
                >
                  <Edit className="h-3 w-3 mr-1" />
                  Edit
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setDeleteId(firm.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-3 w-3 mr-1" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {visibleFirms.length === 0 && (
          <p className="col-span-full text-center text-muted-foreground py-8">
            No accounting firms match your filters.
          </p>
        )}
      </div>

      {totalCount > 0 && (
        <AdminPagination page={page} totalPages={totalPages} onPageChange={setPage} />
      )}

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the accounting firm.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => deleteId && deleteMutation.mutate(deleteId)}
              className="bg-destructive hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
