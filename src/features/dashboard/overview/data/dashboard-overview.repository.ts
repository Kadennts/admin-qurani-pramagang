import type { createClient } from "@/utils/supabase/client";

import type {
  DashboardOverviewDateRange,
  DashboardOverviewGroup,
  DashboardOverviewOrderTimestampRow,
  DashboardOverviewQueryResult,
  DashboardOverviewTimestampRow,
} from "../model/dashboard-overview.types";

type DashboardOverviewClient = ReturnType<typeof createClient>;

export async function fetchDashboardOverviewSnapshot(
  client: DashboardOverviewClient,
  range: DashboardOverviewDateRange | null,
): Promise<DashboardOverviewQueryResult> {
  let usersQuery = client.from("user_profiles").select("created_at");
  let groupsQuery = client.from("support_groups").select("created_at");
  let ordersQuery = client.from("billing_pesanan").select("order_date");
  let topGroupQuery = client
    .from("support_groups")
    .select("id, name, initials, type, description, member_count, created_at")
    .order("member_count", { ascending: false })
    .limit(1);

  if (range) {
    const startIso = range.start.toISOString();
    const endIso = range.end.toISOString();

    usersQuery = usersQuery.gte("created_at", startIso).lt("created_at", endIso);
    groupsQuery = groupsQuery.gte("created_at", startIso).lt("created_at", endIso);
    ordersQuery = ordersQuery.gte("order_date", startIso).lt("order_date", endIso);
    topGroupQuery = topGroupQuery.gte("created_at", startIso).lt("created_at", endIso);
  }

  const [
    { data: usersData, error: usersError },
    { data: groupsData, error: groupsError },
    { data: ordersData, error: ordersError },
    { data: topGroupsData, error: topGroupError },
  ] = await Promise.all([usersQuery, groupsQuery, ordersQuery, topGroupQuery]);

  if (usersError || groupsError || ordersError || topGroupError) {
    throw usersError || groupsError || ordersError || topGroupError;
  }

  return {
    userDates: ((usersData ?? []) as DashboardOverviewTimestampRow[])
      .map((item) => item.created_at)
      .filter((value): value is string => Boolean(value)),
    groupDates: ((groupsData ?? []) as DashboardOverviewTimestampRow[])
      .map((item) => item.created_at)
      .filter((value): value is string => Boolean(value)),
    orderDates: ((ordersData ?? []) as DashboardOverviewOrderTimestampRow[])
      .map((item) => item.order_date)
      .filter((value): value is string => Boolean(value)),
    topGroup: (topGroupsData?.[0] ?? null) as DashboardOverviewGroup | null,
  };
}
