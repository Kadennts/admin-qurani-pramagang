"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  Calendar,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Info,
  Landmark,
  Loader2,
  Receipt,
  TrendingUp,
  Wallet,
} from "lucide-react";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  BillingOrderRow,
  GuruRow,
  PayoutTransferRow,
  TAX_FEE_RATE,
  WALLET_PERIOD_OPTIONS,
  WalletPeriodId,
  calculateFinancials,
  formatCurrency,
  formatDate,
  getCoveredOrderIds,
  getWalletPeriodRange,
  isPaidOrder,
  isPendingGuruOrder,
  isSettledOrder,
  isWithinRange,
} from "@/lib/wallet";
import { createClient } from "@/utils/supabase/client";

type ChartBucket = {
  label: string;
  start: Date;
  end: Date;
};

type WithdrawalItem = {
  id: string;
  guruName: string;
  amount: number;
  bankName: string;
  status: string;
  date: string | null;
};

type TransactionItem = {
  id: string;
  memberName: string;
  packageLabel: string;
  date: string;
  gross: number;
  deduction: number;
  net: number;
  status: "Selesai" | "Pending";
  paymentMethod: string;
};

const PLATFORM_FEE_DISPLAY = "12% / Sesi";
const TAX_FEE_DISPLAY = `${(TAX_FEE_RATE * 100).toFixed(1)}% / Sesi`;
const NET_FEE_DISPLAY = "85.5% / Sesi";
const TRANSACTIONS_PER_PAGE = 5;

function buildChartBuckets(periodId: WalletPeriodId, referenceDate: Date) {
  const periodRange = getWalletPeriodRange(periodId, referenceDate);
  const todayStart = new Date(
    referenceDate.getFullYear(),
    referenceDate.getMonth(),
    referenceDate.getDate()
  );

  if (periodId === "today" || periodId === "yesterday") {
    const anchor = periodRange?.start ?? todayStart;
    return Array.from({ length: 6 }, (_, index) => {
      const start = new Date(anchor);
      start.setHours(index * 4, 0, 0, 0);
      const end = new Date(start);
      end.setHours(start.getHours() + 4);

      return {
        label: `${String(start.getHours()).padStart(2, "0")}:00`,
        start,
        end,
      };
    });
  }

  if (periodId === "this-week" || periodId === "last-week") {
    const start = periodRange?.start ?? todayStart;

    return Array.from({ length: 7 }, (_, index) => {
      const bucketStart = new Date(start);
      bucketStart.setDate(start.getDate() + index);
      const bucketEnd = new Date(bucketStart);
      bucketEnd.setDate(bucketStart.getDate() + 1);

      return {
        label: bucketStart.toLocaleDateString("en-US", { weekday: "short" }),
        start: bucketStart,
        end: bucketEnd,
      };
    });
  }

  if (periodId === "this-month" || periodId === "last-month") {
    const start = periodRange?.start ?? new Date(referenceDate.getFullYear(), referenceDate.getMonth(), 1);
    const end = periodRange?.end ?? new Date(referenceDate.getFullYear(), referenceDate.getMonth() + 1, 1);
    const totalDays = Math.max(
      1,
      Math.round((end.getTime() - start.getTime()) / (24 * 60 * 60 * 1000))
    );
    const step = Math.max(1, Math.ceil(totalDays / 6));
    const buckets: ChartBucket[] = [];

    for (let day = 0; day < totalDays; day += step) {
      const bucketStart = new Date(start);
      bucketStart.setDate(start.getDate() + day);
      const bucketEnd = new Date(bucketStart);
      bucketEnd.setDate(bucketStart.getDate() + step);
      if (bucketEnd > end) {
        bucketEnd.setTime(end.getTime());
      }

      buckets.push({
        label: bucketStart.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        start: bucketStart,
        end: bucketEnd,
      });
    }

    return buckets;
  }

  if (periodId === "this-year" || periodId === "last-year") {
    const yearStart =
      periodRange?.start ?? new Date(referenceDate.getFullYear(), 0, 1);

    return Array.from({ length: 12 }, (_, monthIndex) => {
      const start = new Date(yearStart.getFullYear(), monthIndex, 1);
      const end = new Date(yearStart.getFullYear(), monthIndex + 1, 1);

      return {
        label: start.toLocaleDateString("en-US", { month: "short" }),
        start,
        end,
      };
    });
  }

  const endMonth = new Date(referenceDate.getFullYear(), referenceDate.getMonth() + 1, 1);

  return Array.from({ length: 12 }, (_, index) => {
    const start = new Date(referenceDate.getFullYear(), referenceDate.getMonth() - (11 - index), 1);
    const end = new Date(start.getFullYear(), start.getMonth() + 1, 1);
    return {
      label: start.toLocaleDateString("en-US", { month: "short" }),
      start,
      end: end > endMonth ? endMonth : end,
    };
  });
}

