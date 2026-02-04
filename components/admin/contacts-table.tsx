"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Archive, ChevronDown } from "lucide-react";
import type { Doc } from "@/convex/_generated/dataModel";

type ContactStatus = "unread" | "read" | "responded" | "archived";

interface ContactsTableProps {
  contacts: Doc<"contactSubmissions">[];
  onStatusChange: (id: string, status: ContactStatus) => void;
  onArchiveBulk: (ids: string[]) => void;
}

export function ContactsTable({
  contacts,
  onStatusChange,
  onArchiveBulk,
}: ContactsTableProps) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  // Toggle all checkboxes
  const toggleAll = () => {
    if (selected.size === contacts.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(contacts.map((c) => c._id)));
    }
  };

  // Toggle individual checkbox
  const toggleOne = (id: string) => {
    const newSelected = new Set(selected);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelected(newSelected);
  };

  // Handle bulk archive
  const handleBulkArchive = () => {
    onArchiveBulk(Array.from(selected));
    setSelected(new Set());
  };

  // Handle row click (not checkbox)
  const handleRowClick = (contact: Doc<"contactSubmissions">) => {
    // Mark as read if unread
    if (contact.status === "unread") {
      onStatusChange(contact._id, "read");
    }
    // Toggle expanded state
    setExpandedRow(expandedRow === contact._id ? null : contact._id);
  };

  // Status badge styling
  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      unread:
        "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
      read: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      responded:
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    };

    return (
      <Badge variant="secondary" className={variants[status] || ""}>
        {status}
      </Badge>
    );
  };

  // Format date
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-4">
      {/* Bulk action bar */}
      {selected.size > 0 && (
        <div className="flex items-center gap-4 p-3 bg-muted rounded-lg">
          <span className="text-sm font-medium">{selected.size} selected</span>
          <Button variant="outline" size="sm" onClick={handleBulkArchive}>
            <Archive className="h-4 w-4 mr-2" />
            Archive Selected
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelected(new Set())}
          >
            Clear
          </Button>
        </div>
      )}

      {/* Table */}
      <div className="border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr className="text-left text-sm">
              <th className="w-12 p-3">
                <input
                  type="checkbox"
                  checked={
                    contacts.length > 0 && selected.size === contacts.length
                  }
                  onChange={toggleAll}
                  className="cursor-pointer"
                  aria-label="Select all contacts"
                />
              </th>
              <th className="p-3">Status</th>
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Project Type</th>
              <th className="p-3">Date</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {contacts.map((contact) => (
              <>
                <tr
                  key={contact._id}
                  className="border-t hover:bg-accent/50 transition-colors cursor-pointer"
                  onClick={() => handleRowClick(contact)}
                >
                  <td className="p-3" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={selected.has(contact._id)}
                      onChange={() => toggleOne(contact._id)}
                      className="cursor-pointer"
                      aria-label={`Select ${contact.name}`}
                    />
                  </td>
                  <td className="p-3">{getStatusBadge(contact.status)}</td>
                  <td className="p-3 font-medium">{contact.name}</td>
                  <td className="p-3 text-sm text-muted-foreground">
                    {contact.email}
                  </td>
                  <td className="p-3 text-sm">{contact.projectType}</td>
                  <td className="p-3 text-sm text-muted-foreground">
                    {formatDate(contact.createdAt)}
                  </td>
                  <td className="p-3" onClick={(e) => e.stopPropagation()}>
                    <div className="relative group">
                      <Button variant="ghost" size="sm">
                        Change Status
                        <ChevronDown className="ml-1 h-3 w-3" />
                      </Button>
                      <div className="hidden group-hover:block absolute right-0 z-10 mt-1 w-40 bg-popover border rounded-md shadow-lg">
                        <div className="py-1">
                          <button
                            className="w-full text-left px-4 py-2 text-sm hover:bg-accent"
                            onClick={() => onStatusChange(contact._id, "read")}
                          >
                            Mark as Read
                          </button>
                          <button
                            className="w-full text-left px-4 py-2 text-sm hover:bg-accent"
                            onClick={() =>
                              onStatusChange(contact._id, "responded")
                            }
                          >
                            Mark as Responded
                          </button>
                          <button
                            className="w-full text-left px-4 py-2 text-sm hover:bg-accent"
                            onClick={() =>
                              onStatusChange(contact._id, "archived")
                            }
                          >
                            Archive
                          </button>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
                {/* Expanded row for message content */}
                {expandedRow === contact._id && (
                  <tr className="border-t bg-muted/30">
                    <td colSpan={7} className="p-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold">Message</h4>
                          <a
                            href={`mailto:${contact.email}?subject=Re: ${contact.projectType} inquiry`}
                            className="text-sm text-primary hover:underline"
                            onClick={(e) => e.stopPropagation()}
                          >
                            Reply via Email
                          </a>
                        </div>
                        <p className="text-sm whitespace-pre-wrap">
                          {contact.message}
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
