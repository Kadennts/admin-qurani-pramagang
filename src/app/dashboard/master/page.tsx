"use client";

import { useMasterDashboard } from "@/features/master/dashboard/hooks/use-master-dashboard";
import { MasterDashboardView } from "@/features/master/dashboard/ui/master-dashboard-view";

export default function MasterDashboardPage() {
  const state = useMasterDashboard();

  return <MasterDashboardView state={state} />;
}
