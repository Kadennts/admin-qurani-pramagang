"use client";

import { useSupportDashboard } from "@/features/support/dashboard/hooks/use-support-dashboard";
import { SupportDashboardView } from "@/features/support/dashboard/ui/support-dashboard-view";

export default function SupportDashboardPage() {
  const state = useSupportDashboard();

  return <SupportDashboardView state={state} />;
}
