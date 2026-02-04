import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Professional web design services starting at $500. WordPress websites, custom web applications, and team growth consulting.",
  openGraph: {
    title: "Services | Jon Gerton Web Design",
    description: "Professional web design services starting at $500.",
  },
};

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
