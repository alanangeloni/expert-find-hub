
import React, { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/spinner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar, Mail, Phone, MessageSquare, CheckCircle, Clock, X } from 'lucide-react';
import { format } from 'date-fns';
import { AdminListToolbar } from '@/components/admin/AdminListToolbar';
import { AdminPagination } from '@/components/admin/AdminPagination';
import {
  compareByDateField,
  compareByStringField,
  matchesSearchQuery,
  useAdminListPipeline,
} from '@/hooks/useAdminListPipeline';

interface MeetingRequest {
  id: string;
  advisor_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number?: string;
  message?: string;
  interested_in_discussing?: string[];
  preferred_contact_method?: string;
  created_at: string;
  updated_at: string;
}

interface AdvisorInfo {
  id: string;
  name: string;
  firm_name?: string;
}

export const MeetingRequestsManagement = () => {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortKey, setSortKey] = useState('newest');

  const { data: meetingRequests, isLoading } = useQuery({
    queryKey: ['meeting-requests'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('meeting_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []) as MeetingRequest[];
    },
  });

  const { data: advisors } = useQuery({
    queryKey: ['advisors-info'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('financial_advisors')
        .select('id, name, firm_name');

      if (error) throw error;
      return data as AdvisorInfo[];
    },
  });

  const getAdvisorName = (advisorId: string) => {
    const advisor = advisors?.find(a => a.id === advisorId);
    return advisor ? `${advisor.name}${advisor.firm_name ? ` (${advisor.firm_name})` : ''}` : 'Unknown Advisor';
  };

  const getAdvisorSearchName = (advisorId: string) => {
    const advisor = advisors?.find(a => a.id === advisorId);
    if (!advisor) return '';
    return `${advisor.name} ${advisor.firm_name ?? ''}`;
  };

  const sortCompare = useMemo(
    () => ({
      newest: compareByDateField<MeetingRequest>((r) => r.created_at, false),
      oldest: compareByDateField<MeetingRequest>((r) => r.created_at, true),
      client_asc: compareByStringField<MeetingRequest>(
        (r) => `${r.first_name} ${r.last_name}`,
        true
      ),
    }),
    []
  );

  const {
    paginatedItems: visibleRequests,
    totalCount,
    totalPages,
    page,
    setPage,
    rangeStart,
    rangeEnd,
  } = useAdminListPipeline({
    items: meetingRequests ?? [],
    pageSize: 15,
    searchQuery,
    searchMatch: (r, q) =>
      matchesSearchQuery(q, [
        r.first_name,
        r.last_name,
        r.email,
        getAdvisorSearchName(r.advisor_id),
      ]),
    filterFn: () => {
      if (statusFilter === 'all') return true;
      // No status column on meeting_requests yet; all records are treated as pending.
      return statusFilter === 'pending';
    },
    sortKey,
    sortCompare,
    resetDeps: [statusFilter],
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
      case 'contacted':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200"><Mail className="h-3 w-3 mr-1" />Contacted</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200"><CheckCircle className="h-3 w-3 mr-1" />Completed</Badge>;
      case 'cancelled':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200"><X className="h-3 w-3 mr-1" />Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  const hasRequests = (meetingRequests?.length ?? 0) > 0;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Meeting Requests</h2>
        <p className="text-gray-600">Manage advisor meeting requests from potential clients</p>
      </div>

      <AdminListToolbar
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
        searchPlaceholder="Search by client or advisor..."
        totalCount={totalCount}
        rangeStart={rangeStart}
        rangeEnd={rangeEnd}
        filters={
          <>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Requests</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="contacted">Contacted</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortKey} onValueChange={setSortKey}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Sort" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="oldest">Oldest</SelectItem>
                <SelectItem value="client_asc">Client name A–Z</SelectItem>
              </SelectContent>
            </Select>
          </>
        }
      />

      {!hasRequests ? (
        <Card>
          <CardHeader>
            <CardTitle>No Meeting Requests Found</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">No meeting requests have been submitted yet.</p>
          </CardContent>
        </Card>
      ) : totalCount === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No matching requests</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">Try adjusting your search or filters.</p>
          </CardContent>
        </Card>
      ) : (
        <>
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Client</TableHead>
                    <TableHead>Advisor</TableHead>
                    <TableHead>Contact Info</TableHead>
                    <TableHead>Topics</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {visibleRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell>
                        <div className="font-medium">
                          {request.first_name} {request.last_name}
                        </div>
                        {request.message && (
                          <div className="text-sm text-gray-500 mt-1 max-w-xs truncate">
                            <MessageSquare className="h-3 w-3 inline mr-1" />
                            {request.message}
                          </div>
                        )}
                      </TableCell>

                      <TableCell>
                        <div className="text-sm">
                          {getAdvisorName(request.advisor_id)}
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center text-sm">
                            <Mail className="h-3 w-3 mr-1 text-gray-400" />
                            <span className="truncate max-w-[150px]">{request.email}</span>
                          </div>
                          {request.phone_number && (
                            <div className="flex items-center text-sm text-gray-600">
                              <Phone className="h-3 w-3 mr-1 text-gray-400" />
                              {request.phone_number}
                            </div>
                          )}
                          {request.preferred_contact_method && (
                            <div className="text-xs text-gray-500">
                              Prefers: {request.preferred_contact_method}
                            </div>
                          )}
                        </div>
                      </TableCell>

                      <TableCell>
                        {request.interested_in_discussing && request.interested_in_discussing.length > 0 ? (
                          <div className="flex flex-wrap gap-1 max-w-[200px]">
                            {request.interested_in_discussing.slice(0, 2).map((topic, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {topic}
                              </Badge>
                            ))}
                            {request.interested_in_discussing.length > 2 && (
                              <Badge variant="secondary" className="text-xs">
                                +{request.interested_in_discussing.length - 2} more
                              </Badge>
                            )}
                          </div>
                        ) : (
                          <span className="text-gray-400 text-sm">None specified</span>
                        )}
                      </TableCell>

                      <TableCell>
                        {getStatusBadge('pending')}
                      </TableCell>

                      <TableCell>
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="h-3 w-3 mr-1" />
                          {format(new Date(request.created_at), 'MMM d, yyyy')}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          <AdminPagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}
    </div>
  );
};
