import type { createClient } from "@/utils/supabase/client";

import type { SupportDashboardTicketStatusRow } from "../model/support-dashboard.types";

type SupportDashboardClient = ReturnType<typeof createClient>;

export async function fetchSupportDashboardTicketStatuses(client: SupportDashboardClient) {
  const { data, error } = await client.from("support_tickets").select("status");

  if (error) {
    throw error;
  }

  return (data ?? []) as SupportDashboardTicketStatusRow[];
}
