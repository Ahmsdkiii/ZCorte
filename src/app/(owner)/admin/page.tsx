import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { buildPageMetadata } from "@/lib/metadata";
import { getAdminDashboardDataAction } from "@/actions/admin.actions";
import { AdminDashboardView } from "@/components/organisms/Admin/AdminDashboardView";

export const metadata: Metadata = buildPageMetadata({
  title: "Admin Command Center — Executive Overview",
  description: "Live management dashboard for orders, sales analytics, and inventory controls.",
  path: "/admin",
});

export default async function AdminPage() {
  const result = await getAdminDashboardDataAction();

  if (!result.success || !result.data) {
    redirect("/login?callbackUrl=/admin");
  }

  return <AdminDashboardView initialData={result.data} />;
}
