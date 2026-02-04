import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about Jon Gerton - 10+ years of web development experience helping local businesses and startups get online.",
  openGraph: {
    title: "About | Jon Gerton Web Design",
    description: "10+ years helping businesses get online.",
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
