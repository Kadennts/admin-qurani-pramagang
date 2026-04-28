import type { SupportDashboardChartPoint, SupportDashboardChartRange } from "./support-dashboard.types";

const AXIS_LABEL_FORMATTER = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
});

export function normalizeSupportDashboardStatus(status: string | null) {
  return (status ?? "").trim().toLowerCase();
}

export function generateSupportDashboardChartData(range: SupportDashboardChartRange) {
  const points: SupportDashboardChartPoint[] = [];
  const today = new Date();

  for (let index = range.pointCount - 1; index >= 0; index -= 1) {
    const daysAgo = index * range.stepDays;
    const date = new Date(today);
    date.setDate(today.getDate() - daysAgo);

    const waveA = Math.sin(index * 0.9);
    const waveB = Math.cos(index * 0.43);
    const waveC = Math.sin(index * 1.72);
    const pulse = index % 6 === 0 ? 44 : 0;
    const desktop = Math.max(
      84,
      Math.round(208 + waveA * 46 + waveB * 32 + waveC * 18 + pulse),
    );
    const mobile = Math.max(
      42,
      Math.round(84 + waveA * 19 + waveB * 15 + Math.cos(index * 1.28) * 12 + pulse * 0.38),
    );

    points.push({
      dateLabel: AXIS_LABEL_FORMATTER.format(date),
      desktop,
      mobile,
    });
  }

  return points;
}

export function getSupportDashboardSmoothPath(
  data: SupportDashboardChartPoint[],
  key: keyof Pick<SupportDashboardChartPoint, "desktop" | "mobile">,
  getX: (index: number) => number,
  getY: (value: number) => number,
) {
  if (data.length === 0) {
    return "";
  }

  let path = `M ${getX(0)} ${getY(data[0][key])}`;

  for (let index = 0; index < data.length - 1; index += 1) {
    const x0 = getX(Math.max(0, index - 1));
    const y0 = getY(data[Math.max(0, index - 1)][key]);
    const x1 = getX(index);
    const y1 = getY(data[index][key]);
    const x2 = getX(index + 1);
    const y2 = getY(data[index + 1][key]);
    const x3 = getX(Math.min(data.length - 1, index + 2));
    const y3 = getY(data[Math.min(data.length - 1, index + 2)][key]);

    const tension = 0.16;
    const cp1x = x1 + (x2 - x0) * tension;
    const cp1y = y1 + (y2 - y0) * tension;
    const cp2x = x2 - (x3 - x1) * tension;
    const cp2y = y2 - (y3 - y1) * tension;

    path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${x2} ${y2}`;
  }

  return path;
}
