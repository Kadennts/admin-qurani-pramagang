"use client";

import { AdminDashboardView } from "@/features/admin/dashboard/ui/admin-dashboard-view";
import { useAdminDashboard } from "@/features/admin/dashboard/hooks/use-admin-dashboard";

export default function AdminDashboardPage() {
  const state = useAdminDashboard();

  return <AdminDashboardView state={state} />;
}
