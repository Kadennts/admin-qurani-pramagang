"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { createClient } from "@/utils/supabase/client";

import {
  fetchBillingGuruProfileByOrder,
  fetchBillingOrderDetail,
} from "../data/billing-orders.repository";
import {
  buildBillingMeetings,
  buildBillingOrderDetailDerived,
  normalizeBillingGuruProfile,
} from "../model/billing-orders.utils";
import type {
  BillingGuruProfile,
  BillingMeetingItem,
  BillingOrderDetail,
  BillingOrderDetailDerived,
} from "../model/billing-orders.types";

export function useBillingOrderDetail() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [supabase] = useState(() => createClient());
  const [order, setOrder] = useState<BillingOrderDetail | null>(null);
  const [guru, setGuru] = useState<BillingGuruProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadBillingOrderDetail() {
      if (!params.id) {
        if (isMounted) {
          setIsLoading(false);
        }
        return;
      }

      setIsLoading(true);

      try {
        const orderDetail = await fetchBillingOrderDetail(supabase, params.id);
        const guruProfile = await fetchBillingGuruProfileByOrder(
          supabase,
          orderDetail.guru_name,
        );

        if (!isMounted) {
          return;
        }

        setOrder(orderDetail);
        setGuru(normalizeBillingGuruProfile(guruProfile));
      } catch (error) {
        console.error("Failed to load billing order detail", error);

        if (!isMounted) {
          return;
        }

        setOrder(null);
        setGuru(null);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadBillingOrderDetail();

    return () => {
      isMounted = false;
    };
  }, [params.id, supabase]);

  const derived = useMemo<BillingOrderDetailDerived | null>(
    () => (order ? buildBillingOrderDetailDerived(order) : null),
    [order],
  );

  const meetings = useMemo<BillingMeetingItem[]>(
    () => (order && derived ? buildBillingMeetings(order, derived) : []),
    [derived, order],
  );

  return {
    derived,
    goBack: () => router.back(),
    guru,
    id: params.id,
    isLoading,
    meetings,
    order,
  };
}
