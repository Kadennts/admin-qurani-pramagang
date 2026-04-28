export type DashboardOverviewCounts = {
  recitations: number;
  users: number;
  groups: number;
};

export type DashboardOverviewGroup = {
  id: string;
  name: string;
  initials: string;
  type: string;
  description: string | null;
  member_count: number | null;
  created_at: string;
};

export type DashboardOverviewPeriodKind = "all" | "this-year" | "this-month" | "month";

export type DashboardOverviewPeriodOption = {
  id: string;
  label: string;
  metricLabel: string;
  kind: DashboardOverviewPeriodKind;
  year?: number;
  month?: number;
};

export type DashboardOverviewMonthBucket = {
  key: string;
  label: string;
  month: number;
  year: number;
};

export type DashboardOverviewDateRange = {
  start: Date;
  end: Date;
};

export type DashboardOverviewTimestampRow = {
  created_at: string | null;
};

export type DashboardOverviewOrderTimestampRow = {
  order_date: string | null;
};

export type DashboardOverviewQueryResult = {
  userDates: string[];
  groupDates: string[];
  orderDates: string[];
  topGroup: DashboardOverviewGroup | null;
};
