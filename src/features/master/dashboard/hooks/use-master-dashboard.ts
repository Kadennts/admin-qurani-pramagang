"use client";

import { useEffect, useState } from "react";

import { createClient } from "@/utils/supabase/client";

import { fetchMasterDashboardCounts } from "../data/master-dashboard.repository";
import type { MasterDashboardCounts } from "../model/master-dashboard.types";

const EMPTY_COUNTS: MasterDashboardCounts = {
  countries: 0,
  states: 0,
  cities: 0,
  currencies: 0,
};

export function useMasterDashboard() {
  const [supabase] = useState(() => createClient());
  const [counts, setCounts] = useState<MasterDashboardCounts>(EMPTY_COUNTS);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadMasterDashboard() {
      setIsLoading(true);

      try {
        const data = await fetchMasterDashboardCounts(supabase);
        if (isMounted) {
          setCounts(data);
        }
      } catch (error) {
        console.error("Failed to load master dashboard", error);
        if (isMounted) {
          setCounts(EMPTY_COUNTS);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadMasterDashboard();

    return () => {
      isMounted = false;
    };
  }, [supabase]);

  return {
    counts,
    isLoading,
  };
}
