"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent } from "@/components/ui/card";
import { ContactsTable } from "@/components/admin/contacts-table";
import { Badge } from "@/components/ui/badge";
import { Inbox } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Id } from "@/convex/_generated/dataModel";

type FilterTab = "all" | "unread" | "archived";
type ContactStatus = "read" | "responded" | "archived";

export default function AdminContactsPage() {
  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const { toast } = useToast();

  // Queries
  const allContacts = useQuery(api.contacts.list);
  const archivedContacts = useQuery(api.contacts.listArchived);

  // Mutations
  const updateStatus = useMutation(api.contacts.updateStatus);
  const archiveBulk = useMutation(api.contacts.archiveBulk);

  // Determine which contacts to show based on active tab
  const contacts =
    activeTab === "archived"
      ? archivedContacts
      : activeTab === "unread"
        ? allContacts?.filter((c) => c.status === "unread")
        : allContacts;

  const isLoading = contacts === undefined;

  // Count badges for tabs
  const unreadCount = allContacts?.filter((c) => c.status === "unread").length ?? 0;

  // Handler for status change
  const handleStatusChange = async (
    id: Id<"contactSubmissions">,
    status: ContactStatus
  ) => {
    try {
      await updateStatus({ id, status });
      toast({
        title: "Status updated",
        description: `Contact marked as ${status}`,
      });
    } catch (err) {
      console.error("Failed to update status:", err);
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive",
      });
    }
  };

  // Handler for bulk archive
  const handleArchiveBulk = async (ids: Id<"contactSubmissions">[]) => {
    try {
      const count = await archiveBulk({ ids });
      toast({
        title: "Archived",
        description: `${count} contact${count !== 1 ? "s" : ""} archived`,
      });
    } catch (err) {
      console.error("Failed to archive contacts:", err);
      toast({
        title: "Error",
        description: "Failed to archive contacts",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with tabs */}
      <div className="flex items-center justify-between border-b">
        <h1 className="text-2xl font-bold pb-4">Contact Submissions</h1>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 border-b">
        <button
          onClick={() => setActiveTab("all")}
          className={`px-4 py-2 border-b-2 transition-colors ${
            activeTab === "all"
              ? "border-primary text-primary font-medium"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          All
        </button>
        <button
          onClick={() => setActiveTab("unread")}
          className={`px-4 py-2 border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === "unread"
              ? "border-primary text-primary font-medium"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Unread
          {unreadCount > 0 && (
            <Badge
              variant="secondary"
              className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
            >
              {unreadCount}
            </Badge>
          )}
        </button>
        <button
          onClick={() => setActiveTab("archived")}
          className={`px-4 py-2 border-b-2 transition-colors ${
            activeTab === "archived"
              ? "border-primary text-primary font-medium"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Archived
        </button>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground">Loading...</div>
      ) : contacts && contacts.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Inbox className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              {activeTab === "unread"
                ? "No unread contacts"
                : activeTab === "archived"
                  ? "No archived contacts"
                  : "No contact submissions yet"}
            </p>
          </CardContent>
        </Card>
      ) : contacts ? (
        <ContactsTable
          contacts={contacts}
          onStatusChange={handleStatusChange}
          onArchiveBulk={handleArchiveBulk}
        />
      ) : null}
    </div>
  );
}
