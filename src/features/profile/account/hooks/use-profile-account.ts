"use client";

import { type ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { toast } from "sonner";

import {
  useAppPreferences,
  type AppProfile,
} from "@/components/providers/app-preferences-provider";
import { createClient } from "@/utils/supabase/client";

import {
  fetchProfileAccountByUsername,
  fetchProfileAccountMasterData,
  saveProfileAccount,
} from "../data/profile-account.repository";
import { PROFILE_SSR_PLACEHOLDER } from "../model/profile-account.constants";
import {
  buildLocationProfilePatch,
  buildProfileLocationSignature,
  buildProfileSelectOptions,
  filterCitiesByState,
  filterStatesByCountry,
  findCityByName,
  mergeProfileAccountSources,
  readScopedProfileAccountStorage,
  syncProfileAccountSession,
} from "../model/profile-account.utils";
import type {
  ProfileAccountAutoSaveStatus,
  ProfileAccountPersistOptions,
  ProfileCity,
  ProfileCountry,
  ProfileState,
} from "../model/profile-account.types";

async function persistProfileAccount(
  supabase: ReturnType<typeof createClient>,
  profile: AppProfile,
  updateProfile: (profile: AppProfile) => void,
  options: ProfileAccountPersistOptions = {},
) {
  // Keep the active session in sync first so the UI reflects the latest value
  // even when the database request is still in-flight or fails.
  syncProfileAccountSession(profile);
  updateProfile(profile);

  let persistedToDatabase = false;

  try {
    await saveProfileAccount(supabase, profile);
    persistedToDatabase = true;
  } catch (error) {
    console.error("Failed to sync profile account", error);

    if (options.showErrorToast) {
      toast.error("Perubahan tersimpan di browser, tetapi gagal sinkron ke database.");
    }
  }

  return {
    nextProfile: profile,
    persistedToDatabase,
  };
}

export function useProfileAccount() {
  const { language, profile, setLanguage, t, updateProfile } = useAppPreferences();
  const { resolvedTheme, setTheme } = useTheme();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const initialProfileRef = useRef(profile);
  const [supabase] = useState(() => createClient());
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] =
    useState<ProfileAccountAutoSaveStatus>("idle");
  const [draftProfile, setDraftProfile] = useState<AppProfile>(profile);
  const [countries, setCountries] = useState<ProfileCountry[]>([]);
  const [states, setStates] = useState<ProfileState[]>([]);
  const [cities, setCities] = useState<ProfileCity[]>([]);

  useEffect(() => {
    let isMounted = true;

    async function hydratePersistedProfile() {
      try {
        // The screen starts from provider defaults, then we blend in:
        // 1) master data for dropdowns, 2) database profile, 3) last per-user browser draft.
        const [masterData, persistedAccount] = await Promise.all([
          fetchProfileAccountMasterData(supabase),
          fetchProfileAccountByUsername(supabase, profile.username),
        ]);

        if (!isMounted) {
          return;
        }

        setCountries(masterData.countries);
        setStates(masterData.states);
        setCities(masterData.cities);

        const scopedProfile = readScopedProfileAccountStorage(profile.username);
        const mergedProfile = mergeProfileAccountSources(
          initialProfileRef.current,
          persistedAccount,
          scopedProfile,
        );

        syncProfileAccountSession(mergedProfile);
        updateProfile(mergedProfile);
        setDraftProfile(mergedProfile);
      } catch (error) {
        console.error("Failed to hydrate profile account", error);
      }
    }

    void hydratePersistedProfile();

    return () => {
      isMounted = false;
    };
  }, [profile.username, supabase, updateProfile]);

  const filteredStates = useMemo(
    () => filterStatesByCountry(countries, states, draftProfile.country),
    [countries, draftProfile.country, states],
  );

  const filteredCities = useMemo(
    () => filterCitiesByState(states, cities, draftProfile.state),
    [cities, draftProfile.state, states],
  );

  const countryOptions = useMemo(
    () => buildProfileSelectOptions(countries),
    [countries],
  );

  const stateOptions = useMemo(
    () => buildProfileSelectOptions(filteredStates),
    [filteredStates],
  );

  const cityOptions = useMemo(
    () => buildProfileSelectOptions(filteredCities),
    [filteredCities],
  );

  const displayProfile =
    isEditing || draftProfile.username === profile.username
      ? draftProfile
      : { ...profile, ...PROFILE_SSR_PLACEHOLDER };

  const isDarkMode = resolvedTheme === "dark";

  // Menangani perubahan field teks/textarea/select — mengembalikan handler untuk field tertentu
  const handleDraftChange =
    (field: keyof AppProfile) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setDraftProfile((current) => ({
        ...current,
        [field]: event.target.value,
      }));
    };

  const handlePhotoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== "string") {
        return;
      }

      setDraftProfile((current) => ({
        ...current,
        avatar: reader.result as string,
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleCountryChange = (value: string) => {
    setAutoSaveStatus("saving");
    setDraftProfile((current) => ({
      ...current,
      country: value,
      state: "",
      city: "",
      timezone: "",
    }));
  };

  const handleStateChange = (value: string) => {
    setAutoSaveStatus("saving");
    setDraftProfile((current) => ({
      ...current,
      state: value,
      city: "",
      timezone: "",
    }));
  };

  const handleCityChange = (value: string) => {
    const selectedCity =
      findCityByName(filteredCities, value) ?? findCityByName(cities, value);

    setAutoSaveStatus("saving");
    setDraftProfile((current) => ({
      ...current,
      city: value,
      timezone: selectedCity?.timezone || "",
    }));
  };

  const locationSignature = useMemo(
    () => buildProfileLocationSignature(draftProfile),
    [draftProfile],
  );
  const persistedLocationSignature = useMemo(
    () => buildProfileLocationSignature(profile),
    [profile],
  );

  useEffect(() => {
    if (!isEditing || locationSignature === persistedLocationSignature) {
      return;
    }

    const timeout = window.setTimeout(async () => {
      // Auto-save is intentionally scoped to location fields so unsaved edits
      // like bio or avatar do not get committed unless the user clicks Save.
      const nextProfile = buildLocationProfilePatch(profile, draftProfile);
      const result = await persistProfileAccount(supabase, nextProfile, updateProfile, {
        silent: true,
      });

      setAutoSaveStatus(result.persistedToDatabase ? "saved" : "error");
    }, 700);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [
    draftProfile,
    isEditing,
    locationSignature,
    persistedLocationSignature,
    profile,
    supabase,
    updateProfile,
  ]);

  const handleSave = async () => {
    setIsSaving(true);

    const result = await persistProfileAccount(supabase, draftProfile, updateProfile, {
      showErrorToast: true,
    });

    setIsSaving(false);
    setIsEditing(false);

    if (result.persistedToDatabase) {
      toast.success(
        language === "id" ? "Profil Berhasil Diubah!" : t("profile.toastSaved"),
      );
    }
  };

  const handleCancel = () => {
    setDraftProfile(profile);
    setIsEditing(false);
    setAutoSaveStatus("idle");
  };

  const startEditing = () => {
    setDraftProfile(profile);
    setIsEditing(true);
  };

  return {
    autoSaveStatus,
    cityOptions,
    countryOptions,
    displayProfile,
    draftProfile,
    fileInputRef,
    handleCancel,
    handleCityChange,
    handleCountryChange,
    handleDraftChange,
    handlePhotoChange,
    handleSave,
    handleStateChange,
    isDarkMode,
    isEditing,
    isSaving,
    language,
    setLanguage,
    setTheme,
    startEditing,
    stateOptions,
    t,
  };
}
