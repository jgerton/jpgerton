import type { Metadata } from "next";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Free Website Audit | Check Your Site's Health",
  description:
    "Get a free, instant website health check. See how your site scores on performance, SEO, security, and accessibility. No signup required.",
  keywords: [
    "free website audit",
    "website health check",
    "site speed test",
    "SEO checker",
    "website security scan",
    "accessibility checker",
  ],
  openGraph: {
    title: "Free Website Audit | Check Your Site's Health",
    description:
      "Get a free, instant website health check. See how your site scores on performance, SEO, security, and accessibility.",
    url: `${siteConfig.url}/free-website-audit`,
    siteName: siteConfig.name,
    type: "website",
  },
};

export default function AuditLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
