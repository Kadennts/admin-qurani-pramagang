import type { createClient } from "@/utils/supabase/client";

import type { BillingDashboardOrder } from "../model/billing-dashboard.types";

type BillingDashboardClient = ReturnType<typeof createClient>;

export async function fetchBillingDashboardOrders(client: BillingDashboardClient) {
  const { data, error } = await client
    .from("billing_pesanan")
    .select("*")
    .order("order_date", { ascending: false });

  if (error) {
    throw error;
  }

  return (data ?? []) as BillingDashboardOrder[];
}
