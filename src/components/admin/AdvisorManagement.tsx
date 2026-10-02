import { useCallback, useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
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
import { Edit, Trash2, Plus, Eye } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { AdvisorForm } from "./AdvisorForm";
import { AdvisorApprovalActions } from "./AdvisorApprovalActions";
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
import { Tables } from "@/integrations/supabase/types";
import { format } from "date-fns";

type AdvisorRow = Tables<"financial_advisors">;

const ADVISOR_STATUSES = [
  "draft",
  "pending_approval",
  "approved",
  "rejected",
] as const;

type AdvisorStatus = (typeof ADVISOR_STATUSES)[number];

const STATUS_LABELS: Record<AdvisorStatus, string> = {
  draft: "Draft",
  pending_approval: "Pending approval",
  approved: "Approved",
  rejected: "Rejected",
};

function formatLocation(advisor: AdvisorRow) {
  return [advisor.city, advisor.state_hq].filter(Boolean).join(", ") || "—";
}

export function AdvisorManagement() {
  const [selectedAdvisor, setSelectedAdvisor] = useState<AdvisorRow | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [verifiedFilter, setVerifiedFilter] = useState<string>("all");
  const [sortKey, setSortKey] = useState("newest");
  const queryClient = useQueryClient();

  const { data: advisors = [], isLoading } = useQuery({
    queryKey: ["advisors-admin"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("financial_advisors")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return (data || []) as AdvisorRow[];
    },
  });

  const filterFn = useCallback(
    (item: AdvisorRow) => {
      if (statusFilter !== "all" && item.status !== statusFilter) return false;
      if (verifiedFilter === "verified" && !item.verified) return false;
      if (verifiedFilter === "unverified" && item.verified) return false;
      return true;
    },
    [statusFilter, verifiedFilter]
  );

  const searchMatch = useCallback(
    (item: AdvisorRow, query: string) =>
      matchesSearchQuery(query, [item.name, item.firm_name, item.email]),
    []
  );

  const sortCompare = useMemo(
    () => ({
      newest: compareByDateField<AdvisorRow>(
        (a) => a.updated_at || a.created_at,
        false
      ),
      name: compareByStringField<AdvisorRow>((a) => a.name, true),
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
    items: advisors,
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

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ["advisors-admin"] });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("financial_advisors")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      invalidate();
      toast({ title: "Advisor deleted successfully" });
      setDeleteId(null);
    },
    onError: (error: Error) => {
      toast({
        title: "Error deleting advisor",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateStatus = async (id: string, status: AdvisorStatus) => {
    const payload: Record<string, unknown> = { status };
    if (status === "approved") {
      payload.verified = true;
      payload.approved_at = new Date().toISOString();
    }
    const { data, error } = await supabase
      .from("financial_advisors")
      .update(payload)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    if (!data) throw new Error("Status update did not persist.");
    return data;
  };

  const updateVerified = async (id: string, verified: boolean) => {
    const { data, error } = await supabase
      .from("financial_advisors")
      .update({ verified })
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    if (!data) throw new Error("Verified update did not persist.");
    return data;
  };

  const handleStatusChange = async (id: string, status: AdvisorStatus) => {
    try {
      await updateStatus(id, status);
      toast({ title: `Status set to ${STATUS_LABELS[status]}` });
      invalidate();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Update failed";
      toast({
        title: "Error updating status",
        description: message,
        variant: "destructive",
      });
    }
  };

  const handleVerifiedToggle = async (id: string, verified: boolean) => {
    try {
      await updateVerified(id, verified);
      toast({ title: verified ? "Marked verified" : "Marked unverified" });
      invalidate();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Update failed";
      toast({
        title: "Error updating verified",
        description: message,
        variant: "destructive",
      });
    }
  };

  const handleBulkStatus = async (status: AdvisorStatus) => {
    const ids = Array.from(selectedIds);
    if (ids.length === 0) return;
    try {
      await Promise.all(ids.map((id) => updateStatus(id, status)));
      toast({ title: `Updated ${ids.length} advisor(s) to ${STATUS_LABELS[status]}` });
      clear();
      invalidate();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Bulk update failed";
      toast({
        title: "Error updating advisors",
        description: message,
        variant: "destructive",
      });
    }
  };

  const handleBulkDelete = async () => {
    const ids = Array.from(selectedIds);
    if (ids.length === 0) return;
    try {
      const { error } = await supabase
        .from("financial_advisors")
        .delete()
        .in("id", ids);
      if (error) throw error;
      toast({ title: `Deleted ${ids.length} advisor(s)` });
      clear();
      setBulkDeleteOpen(false);
      invalidate();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Bulk delete failed";
      toast({
        title: "Error deleting advisors",
        description: message,
        variant: "destructive",
      });
    }
  };

  const handleEdit = (advisor: AdvisorRow) => {
    setSelectedAdvisor(advisor);
    setIsFormOpen(true);
  };

  const handleView = (advisor: AdvisorRow) => {
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
    invalidate();
  };

  const handleDialogOpenChange = (open: boolean) => {
    setIsFormOpen(open);
    if (!open) setSelectedAdvisor(null);
  };

  const handleViewDialogOpenChange = (open: boolean) => {
    setIsViewOpen(open);
    if (!open) setSelectedAdvisor(null);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
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
              <SelectTrigger className="w-[180px] h-9">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                {ADVISOR_STATUSES.map((s) => (
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
        <Button size="sm" variant="outline" onClick={() => handleBulkStatus("approved")}>
          Set Approved
        </Button>
        <Button size="sm" variant="outline" onClick={() => handleBulkStatus("rejected")}>
          Set Rejected
        </Button>
        <Button size="sm" variant="outline" onClick={() => handleBulkStatus("draft")}>
          Set Draft
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
              <TableHead className="w-[170px]">Status</TableHead>
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
                  No advisors found.
                </TableCell>
              </TableRow>
            ) : (
              paginatedItems.map((advisor) => (
                <TableRow key={advisor.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedIds.has(advisor.id)}
                      onCheckedChange={(checked) =>
                        toggleOne(advisor.id, checked === true)
                      }
                      aria-label={`Select ${advisor.name}`}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{advisor.name}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {advisor.firm_name || "—"}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatLocation(advisor)}
                  </TableCell>
                  <TableCell>
                    <Select
                      value={advisor.status || "draft"}
                      onValueChange={(value) =>
                        handleStatusChange(advisor.id, value as AdvisorStatus)
                      }
                    >
                      <SelectTrigger className="h-8 w-[160px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {ADVISOR_STATUSES.map((s) => (
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
                        handleVerifiedToggle(advisor.id, !advisor.verified)
                      }
                      className="inline-flex"
                    >
                      {advisor.verified ? (
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
                    {advisor.updated_at || advisor.created_at
                      ? format(
                          new Date(advisor.updated_at || advisor.created_at || ""),
                          "MMM d, yyyy"
                        )
                      : "—"}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleView(advisor)}
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(advisor)}
                      >
                        <Edit className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                        onClick={() => setDeleteId(advisor.id)}
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

      <Dialog open={isViewOpen} onOpenChange={handleViewDialogOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Advisor Details: {selectedAdvisor?.name}</DialogTitle>
          </DialogHeader>
          {selectedAdvisor && (
            <div className="space-y-4">
              <AdvisorApprovalActions
                advisor={selectedAdvisor}
                onUpdate={() => {
                  invalidate();
                  handleViewDialogOpenChange(false);
                }}
              />
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>Email:</strong> {selectedAdvisor.email}
                </div>
                <div>
                  <strong>Phone:</strong> {selectedAdvisor.phone_number}
                </div>
                <div>
                  <strong>Experience:</strong>{" "}
                  {selectedAdvisor.years_of_experience} years
                </div>
                <div>
                  <strong>Location:</strong> {formatLocation(selectedAdvisor)}
                </div>
                <div>
                  <strong>Firm:</strong> {selectedAdvisor.firm_name || "N/A"}
                </div>
                <div>
                  <strong>Position:</strong> {selectedAdvisor.position || "N/A"}
                </div>
              </div>

              {selectedAdvisor.personal_bio && (
                <div>
                  <strong>Personal Bio:</strong>
                  <p className="mt-1 text-muted-foreground">
                    {selectedAdvisor.personal_bio}
                  </p>
                </div>
              )}

              {selectedAdvisor.advisor_services &&
                selectedAdvisor.advisor_services.length > 0 && (
                  <div>
                    <strong>Services:</strong>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {selectedAdvisor.advisor_services.map((service) => (
                        <Badge key={service} variant="outline">
                          {service}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

              {selectedAdvisor.professional_designations &&
                selectedAdvisor.professional_designations.length > 0 && (
                  <div>
                    <strong>Designations:</strong>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {selectedAdvisor.professional_designations.map(
                        (designation) => (
                          <Badge key={designation} variant="outline">
                            {designation}
                          </Badge>
                        )
                      )}
                    </div>
                  </div>
                )}

              {selectedAdvisor.licenses &&
                selectedAdvisor.licenses.length > 0 && (
                  <div>
                    <strong>Licenses:</strong>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {selectedAdvisor.licenses.map((license) => (
                        <Badge key={license} variant="outline">
                          {license}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isFormOpen} onOpenChange={handleDialogOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedAdvisor ? "Edit Advisor" : "Add New Advisor"}
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
              This action cannot be undone. This will permanently delete the
              advisor.
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
            <AlertDialogTitle>Delete {selectedCount} advisors?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. Selected advisors will be permanently
              deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleBulkDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
