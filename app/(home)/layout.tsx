import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Jon Gerton - Web Design & Development",
  description:
    "Professional WordPress websites starting at $500. Custom web applications and indie project portfolio by Jon Gerton.",
  openGraph: {
    title: "Jon Gerton - Web Design & Development",
    description: "Professional WordPress websites starting at $500.",
    type: "website",
  },
};

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
