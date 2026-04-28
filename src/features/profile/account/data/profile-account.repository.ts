import type { AppProfile } from "@/components/providers/app-preferences-provider";
import type { createClient } from "@/utils/supabase/client";

import {
  mapProfileToAccountRecordInput,
} from "../model/profile-account.utils";
import type {
  ProfileAccountRecord,
  ProfileCity,
  ProfileCountry,
  ProfileState,
} from "../model/profile-account.types";

type ProfileAccountClient = ReturnType<typeof createClient>;

export async function fetchProfileAccountMasterData(
  client: ProfileAccountClient,
) {
  const [{ data: countries, error: countriesError }, { data: states, error: statesError }, { data: cities, error: citiesError }] =
    await Promise.all([
      client.from("countries").select("*").order("name"),
      client.from("states").select("*").order("name"),
      client.from("cities").select("*").order("name"),
    ]);

  if (countriesError || statesError || citiesError) {
    throw countriesError || statesError || citiesError;
  }

  return {
    cities: (cities ?? []) as ProfileCity[],
    countries: (countries ?? []) as ProfileCountry[],
    states: (states ?? []) as ProfileState[],
  };
}

export async function fetchProfileAccountByUsername(
  client: ProfileAccountClient,
  username: string,
) {
  const { data, error } = await client
    .from("user_profiles")
    .select("*")
    .eq("username", username)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return (data ?? null) as ProfileAccountRecord | null;
}

export async function saveProfileAccount(
  client: ProfileAccountClient,
  profile: AppProfile,
) {
  const payload = mapProfileToAccountRecordInput(profile);
  const existingProfile = await fetchProfileAccountByUsername(client, profile.username);

  if (existingProfile) {
    // Update keeps the same row for returning users.
    const { error } = await client
      .from("user_profiles")
      .update(payload)
      .eq("id", existingProfile.id);

    if (error) {
      throw error;
    }

    return;
  }

  // Insert covers first-time profiles that do not yet exist in user_profiles.
  const { error } = await client.from("user_profiles").insert(payload);

  if (error) {
    throw error;
  }
}
