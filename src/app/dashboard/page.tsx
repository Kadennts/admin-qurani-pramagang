"use client";

import { DashboardOverviewView } from "@/features/dashboard/overview/ui/dashboard-overview-view";
import { useDashboardOverview } from "@/features/dashboard/overview/hooks/use-dashboard-overview";

export default function DashboardPage() {
  const state = useDashboardOverview();

  return <DashboardOverviewView state={state} />;
}
