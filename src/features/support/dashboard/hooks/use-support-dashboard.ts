"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { createClient } from "@/utils/supabase/client";

import { fetchSupportDashboardTicketStatuses } from "../data/support-dashboard.repository";
import { SUPPORT_DASHBOARD_CHART_RANGES } from "../model/support-dashboard.constants";
import { generateSupportDashboardChartData, getSupportDashboardSmoothPath, normalizeSupportDashboardStatus } from "../model/support-dashboard.utils";
import type { SupportDashboardChartRangeId, SupportDashboardTicketStats } from "../model/support-dashboard.types";

const EMPTY_STATS: SupportDashboardTicketStats = {
  total: 0,
  open: 0,
  inProgress: 0,
  resolved: 0,
};

export function useSupportDashboard() {
  const [supabase] = useState(() => createClient());
  const [ticketStats, setTicketStats] = useState<SupportDashboardTicketStats>(EMPTY_STATS);
  const [isLoading, setIsLoading] = useState(true);
  const [isRangeMenuOpen, setIsRangeMenuOpen] = useState(false);
  const [selectedRangeId, setSelectedRangeId] = useState<SupportDashboardChartRangeId>("last-30-days");
  const [chartData, setChartData] = useState(generateSupportDashboardChartData(SUPPORT_DASHBOARD_CHART_RANGES[1]));
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const selectedRange = useMemo(
    () => SUPPORT_DASHBOARD_CHART_RANGES.find((range) => range.id === selectedRangeId) ?? SUPPORT_DASHBOARD_CHART_RANGES[1],
    [selectedRangeId],
  );

  useEffect(() => {
    let isMounted = true;

    async function loadSupportDashboard() {
      setIsLoading(true);

      try {
        const rows = await fetchSupportDashboardTicketStatuses(supabase);

        if (!isMounted) {
          return;
        }

        setTicketStats({
          total: rows.length,
          open: rows.filter((ticket) => normalizeSupportDashboardStatus(ticket.status) === "open").length,
          inProgress: rows.filter((ticket) => normalizeSupportDashboardStatus(ticket.status) === "in progress").length,
          resolved: rows.filter((ticket) =>
            ["answered", "closed", "resolved"].includes(normalizeSupportDashboardStatus(ticket.status)),
          ).length,
        });
      } catch (error) {
        console.error("Failed fetching support dashboard stats", error);

        if (isMounted) {
          setTicketStats(EMPTY_STATS);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadSupportDashboard();

    return () => {
      isMounted = false;
    };
  }, [supabase]);

  useEffect(() => {
    setChartData(generateSupportDashboardChartData(selectedRange));
    setHoverIndex(null);
  }, [selectedRange]);

  const svgWidth = 1120;
  const svgHeight = 290;
  const maxChartValue = useMemo(
    () => Math.max(1, ...chartData.map((point) => Math.max(point.desktop, point.mobile))) * 1.18,
    [chartData],
  );
  const getX = (index: number) => (index / Math.max(1, chartData.length - 1)) * svgWidth;
  const getY = (value: number) => svgHeight - (value / maxChartValue) * svgHeight;

  const desktopLinePath = useMemo(
    () => getSupportDashboardSmoothPath(chartData, "desktop", getX, getY),
    [chartData, maxChartValue],
  );
  const mobileLinePath = useMemo(
    () => getSupportDashboardSmoothPath(chartData, "mobile", getX, getY),
    [chartData, maxChartValue],
  );
  const desktopAreaPath = `${desktopLinePath} L ${svgWidth} ${svgHeight} L 0 ${svgHeight} Z`;
  const mobileAreaPath = `${mobileLinePath} L ${svgWidth} ${svgHeight} L 0 ${svgHeight} Z`;

  const handleMouseMove = (event: React.MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current || chartData.length === 0) {
      return;
    }

    const rect = svgRef.current.getBoundingClientRect();
    const relativeX = Math.max(0, Math.min(event.clientX - rect.left, rect.width));
    const ratio = relativeX / rect.width;
    const nextIndex = Math.max(0, Math.min(Math.round(ratio * (chartData.length - 1)), chartData.length - 1));

    setHoverIndex(nextIndex);
  };

  const activePoint = hoverIndex !== null && chartData[hoverIndex] ? chartData[hoverIndex] : null;

  return {
    activePoint,
    chartData,
    desktopAreaPath,
    desktopLinePath,
    getX,
    getY,
    handleMouseMove,
    hoverIndex,
    isLoading,
    isRangeMenuOpen,
    mobileAreaPath,
    mobileLinePath,
    selectedRange,
    selectedRangeId,
    setHoverIndex,
    setIsRangeMenuOpen,
    setSelectedRangeId,
    svgHeight,
    svgRef,
    svgWidth,
    ticketStats,
  };
}
