import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus, Search, Filter, Edit, Trash2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Spinner } from "@/components/ui/spinner";
import { Tables } from "@/integrations/supabase/types";
import { AccountantForm } from "./AccountantForm";
import { AccountantApprovalActions } from "./AccountantApprovalActions";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

type AccountantRow = Tables<"accountants">;

const generateSlug = (name: string) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "") +
  "-" +
  Math.random().toString(36).slice(2, 6);

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
  const [activeTab, setActiveTab] = useState("pending");
  const [editingAccountant, setEditingAccountant] = useState<AccountantRow | null>(null);
  const [deletingAccountant, setDeletingAccountant] = useState<AccountantRow | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<AccountantRow>>({});
  const [isSaving, setIsSaving] = useState(false);

  const { data: accountants = [], isLoading, error, refetch } = useQuery({
    queryKey: ["admin-accountants"],
    queryFn: fetchAccountants,
  });

  const pendingAccountants = accountants.filter((a) => a.status === "pending_approval");
  const approvedAccountants = accountants.filter((a) => a.status === "approved");
  const rejectedAccountants = accountants.filter((a) => a.status === "rejected");
  const draftAccountants = accountants.filter((a) => a.status === "draft");

  const filteredAccountants = accountants.filter((a) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      a.name.toLowerCase().includes(q) ||
      (a.firm_name || "").toLowerCase().includes(q) ||
      (a.email || "").toLowerCase().includes(q);
    const matchesStatus = statusFilter === "all" || a.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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
        const { error } = await supabase.from("accountants").update(payload as never).eq("id", editingAccountant.id);
        if (error) throw error;
        toast.success("Accountant updated");
      } else {
        const { error } = await supabase.from("accountants").insert(payload as never);
        if (error) throw error;
        toast.success("Accountant created");
      }
      setIsFormOpen(false);
      refetch();
    } catch (err: any) {
      console.error("Error saving accountant:", err);
      toast.error(err.message || "Failed to save accountant");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingAccountant) return;
    try {
      const { error } = await supabase.from("accountants").delete().eq("id", deletingAccountant.id);
      if (error) throw error;
      toast.success("Accountant deleted");
      setDeletingAccountant(null);
      refetch();
    } catch (err: any) {
      console.error("Error deleting accountant:", err);
      toast.error(err.message || "Failed to delete accountant");
    }
  };

  if (error) {
    return <div className="text-destructive">Error loading accountants: {(error as Error).message}</div>;
  }

  const renderAccountantCard = (accountant: AccountantRow) => (
    <Card key={accountant.id}>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base">{accountant.name}</CardTitle>
          <div className="flex gap-1">
            {accountant.verified && (
              <Badge variant="outline" className="text-xs">
                Verified
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="text-sm text-muted-foreground space-y-1">
          {accountant.position && <p>{accountant.position}</p>}
          {accountant.firm_name && <p>{accountant.firm_name}</p>}
          {(accountant.city || accountant.state_hq) && (
            <p>
              {[accountant.city, accountant.state_hq].filter(Boolean).join(", ")}
            </p>
          )}
          {accountant.email && <p>{accountant.email}</p>}
          {accountant.submitted_at && (
            <p className="text-xs">
              Submitted: {new Date(accountant.submitted_at).toLocaleDateString()}
            </p>
          )}
        </div>

        <AccountantApprovalActions accountant={accountant} onUpdate={() => refetch()} />

        <div className="flex gap-2">
          {accountant.slug && (
            <Button size="sm" variant="ghost" asChild>
              <a href={`/accountants/${accountant.slug}`} target="_blank" rel="noopener noreferrer">
                <Eye className="h-3 w-3 mr-1" />
                View
              </a>
            </Button>
          )}
          <Button size="sm" variant="outline" onClick={() => handleEdit(accountant)}>
            <Edit className="h-3 w-3 mr-1" />
            Edit
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="text-destructive hover:text-destructive"
            onClick={() => setDeletingAccountant(accountant)}
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
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3 flex-1 min-w-[280px]">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, firm, or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="pending_approval">Pending Approval</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="h-4 w-4 mr-2" />
          Add Accountant
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      ) : statusFilter !== "all" || searchQuery ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredAccountants.map(renderAccountantCard)}
          {filteredAccountants.length === 0 && (
            <p className="col-span-full text-sm text-muted-foreground py-8 text-center">
              No accountants found.
            </p>
          )}
        </div>
      ) : (
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="pending">
              Pending ({pendingAccountants.length})
            </TabsTrigger>
            <TabsTrigger value="approved">
              Approved ({approvedAccountants.length})
            </TabsTrigger>
            <TabsTrigger value="rejected">
              Rejected ({rejectedAccountants.length})
            </TabsTrigger>
            <TabsTrigger value="draft">
              Draft ({draftAccountants.length})
            </TabsTrigger>
          </TabsList>
          <TabsContent value="pending" className="mt-4">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {pendingAccountants.map(renderAccountantCard)}
              {pendingAccountants.length === 0 && (
                <p className="col-span-full text-sm text-muted-foreground py-8 text-center">
                  No pending accountant registrations.
                </p>
              )}
            </div>
          </TabsContent>
          <TabsContent value="approved" className="mt-4">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {approvedAccountants.map(renderAccountantCard)}
              {approvedAccountants.length === 0 && (
                <p className="col-span-full text-sm text-muted-foreground py-8 text-center">
                  No approved accountants.
                </p>
              )}
            </div>
          </TabsContent>
          <TabsContent value="rejected" className="mt-4">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {rejectedAccountants.map(renderAccountantCard)}
              {rejectedAccountants.length === 0 && (
                <p className="col-span-full text-sm text-muted-foreground py-8 text-center">
                  No rejected accountants.
                </p>
              )}
            </div>
          </TabsContent>
          <TabsContent value="draft" className="mt-4">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {draftAccountants.map(renderAccountantCard)}
              {draftAccountants.length === 0 && (
                <p className="col-span-full text-sm text-muted-foreground py-8 text-center">
                  No draft accountants.
                </p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      )}

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingAccountant ? "Edit Accountant" : "Add Accountant"}</DialogTitle>
          </DialogHeader>
          <AccountantForm formData={formData} setFormData={setFormData} />
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => setIsFormOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? "Saving..." : editingAccountant ? "Update" : "Create"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deletingAccountant} onOpenChange={() => setDeletingAccountant(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Accountant</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {deletingAccountant?.name}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
