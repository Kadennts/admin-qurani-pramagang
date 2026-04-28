"use client";

import {
  CheckCircle2,
  Clock,
  Cpu,
  DollarSign,
  Globe2,
  HardDrive,
  Languages,
  Map,
  MapPin,
  RefreshCw,
  Server,
  Settings,
  Activity,
} from "lucide-react";

import type { useMasterDashboard } from "../hooks/use-master-dashboard";

export function MasterDashboardView({ state }: { state: ReturnType<typeof useMasterDashboard> }) {
  return (
    <div className="mx-auto max-w-[1400px] animate-in fade-in pb-12 duration-300">
      <div className="mt-2 mb-8">
        <h1 className="font-serif text-3xl font-black text-slate-800">Master Data Dashboard</h1>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="mb-6 text-sm font-black text-slate-800">System Status</h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            {[
              { value: "2%", label: "Smooth operation", subtext: "0.19 / 0.16 / 0.10", stroke: "#10b981", dashOffset: "246" },
              { value: "1.3%", label: "4 Core(s)", subtext: "API Usage", stroke: "#3b82f6", dashOffset: "248" },
              { value: "59.9%", label: "2453 / 4096(MB)", subtext: "RAM usage", stroke: "#059669", dashOffset: "100.48" },
            ].map((item) => (
              <div key={item.label} className="flex flex-col items-center justify-center">
                <div className="relative mb-3 h-24 w-24">
                  <svg className="h-full w-full -rotate-90 transform" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" fill="transparent" stroke="#f1f5f9" strokeWidth="8" />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="transparent"
                      stroke={item.stroke}
                      strokeWidth="8"
                      strokeDasharray="251.2"
                      strokeDashoffset={item.dashOffset}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xl font-black text-slate-800">{item.value}</span>
                  </div>
                </div>
                <p className="text-[13px] font-bold text-slate-700">{item.label}</p>
                <p className="mt-1 text-[10px] font-bold text-slate-400">{item.subtext}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="mb-auto text-sm font-black text-slate-800">Disk</h3>
          <div className="flex items-center justify-between pb-4">
            <div>
              <p className="mb-1 text-4xl font-black text-[#059669]">18%</p>
              <p className="text-xs font-bold text-slate-400">6.66/38.08 GB</p>
            </div>

            <div className="relative h-28 w-28">
              <svg className="h-full w-full -rotate-90 transform" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="38" fill="transparent" stroke="#f1f5f9" strokeWidth="4" />
                <circle cx="50" cy="50" r="28" fill="transparent" stroke="#f1f5f9" strokeWidth="4" />
                <circle cx="50" cy="50" r="18" fill="transparent" stroke="#f1f5f9" strokeWidth="4" />
                <circle cx="50" cy="50" r="38" fill="transparent" stroke="#10b981" strokeWidth="4" strokeDasharray="238.7" strokeDashoffset="195" strokeLinecap="round" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <h3 className="mb-4 ml-1 text-sm font-black text-slate-800">Overview</h3>
      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Countries", active: state.counts.countries, total: state.counts.countries, icon: Globe2, iconClassName: "bg-emerald-50 text-[#059669]" },
          { label: "States", active: state.counts.states, total: state.counts.states, icon: Map, iconClassName: "bg-blue-50 text-blue-600" },
          { label: "Cities", active: state.counts.cities, total: state.counts.cities, icon: MapPin, iconClassName: "bg-purple-50 text-purple-600" },
          { label: "Currencies", active: state.counts.currencies, total: state.counts.currencies, icon: DollarSign, iconClassName: "bg-amber-50 text-amber-500" },
        ].map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
              <div className="mb-6 flex items-center gap-3">
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${card.iconClassName}`}>
                  <Icon size={20} />
                </div>
                <h3 className="text-base font-black tracking-wide text-slate-800">{card.label}</h3>
              </div>
              <div className="flex items-end justify-between text-sm font-bold">
                <div className="text-[#059669]">Active: {state.isLoading ? "..." : card.active}</div>
                <div className="text-slate-400">Inactive: 0</div>
              </div>
              <div className="mt-2 text-xs font-bold text-slate-800">Total: {state.isLoading ? "..." : card.total}</div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1.5fr]">
        <div>
          <h3 className="mb-4 ml-1 text-sm font-black text-slate-800">Statistics</h3>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "Languages", version: "v2.1", count: "184", badge: "Active", badgeClassName: "bg-emerald-50 text-emerald-500", icon: Languages, iconClassName: "bg-emerald-50 text-emerald-500" },
              { label: "Timezones", version: "v1.0", count: "425", badge: "Active", badgeClassName: "bg-emerald-50 text-emerald-500", icon: Clock, iconClassName: "bg-blue-50 text-blue-500" },
              { label: "Regions", version: "v2.0", count: "92", badge: "Synced", badgeClassName: "bg-emerald-50 text-emerald-500", icon: Globe2, iconClassName: "bg-purple-50 text-purple-500" },
              { label: "Tax Rules", version: "v1.4", count: "38", badge: "Stable", badgeClassName: "bg-amber-50 text-amber-500", icon: Settings, iconClassName: "bg-amber-50 text-amber-500" },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="mb-2 flex items-center gap-3">
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${item.iconClassName}`}>
                      <Icon size={20} />
                    </div>
                    <div>
                      <h4 className="text-sm font-extrabold text-slate-800">{item.label}</h4>
                      <p className="text-[10px] font-bold text-slate-400">{item.version}</p>
                    </div>
                  </div>
                  <div className="mt-4 flex items-end justify-between">
                    <span className={`rounded-md px-2 py-0.5 text-xs font-bold ${item.badgeClassName}`}>{item.badge}</span>
                    <span className="text-xl font-black text-slate-800">{item.count}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div>
          <h3 className="mb-4 ml-1 text-sm font-black text-slate-800">Traffic</h3>
          <div className="flex h-full min-h-[360px] flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
                  <Server size={22} />
                </div>
                <div>
                  <h3 className="font-black text-slate-800">Traffic Server</h3>
                  <p className="text-xs font-bold text-slate-400">Last 24 hours</p>
                </div>
              </div>
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-600">Normal</span>
            </div>

            <div className="mb-6 grid grid-cols-3 gap-4 rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
              <div>
                <div className="mb-1 flex items-center gap-1.5">
                  <div className="h-2.5 w-2.5 rounded-full bg-blue-500"></div>
                  <span className="text-xs font-bold text-slate-500">CPU</span>
                </div>
                <span className="text-sm font-black text-slate-800">1.3%</span>
              </div>
              <div>
                <div className="mb-1 flex items-center gap-1.5">
                  <div className="h-2.5 w-2.5 rounded-full bg-emerald-500"></div>
                  <span className="text-xs font-bold text-slate-500">Memory</span>
                </div>
                <span className="text-sm font-black text-slate-800">59.9%</span>
              </div>
              <div>
                <div className="mb-1 flex items-center gap-1.5">
                  <div className="h-2.5 w-2.5 rounded-full bg-amber-500"></div>
                  <span className="text-xs font-bold text-slate-500">Disk</span>
                </div>
                <span className="text-sm font-black text-slate-800">18%</span>
              </div>
            </div>

            <div className="mb-6 flex items-center justify-between rounded-2xl border border-slate-100 bg-white p-4">
              <div className="flex items-center gap-6">
                <div>
                  <div className="mb-1 flex items-center gap-1.5">
                    <div className="h-2.5 w-2.5 rounded-full bg-blue-500"></div>
                    <span className="text-xs font-bold text-slate-500">Upstream</span>
                  </div>
                  <span className="text-sm font-black text-slate-800">20.01 KB</span>
                </div>
                <div>
                  <div className="mb-1 flex items-center gap-1.5">
                    <div className="h-2.5 w-2.5 rounded-full bg-[#059669]"></div>
                    <span className="text-xs font-bold text-slate-500">Downstream</span>
                  </div>
                  <span className="text-sm font-black text-slate-800">10.24 KB</span>
                </div>
              </div>

              <div className="flex gap-6 text-right">
                <div>
                  <div className="mb-1 text-[11px] font-bold text-slate-400">Total sent</div>
                  <span className="text-sm font-black text-slate-800">887.96 MB</span>
                </div>
                <div>
                  <div className="mb-1 text-[11px] font-bold text-slate-400">Total received</div>
                  <span className="text-sm font-black text-slate-800">350.27 MB</span>
                </div>
              </div>
            </div>

            <div className="relative mt-auto flex min-h-[150px] w-full flex-1 items-end overflow-hidden rounded-xl border border-slate-50">
              <svg viewBox="0 0 500 150" preserveAspectRatio="none" className="absolute bottom-0 h-[80%] w-full opacity-20">
                <path d="M0,50 C150,150 350,0 500,50 L500,150 L0,150 Z" fill="#3b82f6"></path>
              </svg>
              <svg viewBox="0 0 500 150" preserveAspectRatio="none" className="absolute bottom-0 h-[60%] w-full opacity-80">
                <path d="M0,100 C150,0 350,150 500,50 L500,150 L0,150 Z" fill="#059669"></path>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
