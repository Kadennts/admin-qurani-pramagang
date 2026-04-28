import type { AppProfile } from "@/components/providers/app-preferences-provider";

export type ProfileNotificationRecipient = string;

export type ProfileAccountRecord = {
  id: string;
  username: string | null;
  full_name: string | null;
  email: string | null;
  role: string | null;
  status: string | null;
  country: string | null;
  province: string | null;
  city: string | null;
};

export type ProfileCountry = {
  id: string;
  name: string;
};

export type ProfileState = {
  id: string;
  country_id: string;
  name: string;
  country_name?: string | null;
  country?: string | null;
};

export type ProfileCity = {
  id: string;
  state_id: string;
  name: string;
  timezone?: string | null;
  state_name?: string | null;
  state?: string | null;
};

export type ProfileSelectOption = {
  value: string;
  label: string;
};

export type ProfileAccountStoragePayload = AppProfile;

export type ProfileAccountPersistResult = {
  nextProfile: AppProfile;
  persistedToDatabase: boolean;
};

export type ProfileAccountAutoSaveStatus =
  | "idle"
  | "saving"
  | "saved"
  | "error";

export type ProfileAccountPersistOptions = {
  showSuccessToast?: boolean;
  showErrorToast?: boolean;
  silent?: boolean;
};

export type ProfileAccountSessionCookiePayload = {
  name: string;
  username: string;
  email: string;
  role: string;
  country: string;
  state: string;
  city: string;
  timezone: string;
};
