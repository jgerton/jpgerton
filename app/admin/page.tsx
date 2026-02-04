"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

export default function AdminDashboardPage() {
  return (
    <div className="max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <Card>
        <CardHeader>
          <CardTitle>Coming Soon</CardTitle>
          <CardDescription>
            Dashboard overview with key metrics and activity
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This page will display an overview of your site&apos;s activity,
            including recent contact submissions, project statistics, and quick
            actions.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
