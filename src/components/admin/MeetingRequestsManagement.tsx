import { useCallback, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/hooks/use-toast";
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
import { Eye, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { AdminListToolbar } from "./AdminListToolbar";
import { AdminPagination } from "./AdminPagination";
import { AdminBulkBar } from "./AdminBulkBar";
import {
  useAdminListPipeline,
  matchesSearchQuery,
  compareByDateField,
} from "@/hooks/useAdminListPipeline";
import { useRowSelection } from "@/hooks/useRowSelection";
import { Tables } from "@/integrations/supabase/types";

type MeetingRequest = Tables<"meeting_requests">;

interface AdvisorInfo {
  id: string;
  name: string;
  firm_name?: string | null;
}

export const MeetingRequestsManagement = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortKey, setSortKey] = useState("newest");
  const [viewingRequest, setViewingRequest] = useState<MeetingRequest | null>(
    null
  );
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: meetingRequests = [], isLoading } = useQuery({
    queryKey: ["meeting-requests"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("meeting_requests")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return (data || []) as MeetingRequest[];
    },
  });

  const { data: advisors = [] } = useQuery({
    queryKey: ["advisors-info"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("financial_advisors")
        .select("id, name, firm_name");

      if (error) throw error;
      return (data || []) as AdvisorInfo[];
    },
  });

  const advisorMap = useMemo(() => {
    const map = new Map<string, AdvisorInfo>();
    for (const a of advisors) map.set(a.id, a);
    return map;
  }, [advisors]);

  const getAdvisorName = useCallback(
    (advisorId: string) => {
      const advisor = advisorMap.get(advisorId);
      if (!advisor) return "Unknown Advisor";
      return advisor.firm_name
        ? `${advisor.name} (${advisor.firm_name})`
        : advisor.name;
    },
    [advisorMap]
  );

  const searchMatch = useCallback(
    (item: MeetingRequest, query: string) =>
      matchesSearchQuery(query, [
        item.first_name,
        item.last_name,
        `${item.first_name} ${item.last_name}`,
        item.email,
        item.message,
      ]),
    []
  );

  const sortCompare = useMemo(
    () => ({
      newest: compareByDateField<MeetingRequest>((a) => a.created_at, false),
      oldest: compareByDateField<MeetingRequest>((a) => a.created_at, true),
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
    items: meetingRequests,
    pageSize: 25,
    searchQuery,
    searchMatch,
    sortKey,
    sortCompare,
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
    queryClient.invalidateQueries({ queryKey: ["meeting-requests"] });

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from("meeting_requests")
        .delete()
        .eq("id", id);
      if (error) throw error;
      toast({ title: "Meeting request deleted" });
      setDeleteId(null);
      invalidate();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Delete failed";
      toast({
        title: "Error deleting request",
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
        .from("meeting_requests")
        .delete()
        .in("id", ids);
      if (error) throw error;
      toast({ title: `Deleted ${ids.length} meeting request(s)` });
      clear();
      setBulkDeleteOpen(false);
      invalidate();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Bulk delete failed";
      toast({
        title: "Error deleting requests",
        description: message,
        variant: "destructive",
      });
    }
  };

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
        searchPlaceholder="Search name, email, or message..."
        totalCount={totalCount}
        rangeStart={rangeStart}
        rangeEnd={rangeEnd}
        filters={
          <Select value={sortKey} onValueChange={setSortKey}>
            <SelectTrigger className="w-[140px] h-9">
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="oldest">Oldest</SelectItem>
            </SelectContent>
          </Select>
        }
      />

      <AdminBulkBar selectedCount={selectedCount} onClear={clear}>
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
              <TableHead>Requester</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Advisor</TableHead>
              <TableHead>Preferred contact</TableHead>
              <TableHead className="w-[110px]">Created</TableHead>
              <TableHead className="w-[120px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedItems.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="h-24 text-center text-muted-foreground"
                >
                  No meeting requests found.
                </TableCell>
              </TableRow>
            ) : (
              paginatedItems.map((request) => (
                <TableRow key={request.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedIds.has(request.id)}
                      onCheckedChange={(checked) =>
                        toggleOne(request.id, checked === true)
                      }
                      aria-label={`Select ${request.first_name} ${request.last_name}`}
                    />
                  </TableCell>
                  <TableCell className="font-medium">
                    {request.first_name} {request.last_name}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {request.email}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {getAdvisorName(request.advisor_id)}
                  </TableCell>
                  <TableCell className="text-muted-foreground capitalize">
                    {request.preferred_contact_method || "—"}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm whitespace-nowrap">
                    {format(new Date(request.created_at), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setViewingRequest(request)}
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                        onClick={() => setDeleteId(request.id)}
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

      <Dialog
        open={!!viewingRequest}
        onOpenChange={(open) => !open && setViewingRequest(null)}
      >
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Meeting request: {viewingRequest?.first_name}{" "}
              {viewingRequest?.last_name}
            </DialogTitle>
          </DialogHeader>
          {viewingRequest && (
            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-muted-foreground">Email</p>
                  <p className="font-medium">{viewingRequest.email}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Phone</p>
                  <p className="font-medium">
                    {viewingRequest.phone_number || "—"}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Advisor</p>
                  <p className="font-medium">
                    {getAdvisorName(viewingRequest.advisor_id)}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Preferred contact</p>
                  <p className="font-medium capitalize">
                    {viewingRequest.preferred_contact_method || "—"}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Created</p>
                  <p className="font-medium">
                    {format(
                      new Date(viewingRequest.created_at),
                      "MMM d, yyyy h:mm a"
                    )}
                  </p>
                </div>
              </div>

              {viewingRequest.interested_in_discussing &&
                viewingRequest.interested_in_discussing.length > 0 && (
                  <div>
                    <p className="text-muted-foreground mb-1">
                      Interested in discussing
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {viewingRequest.interested_in_discussing.map((topic) => (
                        <Badge key={topic} variant="secondary" className="text-xs">
                          {topic}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

              {viewingRequest.message && (
                <div>
                  <p className="text-muted-foreground mb-1">Message</p>
                  <p className="whitespace-pre-wrap">{viewingRequest.message}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete meeting request?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              meeting request.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteId && handleDelete(deleteId)}
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
            <AlertDialogTitle>
              Delete {selectedCount} meeting requests?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. Selected requests will be permanently
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
};
