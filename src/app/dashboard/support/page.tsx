"use client";

import { useEffect, useRef, useState } from "react";
import {
  AlertCircle,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Loader2,
  Ticket,
} from "lucide-react";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { createClient } from "@/utils/supabase/client";

type TicketStats = {
  total: number;
  open: number;
  inProgress: number;
  resolved: number;
};

type TicketStatusRow = {
  status: string | null;
};

type ChartPoint = {
  dateLabel: string;
  desktop: number;
  mobile: number;
};

type ChartRange = {
  id: "last-3-months" | "last-30-days" | "last-7-days";
  label: string;
  subtitle: string;
  pointCount: number;
  stepDays: number;
  labelEvery: number;
};

const CHART_RANGES: ChartRange[] = [
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

const AXIS_LABEL_FORMATTER = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
});

function normalizeStatus(status: string | null) {
  return (status ?? "").trim().toLowerCase();
}

function generateChartData(range: ChartRange) {
  const points: ChartPoint[] = [];
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
      Math.round(208 + waveA * 46 + waveB * 32 + waveC * 18 + pulse)
    );
    const mobile = Math.max(
      42,
      Math.round(84 + waveA * 19 + waveB * 15 + Math.cos(index * 1.28) * 12 + pulse * 0.38)
    );

    points.push({
      dateLabel: AXIS_LABEL_FORMATTER.format(date),
      desktop,
      mobile,
    });
  }

  return points;
}

