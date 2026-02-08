"use client";

import { useState, useEffect } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { StatsCard } from "@/components/admin/stats-card";
import { Badge } from "@/components/ui/badge";
import { Mail, Folder, Calendar, BarChart3 } from "lucide-react";
import Link from "next/link";

export default function AdminDashboardPage() {
  const contacts = useQuery(api.contacts.list);
  const projects = useQuery(api.projects.list);
  const auditLeadStats = useQuery(api.auditLeads.stats);
  const [now, setNow] = useState(() => Date.now());

  // Update current time when contacts change
  useEffect(() => {
    setNow(Date.now());
  }, [contacts]);

  // Calculate stats
  const isLoading = contacts === undefined || projects === undefined;
  const unreadCount = contacts?.filter((c) => c.status === "unread").length ?? 0;
  const projectCount = projects?.length ?? 0;

  // Contacts from this week
  const weekAgo = now - 7 * 24 * 60 * 60 * 1000;
  const weekCount = contacts?.filter((c) => c.createdAt >= weekAgo).length ?? 0;

  // Recent contacts (last 5)
  const recentContacts = contacts?.slice(0, 5) ?? [];

  // Helper for time ago
  const timeAgo = (timestamp: number) => {
    const seconds = Math.floor((now - timestamp) / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return "just now";
  };

  // Status badge styling
  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      unread: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
      read: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      responded: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    };

    return (
      <Badge variant="secondary" className={variants[status] || ""}>
        {status}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          label="Unread Messages"
          value={isLoading ? "..." : unreadCount}
          icon={<Mail className="h-8 w-8" />}
        />
        <StatsCard
          label="Total Projects"
          value={isLoading ? "..." : projectCount}
          icon={<Folder className="h-8 w-8" />}
        />
        <StatsCard
          label="This Week"
          value={isLoading ? "..." : weekCount}
          icon={<Calendar className="h-8 w-8" />}
        />
        <StatsCard
          label="Audit Leads"
          value={auditLeadStats === undefined ? "..." : auditLeadStats.new}
          icon={<BarChart3 className="h-8 w-8" />}
        />
      </div>

      {/* Recent Contact Submissions */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Contact Submissions</CardTitle>
          <Link
            href="/admin/contacts"
            className="text-sm text-primary hover:underline"
          >
            View all
          </Link>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">
              Loading...
            </div>
          ) : recentContacts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Mail className="mx-auto h-12 w-12 mb-2 opacity-20" />
              <p>No contact submissions yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentContacts.map((contact) => (
                <div
                  key={contact._id}
                  className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                >
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium truncate">{contact.name}</p>
                      {getStatusBadge(contact.status)}
                    </div>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <span className="truncate">{contact.email}</span>
                      <span className="text-xs">•</span>
                      <span>{contact.projectType}</span>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground ml-4">
                    {timeAgo(contact.createdAt)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
