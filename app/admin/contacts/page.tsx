"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

export default function AdminContactsPage() {
  return (
    <div className="max-w-6xl">
      <h1 className="text-3xl font-bold mb-6">Contact Submissions</h1>
      <Card>
        <CardHeader>
          <CardTitle>Coming Soon</CardTitle>
          <CardDescription>
            View and manage contact form submissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This page will display all contact submissions from your website.
            You&apos;ll be able to view submission details, mark them as read or
            responded to, and archive completed conversations.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
