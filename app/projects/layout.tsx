import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Browse Jon Gerton's portfolio of indie projects and custom web development work.",
  openGraph: {
    title: "Projects | Jon Gerton",
    description: "Portfolio of indie projects and custom web development.",
  },
};

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
