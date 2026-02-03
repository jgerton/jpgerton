"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function Home() {
  const health = useQuery(api.functions.health.check);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">jpgerton.com</h1>
      <div className="text-lg">
        {health ? (
          <p className="text-green-600">
            Convex connected: {health.status} at{" "}
            {new Date(health.timestamp).toLocaleTimeString()}
          </p>
        ) : (
          <p className="text-yellow-600">Connecting to Convex...</p>
        )}
      </div>
    </main>
  );
}
