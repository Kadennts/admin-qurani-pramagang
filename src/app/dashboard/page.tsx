"use client";

import { useEffect, useState } from "react";
import {
  BookOpen,
  Calendar,
  CheckCircle2,
  ChevronDown,
  Loader2,
  Target,
  Users,
  Users as GroupsIcon,
} from "lucide-react";

import { createClient } from "@/utils/supabase/client";

type Counts = {
  recitations: number;
  users: number;
  groups: number;
};

type SupportGroup = {
  id: string;
  name: string;
  initials: string;
  type: string;
  description: string | null;
  member_count: number | null;
  created_at: string;
};

type PeriodKind = "all" | "this-year" | "this-month" | "month";

type PeriodOption = {
  id: string;
  label: string;
  metricLabel: string;
  kind: PeriodKind;
  year?: number;
  month?: number;
};

type MonthBucket = {
  key: string;
  label: string;
  month: number;
  year: number;
};

type DateRange = {
  start: Date;
  end: Date;
};

type TimestampRow = {
  created_at: string | null;
};

type OrderTimestampRow = {
  order_date: string | null;
};

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

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function buildPeriodOptions(referenceDate: Date) {
  const year = referenceDate.getFullYear();
  const month = referenceDate.getMonth();
  const options: PeriodOption[] = [
    { id: "all", label: "All", metricLabel: "Semua Data", kind: "all" },
    {
      id: "this-year",
      label: "This year",
      metricLabel: "Tahun Ini",
      kind: "this-year",
    },
    {
      id: "this-month",
      label: "This month",
      metricLabel: "Bulan Ini",
      kind: "this-month",
    },
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

function getPeriodRange(period: PeriodOption, referenceDate: Date): DateRange | null {
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
  const buckets: MonthBucket[] = [];

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

function buildChartBuckets(period: PeriodOption, referenceDate: Date) {
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

function countByMonth(dateStrings: string[], buckets: MonthBucket[]) {
  const dateMap = new Map<string, number>();

  for (const value of dateStrings) {
    const date = new Date(value);
    const key = `${date.getFullYear()}-${date.getMonth()}`;
    dateMap.set(key, (dateMap.get(key) ?? 0) + 1);
  }

  return buckets.map((bucket) => dateMap.get(bucket.key) ?? 0);
}

function generateSVGPath(dataArr: number[], maxTotal: number) {
  if (dataArr.length === 0) {
    return "";
  }

  const width = 500;
  const height = 150;
  const stepX = dataArr.length > 1 ? width / (dataArr.length - 1) : width;

  let path = `M 0 ${(1 - dataArr[0] / maxTotal) * height}`;

  for (let index = 1; index < dataArr.length; index += 1) {
    const currentX = stepX * index;
    const currentY = (1 - dataArr[index] / maxTotal) * height;
    path += ` L ${currentX} ${currentY}`;
  }

  return path;
}

export default function DashboardPage() {
  const [supabase] = useState(() => createClient());
  const [referenceDate] = useState(() => new Date());
  const [periodOptions] = useState(() => buildPeriodOptions(referenceDate));
  const [selectedPeriodId, setSelectedPeriodId] = useState("this-month");

  const [counts, setCounts] = useState<Counts>({
    recitations: 0,
    users: 0,
    groups: 0,
  });
  const [topGroup, setTopGroup] = useState<SupportGroup | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [dateLabels, setDateLabels] = useState<string[]>([]);
  const [userChartData, setUserChartData] = useState<number[]>([]);
  const [groupChartData, setGroupChartData] = useState<number[]>([]);

  const selectedPeriod =
    periodOptions.find((option) => option.id === selectedPeriodId) ?? periodOptions[2];

  useEffect(() => {
    let isMounted = true;

    async function fetchDashboardData() {
      setIsLoading(true);

      const range = getPeriodRange(selectedPeriod, referenceDate);
      const chartBuckets = buildChartBuckets(selectedPeriod, referenceDate);

      try {
        let usersQuery = supabase.from("user_profiles").select("created_at");
        let groupsQuery = supabase.from("support_groups").select("created_at");
        let ordersQuery = supabase.from("billing_pesanan").select("order_date");
        let topGroupQuery = supabase
          .from("support_groups")
          .select("id, name, initials, type, description, member_count, created_at")
          .order("member_count", { ascending: false })
          .limit(1);

        if (range) {
          const startIso = range.start.toISOString();
          const endIso = range.end.toISOString();

          usersQuery = usersQuery.gte("created_at", startIso).lt("created_at", endIso);
          groupsQuery = groupsQuery.gte("created_at", startIso).lt("created_at", endIso);
          ordersQuery = ordersQuery.gte("order_date", startIso).lt("order_date", endIso);
          topGroupQuery = topGroupQuery.gte("created_at", startIso).lt("created_at", endIso);
        }

        const [
          { data: usersData, error: usersError },
          { data: groupsData, error: groupsError },
          { data: ordersData, error: ordersError },
          { data: topGroupsData, error: topGroupError },
        ] = await Promise.all([usersQuery, groupsQuery, ordersQuery, topGroupQuery]);

        if (usersError || groupsError || ordersError || topGroupError) {
          throw usersError || groupsError || ordersError || topGroupError;
        }

        const userDates = ((usersData ?? []) as TimestampRow[])
          .map((item) => item.created_at)
          .filter((value): value is string => Boolean(value));
        const groupDates = ((groupsData ?? []) as TimestampRow[])
          .map((item) => item.created_at)
          .filter((value): value is string => Boolean(value));
        const orderDates = ((ordersData ?? []) as OrderTimestampRow[])
          .map((item) => item.order_date)
          .filter((value): value is string => Boolean(value));

        if (!isMounted) {
          return;
        }

        setCounts({
          recitations: orderDates.length,
          users: userDates.length,
          groups: groupDates.length,
        });
        setTopGroup(topGroupsData?.[0] ?? null);
        setDateLabels(chartBuckets.map((bucket) => bucket.label));
        setUserChartData(countByMonth(userDates, chartBuckets));
        setGroupChartData(countByMonth(groupDates, chartBuckets));
      } catch (error) {
        console.error("Failed fetching dashboard data", error);

        if (!isMounted) {
          return;
        }

        setCounts({
          recitations: 0,
          users: 0,
          groups: 0,
        });
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

    fetchDashboardData();

    return () => {
      isMounted = false;
    };
  }, [referenceDate, selectedPeriod, supabase]);

  const maxChartValue = Math.max(...userChartData, ...groupChartData, 1);

  return (
    <div className="mx-auto max-w-[1400px] space-y-6 pb-12 animate-in fade-in duration-300">
      <div className="mb-2 flex flex-col gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-black text-slate-800">Dashboard Utama</h1>

        <div className="relative">
          <button
            type="button"
            className="flex min-w-[220px] items-center justify-between gap-3 rounded-xl border border-[#059669]/20 bg-emerald-50 px-4 py-2.5 text-[#059669] shadow-sm transition-colors hover:bg-emerald-100"
          >
            <span className="flex items-center gap-2">
              <Calendar size={16} />
              <span className="text-sm font-extrabold">Periode: {selectedPeriod.label}</span>
            </span>
            <ChevronDown size={16} />
          </button>

          <div className="pointer-events-none absolute inset-0">
            <select
              aria-label="Pilih periode dashboard"
              value={selectedPeriodId}
              onChange={(event) => setSelectedPeriodId(event.target.value)}
              className="pointer-events-auto absolute inset-0 cursor-pointer opacity-0"
            >
              {periodOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="relative overflow-hidden rounded-3xl border border-slate-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
          <div className="absolute top-0 right-0 h-32 w-32 translate-x-8 -translate-y-8 rounded-full bg-blue-50 opacity-50"></div>
          <div className="relative z-10 mb-4 flex items-start justify-between">
            <span className="text-sm font-extrabold tracking-wide text-slate-500">
              Pesanan {selectedPeriod.metricLabel}
            </span>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-blue-100 bg-blue-50 text-blue-500 shadow-sm">
              <BookOpen size={22} strokeWidth={2.5} />
            </div>
          </div>
          <h2 className="relative z-10 flex items-end gap-3 text-4xl font-black text-slate-800">
            {isLoading ? <Loader2 className="animate-spin text-blue-500" /> : counts.recitations}
          </h2>
        </div>

        <div className="relative overflow-hidden rounded-3xl border border-slate-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
          <div className="absolute top-0 right-0 h-32 w-32 translate-x-8 -translate-y-8 rounded-full bg-emerald-50 opacity-50"></div>
          <div className="relative z-10 mb-4 flex items-start justify-between">
            <span className="text-sm font-extrabold tracking-wide text-slate-500">
              User Baru {selectedPeriod.metricLabel}
            </span>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-100 bg-emerald-50 text-[#059669] shadow-sm">
              <Users size={22} strokeWidth={2.5} />
            </div>
          </div>
          <h2 className="relative z-10 flex items-end gap-3 text-4xl font-black text-slate-800">
            {isLoading ? <Loader2 className="animate-spin text-emerald-500" /> : counts.users}
          </h2>
        </div>

        <div className="relative overflow-hidden rounded-3xl border border-slate-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
          <div className="absolute top-0 right-0 h-32 w-32 translate-x-8 -translate-y-8 rounded-full bg-purple-50 opacity-50"></div>
          <div className="relative z-10 mb-4 flex items-start justify-between">
            <span className="text-sm font-extrabold tracking-wide text-slate-500">
              Grup Baru {selectedPeriod.metricLabel}
            </span>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-purple-100 bg-purple-50 text-purple-600 shadow-sm">
              <GroupsIcon size={22} strokeWidth={2.5} />
            </div>
          </div>
          <h2 className="relative z-10 flex items-end gap-3 text-4xl font-black text-slate-800">
            {isLoading ? <Loader2 className="animate-spin text-purple-500" /> : counts.groups}
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="group relative flex min-h-[400px] flex-col overflow-hidden rounded-3xl border border-slate-100 bg-white p-8 shadow-sm lg:col-span-2">
          <h3 className="relative z-10 mb-3 flex items-center gap-2 text-lg font-black tracking-tight text-slate-800">
            <Target className="text-[#059669]" />
            Top Group Performance
          </h3>

          {isLoading ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-3 text-[#059669]">
              <Loader2 size={32} className="animate-spin" />
            </div>
          ) : topGroup ? (
            <div className="relative z-10 flex flex-1 flex-col items-center justify-center">
              <div className="mb-6 flex h-28 w-28 items-center justify-center rounded-full border-4 border-white bg-gradient-to-br from-emerald-400 to-[#059669] text-4xl font-black text-white shadow-xl shadow-emerald-200 transition-transform duration-300 group-hover:scale-105">
                {topGroup.initials}
              </div>
              <h2 className="text-center text-3xl font-black tracking-tight text-slate-800">
                {topGroup.name}
              </h2>
              <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
                <span className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-4 py-1.5 text-sm font-extrabold text-slate-600">
                  <Users size={16} /> {topGroup.member_count ?? 0} Members Aktif
                </span>
                <span className="flex items-center gap-1.5 rounded-full border border-blue-100 bg-blue-50 px-4 py-1.5 text-sm font-extrabold text-blue-600">
                  <CheckCircle2 size={16} /> {topGroup.type}
                </span>
              </div>
              {topGroup.description && (
                <p className="mt-6 max-w-lg rounded-xl border border-slate-100 bg-slate-50 p-4 text-center text-sm font-semibold leading-relaxed text-slate-500">
                  {topGroup.description}
                </p>
              )}
            </div>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center gap-2 text-slate-400">
              <div className="mb-2 flex h-20 w-20 items-center justify-center rounded-full bg-slate-50">
                <GroupsIcon size={32} className="text-slate-300" />
              </div>
              <span className="text-lg font-extrabold text-slate-500">Belum Ada Data Grup</span>
              <span className="text-sm font-bold opacity-70">
                Periode {selectedPeriod.label.toLowerCase()} belum memiliki grup baru.
              </span>
            </div>
          )}

          <svg
            className="pointer-events-none absolute right-0 bottom-0 h-[400px] w-[400px] translate-x-12 translate-y-12 opacity-[0.03]"
            viewBox="0 0 100 100"
          >
            <circle cx="100" cy="100" r="80" fill="#059669" />
          </svg>
        </div>

        <div className="flex min-h-[400px] flex-col rounded-3xl border border-slate-100 bg-white p-8 shadow-sm">
          <div className="mb-2 flex items-center justify-between gap-3">
            <h3 className="text-lg font-black tracking-tight text-slate-800">Statistik Bulanan</h3>
            {!isLoading && (
              <span className="rounded-full bg-slate-50 px-3 py-1 text-[11px] font-extrabold text-slate-500">
                {selectedPeriod.label}
              </span>
            )}
          </div>

          <div className="relative mt-4 flex flex-1 flex-col justify-end overflow-visible border-l-2 border-b-2 border-slate-100 pb-8">
            {[4, 3, 2, 1].map((value) => {
              const stepHeight = 100 / 4;
              const topPosition = `${(4 - value) * stepHeight}%`;
              const labelValue = Math.ceil((maxChartValue / 4) * value);

              return (
                <div
                  key={value}
                  className="absolute flex w-full items-center border-t border-dashed border-slate-200"
                  style={{ top: topPosition }}
                >
                  <span className="absolute -left-8 w-6 text-right text-xs font-bold text-slate-400">
                    {labelValue}
                  </span>
                </div>
              );
            })}
            <span className="absolute -left-8 bottom-7 w-6 text-right text-xs font-bold text-slate-400">
              0
            </span>

            {dateLabels.length > 0 && (
              <div className="absolute inset-0 pb-8">
                <svg
                  viewBox="0 0 500 150"
                  className="h-full w-full overflow-visible"
                  preserveAspectRatio="none"
                >
                  <path
                    d={generateSVGPath(userChartData, maxChartValue)}
                    fill="none"
                    stroke="#22c55e"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="drop-shadow-sm"
                  />
                  <path
                    d={generateSVGPath(groupChartData, maxChartValue)}
                    fill="none"
                    stroke="#8b5cf6"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeDasharray="6 4"
                  />

                  {userChartData.map((value, index) => (
                    <circle
                      key={`u-${dateLabels[index]}`}
                      cx={userChartData.length > 1 ? (500 / (userChartData.length - 1)) * index : 250}
                      cy={(1 - value / maxChartValue) * 150}
                      r="4"
                      fill="#fff"
                      stroke="#22c55e"
                      strokeWidth="2"
                    />
                  ))}

                  {groupChartData.map((value, index) => (
                    <circle
                      key={`g-${dateLabels[index]}`}
                      cx={groupChartData.length > 1 ? (500 / (groupChartData.length - 1)) * index : 250}
                      cy={(1 - value / maxChartValue) * 150}
                      r="4"
                      fill="#fff"
                      stroke="#8b5cf6"
                      strokeWidth="2"
                    />
                  ))}
                </svg>
              </div>
            )}

            <div className="absolute -bottom-6 left-0 flex w-full justify-between px-1 text-[10px] font-extrabold text-slate-400">
              {dateLabels.length > 0 ? (
                dateLabels.map((label) => <span key={label}>{label}</span>)
              ) : (
                <span>Memuat...</span>
              )}
            </div>
          </div>

          <div className="mt-8 flex items-center justify-center gap-4 text-[11px] font-extrabold">
            <div className="flex items-center gap-1.5 text-emerald-500">
              <div className="h-3 w-3 rounded-md bg-emerald-500"></div> Users Baru
            </div>
            <div className="flex items-center gap-1.5 text-purple-500">
              <div className="h-3 w-3 rounded-md bg-purple-500"></div> Groups Baru
            </div>
          </div>


        </div>
      </div>
    </div>
  );
}
