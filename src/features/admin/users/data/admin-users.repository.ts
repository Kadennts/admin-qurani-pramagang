import type { createClient } from "@/utils/supabase/client";

import type { AdminCity, AdminCountry, AdminState, AdminUserFormData, AdminUserProfile } from "../model/admin-users.types";

type AdminSupabaseClient = ReturnType<typeof createClient>;

export async function fetchAdminUserProfiles(client: AdminSupabaseClient) {
  const { data, error } = await client
    .from("user_profiles")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return (data ?? []) as AdminUserProfile[];
}

export async function fetchAdminCountries(client: AdminSupabaseClient) {
  const { data, error } = await client.from("countries").select("*").order("name");

  if (error) {
    throw error;
  }

  return (data ?? []) as AdminCountry[];
}

export async function fetchAdminStatesByCountryId(client: AdminSupabaseClient, countryId: string) {
  const { data, error } = await client.from("states").select("*").eq("country_id", countryId).order("name");

  if (error) {
    throw error;
  }

  return (data ?? []) as AdminState[];
}

export async function fetchAdminCitiesByStateId(client: AdminSupabaseClient, stateId: string) {
  const { data, error } = await client.from("cities").select("*").eq("state_id", stateId).order("name");

  if (error) {
    throw error;
  }

  return (data ?? []) as AdminCity[];
}

export async function updateAdminUserProfile(
  client: AdminSupabaseClient,
  userId: string,
  formData: AdminUserFormData,
) {
  const { data, error } = await client
    .from("user_profiles")
    .update({
      username: formData.username,
      full_name: formData.full_name,
      email: formData.email,
      country: formData.country,
      province: formData.province,
      city: formData.city,
      role: formData.role,
      status: formData.status,
    })
    .eq("id", userId)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data as AdminUserProfile;
}
