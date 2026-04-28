"use client";

import { useBillingDashboard } from "@/features/billing/dashboard/hooks/use-billing-dashboard";
import { BillingDashboardView } from "@/features/billing/dashboard/ui/billing-dashboard-view";

export default function BillingDashboardPage() {
  const state = useBillingDashboard();

  return <BillingDashboardView state={state} />;
}
