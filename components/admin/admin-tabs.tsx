"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const tabs = [
  { label: "Dashboard", href: "/admin" },
  { label: "Projects", href: "/admin/projects" },
  { label: "Contacts", href: "/admin/contacts" },
];

export function AdminTabs() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/admin") {
      return pathname === "/admin";
    }
    return pathname.startsWith(href);
  };

  return (
    <nav className="border-b border-admin bg-admin-sidebar">
      <div className="flex px-6">
        {tabs.map((tab) => (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              "px-4 py-3 text-sm font-medium border-b-2 -mb-px transition-colors",
              isActive(tab.href)
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            {tab.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
