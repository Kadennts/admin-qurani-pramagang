"use client";

import { useEffect, useMemo, useState } from "react";

import { createClient } from "@/utils/supabase/client";

import { fetchDashboardOverviewSnapshot } from "../data/dashboard-overview.repository";
import {
  buildDashboardOverviewChartBuckets,
  buildDashboardOverviewPeriodOptions,
  countDashboardOverviewByMonth,
  getDashboardOverviewPeriodRange,
} from "../model/dashboard-overview.utils";
import type {
  DashboardOverviewCounts,
  DashboardOverviewGroup,
} from "../model/dashboard-overview.types";

const EMPTY_COUNTS: DashboardOverviewCounts = {
  recitations: 0,
  users: 0,
  groups: 0,
};

export function useDashboardOverview() {
  const [supabase] = useState(() => createClient());
  const [referenceDate] = useState(() => new Date());
  const [periodOptions] = useState(() => buildDashboardOverviewPeriodOptions(referenceDate));
  const [selectedPeriodId, setSelectedPeriodId] = useState("this-month");
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const [counts, setCounts] = useState<DashboardOverviewCounts>(EMPTY_COUNTS);
  const [topGroup, setTopGroup] = useState<DashboardOverviewGroup | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [dateLabels, setDateLabels] = useState<string[]>([]);
  const [userChartData, setUserChartData] = useState<number[]>([]);
  const [groupChartData, setGroupChartData] = useState<number[]>([]);

  const selectedPeriod = useMemo(
    () => periodOptions.find((option) => option.id === selectedPeriodId) ?? periodOptions[2],
    [periodOptions, selectedPeriodId],
  );

  useEffect(() => {
    let isMounted = true;

    async function loadDashboardOverview() {
      setIsLoading(true);
      const chartBuckets = buildDashboardOverviewChartBuckets(selectedPeriod, referenceDate);

      try {
        const snapshot = await fetchDashboardOverviewSnapshot(
          supabase,
          getDashboardOverviewPeriodRange(selectedPeriod, referenceDate),
        );

        if (!isMounted) {
          return;
        }

        setCounts({
          recitations: snapshot.orderDates.length,
          users: snapshot.userDates.length,
          groups: snapshot.groupDates.length,
        });
        setTopGroup(snapshot.topGroup);
        setDateLabels(chartBuckets.map((bucket) => bucket.label));
        setUserChartData(countDashboardOverviewByMonth(snapshot.userDates, chartBuckets));
        setGroupChartData(countDashboardOverviewByMonth(snapshot.groupDates, chartBuckets));
      } catch (error) {
        console.error("Failed fetching dashboard data", error);

        if (!isMounted) {
          return;
        }

        setCounts(EMPTY_COUNTS);
        setTopGroup(null);
        setDateLabels(chartBuckets.map((bucket) => bucket.label));
        setUserChartData(chartBuckets.map(() => 0));
        setGroupChartData(chartBuckets.map(() => 0));
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadDashboardOverview();

    return () => {
      isMounted = false;
    };
  }, [referenceDate, selectedPeriod, supabase]);

  const maxChartValue = useMemo(() => Math.max(...userChartData, ...groupChartData, 1), [groupChartData, userChartData]);

  return {
    counts,
    dateLabels,
    groupChartData,
    isLoading,
    isOptionsOpen,
    maxChartValue,
    periodOptions,
    referenceDate,
    selectedPeriod,
    selectedPeriodId,
    setIsOptionsOpen,
    setSelectedPeriodId,
    topGroup,
    userChartData,
  };
}
