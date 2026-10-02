import { useCallback, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus, Edit, Trash2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";
import { AccountantForm } from "./AccountantForm";
import { AccountantApprovalActions } from "./AccountantApprovalActions";
import { AdminListToolbar } from "./AdminListToolbar";
import { AdminPagination } from "./AdminPagination";
import { AdminBulkBar } from "./AdminBulkBar";
import {
  useAdminListPipeline,
  matchesSearchQuery,
  compareByDateField,
  compareByStringField,
} from "@/hooks/useAdminListPipeline";
import { useRowSelection } from "@/hooks/useRowSelection";
import { format } from "date-fns";

type AccountantRow = Tables<"accountants">;

const ACCOUNTANT_STATUSES = [
  "draft",
  "pending_approval",
  "approved",
  "rejected",
] as const;

type AccountantStatus = (typeof ACCOUNTANT_STATUSES)[number];

const STATUS_LABELS: Record<AccountantStatus, string> = {
  draft: "Draft",
  pending_approval: "Pending approval",
  approved: "Approved",
  rejected: "Rejected",
};

const generateSlug = (name: string) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "") +
  "-" +
  Math.random().toString(36).slice(2, 6);

function formatLocation(accountant: AccountantRow) {
  return [accountant.city, accountant.state_hq].filter(Boolean).join(", ") || "—";
}

const fetchAccountants = async (): Promise<AccountantRow[]> => {
  const { data, error } = await supabase
    .from("accountants")
    .select("*")
    .order("created_at", { ascending: false })
    .range(0, 999);
  if (error) throw error;
  return data || [];
};

