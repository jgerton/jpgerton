import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Articles about local business web design, technical insights, and company updates from Jon Gerton.",
  openGraph: {
    title: "Blog | Jon Gerton",
    description:
      "Articles about local business web design, technical insights, and company updates.",
  },
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
