"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  const health = useQuery(api.functions.health.check);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-background">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <h1 className="text-4xl font-bold mb-8 text-foreground">jpgerton.com</h1>

      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Infrastructure Status
            <Badge variant={health ? "default" : "secondary"}>
              {health ? "Connected" : "Loading"}
            </Badge>
          </CardTitle>
          <CardDescription>Phase 1 verification page</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm">
            {health ? (
              <p className="text-green-600 dark:text-green-400">
                Convex: {health.status} at{" "}
                {new Date(health.timestamp).toLocaleTimeString()}
              </p>
            ) : (
              <p className="text-yellow-600 dark:text-yellow-400">
                Connecting to Convex...
              </p>
            )}
          </div>

          <div className="flex gap-2">
            <Button variant="default">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