function isDateBetween(dateValue: string, start: Date, end: Date) {
  const date = new Date(dateValue);
  return date >= start && date < end;
}

function buildAreaPath(values: number[], width: number, height: number, maxValue: number) {
  if (values.length === 0) {
    return "";
  }

  const stepX = values.length > 1 ? width / (values.length - 1) : width;
  const getY = (value: number) => height - (value / maxValue) * height;

  let path = `M 0 ${getY(values[0])}`;

  for (let index = 1; index < values.length; index += 1) {
    const currentX = stepX * index;
    const previousX = stepX * (index - 1);
    const currentY = getY(values[index]);
    const previousY = getY(values[index - 1]);
    const controlX = (previousX + currentX) / 2;
    path += ` C ${controlX} ${previousY}, ${controlX} ${currentY}, ${currentX} ${currentY}`;
  }

  return path;
}

export default function BillingWalletPage() {
  const [supabase] = useState(() => createClient());
  const [referenceDate] = useState(() => new Date());
  const [orders, setOrders] = useState<BillingOrderRow[]>([]);
  const [gurus, setGurus] = useState<GuruRow[]>([]);
  const [transfers, setTransfers] = useState<PayoutTransferRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isTransferTableReady, setIsTransferTableReady] = useState(true);
  const [selectedPeriodId, setSelectedPeriodId] = useState<WalletPeriodId>("today");
  const [isPeriodMenuOpen, setIsPeriodMenuOpen] = useState(false);
  const [transactionPage, setTransactionPage] = useState(1);

  useEffect(() => {
    let isMounted = true;

    async function fetchWalletData() {
      setIsLoading(true);

      try {
        const [ordersResponse, gurusResponse, transfersResponse] = await Promise.all([
          supabase.from("billing_pesanan").select("*").order("order_date", { ascending: false }),
          supabase.from("master_guru").select("*"),
          supabase
            .from("master_payout_transfers")
            .select("*")
            .order("created_at", { ascending: false }),
        ]);

        if (ordersResponse.error || gurusResponse.error) {
          throw ordersResponse.error || gurusResponse.error;
        }

        if (!isMounted) {
          return;
        }

        setOrders((ordersResponse.data ?? []) as BillingOrderRow[]);
        setGurus((gurusResponse.data ?? []) as GuruRow[]);
        setTransfers(
          transfersResponse.error ? [] : ((transfersResponse.data ?? []) as PayoutTransferRow[])
        );
        setIsTransferTableReady(!transfersResponse.error);
      } catch (error) {
        console.error("Failed fetching wallet data", error);

        if (!isMounted) {
          return;
        }

        setOrders([]);
        setGurus([]);
        setTransfers([]);
        setIsTransferTableReady(false);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void fetchWalletData();

    return () => {
      isMounted = false;
    };
  }, [supabase]);

  useEffect(() => {
    setTransactionPage(1);
  }, [selectedPeriodId]);

  const selectedPeriod =
    WALLET_PERIOD_OPTIONS.find((option) => option.id === selectedPeriodId) ??
    WALLET_PERIOD_OPTIONS[1];
  const periodRange = getWalletPeriodRange(selectedPeriodId, referenceDate);

  const filteredTransfers = useMemo(
    () =>
      transfers.filter((transfer) =>
        isWithinRange(transfer.processed_at ?? transfer.created_at, periodRange)
      ),
    [periodRange, transfers]
  );

  const paidOrders = useMemo(
    () =>
      orders.filter(
        (order) => isPaidOrder(order) && isWithinRange(order.order_date, periodRange)
      ),
    [orders, periodRange]
  );

  const coveredOrderIds = useMemo(
    () => getCoveredOrderIds(filteredTransfers),
    [filteredTransfers]
  );

  const settledOrders = paidOrders.filter((order) => isSettledOrder(order));
  const pendingOrders = paidOrders.filter((order) => isPendingGuruOrder(order));
  const availableOrders = settledOrders.filter((order) => !coveredOrderIds.has(order.id));
  const pendingGuruOrders = pendingOrders.filter((order) => !coveredOrderIds.has(order.id));

  const totalRevenue = paidOrders.reduce(
    (total, order) => total + calculateFinancials(order.price).gross,
    0
  );
  const availableBalance = availableOrders.reduce(
    (total, order) => total + calculateFinancials(order.price).net,
    0
  );
  const pendingBalance = pendingGuruOrders.reduce(
    (total, order) => total + calculateFinancials(order.price).net,
    0
  );
  const withdrawnTotal = filteredTransfers.reduce(
    (total, transfer) => total + Number(transfer.net_amount ?? 0),
    0
  );

  const availableGuruCount = new Set(
    availableOrders.map((order) => order.guru_name).filter(Boolean)
  ).size;

  const chartBuckets = useMemo(
    () => buildChartBuckets(selectedPeriodId, referenceDate),
    [referenceDate, selectedPeriodId]
  );
  const chartValues = chartBuckets.map((bucket) =>
    paidOrders.reduce((total, order) => {
      if (!isDateBetween(order.order_date, bucket.start, bucket.end)) {
        return total;
      }

      return total + calculateFinancials(order.price).gross;
    }, 0)
  );

  const latestWithdrawals: WithdrawalItem[] = filteredTransfers
    .map((transfer) => ({
      id: transfer.id,
      guruName: transfer.guru_name,
      amount: Number(transfer.net_amount ?? 0),
      bankName: transfer.bank_name ?? "Transfer Bank",
      status: transfer.status ?? "Pending",
      date: transfer.processed_at ?? transfer.created_at,
    }))
    .slice(0, 5);

  const transactionItems: TransactionItem[] = paidOrders
    .map((order) => {
      const financials = calculateFinancials(order.price);
      const status: TransactionItem["status"] = isSettledOrder(order)
        ? "Selesai"
        : "Pending";

      return {
        id: order.id,
        memberName: order.member_name ?? "Member",
        packageLabel: order.package_sessions || order.package_name || "Pertemuan",
        date: order.order_date,
        gross: financials.gross,
        deduction: financials.totalDeduction,
        net: financials.net,
        status,
        paymentMethod: order.payment_method ?? "-",
      };
    })
    .sort((left, right) => new Date(right.date).getTime() - new Date(left.date).getTime());

  const totalTransactionPages = Math.max(
    1,
    Math.ceil(transactionItems.length / TRANSACTIONS_PER_PAGE)
  );
  const currentTransactionPage = Math.min(transactionPage, totalTransactionPages);
  const paginatedTransactions = transactionItems.slice(
    (currentTransactionPage - 1) * TRANSACTIONS_PER_PAGE,
    currentTransactionPage * TRANSACTIONS_PER_PAGE
  );

  const chartWidth = 760;
  const chartHeight = 220;
  const chartMax = Math.max(1, ...chartValues);
  const chartLinePath = buildAreaPath(chartValues, chartWidth, chartHeight, chartMax);
  const chartAreaPath = `${chartLinePath} L ${chartWidth} ${chartHeight} L 0 ${chartHeight} Z`;

  const summaryCards = [
    {
      label: "Total Pendapatan",
      value: totalRevenue,
      icon: TrendingUp,
      iconClassName: "bg-orange-50 text-orange-500",
    },
    {
      label: "Saldo Tersedia",
      value: availableBalance,
      icon: Wallet,
      iconClassName: "bg-emerald-50 text-[#059669]",
    },
    {
      label: "Saldo Pending",
      value: pendingBalance,
      icon: Clock3,
      iconClassName: "bg-blue-50 text-blue-500",
    },
    {
      label: "Total Dicairkan",
      value: withdrawnTotal,
      icon: Landmark,
      iconClassName: "bg-slate-100 text-slate-600",
    },
  ];

  return (
    <div className="mx-auto max-w-[1400px] space-y-5 pb-10">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-[2rem] font-black tracking-tight text-slate-900">Wallet</h1>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Popover open={isPeriodMenuOpen} onOpenChange={setIsPeriodMenuOpen}>
            <PopoverTrigger className="inline-flex h-10 min-w-[148px] items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-50">
              <span className="flex items-center gap-2">
                <Calendar size={16} className="text-[#059669]" />
                {selectedPeriod.label}
              </span>
              <ChevronDown size={16} className="text-slate-400" />
            </PopoverTrigger>
            <PopoverContent
              align="end"
              sideOffset={8}
              className="w-[240px] rounded-[20px] border border-slate-200 bg-white p-2 shadow-[0_18px_45px_rgba(15,23,42,0.12)]"
            >
              <div className="space-y-1">
                {WALLET_PERIOD_OPTIONS.map((option) => {
                  const isSelected = option.id === selectedPeriod.id;

                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => {
                        setSelectedPeriodId(option.id);
                        setIsPeriodMenuOpen(false);
                      }}
                      className={`flex w-full items-center justify-between rounded-2xl px-3.5 py-3 text-left text-sm font-semibold transition-colors ${
                        isSelected
                          ? "bg-emerald-50 text-[#059669]"
                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                      }`}
                    >
                      <span>{option.label}</span>
                      {isSelected && <Check size={16} />}
                    </button>
                  );
                })}
              </div>
            </PopoverContent>
          </Popover>

          <Link
            href="/dashboard/master/payout"
            className="inline-flex h-10 items-center gap-2 rounded-2xl bg-[#059669] px-4.5 text-sm font-bold text-white shadow-md shadow-emerald-600/15 transition-colors hover:bg-[#047857]"
          >
            <ArrowUpRight size={16} />
            Proses Transfer
          </Link>
        </div>
      </div>

      {!isTransferTableReady && (
        <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm font-medium text-amber-700">
          <Info size={18} className="mt-0.5 shrink-0" />
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((card) => {
          const Icon = card.icon;

          return (
            <article
              key={card.label}
              className="rounded-[22px] border border-slate-200/80 bg-white px-5 py-5 shadow-[0_8px_24px_rgba(15,23,42,0.04)]"
            >
              <div className="mb-4 flex items-start justify-between gap-3">
                <div>
                  <p className="text-[15px] font-semibold text-slate-500">{card.label}</p>
                </div>
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${card.iconClassName}`}
                >
                  <Icon size={18} />
                </div>
              </div>
              <div className="space-y-1.5">
                <p className="max-w-full break-words text-[clamp(1.7rem,2vw,2.25rem)] leading-tight font-black tracking-tight text-slate-900">
                  {isLoading ? (
                    <Loader2 size={24} className="animate-spin text-slate-400" />
                  ) : (
                    formatCurrency(card.value)
                  )}
                </p>
              </div>
            </article>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,2fr)_340px]">
        <section className="overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-5 py-4.5">
            <h2 className="text-[1.25rem] font-black tracking-tight text-slate-900">
              Riwayat Pendapatan
            </h2>
          </div>

          <div className="px-5 pt-5 pb-4">
            <div className="relative h-[270px] overflow-hidden rounded-[22px] bg-gradient-to-b from-white to-emerald-50/30">
              <svg
                viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                preserveAspectRatio="none"
                className="h-[220px] w-full"
              >
                <defs>
                  <linearGradient id="walletRevenueFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0.02" />
                  </linearGradient>
                </defs>

                {[0, 0.25, 0.5, 0.75, 1].map((ratio) => (
                  <line
                    key={ratio}
                    x1="0"
                    y1={chartHeight * ratio}
                    x2={chartWidth}
                    y2={chartHeight * ratio}
                    stroke="#e5e7eb"
                    strokeWidth="1"
                  />
                ))}

                <path d={chartAreaPath} fill="url(#walletRevenueFill)" />
                <path
                  d={chartLinePath}
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>

              <div className="absolute inset-x-0 bottom-4 flex justify-between px-3 text-[10px] font-semibold text-slate-400">
                {chartBuckets.map((bucket) => (
                  <span key={`${bucket.label}-${bucket.start.toISOString()}`}>{bucket.label}</span>
                ))}
              </div>
            </div>
          </div>
        </section>

        <aside className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-5">
            <h2 className="text-[1.2rem] font-black tracking-tight text-slate-900">
              Penarikan Terakhir
            </h2>
          </div>

          {isLoading ? (
            <div className="flex h-[210px] items-center justify-center text-slate-400">
              <Loader2 size={26} className="animate-spin" />
            </div>
          ) : latestWithdrawals.length === 0 ? (
            <div className="flex h-[210px] flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 text-center">
              <Landmark size={22} className="text-slate-300" />
              <p className="text-sm font-semibold text-slate-500">Belum ada pencairan pada periode ini.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {latestWithdrawals.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-slate-100 bg-white px-4 py-3.5 shadow-sm"
                >
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <p className="break-words text-base leading-tight font-black text-slate-900">
                      {formatCurrency(item.amount)}
                    </p>
                    <span className="rounded-full bg-amber-50 px-3 py-1 text-[11px] font-bold text-amber-600">
                      {item.status}
                    </span>
                  </div>
                  <p className="text-sm font-bold text-slate-700">{item.guruName}</p>
                  <p className="mt-1 text-xs font-semibold text-slate-400">
                    {formatDate(item.date)} • {item.bankName}
                  </p>
                </div>
              ))}
            </div>
          )}
        </aside>
      </div>

      <section className="overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-5 py-4.5">
          <h2 className="text-[1.25rem] font-black tracking-tight text-slate-900">
            Riwayat Transaksi
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full whitespace-nowrap">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/60 text-left text-[11px] font-black uppercase tracking-wider text-slate-500">
                <th className="px-5 py-3.5">Murid / Pertemuan</th>
                <th className="px-5 py-3.5">Tgl Transaksi</th>
                <th className="px-5 py-3.5">Nilai Kotor</th>
                <th className="px-5 py-3.5">Potongan (14.5%)</th>
                <th className="px-5 py-3.5">Diterima Bersih</th>
                <th className="px-5 py-3.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-sm font-medium text-slate-500">
                    Memuat transaksi...
                  </td>
                </tr>
              ) : paginatedTransactions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-sm font-medium text-slate-500">
                    Tidak ada transaksi pada periode ini.
                  </td>
                </tr>
              ) : (
                paginatedTransactions.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-5 py-4.5">
                      <div className="flex flex-col">
                        <span className="text-sm font-extrabold text-slate-800">{item.memberName}</span>
                        <span className="mt-1 text-xs font-semibold text-slate-400">
                          {item.packageLabel} • {item.paymentMethod}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-4.5 text-sm font-semibold text-slate-500">
                      {formatDate(item.date)}
                    </td>
                    <td className="px-5 py-4.5 text-sm font-semibold text-slate-500">
                      {formatCurrency(item.gross)}
                    </td>
                    <td className="px-5 py-4.5 text-sm font-bold text-rose-500">
                      -{formatCurrency(item.deduction)}
                    </td>
                    <td className="bg-emerald-50/35 px-5 py-4.5 text-sm font-black text-[#059669]">
                      {formatCurrency(item.net)}
                    </td>
                    <td className="px-5 py-4.5">
                      <span
                        className={`rounded-full px-3 py-1 text-[11px] font-bold ${
                          item.status === "Selesai"
                            ? "bg-emerald-50 text-[#059669]"
                            : "bg-amber-50 text-amber-600"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-3 border-t border-slate-100 bg-slate-50/60 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-medium text-slate-500">
            Menampilkan{" "}
            <span className="font-bold text-slate-700">
              {paginatedTransactions.length === 0
                ? "0"
                : `${(currentTransactionPage - 1) * TRANSACTIONS_PER_PAGE + 1}-${Math.min(
                    currentTransactionPage * TRANSACTIONS_PER_PAGE,
                    transactionItems.length
                  )}`}
            </span>{" "}
            dari {transactionItems.length} transaksi
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setTransactionPage((page) => Math.max(1, page - 1))}
              disabled={currentTransactionPage === 1}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-400 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft size={16} />
            </button>
            <div className="flex h-9 min-w-[36px] items-center justify-center rounded-xl bg-emerald-50 px-3 text-sm font-bold text-[#059669]">
              {currentTransactionPage}
            </div>
            <button
              type="button"
              onClick={() =>
                setTransactionPage((page) => Math.min(totalTransactionPages, page + 1))
              }
              disabled={currentTransactionPage === totalTransactionPages}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-400 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </section>

      <section className="rounded-[24px] border border-emerald-100 bg-[linear-gradient(135deg,#f6fffb_0%,#effcf6_100%)] p-5 shadow-sm">
        <div className="mb-5 flex items-start gap-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-emerald-100 bg-white text-[#059669] shadow-sm">
            <Receipt size={20} />
          </div>
          <div>
            <h2 className="text-[1.3rem] font-black tracking-tight text-slate-900">
              Skema Pendapatan Pengajar
            </h2>
            <p className="mt-1 text-[13px] font-medium text-slate-500">
              Setiap sesi yang selesai akan dibagi ke biaya platform, pajak, dan hasil bersih guru.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="rounded-3xl border border-slate-100 bg-white px-5 py-4.5">
            <p className="text-[11px] font-black uppercase tracking-wider text-slate-400">
              Fee Platform
            </p>
            <p className="mt-3 text-[1.55rem] font-black text-rose-500">{PLATFORM_FEE_DISPLAY}</p>
            <p className="mt-2 text-xs font-semibold text-slate-400">
              Biaya operasional, server, dan sistem administrasi.
            </p>
          </div>
          <div className="rounded-3xl border border-slate-100 bg-white px-5 py-4.5">
            <p className="text-[11px] font-black uppercase tracking-wider text-slate-400">
              Pajak PPh 21
            </p>
            <p className="mt-3 text-[1.55rem] font-black text-rose-500">{TAX_FEE_DISPLAY}</p>
            <p className="mt-2 text-xs font-semibold text-slate-400">
              Dipotong atas nama pengajar sesuai skema payout aplikasi.
            </p>
          </div>
          <div className="rounded-3xl bg-[#059669] px-5 py-4.5 text-white shadow-[0_18px_30px_rgba(5,150,105,0.2)]">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={18} />
              <p className="text-[11px] font-black uppercase tracking-wider text-emerald-100">
                Bersih Diterima
              </p>
            </div>
            <p className="mt-3 text-[1.6rem] font-black">{NET_FEE_DISPLAY}</p>
            <p className="mt-2 text-xs font-semibold text-emerald-100">
              Nilai bersih ini masuk ke saldo guru dan siap dicairkan setelah order selesai.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
