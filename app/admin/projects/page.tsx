"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

export default function AdminProjectsPage() {
  return (
    <div className="max-w-6xl">
      <h1 className="text-3xl font-bold mb-6">Projects Management</h1>
      <Card>
        <CardHeader>
          <CardTitle>Coming Soon</CardTitle>
          <CardDescription>
            Manage your portfolio projects and visibility
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This page will allow you to create, edit, and manage your portfolio
            projects. You'll be able to upload screenshots, set project status,
            add technologies, and control which projects appear on your public
            portfolio.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
