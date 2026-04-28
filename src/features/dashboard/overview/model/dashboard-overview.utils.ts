import type {
  DashboardOverviewDateRange,
  DashboardOverviewMonthBucket,
  DashboardOverviewPeriodOption,
} from "./dashboard-overview.types";

const FULL_MONTH_FORMATTER = new Intl.DateTimeFormat("id-ID", {
  month: "long",
  year: "numeric",
});

const SHORT_MONTH_FORMATTER = new Intl.DateTimeFormat("id-ID", {
  month: "short",
});

const COMPACT_MONTH_FORMATTER = new Intl.DateTimeFormat("id-ID", {
  month: "short",
  year: "2-digit",
});

export function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function buildDashboardOverviewPeriodOptions(referenceDate: Date) {
  const year = referenceDate.getFullYear();
  const month = referenceDate.getMonth();
  const options: DashboardOverviewPeriodOption[] = [
    { id: "all", label: "All", metricLabel: "Semua Data", kind: "all" },
    { id: "this-year", label: "This year", metricLabel: "Tahun Ini", kind: "this-year" },
    { id: "this-month", label: "This month", metricLabel: "Bulan Ini", kind: "this-month" },
  ];

  for (let offset = 0; offset < 12; offset += 1) {
    const date = new Date(year, month - offset, 1);
    const label = capitalize(FULL_MONTH_FORMATTER.format(date));

    options.push({
      id: `month-${date.getFullYear()}-${date.getMonth()}`,
      label,
      metricLabel: label,
      kind: "month",
      year: date.getFullYear(),
      month: date.getMonth(),
    });
  }

  return options;
}

export function getDashboardOverviewPeriodRange(period: DashboardOverviewPeriodOption, referenceDate: Date): DashboardOverviewDateRange | null {
  if (period.kind === "all") {
    return null;
  }

  if (period.kind === "this-year") {
    const year = referenceDate.getFullYear();
    return {
      start: new Date(year, 0, 1),
      end: new Date(year + 1, 0, 1),
    };
  }

  if (period.kind === "this-month") {
    const year = referenceDate.getFullYear();
    const month = referenceDate.getMonth();
    return {
      start: new Date(year, month, 1),
      end: new Date(year, month + 1, 1),
    };
  }

  return {
    start: new Date(period.year!, period.month!, 1),
    end: new Date(period.year!, period.month! + 1, 1),
  };
}

function buildTrailingMonths(anchorDate: Date, count: number) {
  const buckets: DashboardOverviewMonthBucket[] = [];

  for (let index = count - 1; index >= 0; index -= 1) {
    const date = new Date(anchorDate.getFullYear(), anchorDate.getMonth() - index, 1);
    buckets.push({
      key: `${date.getFullYear()}-${date.getMonth()}`,
      label: capitalize(COMPACT_MONTH_FORMATTER.format(date)),
      month: date.getMonth(),
      year: date.getFullYear(),
    });
  }

  return buckets;
}

export function buildDashboardOverviewChartBuckets(period: DashboardOverviewPeriodOption, referenceDate: Date) {
  if (period.kind === "this-year") {
    return Array.from({ length: 12 }, (_, monthIndex) => {
      const date = new Date(referenceDate.getFullYear(), monthIndex, 1);
      return {
        key: `${date.getFullYear()}-${date.getMonth()}`,
        label: capitalize(SHORT_MONTH_FORMATTER.format(date)),
        month: date.getMonth(),
        year: date.getFullYear(),
      };
    });
  }

  if (period.kind === "month") {
    return buildTrailingMonths(new Date(period.year!, period.month!, 1), 7);
  }

  return buildTrailingMonths(new Date(referenceDate.getFullYear(), referenceDate.getMonth(), 1), 7);
}

export function countDashboardOverviewByMonth(dateStrings: string[], buckets: DashboardOverviewMonthBucket[]) {
  const dateMap = new Map<string, number>();

  for (const value of dateStrings) {
    const date = new Date(value);
    const key = `${date.getFullYear()}-${date.getMonth()}`;
    dateMap.set(key, (dateMap.get(key) ?? 0) + 1);
  }

  return buckets.map((bucket) => dateMap.get(bucket.key) ?? 0);
}

export function generateDashboardOverviewSVGPath(data: number[], maxTotal: number) {
  if (data.length === 0) {
    return "";
  }

  const width = 500;
  const height = 150;
  const stepX = data.length > 1 ? width / (data.length - 1) : width;

  let path = `M 0 ${(1 - data[0] / maxTotal) * height}`;

  for (let index = 1; index < data.length; index += 1) {
    const currentX = stepX * index;
    const currentY = (1 - data[index] / maxTotal) * height;
    path += ` L ${currentX} ${currentY}`;
  }

  return path;
}