function getSmoothPath(
  data: ChartPoint[],
  key: keyof Pick<ChartPoint, "desktop" | "mobile">,
  getX: (index: number) => number,
  getY: (value: number) => number
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

export default function SupportDashboardPage() {
  const [supabase] = useState(() => createClient());
  const [ticketStats, setTicketStats] = useState<TicketStats>({
    total: 0,
    open: 0,
    inProgress: 0,
    resolved: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isRangeMenuOpen, setIsRangeMenuOpen] = useState(false);
  const [selectedRangeId, setSelectedRangeId] =
    useState<ChartRange["id"]>("last-30-days");
  const [chartData, setChartData] = useState<ChartPoint[]>([]);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const svgRef = useRef<SVGSVGElement>(null);
  const selectedRange =
    CHART_RANGES.find((range) => range.id === selectedRangeId) ?? CHART_RANGES[1];

  useEffect(() => {
    let isMounted = true;

    async function fetchStats() {
      setIsLoading(true);

      try {
        const { data, error } = await supabase.from("support_tickets").select("status");

        if (error) {
          throw error;
        }

        const rows = (data ?? []) as TicketStatusRow[];

        if (!isMounted) {
          return;
        }

        setTicketStats({
          total: rows.length,
          open: rows.filter((ticket) => normalizeStatus(ticket.status) === "open").length,
          inProgress: rows.filter(
            (ticket) => normalizeStatus(ticket.status) === "in progress"
          ).length,
          resolved: rows.filter((ticket) =>
            ["answered", "closed", "resolved"].includes(normalizeStatus(ticket.status))
          ).length,
        });
      } catch (error) {
        console.error("Failed fetching support dashboard stats", error);

        if (isMounted) {
          setTicketStats({
            total: 0,
            open: 0,
            inProgress: 0,
            resolved: 0,
          });
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchStats();

    return () => {
      isMounted = false;
    };
  }, [supabase]);

  useEffect(() => {
    setChartData(generateChartData(selectedRange));
    setHoverIndex(null);
  }, [selectedRange]);

  const SVG_WIDTH = 1120;
  const SVG_HEIGHT = 290;
  const maxChartValue =
    Math.max(1, ...chartData.map((point) => Math.max(point.desktop, point.mobile))) * 1.18;
  const getX = (index: number) =>
    (index / Math.max(1, chartData.length - 1)) * SVG_WIDTH;
  const getY = (value: number) => SVG_HEIGHT - (value / maxChartValue) * SVG_HEIGHT;

  const desktopLinePath = getSmoothPath(chartData, "desktop", getX, getY);
  const mobileLinePath = getSmoothPath(chartData, "mobile", getX, getY);
  const desktopAreaPath = `${desktopLinePath} L ${SVG_WIDTH} ${SVG_HEIGHT} L 0 ${SVG_HEIGHT} Z`;
  const mobileAreaPath = `${mobileLinePath} L ${SVG_WIDTH} ${SVG_HEIGHT} L 0 ${SVG_HEIGHT} Z`;

  const handleMouseMove = (event: React.MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current || chartData.length === 0) {
      return;
    }

    const rect = svgRef.current.getBoundingClientRect();
    const relativeX = Math.max(0, Math.min(event.clientX - rect.left, rect.width));
    const ratio = relativeX / rect.width;
    const nextIndex = Math.max(
      0,
      Math.min(Math.round(ratio * (chartData.length - 1)), chartData.length - 1)
    );

    setHoverIndex(nextIndex);
  };

  const activePoint =
    hoverIndex !== null && chartData[hoverIndex] ? chartData[hoverIndex] : null;

  const statCards = [
    {
      label: "Tickets",
      value: ticketStats.total,
      icon: Ticket,
      iconClassName: "bg-[#dbeafe] text-[#2563eb]",
    },
    {
      label: "Open Tickets",
      value: ticketStats.open,
      icon: AlertCircle,
      iconClassName: "bg-[#fee2e2] text-[#ef4444]",
    },
    {
      label: "In Progress",
      value: ticketStats.inProgress,
      icon: Clock3,
      iconClassName: "bg-[#fef3c7] text-[#d97706]",
    },
    {
      label: "Resolved",
      value: ticketStats.resolved,
      icon: CheckCircle2,
      iconClassName: "bg-[#d1fae5] text-[#10b981]",
    },
  ];

  return (
    <div className="mx-auto max-w-[1400px] space-y-5 pb-10">
      <header className="space-y-1">
        <h1 className="text-[2rem] leading-none font-extrabold tracking-tight text-[#0f172a] md:text-[2.15rem]">
          Support Dashboard
        </h1>
      </header>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {statCards.map((card) => {
          const Icon = card.icon;

          return (
            <article
              key={card.label}
              className="flex min-h-[138px] flex-col justify-between rounded-[22px] border border-slate-200/80 bg-white px-6 py-6 shadow-[0_6px_18px_rgba(15,23,42,0.04)]"
            >
              <div className="flex items-start justify-between gap-4">
                <span className="pt-1 text-[15px] font-medium text-slate-600">
                  {card.label}
                </span>
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-[16px] ${card.iconClassName}`}
                >
                  <Icon size={22} strokeWidth={2.1} />
                </div>
              </div>
              <div className="text-[2.4rem] leading-none font-extrabold tracking-tight text-[#0f172a]">
                {isLoading ? <Loader2 className="animate-spin text-slate-400" size={28} /> : card.value}
              </div>
            </article>
          );
        })}
      </section>

      <section className="overflow-hidden rounded-[24px] border border-slate-200/80 bg-white shadow-[0_8px_24px_rgba(15,23,42,0.05)]">
        <div className="flex flex-col gap-4 border-b border-slate-200/80 px-7 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <h2 className="text-xl leading-none font-bold tracking-tight text-[#0f172a]">
              Area Chart - Interactive
            </h2>
            <p className="text-sm font-medium text-slate-500">{selectedRange.subtitle}</p>
          </div>

          <Popover open={isRangeMenuOpen} onOpenChange={setIsRangeMenuOpen}>
            <PopoverTrigger
              aria-label="Select chart range"
              className="inline-flex h-10 min-w-[160px] items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-[0_4px_12px_rgba(15,23,42,0.05)] transition-colors hover:bg-slate-50"
            >
              <span>{selectedRange.label}</span>
              <ChevronDown size={16} className="text-slate-400" />
            </PopoverTrigger>
            <PopoverContent
              align="end"
              sideOffset={10}
              className="w-[220px] rounded-[18px] border border-slate-200 bg-white p-2 shadow-[0_18px_45px_rgba(15,23,42,0.12)]"
            >
              <div className="space-y-1">
                {CHART_RANGES.map((range) => {
                  const isSelected = range.id === selectedRange.id;

                  return (
                    <button
                      key={range.id}
                      type="button"
                      onClick={() => {
                        setSelectedRangeId(range.id);
                        setIsRangeMenuOpen(false);
                      }}
                      className={`flex w-full items-center justify-between rounded-2xl px-3.5 py-2.5 text-left text-sm font-semibold transition-colors ${
                        isSelected
                          ? "bg-[#f1f5f9] text-slate-900"
                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                      }`}
                    >
                      <span>{range.label}</span>
                      {isSelected && <Check size={16} className="text-[#059669]" />}
                    </button>
                  );
                })}
              </div>
            </PopoverContent>
          </Popover>
        </div>

        <div className="relative px-7 pt-6 pb-5">
          <div className="relative h-[320px] w-full overflow-hidden rounded-[22px] bg-gradient-to-b from-white via-white to-slate-50/60">
            <svg
              ref={svgRef}
              preserveAspectRatio="none"
              viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
              className="h-full w-full overflow-visible"
              onMouseMove={handleMouseMove}
              onMouseLeave={() => setHoverIndex(null)}
            >
              <defs>
                <linearGradient id="supportDesktopFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#22c55e" stopOpacity="0.38" />
                  <stop offset="100%" stopColor="#22c55e" stopOpacity="0.02" />
                </linearGradient>
                <linearGradient id="supportMobileFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.02" />
                </linearGradient>
              </defs>

              {[0, 0.25, 0.5, 0.75, 1].map((ratio) => (
                <line
                  key={ratio}
                  x1="0"
                  y1={SVG_HEIGHT * ratio}
                  x2={SVG_WIDTH}
                  y2={SVG_HEIGHT * ratio}
                  stroke="#e5e7eb"
                  strokeWidth="1"
                />
              ))}

              <path d={desktopAreaPath} fill="url(#supportDesktopFill)" />
              <path d={mobileAreaPath} fill="url(#supportMobileFill)" />

              <path
                d={desktopLinePath}
                fill="none"
                stroke="#22c55e"
                strokeWidth="3.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d={mobileLinePath}
                fill="none"
                stroke="#3b82f6"
                strokeWidth="3.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {chartData.map((point, index) => {
                if (index % selectedRange.labelEvery !== 0 && index !== chartData.length - 1) {
                  return null;
                }

                return (
                  <text
                    key={`${point.dateLabel}-${index}`}
                    x={getX(index)}
                    y={SVG_HEIGHT + 24}
                    textAnchor="middle"
                    fill="#64748b"
                    fontSize="11"
                    fontWeight="500"
                  >
                    {point.dateLabel}
                  </text>
                );
              })}

              {activePoint && hoverIndex !== null && (
                <g pointerEvents="none">
                  <line
                    x1={getX(hoverIndex)}
                    y1="0"
                    x2={getX(hoverIndex)}
                    y2={SVG_HEIGHT}
                    stroke="#cbd5e1"
                    strokeWidth="1.5"
                    strokeDasharray="5 5"
                  />
                  <circle
                    cx={getX(hoverIndex)}
                    cy={getY(activePoint.desktop)}
                    r="5.5"
                    fill="#22c55e"
                    stroke="#ffffff"
                    strokeWidth="3"
                  />
                  <circle
                    cx={getX(hoverIndex)}
                    cy={getY(activePoint.mobile)}
                    r="5.5"
                    fill="#3b82f6"
                    stroke="#ffffff"
                    strokeWidth="3"
                  />
                </g>
              )}
            </svg>

            {activePoint && hoverIndex !== null && (
              <div
                className="pointer-events-none absolute top-5 z-10 min-w-[152px] rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-[0_18px_40px_rgba(15,23,42,0.14)]"
                style={{
                  left: `calc(${(getX(hoverIndex) / SVG_WIDTH) * 100}% ${
                    hoverIndex > chartData.length / 2 ? "- 182px" : "+ 14px"
                  })`,
                }}
              >
                <div className="mb-3 text-xs font-bold text-slate-800">{activePoint.dateLabel}</div>
                <div className="mb-2 flex items-center justify-between gap-5 text-xs">
                  <span className="flex items-center gap-2 text-slate-500">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#22c55e]"></span>
                    Desktop
                  </span>
                  <span className="font-extrabold text-slate-800">{activePoint.desktop}</span>
                </div>
                <div className="flex items-center justify-between gap-5 text-xs">
                  <span className="flex items-center gap-2 text-slate-500">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#3b82f6]"></span>
                    Mobile
                  </span>
                  <span className="font-extrabold text-slate-800">{activePoint.mobile}</span>
                </div>
              </div>
            )}
          </div>

          <div className="pt-5 text-center">
            <div className="inline-flex items-center gap-6 rounded-full bg-white px-4 py-1.5 text-sm font-semibold text-slate-700">
              <span className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-sm bg-[#22c55e]"></span>
                Desktop
              </span>
              <span className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-sm bg-[#3b82f6]"></span>
                Mobile
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
