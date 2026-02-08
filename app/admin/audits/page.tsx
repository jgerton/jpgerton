"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { StatsCard } from "@/components/admin/stats-card";
import { Badge } from "@/components/ui/badge";
import { BarChart3, Users, TrendingUp } from "lucide-react";
import type { Id } from "@/convex/_generated/dataModel";

export default function AdminAuditsPage() {
  const audits = useQuery(api.siteAudits.list);
  const auditStats = useQuery(api.siteAudits.stats);
  const leads = useQuery(api.auditLeads.list);
  const leadStats = useQuery(api.auditLeads.stats);
  const updateLeadStatus = useMutation(api.auditLeads.updateStatus);

  const isLoading =
    audits === undefined ||
    leads === undefined ||
    auditStats === undefined ||
    leadStats === undefined;

  const handleStatusChange = async (
    id: Id<"auditLeads">,
    status: "new" | "contacted" | "converted" | "archived"
  ) => {
    await updateLeadStatus({ id, status });
  };

  const getGradeBadge = (grade?: string) => {
    if (!grade) return null;
    const variants: Record<string, string> = {
      A: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      B: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      C: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      D: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
      F: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    };
    return (
      <Badge variant="secondary" className={variants[grade] || ""}>
        {grade}
      </Badge>
    );
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      new: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
      contacted:
        "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      converted:
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      archived: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
    };
    return (
      <Badge variant="secondary" className={variants[status] || ""}>
        {status}
      </Badge>
    );
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Website Audits</h1>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatsCard
          label="Total Audits"
          value={isLoading ? "..." : (auditStats?.total ?? 0)}
          icon={<BarChart3 className="h-8 w-8" />}
        />
        <StatsCard
          label="This Week"
          value={isLoading ? "..." : (auditStats?.thisWeek ?? 0)}
          icon={<TrendingUp className="h-8 w-8" />}
        />
        <StatsCard
          label="Leads Generated"
          value={isLoading ? "..." : (leadStats?.total ?? 0)}
          icon={<Users className="h-8 w-8" />}
        />
      </div>

      {/* Leads Table */}
      <Card>
        <CardHeader>
          <CardTitle>Audit Leads</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">
              Loading...
            </div>
          ) : leads.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="mx-auto h-12 w-12 mb-2 opacity-20" />
              <p>No audit leads yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2 font-medium">Name</th>
                    <th className="text-left p-2 font-medium">Email</th>
                    <th className="text-left p-2 font-medium">Business</th>
                    <th className="text-left p-2 font-medium">URL</th>
                    <th className="text-left p-2 font-medium">Grade</th>
                    <th className="text-left p-2 font-medium">Status</th>
                    <th className="text-left p-2 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.map((lead) => (
                    <tr key={lead._id} className="border-b hover:bg-accent/50">
                      <td className="p-2">{lead.name}</td>
                      <td className="p-2">
                        <a
                          href={`mailto:${lead.email}`}
                          className="text-primary hover:underline"
                        >
                          {lead.email}
                        </a>
                      </td>
                      <td className="p-2 text-muted-foreground">
                        {lead.businessName || "-"}
                      </td>
                      <td className="p-2 max-w-[200px] truncate">
                        {lead.auditUrl || "-"}
                      </td>
                      <td className="p-2">{getGradeBadge(lead.auditGrade)}</td>
                      <td className="p-2">
                        <select
                          value={lead.status}
                          onChange={(e) =>
                            handleStatusChange(
                              lead._id,
                              e.target.value as
                                | "new"
                                | "contacted"
                                | "converted"
                                | "archived"
                            )
                          }
                          className="text-xs border rounded px-1 py-0.5 bg-background"
                        >
                          <option value="new">New</option>
                          <option value="contacted">Contacted</option>
                          <option value="converted">Converted</option>
                          <option value="archived">Archived</option>
                        </select>
                      </td>
                      <td className="p-2 text-muted-foreground">
                        {formatDate(lead.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Audits Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Audits</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">
              Loading...
            </div>
          ) : audits.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <BarChart3 className="mx-auto h-12 w-12 mb-2 opacity-20" />
              <p>No audits yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2 font-medium">URL</th>
                    <th className="text-left p-2 font-medium">Grade</th>
                    <th className="text-left p-2 font-medium">Status</th>
                    <th className="text-left p-2 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {audits.slice(0, 50).map((audit) => (
                    <tr
                      key={audit._id}
                      className="border-b hover:bg-accent/50"
                    >
                      <td className="p-2 max-w-[300px] truncate">
                        {audit.url}
                      </td>
                      <td className="p-2">
                        {getGradeBadge(audit.overallGrade)}
                      </td>
                      <td className="p-2">{getStatusBadge(audit.status)}</td>
                      <td className="p-2 text-muted-foreground">
                        {formatDate(audit.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
