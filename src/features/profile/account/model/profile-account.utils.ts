import type { AppProfile } from "@/components/providers/app-preferences-provider";

import { PROFILE_SESSION_STORAGE_KEY } from "./profile-account.constants";
import type {
  ProfileAccountRecord,
  ProfileAccountSessionCookiePayload,
  ProfileAccountStoragePayload,
  ProfileCity,
  ProfileCountry,
  ProfileSelectOption,
  ProfileState,
} from "./profile-account.types";

export function buildProfileSelectOptions(
  items: Array<{ name: string }>,
): ProfileSelectOption[] {
  return items.map((item) => ({
    value: item.name,
    label: item.name,
  }));
}

export function findCountryByName(
  countries: ProfileCountry[],
  countryName: string,
) {
  return countries.find((country) => country.name === countryName) ?? null;
}

export function findStateByName(states: ProfileState[], stateName: string) {
  return states.find((state) => state.name === stateName) ?? null;
}

export function filterStatesByCountry(
  countries: ProfileCountry[],
  states: ProfileState[],
  countryName: string,
) {
  if (!countryName || countries.length === 0) {
    return states;
  }

  const country = findCountryByName(countries, countryName);
  if (!country) {
    return states;
  }

  const matchedStates = states.filter((state) => state.country_id === country.id);

  if (matchedStates.length > 0) {
    return matchedStates;
  }

  return states.filter(
    (state) =>
      state.country_name === countryName || state.country === countryName,
  );
}

export function filterCitiesByState(states: ProfileState[], cities: ProfileCity[], stateName: string) {
  if (!stateName || states.length === 0) {
    return cities;
  }

  const state = findStateByName(states, stateName);

  if (!state) {
    return cities;
  }

  const matchedCities = cities.filter((city) => city.state_id === state.id);

  if (matchedCities.length > 0) {
    return matchedCities;
  }

  return cities.filter(
    (city) => city.state_name === stateName || city.state === stateName,
  );
}

export function findCityByName(cities: ProfileCity[], cityName: string) {
  return cities.find((city) => city.name === cityName) ?? null;
}

export function buildProfileAccountStorageKey(username: string) {
  return `${PROFILE_SESSION_STORAGE_KEY}:${username}`;
}

function canUseBrowserStorage() {
  return typeof window !== "undefined";
}

export function readScopedProfileAccountStorage(username: string) {
  if (!canUseBrowserStorage()) {
    return null;
  }

  const raw = window.localStorage.getItem(buildProfileAccountStorageKey(username));

  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as ProfileAccountStoragePayload;
  } catch {
    window.localStorage.removeItem(buildProfileAccountStorageKey(username));
    return null;
  }
}

export function writeScopedProfileAccountStorage(profile: AppProfile) {
  if (!canUseBrowserStorage()) {
    return;
  }

  window.localStorage.setItem(
    buildProfileAccountStorageKey(profile.username),
    JSON.stringify(profile),
  );
}

export function writeCurrentSessionProfileStorage(profile: AppProfile) {
  if (!canUseBrowserStorage()) {
    return;
  }

  window.localStorage.setItem(PROFILE_SESSION_STORAGE_KEY, JSON.stringify(profile));
}

export function clearCurrentSessionProfileStorage() {
  if (!canUseBrowserStorage()) {
    return;
  }

  window.localStorage.removeItem(PROFILE_SESSION_STORAGE_KEY);
}

export function buildProfileAccountCookiePayload(
  profile: AppProfile,
): ProfileAccountSessionCookiePayload {
  return {
    name: profile.name,
    username: profile.username,
    email: profile.email,
    role: profile.role,
    country: profile.country,
    state: profile.state,
    city: profile.city,
    timezone: profile.timezone,
  };
}

export function writeProfileAccountSessionCookie(profile: AppProfile) {
  if (typeof document === "undefined") {
    return;
  }

  document.cookie = `myqurani_user=${encodeURIComponent(
    JSON.stringify(buildProfileAccountCookiePayload(profile)),
  )}; path=/; max-age=86400;`;
}

export function syncProfileAccountSession(profile: AppProfile) {
  // We store the same profile in three places:
  // - current session storage for the running app
  // - per-user storage so relogin restores the latest edit for that account
  // - cookie so the provider can hydrate quickly on page reload
  writeCurrentSessionProfileStorage(profile);
  writeScopedProfileAccountStorage(profile);
  writeProfileAccountSessionCookie(profile);
}

export function mergeProfileAccountSources(
  baseProfile: AppProfile,
  persistedRecord: ProfileAccountRecord | null,
  scopedProfile: ProfileAccountStoragePayload | null,
) {
  // Browser-scoped data is applied first because it may contain recent edits
  // that were not part of the original login payload.
  const mergedProfile: AppProfile = {
    ...baseProfile,
    ...(scopedProfile ?? {}),
  };

  if (!persistedRecord) {
    return mergedProfile;
  }

  // Database data remains the source of truth for persisted account fields.
  return {
    ...mergedProfile,
    name: persistedRecord.full_name || mergedProfile.name,
    username: persistedRecord.username || mergedProfile.username,
    email: persistedRecord.email || mergedProfile.email,
    role: normalizeRoleLabel(persistedRecord.role || mergedProfile.role),
    country: persistedRecord.country || mergedProfile.country,
    state: persistedRecord.province || mergedProfile.state,
    city: persistedRecord.city || mergedProfile.city,
  };
}

export function mapProfileToAccountRecordInput(profile: AppProfile) {
  return {
    username: profile.username,
    full_name: profile.name,
    email: profile.email,
    country: profile.country,
    // App uses "state", while the existing table stores it as "province".
    province: profile.state,
    city: profile.city,
    role: profile.role,
    status: "Active",
  };
}

export function buildLocationProfilePatch(profile: AppProfile, draft: AppProfile) {
  return {
    ...profile,
    country: draft.country,
    state: draft.state,
    city: draft.city,
    timezone: draft.timezone,
  };
}

export function buildProfileLocationSignature(profile: AppProfile) {
  return [profile.country, profile.state, profile.city, profile.timezone].join("|");
}

export function normalizeRoleLabel(value: string) {
  if (!value) {
    return "Admin";
  }

  return value.slice(0, 1).toUpperCase() + value.slice(1);
}
