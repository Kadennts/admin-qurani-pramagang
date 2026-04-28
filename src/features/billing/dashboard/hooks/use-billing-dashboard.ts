"use client";

import { useEffect, useMemo, useState } from "react";

import { createClient } from "@/utils/supabase/client";

import { fetchBillingDashboardOrders } from "../data/billing-dashboard.repository";
import { buildBillingDashboardMetrics } from "../model/billing-dashboard.utils";
import type { BillingDashboardOrder } from "../model/billing-dashboard.types";

export function useBillingDashboard() {
  const [supabase] = useState(() => createClient());
  const [orders, setOrders] = useState<BillingDashboardOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadBillingDashboard() {
      setIsLoading(true);

      try {
        const data = await fetchBillingDashboardOrders(supabase);
        if (isMounted) {
          setOrders(data);
        }
      } catch (error) {
        console.error("Failed to load billing dashboard", error);
        if (isMounted) {
          setOrders([]);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadBillingDashboard();

    return () => {
      isMounted = false;
    };
  }, [supabase]);

  const metrics = useMemo(() => buildBillingDashboardMetrics(orders), [orders]);

  return {
    isLoading,
    metrics,
    orders,
  };
}
