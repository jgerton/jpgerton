"use client";

import { ThemeToggle } from "@/components/theme-toggle";

export function AdminHeader() {
  return (
    <header className="bg-admin-sidebar border-b border-admin px-6 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-semibold">Admin</h1>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
