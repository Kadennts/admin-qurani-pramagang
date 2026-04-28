import type { SupportDashboardChartRange } from "./support-dashboard.types";

export const SUPPORT_DASHBOARD_CHART_RANGES: SupportDashboardChartRange[] = [
  {
    id: "last-3-months",
    label: "Last 3 months",
    subtitle: "Showing total visitors for the last 3 months",
    pointCount: 31,
    stepDays: 3,
    labelEvery: 4,
  },
  {
    id: "last-30-days",
    label: "Last 30 days",
    subtitle: "Showing total visitors for the last 30 days",
    pointCount: 30,
    stepDays: 1,
    labelEvery: 3,
  },
  {
    id: "last-7-days",
    label: "Last 7 days",
    subtitle: "Showing total visitors for the last 7 days",
    pointCount: 7,
    stepDays: 1,
    labelEvery: 1,
  },
];
