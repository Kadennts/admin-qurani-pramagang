export type SupportDashboardTicketStats = {
  total: number;
  open: number;
  inProgress: number;
  resolved: number;
};

export type SupportDashboardTicketStatusRow = {
  status: string | null;
};

export type SupportDashboardChartPoint = {
  dateLabel: string;
  desktop: number;
  mobile: number;
};

export type SupportDashboardChartRangeId = "last-3-months" | "last-30-days" | "last-7-days";

export type SupportDashboardChartRange = {
  id: SupportDashboardChartRangeId;
  label: string;
  subtitle: string;
  pointCount: number;
  stepDays: number;
  labelEvery: number;
};
