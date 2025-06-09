
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';

interface MeetingRequest {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number?: string;
  message?: string;
  interested_in_discussing?: string[];
  preferred_contact_method?: string;
  created_at: string;
}

interface MeetingRequestsListProps {
  advisorId: string;
}

export const MeetingRequestsList: React.FC<MeetingRequestsListProps> = ({ advisorId }) => {
  const { toast } = useToast();
  const [meetingRequests, setMeetingRequests] = useState<MeetingRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchMeetingRequests();
  }, [advisorId]);

  const fetchMeetingRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('meeting_requests')
        .select('*')
        .eq('advisor_id', advisorId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMeetingRequests(data || []);
    } catch (error: any) {
      console.error('Error fetching meeting requests:', error);
      toast({
        title: "Error",
        description: "Failed to load meeting requests",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Meeting Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <div>Loading meeting requests...</div>
        </CardContent>
      </Card>
    );
  }

  if (meetingRequests.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Meeting Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">No meeting requests yet.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Meeting Requests ({meetingRequests.length})</h2>
      
      {meetingRequests.map((request) => (
        <Card key={request.id}>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg">
                  {request.first_name} {request.last_name}
                </CardTitle>
                <p className="text-sm text-gray-600">
                  {formatDistanceToNow(new Date(request.created_at), { addSuffix: true })}
                </p>
              </div>
              {request.preferred_contact_method && (
                <Badge variant="outline">
                  Prefers: {request.preferred_contact_method}
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-700">Email:</p>
                <p className="text-sm">{request.email}</p>
              </div>
              {request.phone_number && (
                <div>
                  <p className="text-sm font-medium text-gray-700">Phone:</p>
                  <p className="text-sm">{request.phone_number}</p>
                </div>
              )}
            </div>

            {request.interested_in_discussing && request.interested_in_discussing.length > 0 && (
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Interested in discussing:</p>
                <div className="flex flex-wrap gap-2">
                  {request.interested_in_discussing.map((topic, index) => (
                    <Badge key={index} variant="secondary">
                      {topic}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {request.message && (
              <div>
                <p className="text-sm font-medium text-gray-700">Message:</p>
                <p className="text-sm bg-gray-50 p-3 rounded-md">{request.message}</p>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
