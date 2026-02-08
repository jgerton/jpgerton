"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { cn } from "@/lib/utils";

const tabs = [
  { label: "Dashboard", href: "/admin" },
  { label: "Projects", href: "/admin/projects" },
  { label: "Blog", href: "/admin/blog" },
  { label: "Case Studies", href: "/admin/case-studies" },
  { label: "Contacts", href: "/admin/contacts" },
  { label: "Audits", href: "/admin/audits" },
];

export function AdminTabs() {
  const pathname = usePathname();
  const blogPosts = useQuery(api.blogPosts.list, {});
  const caseStudies = useQuery(api.caseStudies.list, {});

  const isActive = (href: string) => {
    if (href === "/admin") {
      return pathname === "/admin";
    }
    return pathname.startsWith(href);
  };

  const getCount = (href: string) => {
    if (href === "/admin/blog") {
      return blogPosts?.length;
    }
    if (href === "/admin/case-studies") {
      return caseStudies?.length;
    }
    return undefined;
  };

  return (
    <nav className="border-b border-admin bg-admin-sidebar">
      <div className="flex px-6">
        {tabs.map((tab) => {
          const count = getCount(tab.href);
          return (
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
              {count !== undefined ? ` (${count})` : ""}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
