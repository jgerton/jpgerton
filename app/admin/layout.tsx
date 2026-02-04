import type { Metadata } from "next";
import { AdminHeader } from "@/components/admin/admin-header";
import { AdminTabs } from "@/components/admin/admin-tabs";

export const metadata: Metadata = {
  title: "Admin | jpgerton.com",
  description: "Admin dashboard for managing projects and contacts",
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="admin-layout min-h-screen bg-admin">
      <AdminHeader />
      <AdminTabs />
      <main className="admin-main p-6">{children}</main>
    </div>
  );
}
