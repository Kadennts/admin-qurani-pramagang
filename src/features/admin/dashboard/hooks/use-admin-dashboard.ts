"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { createClient } from "@/utils/supabase/client";

import { fetchAdminDashboardUsers, fetchAdminUsersCount } from "../data/admin-dashboard.repository";
import { buildAdminDashboardSnapshot } from "../model/admin-dashboard.utils";
import type {
  AdminDashboardGenderData,
  AdminDashboardLocationDatum,
  AdminDashboardStats,
  AdminDashboardTooltip,
} from "../model/admin-dashboard.types";

const EMPTY_STATS: AdminDashboardStats = {
  totalUsers: 0,
  admins: 0,
  active: 0,
  blocked: 0,
};

const EMPTY_GENDER: AdminDashboardGenderData = {
  male: 0,
  unknown: 0,
};

export function useAdminDashboard() {
  const [supabase] = useState(() => createClient());
  const [stats, setStats] = useState<AdminDashboardStats>(EMPTY_STATS);
  const [genderData, setGenderData] = useState<AdminDashboardGenderData>(EMPTY_GENDER);
  const [countriesData, setCountriesData] = useState<AdminDashboardLocationDatum[]>([]);
  const [statesData, setStatesData] = useState<AdminDashboardLocationDatum[]>([]);
  const [citiesData, setCitiesData] = useState<AdminDashboardLocationDatum[]>([]);
  const [tooltip, setTooltip] = useState<AdminDashboardTooltip | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadDashboard = useCallback(async () => {
    setIsLoading(true);

    try {
      const [users, adminUsersCount] = await Promise.all([
        fetchAdminDashboardUsers(supabase),
        fetchAdminUsersCount(supabase),
      ]);

      const snapshot = buildAdminDashboardSnapshot(users, adminUsersCount);
      setStats(snapshot.stats);
      setGenderData(snapshot.genderData);
      setCountriesData(snapshot.countriesData);
      setStatesData(snapshot.statesData);
      setCitiesData(snapshot.citiesData);
    } catch (error) {
      console.error("Failed to load admin dashboard", error);
      setStats(EMPTY_STATS);
      setGenderData(EMPTY_GENDER);
      setCountriesData([]);
      setStatesData([]);
      setCitiesData([]);
    } finally {
      setIsLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    void loadDashboard();
  }, [loadDashboard]);

  const totalGender = useMemo(() => genderData.male + genderData.unknown, [genderData]);
  const malePercent = totalGender === 0 ? 0 : (genderData.male / totalGender) * 100;
  const unknownPercent = totalGender === 0 ? 100 : (genderData.unknown / totalGender) * 100;

  return {
    citiesData,
    countriesData,
    genderData,
    isLoading,
    loadDashboard,
    malePercent,
    setTooltip,
    statesData,
    stats,
    tooltip,
    totalGender,
    unknownPercent,
  };
}
