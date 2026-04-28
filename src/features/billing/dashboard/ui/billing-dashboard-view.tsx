"use client";

import { Briefcase, CheckCircle2, Clock, CreditCard, DollarSign, RefreshCcw, Users, XCircle } from "lucide-react";

import { formatBillingCurrency, formatBillingDate, getBillingOrderStatusBadge } from "../model/billing-dashboard.utils";
import type { useBillingDashboard } from "../hooks/use-billing-dashboard";

function CircularProgress({ val, color, text, subtext }: { val: number; color: string; text: string; subtext: string }) {
  const radius = 35;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (val / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative flex h-24 w-24 items-center justify-center">
        <svg className="h-24 w-24 -rotate-90 transform text-slate-100">
          <circle cx="48" cy="48" r={radius} stroke="currentColor" strokeWidth="8" fill="none" />
          <circle
            cx="48"
            cy="48"
            r={radius}
            stroke={color}
            strokeWidth="8"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <span className="absolute text-lg font-black text-slate-800">
          {val}
          {val !== 2 ? "%" : ""}
        </span>
      </div>
      <span className="mt-3 text-sm font-extrabold text-slate-700">{text}</span>
      <span className="text-xs font-semibold text-slate-400">{subtext}</span>
    </div>
  );
}

export function BillingDashboardView({ state }: { state: ReturnType<typeof useBillingDashboard> }) {
  const { metrics } = state;

  return (
    <div className="mx-auto max-w-[1400px] animate-in fade-in pb-12 duration-300">
      <div className="mt-2 mb-6 flex items-center justify-between">
        <h1 className="font-serif text-2xl font-black text-slate-800">Billing Dashboard</h1>
        <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 shadow-sm">
          <Clock size={16} className="text-slate-400" />
          April 2026 <span className="ml-2 text-[10px] text-slate-400">▼</span>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="flex flex-col justify-between rounded-3xl border border-slate-100 bg-white p-6 shadow-sm lg:col-span-2">
          <h3 className="mb-6 font-extrabold text-slate-800">Status Keuangan</h3>
          <div className="flex items-center justify-around pt-2 pb-4">
            <CircularProgress
              val={metrics.successRate}
              color="#059669"
              text="Tingkat Sukses"
              subtext={`${metrics.berhasilCount} dari ${metrics.totalPesanan}`}
            />
            <CircularProgress
              val={metrics.activeRate}
              color="#3b82f6"
              text="Pesanan Aktif"
              subtext={`${metrics.activePesanan} dari ${metrics.totalPesanan}`}
            />
            <CircularProgress val={2} color="#f59e0b" text="Payout Pending" subtext="2 menunggu" />
          </div>
        </div>

        <div className="flex flex-col rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
          <h3 className="mb-4 font-extrabold text-slate-800">Total Revenue</h3>
          <h2 className="mb-1 text-3xl font-black text-[#059669]">{formatBillingCurrency(metrics.totalRevenue)}</h2>
          <span className="mb-8 flex items-center gap-1 text-sm font-bold text-slate-400">
            <span className="text-[#059669]">↗</span> {metrics.berhasilCount} transaksi
          </span>

          <div className="space-y-4">
            <div>
              <div className="mb-2 flex justify-between text-xs font-extrabold text-slate-600">
                <span>GoPay</span><span>{metrics.gopayPct}%</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                <div className="h-full rounded-full bg-[#059669]" style={{ width: `${metrics.gopayPct}%` }}></div>
              </div>
            </div>
            <div>
              <div className="mb-2 flex justify-between text-xs font-extrabold text-slate-600">
                <span>QRIS</span><span>{metrics.qrisPct}%</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                <div className="h-full rounded-full bg-[#059669]" style={{ width: `${metrics.qrisPct}%` }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="mb-4 ml-1 font-extrabold text-slate-800">Overview</h3>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[
            {
              label: "Total Revenue",
              value: formatBillingCurrency(metrics.totalRevenue),
              description: `${metrics.berhasilCount} transaksi berhasil`,
              icon: DollarSign,
              iconClassName: "bg-emerald-50 text-[#059669]",
            },
            {
              label: "Total Pembayaran",
              value: `${metrics.berhasilCount + metrics.pendingCount}`,
              description: `${metrics.berhasilCount} berhasil`,
              icon: CreditCard,
              iconClassName: "bg-blue-50 text-blue-500",
            },
            {
              label: "Pesanan Aktif",
              value: `${metrics.activePesanan}`,
              description: `dari ${metrics.totalPesanan} total pesanan`,
              icon: Users,
              iconClassName: "bg-purple-50 text-purple-500",
            },
            {
              label: "Avg. Transaksi",
              value: formatBillingCurrency(metrics.avgRevenue),
              description: `${metrics.berhasilCount} transaksi`,
              icon: Briefcase,
              iconClassName: "bg-amber-50 text-amber-500",
            },
          ].map((card) => {
            const Icon = card.icon;
            return (
              <div key={card.label} className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
                <div className="mb-6 flex items-center gap-3">
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${card.iconClassName}`}>
                    <Icon size={20} />
                  </div>
                  <span className="text-sm font-extrabold text-slate-800">{card.label}</span>
                </div>
                <h3 className="mb-1 text-2xl font-black text-slate-800">{card.value}</h3>
                <p className="text-xs font-semibold text-slate-400">{card.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="flex flex-col rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
          <h3 className="mb-6 font-extrabold text-slate-800">Statistik Pembayaran</h3>
          <div className="grid flex-1 grid-cols-2 gap-4">
            {[
              { label: "Berhasil", value: metrics.berhasilCount, icon: CheckCircle2, iconClassName: "bg-emerald-100 text-[#059669]", cardClassName: "bg-emerald-50/30" },
              { label: "Pending", value: metrics.pendingCount, icon: Clock, iconClassName: "bg-amber-100 text-amber-600", cardClassName: "bg-amber-50/30" },
              { label: "Gagal", value: metrics.gagalCount, icon: XCircle, iconClassName: "bg-rose-100 text-rose-500", cardClassName: "bg-rose-50/30" },
              { label: "Refund", value: metrics.refundCount, icon: RefreshCcw, iconClassName: "bg-blue-100 text-blue-500", cardClassName: "bg-blue-50/30" },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className={`flex items-center justify-between rounded-2xl border border-slate-100 p-4 ${item.cardClassName}`}>
                  <div className="flex items-center gap-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-full ${item.iconClassName}`}>
                      <Icon size={20} />
                    </div>
                    <div>
                      <div className="text-sm font-extrabold text-slate-800">{item.label}</div>
                      <div className="text-[10px] font-bold text-slate-400">Transaksi</div>
                    </div>
                  </div>
                  <div className="text-2xl font-black text-slate-800">{item.value}</div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="font-extrabold text-slate-800">Tren Revenue</h3>
            <div className="flex items-center gap-2">
              <div className="h-2.5 w-2.5 rounded-full bg-[#059669]"></div>
              <span className="text-[10px] font-bold text-slate-400">Revenue</span>
            </div>
          </div>
          <div className="relative flex w-full flex-1 items-end">
            <div className="absolute inset-0 flex flex-col justify-between pt-2 pb-6">
              <div className="w-full border-b border-slate-100"></div>
              <div className="w-full border-b border-slate-100"></div>
              <div className="w-full border-b border-slate-100"></div>
              <div className="w-full border-b border-slate-100"></div>
            </div>
            <svg viewBox="0 0 400 150" className="preserve-3d z-10 h-40 w-full" preserveAspectRatio="none">
              <defs>
                <linearGradient id="billingGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#059669" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#059669" stopOpacity="0" />
                </linearGradient>
              </defs>
              <polygon points="0,150 0,10 130,5 260,110 400,100 400,150" fill="url(#billingGradient)" />
              <polyline points="0,10 130,5 260,110 400,100" fill="none" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="0" cy="10" r="3" fill="#fff" stroke="#059669" strokeWidth="2" />
              <circle cx="130" cy="5" r="3" fill="#fff" stroke="#059669" strokeWidth="2" />
              <circle cx="260" cy="110" r="3" fill="#fff" stroke="#059669" strokeWidth="2" />
              <circle cx="400" cy="100" r="3" fill="#fff" stroke="#059669" strokeWidth="2" />
            </svg>
            <div className="absolute bottom-0 flex w-full justify-between px-1 text-[10px] font-bold text-slate-400">
              <span>W1</span><span>W2</span><span>W3</span><span>W4</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col overflow-hidden rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-lg font-extrabold text-slate-800">Pembayaran</h3>
          <span className="text-xs font-bold text-slate-400">{metrics.totalPesanan} transaksi</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full whitespace-nowrap">
            <thead>
              <tr className="border-b border-slate-100 text-left text-xs font-black tracking-wider text-slate-500">
                <th className="px-4 py-4">ID</th>
                <th className="px-4 py-4">User</th>
                <th className="px-4 py-4">Trainer</th>
                <th className="px-4 py-4">Payment</th>
                <th className="px-4 py-4">Jumlah</th>
                <th className="px-4 py-4">Status</th>
                <th className="px-4 py-4 text-right">Tanggal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {state.isLoading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-sm font-bold text-slate-400">
                    Memuat data...
                  </td>
                </tr>
              ) : state.orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-sm font-bold text-slate-400">
                    Belum ada pesanan.
                  </td>
                </tr>
              ) : (
                state.orders.map((item, index) => {
                  const { badgeClass, finalStatus } = getBillingOrderStatusBadge(item.status);

                  return (
                    <tr key={item.id} className="transition-colors hover:bg-slate-50/50">
                      <td className="px-4 py-4 text-sm font-bold text-slate-400">#{1013 + index}</td>
                      <td className="px-4 py-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-extrabold text-slate-800">{item.member_name}</span>
                          <span className="text-[10px] font-semibold text-slate-500">{item.member_email}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold text-slate-600">{item.guru_name}</span>
                          <span className="text-[10px] font-semibold text-slate-400">{item.guru_email}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm font-bold text-slate-500">{item.payment_method}</td>
                      <td className="px-4 py-4 text-sm font-black text-slate-800">{formatBillingCurrency(item.price || 0)}</td>
                      <td className="px-4 py-4">
                        <span className={`rounded-lg px-3 py-1.5 text-[10px] font-black tracking-wide ${badgeClass}`}>
                          {finalStatus}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-right text-sm font-bold text-slate-400">
                        {formatBillingDate(item.order_date)}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
