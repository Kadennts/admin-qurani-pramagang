import type { createClient } from "@/utils/supabase/client";

import type { AdminDashboardUserRow } from "../model/admin-dashboard.types";

type AdminSupabaseClient = ReturnType<typeof createClient>;

export async function fetchAdminDashboardUsers(client: AdminSupabaseClient) {
  const { data, error } = await client.from("user_profiles").select("*");

  if (error) {
    throw error;
  }

  return (data ?? []) as AdminDashboardUserRow[];
}

export async function fetchAdminUsersCount(client: AdminSupabaseClient) {
  const { data, error } = await client.from("admin_users").select("id");

  if (error) {
    throw error;
  }

  return (data ?? []).length;
}
