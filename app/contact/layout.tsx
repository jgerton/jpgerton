import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch about your web design project. Book a free discovery call or send a message.",
  openGraph: {
    title: "Contact | Jon Gerton Web Design",
    description: "Get in touch about your web design project.",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
