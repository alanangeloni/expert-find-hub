import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import {
  Users,
  Building2,
  Briefcase,
  Calculator,
  CalendarDays,
  AlertTriangle,
  Clock,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface AdminEntityOverviewProps {
  onNavigateTab: (tab: string) => void;
}

type RecentItem = {
  id: string;
  label: string;
  kind: string;
  tab: string;
  updatedAt: string;
  status?: string | null;
};

export function AdminEntityOverview({ onNavigateTab }: AdminEntityOverviewProps) {
  const advisorsQuery = useQuery({
    queryKey: ["admin-overview-advisors"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("financial_advisors")
        .select("id, name, status, verified, updated_at, created_at")
        .order("updated_at", { ascending: false })
        .limit(200);
      if (error) throw error;
      return data || [];
    },
    retry: false,
  });

  const accountantsQuery = useQuery({
    queryKey: ["admin-overview-accountants"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("accountants")
        .select("id, name, status, verified, updated_at, created_at")
        .order("updated_at", { ascending: false })
        .limit(200);
      if (error) throw error;
      return data || [];
    },
    retry: false,
  });

  const investmentQuery = useQuery({
    queryKey: ["admin-overview-investment"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("investment_firms")
        .select("id, name, verified, updated_at, created_at")
        .order("updated_at", { ascending: false })
        .limit(200);
      if (error) throw error;
      return data || [];
    },
    retry: false,
  });

  const accountingQuery = useQuery({
    queryKey: ["admin-overview-accounting"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("accounting_firms")
        .select("id, name, verified, updated_at, created_at")
        .order("updated_at", { ascending: false })
        .limit(200);
      if (error) throw error;
      return data || [];
    },
    retry: false,
  });

  const meetingsQuery = useQuery({
    queryKey: ["admin-overview-meetings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("meeting_requests")
        .select("id, first_name, last_name, email, created_at, updated_at")
        .order("created_at", { ascending: false })
        .limit(200);
      if (error) throw error;
      return data || [];
    },
    retry: false,
  });

  const loading =
    (advisorsQuery.isLoading && !advisorsQuery.isError) ||
    (accountantsQuery.isLoading && !accountantsQuery.isError) ||
    (investmentQuery.isLoading && !investmentQuery.isError) ||
    (accountingQuery.isLoading && !accountingQuery.isError) ||
    (meetingsQuery.isLoading && !meetingsQuery.isError);

  const advisors = advisorsQuery.data || [];
  const accountants = accountantsQuery.data || [];
  const investmentFirms = investmentQuery.data || [];
  const accountingFirms = accountingQuery.data || [];
  const meetings = meetingsQuery.data || [];

  const stats = useMemo(
    () => [
      {
        label: "Advisors",
        value: advisors.length,
        icon: Users,
        tab: "advisors",
        hint: `${advisors.filter((a) => a.status === "pending_approval").length} pending`,
      },
      {
        label: "Accountants",
        value: accountants.length,
        icon: Calculator,
        tab: "accountants",
        hint: `${accountants.filter((a) => a.status === "pending").length} pending`,
      },
      {
        label: "Investment firms",
        value: investmentFirms.length,
        icon: Briefcase,
        tab: "investment",
        hint: `${investmentFirms.filter((f) => !f.verified).length} unverified`,
      },
      {
        label: "Accounting firms",
        value: accountingFirms.length,
        icon: Building2,
        tab: "accounting",
        hint: `${accountingFirms.filter((f) => !f.verified).length} unverified`,
      },
      {
        label: "Meetings",
        value: meetings.length,
        icon: CalendarDays,
        tab: "meetings",
        hint: "Recent requests",
      },
    ],
    [advisors, accountants, investmentFirms, accountingFirms, meetings]
  );

  const recentlyUpdated = useMemo(() => {
    const items: RecentItem[] = [
      ...advisors.map((a) => ({
        id: a.id,
        label: a.name,
        kind: "Advisor",
        tab: "advisors",
        updatedAt: a.updated_at || a.created_at,
        status: a.status,
      })),
      ...accountants.map((a) => ({
        id: a.id,
        label: a.name,
        kind: "Accountant",
        tab: "accountants",
        updatedAt: a.updated_at || a.created_at,
        status: a.status,
      })),
      ...investmentFirms.map((f) => ({
        id: f.id,
        label: f.name,
        kind: "Investment firm",
        tab: "investment",
        updatedAt: f.updated_at || f.created_at,
        status: f.verified ? "verified" : "unverified",
      })),
      ...accountingFirms.map((f) => ({
        id: f.id,
        label: f.name,
        kind: "Accounting firm",
        tab: "accounting",
        updatedAt: f.updated_at || f.created_at,
        status: f.verified ? "verified" : "unverified",
      })),
      ...meetings.map((m) => ({
        id: m.id,
        label: `${m.first_name} ${m.last_name}`.trim() || m.email,
        kind: "Meeting",
        tab: "meetings",
        updatedAt: m.updated_at || m.created_at,
        status: "request",
      })),
    ];
    return items
      .sort(
        (a, b) =>
          new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime()
      )
      .slice(0, 8);
  }, [advisors, accountants, investmentFirms, accountingFirms, meetings]);

  const actionsNeeded = useMemo(() => {
    const items: { id: string; title: string; detail: string; tab: string }[] = [];
    for (const a of advisors.filter((x) => x.status === "pending_approval")) {
      items.push({
        id: `adv-${a.id}`,
        title: a.name,
        detail: "Advisor awaiting approval",
        tab: "advisors",
      });
    }
    for (const a of accountants.filter(
      (x) => x.status === "pending" || x.status === "pending_approval"
    )) {
      items.push({
        id: `acc-${a.id}`,
        title: a.name,
        detail: "Accountant awaiting review",
        tab: "accountants",
      });
    }
    for (const f of investmentFirms.filter((x) => !x.verified).slice(0, 10)) {
      items.push({
        id: `inv-${f.id}`,
        title: f.name,
        detail: "Investment firm not verified",
        tab: "investment",
      });
    }
    for (const f of accountingFirms.filter((x) => !x.verified).slice(0, 10)) {
      items.push({
        id: `acf-${f.id}`,
        title: f.name,
        detail: "Accounting firm not verified",
        tab: "accounting",
      });
    }
    return items.slice(0, 12);
  }, [advisors, accountants, investmentFirms, accountingFirms]);

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <button
              key={stat.label}
              type="button"
              onClick={() => onNavigateTab(stat.tab)}
              className="text-left rounded-lg border border-border bg-card p-4 transition hover:border-foreground/20 hover:bg-muted/30"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="mt-1 text-3xl font-semibold tracking-tight">{stat.value}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{stat.hint}</p>
                </div>
                <Icon className="h-5 w-5 text-muted-foreground" />
              </div>
            </button>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="shadow-none">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base font-semibold">
              <Clock className="h-4 w-4" />
              Recently updated
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {recentlyUpdated.length === 0 && (
              <p className="text-sm text-muted-foreground py-6 text-center">
                No recent activity.
              </p>
            )}
            {recentlyUpdated.map((item) => (
              <button
                key={`${item.kind}-${item.id}`}
                type="button"
                onClick={() => onNavigateTab(item.tab)}
                className="flex w-full items-center justify-between gap-3 rounded-md px-2 py-2 text-left hover:bg-muted/50"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.kind}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {item.status && (
                    <Badge variant="outline" className="text-[10px] capitalize">
                      {item.status.replace(/_/g, " ")}
                    </Badge>
                  )}
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {formatDistanceToNow(new Date(item.updatedAt), { addSuffix: true })}
                  </span>
                </div>
              </button>
            ))}
          </CardContent>
        </Card>

        <Card className="shadow-none">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base font-semibold">
              <AlertTriangle className="h-4 w-4" />
              Actions needed
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {actionsNeeded.length === 0 && (
              <p className="text-sm text-muted-foreground py-6 text-center">
                Nothing needs attention right now.
              </p>
            )}
            {actionsNeeded.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-3 rounded-md border border-border/70 px-3 py-2"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{item.title}</p>
                  <p className="text-xs text-muted-foreground">{item.detail}</p>
                </div>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => onNavigateTab(item.tab)}
                >
                  Review
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