export const AccountantManagement = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [verifiedFilter, setVerifiedFilter] = useState<string>("all");
  const [sortKey, setSortKey] = useState("newest");
  const [editingAccountant, setEditingAccountant] =
    useState<AccountantRow | null>(null);
  const [deletingAccountant, setDeletingAccountant] =
    useState<AccountantRow | null>(null);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<AccountantRow>>({});
  const [isSaving, setIsSaving] = useState(false);

  const {
    data: accountants = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["admin-accountants"],
    queryFn: fetchAccountants,
  });

  const filterFn = useCallback(
    (item: AccountantRow) => {
      if (statusFilter !== "all" && item.status !== statusFilter) return false;
      if (verifiedFilter === "verified" && !item.verified) return false;
      if (verifiedFilter === "unverified" && item.verified) return false;
      return true;
    },
    [statusFilter, verifiedFilter]
  );

  const searchMatch = useCallback(
    (item: AccountantRow, query: string) =>
      matchesSearchQuery(query, [item.name, item.firm_name, item.email]),
    []
  );

  const sortCompare = useMemo(
    () => ({
      newest: compareByDateField<AccountantRow>(
        (a) => a.updated_at || a.created_at,
        false
      ),
      name: compareByStringField<AccountantRow>((a) => a.name, true),
    }),
    []
  );

  const {
    paginatedItems,
    totalCount,
    totalPages,
    page,
    setPage,
    rangeStart,
    rangeEnd,
  } = useAdminListPipeline({
    items: accountants,
    pageSize: 25,
    searchQuery,
    filterFn,
    searchMatch,
    sortKey,
    sortCompare,
    resetDeps: [statusFilter, verifiedFilter],
  });

  const {
    selectedIds,
    selectedCount,
    allVisibleSelected,
    someVisibleSelected,
    toggleOne,
    toggleAllVisible,
    clear,
  } = useRowSelection(paginatedItems);

  const handleAdd = () => {
    setFormData({ status: "draft", verified: false });
    setEditingAccountant(null);
    setIsFormOpen(true);
  };

  const handleEdit = (accountant: AccountantRow) => {
    setFormData(accountant);
    setEditingAccountant(accountant);
    setIsFormOpen(true);
  };

  const handleSave = async () => {
    if (!formData.name) {
      toast.error("Name is required");
      return;
    }
    setIsSaving(true);
    try {
      const payload: Record<string, unknown> = {
        ...formData,
        slug: formData.slug || generateSlug(formData.name),
      };
      delete payload.id;
      delete payload.created_at;
      delete payload.updated_at;

      if (editingAccountant) {
        const { data, error: updateError } = await supabase
          .from("accountants")
          .update(payload as never)
          .eq("id", editingAccountant.id)
          .select("id")
          .single();
        if (updateError) throw updateError;
        if (!data) throw new Error("Accountant update did not persist.");
        toast.success("Accountant updated");
      } else {
        const { data, error: insertError } = await supabase
          .from("accountants")
          .insert(payload as never)
          .select("id")
          .single();
        if (insertError) throw insertError;
        if (!data) throw new Error("Accountant create did not persist.");
        toast.success("Accountant created");
      }
      setIsFormOpen(false);
      refetch();
    } catch (err: unknown) {
      console.error("Error saving accountant:", err);
      const message =
        err instanceof Error ? err.message : "Failed to save accountant";
      toast.error(message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingAccountant) return;
    try {
      const { error: deleteError } = await supabase
        .from("accountants")
        .delete()
        .eq("id", deletingAccountant.id);
      if (deleteError) throw deleteError;
      toast.success("Accountant deleted");
      setDeletingAccountant(null);
      refetch();
    } catch (err: unknown) {
      console.error("Error deleting accountant:", err);
      const message =
        err instanceof Error ? err.message : "Failed to delete accountant";
      toast.error(message);
    }
  };

  const updateStatus = async (id: string, status: AccountantStatus) => {
    const payload: Record<string, unknown> = { status };
    if (status === "approved") {
      payload.verified = true;
      payload.approved_at = new Date().toISOString();
    }
    const { data, error: updateError } = await supabase
      .from("accountants")
      .update(payload as never)
      .eq("id", id)
      .select()
      .single();
    if (updateError) throw updateError;
    if (!data) throw new Error("Status update did not persist.");
    return data;
  };

  const updateVerified = async (id: string, verified: boolean) => {
    const { data, error: updateError } = await supabase
      .from("accountants")
      .update({ verified } as never)
      .eq("id", id)
      .select()
      .single();
    if (updateError) throw updateError;
    if (!data) throw new Error("Verified update did not persist.");
    return data;
  };

  const handleStatusChange = async (id: string, status: AccountantStatus) => {
    try {
      await updateStatus(id, status);
      toast.success(`Status set to ${STATUS_LABELS[status]}`);
      refetch();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Update failed";
      toast.error(message);
    }
  };

  const handleVerifiedToggle = async (id: string, verified: boolean) => {
    try {
      await updateVerified(id, verified);
      toast.success(verified ? "Marked verified" : "Marked unverified");
      refetch();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Update failed";
      toast.error(message);
    }
  };

  const handleBulkStatus = async (status: AccountantStatus) => {
    const ids = Array.from(selectedIds);
    if (ids.length === 0) return;
    try {
      await Promise.all(ids.map((id) => updateStatus(id, status)));
      toast.success(
        `Updated ${ids.length} accountant(s) to ${STATUS_LABELS[status]}`
      );
      clear();
      refetch();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Bulk update failed";
      toast.error(message);
    }
  };

  const handleBulkDelete = async () => {
    const ids = Array.from(selectedIds);
    if (ids.length === 0) return;
    try {
      const { error: deleteError } = await supabase
        .from("accountants")
        .delete()
        .in("id", ids);
      if (deleteError) throw deleteError;
      toast.success(`Deleted ${ids.length} accountant(s)`);
      clear();
      setBulkDeleteOpen(false);
      refetch();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Bulk delete failed";
      toast.error(message);
    }
  };

  if (error) {
    return (
      <div className="text-destructive">
        Error loading accountants: {(error as Error).message}
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <AdminListToolbar
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
        searchPlaceholder="Search name, firm, or email..."
        totalCount={totalCount}
        rangeStart={rangeStart}
        rangeEnd={rangeEnd}
        filters={
          <>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[160px] h-9">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                {ACCOUNTANT_STATUSES.map((s) => (
                  <SelectItem key={s} value={s}>
                    {STATUS_LABELS[s]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={verifiedFilter} onValueChange={setVerifiedFilter}>
              <SelectTrigger className="w-[150px] h-9">
                <SelectValue placeholder="Verified" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All verified</SelectItem>
                <SelectItem value="verified">Verified</SelectItem>
                <SelectItem value="unverified">Unverified</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortKey} onValueChange={setSortKey}>
              <SelectTrigger className="w-[140px] h-9">
                <SelectValue placeholder="Sort" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="name">Name</SelectItem>
              </SelectContent>
            </Select>
          </>
        }
        actions={
          <Button onClick={handleAdd} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            New record
          </Button>
        }
      />

      <AdminBulkBar selectedCount={selectedCount} onClear={clear}>
        <Button
          size="sm"
          variant="outline"
          onClick={() => handleBulkStatus("approved")}
        >
          Set Approved
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => handleBulkStatus("rejected")}
        >
          Set Rejected
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => handleBulkStatus("draft")}
        >
          Set Draft
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => handleBulkStatus("pending_approval")}
        >
          Set Pending
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="text-destructive hover:text-destructive"
          onClick={() => setBulkDeleteOpen(true)}
        >
          <Trash2 className="h-3.5 w-3.5 mr-1" />
          Delete
        </Button>
      </AdminBulkBar>

      <div className="rounded-md border border-border">
        <Table>
          <TableHeader>
            <TableRow>
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
              <TableHead>Firm</TableHead>
              <TableHead>Location</TableHead>
              <TableHead className="w-[150px]">Status</TableHead>
              <TableHead className="w-[110px]">Verified</TableHead>
              <TableHead className="w-[110px]">Updated</TableHead>
              <TableHead className="w-[200px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedItems.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="h-24 text-center text-muted-foreground"
                >
                  No accountants found.
                </TableCell>
              </TableRow>
            ) : (
              paginatedItems.map((accountant) => (
                <TableRow key={accountant.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedIds.has(accountant.id)}
                      onCheckedChange={(checked) =>
                        toggleOne(accountant.id, checked === true)
                      }
                      aria-label={`Select ${accountant.name}`}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{accountant.name}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {accountant.firm_name || "—"}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatLocation(accountant)}
                  </TableCell>
                  <TableCell>
                    <Select
                      value={accountant.status || "draft"}
                      onValueChange={(value) =>
                        handleStatusChange(
                          accountant.id,
                          value as AccountantStatus
                        )
                      }
                    >
                      <SelectTrigger className="h-8 w-[140px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {ACCOUNTANT_STATUSES.map((s) => (
                          <SelectItem key={s} value={s}>
                            {STATUS_LABELS[s]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <button
                      type="button"
                      onClick={() =>
                        handleVerifiedToggle(
                          accountant.id,
                          !accountant.verified
                        )
                      }
                      className="inline-flex"
                    >
                      {accountant.verified ? (
                        <Badge variant="outline" className="text-xs">
                          Verified
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="text-xs text-muted-foreground"
                        >
                          Unverified
                        </Badge>
                      )}
                    </button>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm whitespace-nowrap">
                    {accountant.updated_at || accountant.created_at
                      ? format(
                          new Date(
                            accountant.updated_at || accountant.created_at
                          ),
                          "MMM d, yyyy"
                        )
                      : "—"}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      {accountant.slug && (
                        <Button variant="ghost" size="sm" asChild>
                          <a
                            href={`/accountants/${accountant.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="View public profile"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                          </a>
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(accountant)}
                      >
                        <Edit className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                        onClick={() => setDeletingAccountant(accountant)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <AdminPagination page={page} totalPages={totalPages} onPageChange={setPage} />

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingAccountant ? "Edit Accountant" : "Add Accountant"}
            </DialogTitle>
          </DialogHeader>
          {editingAccountant && (
            <AccountantApprovalActions
              accountant={editingAccountant}
              onUpdate={() => {
                refetch();
                setIsFormOpen(false);
              }}
            />
          )}
          <AccountantForm formData={formData} setFormData={setFormData} />
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => setIsFormOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving
                ? "Saving..."
                : editingAccountant
                  ? "Update"
                  : "Create"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={!!deletingAccountant}
        onOpenChange={() => setDeletingAccountant(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Accountant</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {deletingAccountant?.name}? This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={bulkDeleteOpen} onOpenChange={setBulkDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Delete {selectedCount} accountants?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. Selected accountants will be
              permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleBulkDelete}
              className="bg-destructive text-destructive-foreground"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
