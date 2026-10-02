import React, { useCallback, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { Edit, Eye, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Spinner } from "@/components/ui/spinner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import {
  compareByDateField,
  compareByStringField,
  matchesSearchQuery,
  useAdminListPipeline,
} from "@/hooks/useAdminListPipeline";
import { useRowSelection } from "@/hooks/useRowSelection";
import { AdminListToolbar } from "@/components/admin/AdminListToolbar";
import { AdminPagination } from "@/components/admin/AdminPagination";
import { AdminBulkBar } from "@/components/admin/AdminBulkBar";
import { AccountingFirmForm } from "./AccountingFirmForm";
import type { Database } from "@/integrations/supabase/types";

type AccountingFirm = Database["public"]["Tables"]["accounting_firms"]["Row"];

const QUERY_KEY = ["accounting-firms-admin"] as const;

export function AccountingFirmManagement() {
  const [selectedFirm, setSelectedFirm] = useState<AccountingFirm | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [verifiedFilter, setVerifiedFilter] = useState("all");
  const [premiumFilter, setPremiumFilter] = useState("all");
  const [sortKey, setSortKey] = useState("name_asc");
  const queryClient = useQueryClient();

  const sortCompare = useMemo(
    () => ({
      name_asc: compareByStringField<AccountingFirm>((f) => f.name, true),
      updated_desc: compareByDateField<AccountingFirm>(
        (f) => f.updated_at,
        false
      ),
      updated_asc: compareByDateField<AccountingFirm>(
        (f) => f.updated_at,
        true
      ),
    }),
    []
  );

  const { data: firms = [], isLoading } = useQuery({
    queryKey: QUERY_KEY,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("accounting_firms")
        .select("*")
        .order("name");

      if (error) throw error;
      return data as AccountingFirm[];
    },
  });

  const filterFn = useCallback(
    (f: AccountingFirm) => {
      if (verifiedFilter === "verified" && !f.verified) return false;
      if (verifiedFilter === "unverified" && f.verified) return false;
      if (premiumFilter === "premium" && !f.premium) return false;
      if (premiumFilter === "standard" && f.premium) return false;
      return true;
    },
    [verifiedFilter, premiumFilter]
  );

  const searchMatch = useCallback(
    (f: AccountingFirm, q: string) =>
      matchesSearchQuery(q, [f.name, f.headquarters, f.slug, f.employees]),
    []
  );

  const {
    paginatedItems: visibleFirms,
    totalCount,
    totalPages,
    page,
    setPage,
    rangeStart,
    rangeEnd,
  } = useAdminListPipeline({
    items: firms,
    searchQuery,
    searchMatch,
    filterFn,
    sortKey,
    sortCompare,
    resetDeps: [verifiedFilter, premiumFilter],
  });

  const {
    selectedIds,
    selectedCount,
    allVisibleSelected,
    someVisibleSelected,
    toggleOne,
    toggleAllVisible,
    clear: clearSelection,
  } = useRowSelection(visibleFirms);

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: QUERY_KEY });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await supabase
        .from("accounting_firms")
        .delete()
        .eq("id", id)
        .select("id")
        .single();

      if (error) throw error;
      if (!data)
        throw new Error("Firm delete did not persist. Check admin RLS policies.");
    },
    onSuccess: () => {
      invalidate();
      toast({ title: "Accounting firm deleted successfully" });
      setDeleteId(null);
      clearSelection();
    },
    onError: (error: Error) => {
      toast({
        title: "Error deleting firm",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const bulkDeleteMutation = useMutation({
    mutationFn: async (ids: string[]) => {
      for (const id of ids) {
        const { data, error } = await supabase
          .from("accounting_firms")
          .delete()
          .eq("id", id)
          .select("id")
          .single();
        if (error) throw error;
        if (!data)
          throw new Error(
            "Firm delete did not persist. Check admin RLS policies."
          );
      }
    },
    onSuccess: (_data, ids) => {
      invalidate();
      toast({ title: `Deleted ${ids.length} firm${ids.length === 1 ? "" : "s"}` });
      setBulkDeleteOpen(false);
      clearSelection();
    },
    onError: (error: Error) => {
      toast({
        title: "Error deleting firms",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const setVerifiedMutation = useMutation({
    mutationFn: async ({
      id,
      verified,
    }: {
      id: string;
      verified: boolean;
    }) => {
      const { data, error } = await supabase
        .from("accounting_firms")
        .update({ verified })
        .eq("id", id)
        .select("id")
        .single();

      if (error) throw error;
      if (!data)
        throw new Error(
          "Verification update did not persist. Check admin RLS policies."
        );
      return verified;
    },
    onSuccess: (verified) => {
      invalidate();
      toast({
        title: verified ? "Firm marked verified" : "Firm marked unverified",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error updating verification",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const bulkVerifiedMutation = useMutation({
    mutationFn: async ({
      ids,
      verified,
    }: {
      ids: string[];
      verified: boolean;
    }) => {
      for (const id of ids) {
        const { data, error } = await supabase
          .from("accounting_firms")
          .update({ verified })
          .eq("id", id)
          .select("id")
          .single();
        if (error) throw error;
        if (!data)
          throw new Error(
            "Verification update did not persist. Check admin RLS policies."
          );
      }
      return { count: ids.length, verified };
    },
    onSuccess: ({ count, verified }) => {
      invalidate();
      toast({
        title: verified
          ? `Verified ${count} firm${count === 1 ? "" : "s"}`
          : `Unverified ${count} firm${count === 1 ? "" : "s"}`,
      });
      clearSelection();
    },
    onError: (error: Error) => {
      toast({
        title: "Error updating verification",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleEdit = (firm: AccountingFirm) => {
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
    invalidate();
  };

  const handleDialogOpenChange = (open: boolean) => {
    setIsFormOpen(open);
    if (!open) setSelectedFirm(null);
  };

  const selectedIdList = useMemo(() => Array.from(selectedIds), [selectedIds]);

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h2 className="text-xl font-semibold">
          Accounting Firms{" "}
          <span className="text-muted-foreground font-normal text-base">
            ({firms.length})
          </span>
        </h2>
      </div>

      <AdminListToolbar
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
        searchPlaceholder="Search name, HQ, slug, employees…"
        totalCount={totalCount}
        rangeStart={rangeStart}
        rangeEnd={rangeEnd}
        filters={
          <>
            <Select value={verifiedFilter} onValueChange={setVerifiedFilter}>
              <SelectTrigger className="w-[150px] h-9">
                <SelectValue placeholder="Verified" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All verification</SelectItem>
                <SelectItem value="verified">Verified</SelectItem>
                <SelectItem value="unverified">Unverified</SelectItem>
              </SelectContent>
            </Select>
            <Select value={premiumFilter} onValueChange={setPremiumFilter}>
              <SelectTrigger className="w-[150px] h-9">
                <SelectValue placeholder="Premium" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All tiers</SelectItem>
                <SelectItem value="premium">Premium</SelectItem>
                <SelectItem value="standard">Standard</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortKey} onValueChange={setSortKey}>
              <SelectTrigger className="w-[180px] h-9">
                <SelectValue placeholder="Sort" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name_asc">Name A–Z</SelectItem>
                <SelectItem value="updated_desc">Newest updated</SelectItem>
                <SelectItem value="updated_asc">Oldest updated</SelectItem>
              </SelectContent>
            </Select>
          </>
        }
        actions={
          <Button onClick={handleAdd}>
            <Plus className="h-4 w-4 mr-2" />
            New record
          </Button>
        }
      />

      <AdminBulkBar selectedCount={selectedCount} onClear={clearSelection}>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={bulkVerifiedMutation.isPending}
          onClick={() =>
            bulkVerifiedMutation.mutate({
              ids: selectedIdList,
              verified: true,
            })
          }
        >
          Verify
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={bulkVerifiedMutation.isPending}
          onClick={() =>
            bulkVerifiedMutation.mutate({
              ids: selectedIdList,
              verified: false,
            })
          }
        >
          Unverify
        </Button>
        <Button
          type="button"
          variant="destructive"
          size="sm"
          onClick={() => setBulkDeleteOpen(true)}
        >
          Delete
        </Button>
      </AdminBulkBar>

      <div className="rounded-md border border-border bg-background overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-10">
                <Checkbox
                  checked={
                    allVisibleSelected
                      ? true
                      : someVisibleSelected
                        ? "indeterminate"
                        : false
                  }
                  onCheckedChange={(checked) =>
                    toggleAllVisible(checked === true)
                  }
                  aria-label="Select all on page"
                />
              </TableHead>
              <TableHead>Name</TableHead>
              <TableHead>HQ</TableHead>
              <TableHead>Employees</TableHead>
              <TableHead>Premium</TableHead>
              <TableHead className="w-[140px]">Verified</TableHead>
              <TableHead>Updated</TableHead>
              <TableHead className="text-right w-[200px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {visibleFirms.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="h-24 text-center text-muted-foreground"
                >
                  No accounting firms match your filters.
                </TableCell>
              </TableRow>
            ) : (
              visibleFirms.map((firm) => (
                <TableRow
                  key={firm.id}
                  data-state={selectedIds.has(firm.id) ? "selected" : undefined}
                >
                  <TableCell>
                    <Checkbox
                      checked={selectedIds.has(firm.id)}
                      onCheckedChange={(checked) =>
                        toggleOne(firm.id, checked === true)
                      }
                      aria-label={`Select ${firm.name}`}
                    />
                  </TableCell>
                  <TableCell className="font-medium max-w-[220px] truncate">
                    {firm.name}
                  </TableCell>
                  <TableCell className="text-muted-foreground max-w-[160px] truncate">
                    {firm.headquarters || "—"}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {firm.employees || "—"}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {firm.premium ? "Premium" : "Standard"}
                  </TableCell>
                  <TableCell>
                    <Select
                      value={firm.verified ? "verified" : "unverified"}
                      onValueChange={(value) =>
                        setVerifiedMutation.mutate({
                          id: firm.id,
                          verified: value === "verified",
                        })
                      }
                      disabled={setVerifiedMutation.isPending}
                    >
                      <SelectTrigger className="h-8 w-[120px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="verified">Verified</SelectItem>
                        <SelectItem value="unverified">Unverified</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-muted-foreground whitespace-nowrap">
                    {firm.updated_at
                      ? format(new Date(firm.updated_at), "MMM d, yyyy")
                      : "—"}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-1">
                      {firm.slug ? (
                        <Button variant="ghost" size="sm" asChild>
                          <Link
                            to={`/accounting-firms/${firm.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Eye className="h-3.5 w-3.5 mr-1" />
                            View
                          </Link>
                        </Button>
                      ) : null}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(firm)}
                      >
                        <Edit className="h-3.5 w-3.5 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                        onClick={() => setDeleteId(firm.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <AdminPagination
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />

      <Dialog open={isFormOpen} onOpenChange={handleDialogOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedFirm
                ? "Edit Accounting Firm"
                : "Add New Accounting Firm"}
            </DialogTitle>
          </DialogHeader>
          {isFormOpen && (
            <AccountingFirmForm
              firm={selectedFirm}
              onSuccess={handleFormSuccess}
            />
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              accounting firm.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteId && deleteMutation.mutate(deleteId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={bulkDeleteOpen} onOpenChange={setBulkDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {selectedCount} firms?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The selected accounting firms will
              be permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => bulkDeleteMutation.mutate(selectedIdList)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={bulkDeleteMutation.isPending}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
