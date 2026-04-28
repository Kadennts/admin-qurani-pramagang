"use client";

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

import { generateDashboardOverviewSVGPath } from "../model/dashboard-overview.utils";
import type { useDashboardOverview } from "../hooks/use-dashboard-overview";

export function DashboardOverviewView({ state }: { state: ReturnType<typeof useDashboardOverview> }) {
  return (
    <div className="mx-auto max-w-[1400px] space-y-6 pb-12 animate-in fade-in duration-300">
      <div className="mb-2 flex flex-col gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-black text-slate-800">Dashboard Utama</h1>

        <div className="relative">
          <button
            type="button"
            onClick={() => state.setIsOptionsOpen((prev) => !prev)}
            className="flex min-w-[220px] items-center justify-between gap-3 rounded-xl border border-[#059669]/20 bg-emerald-50 px-4 py-2.5 text-[#059669] shadow-sm transition-colors hover:bg-emerald-100"
          >
            <span className="flex items-center gap-2">
              <Calendar size={16} />
              <span className="text-sm font-extrabold">Periode: {state.selectedPeriod.label}</span>
            </span>
            <ChevronDown size={16} className={`transition-transform duration-200 ${state.isOptionsOpen ? "rotate-180" : ""}`} />
          </button>

          {state.isOptionsOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => state.setIsOptionsOpen(false)}></div>
              <div className="custom-scrollbar absolute right-0 top-full z-50 mt-2 max-h-60 w-full overflow-auto rounded-xl border border-slate-100 bg-white py-1 shadow-xl dark:border-slate-800 dark:bg-slate-900">
                {state.periodOptions.map((option) => (
                  <button
                    key={option.id}
                    className={`block w-full px-4 py-2 text-left text-sm transition-colors hover:bg-emerald-50 hover:text-emerald-700 dark:hover:bg-slate-800 dark:hover:text-emerald-400 ${
                      state.selectedPeriodId === option.id
                        ? "bg-emerald-50 font-bold text-emerald-700 dark:bg-slate-800"
                        : "text-slate-700 dark:text-slate-300"
                    }`}
                    onClick={() => {
                      state.setSelectedPeriodId(option.id);
                      state.setIsOptionsOpen(false);
                    }}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {[
          {
            label: `Pesanan ${state.selectedPeriod.metricLabel}`,
            icon: BookOpen,
            iconClassName: "border-blue-100 bg-blue-50 text-blue-500",
            decorationClassName: "bg-blue-50",
            value: state.counts.recitations,
            loaderClassName: "text-blue-500",
          },
          {
            label: `User Baru ${state.selectedPeriod.metricLabel}`,
            icon: Users,
            iconClassName: "border-emerald-100 bg-emerald-50 text-[#059669]",
            decorationClassName: "bg-emerald-50",
            value: state.counts.users,
            loaderClassName: "text-emerald-500",
          },
          {
            label: `Grup Baru ${state.selectedPeriod.metricLabel}`,
            icon: GroupsIcon,
            iconClassName: "border-purple-100 bg-purple-50 text-purple-600",
            decorationClassName: "bg-purple-50",
            value: state.counts.groups,
            loaderClassName: "text-purple-500",
          },
        ].map((card) => {
          const Icon = card.icon;

          return (
            <div key={card.label} className="relative overflow-hidden rounded-3xl border border-slate-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
              <div className={`absolute top-0 right-0 h-32 w-32 translate-x-8 -translate-y-8 rounded-full opacity-50 ${card.decorationClassName}`}></div>
              <div className="relative z-10 mb-4 flex items-start justify-between">
                <span className="text-sm font-extrabold tracking-wide text-slate-500">{card.label}</span>
                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl border shadow-sm ${card.iconClassName}`}>
                  <Icon size={22} strokeWidth={2.5} />
                </div>
              </div>
              <h2 className="relative z-10 flex items-end gap-3 text-4xl font-black text-slate-800">
                {state.isLoading ? <Loader2 className={`animate-spin ${card.loaderClassName}`} /> : card.value}
              </h2>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="group relative flex min-h-[400px] flex-col overflow-hidden rounded-3xl border border-slate-100 bg-white p-8 shadow-sm lg:col-span-2">
          <h3 className="relative z-10 mb-3 flex items-center gap-2 text-lg font-black tracking-tight text-slate-800">
            <Target className="text-[#059669]" />
            Top Group Performance
          </h3>

          {state.isLoading ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-3 text-[#059669]">
              <Loader2 size={32} className="animate-spin" />
            </div>
          ) : state.topGroup ? (
            <div className="relative z-10 flex flex-1 flex-col items-center justify-center">
              <div className="mb-6 flex h-28 w-28 items-center justify-center rounded-full border-4 border-white bg-gradient-to-br from-emerald-400 to-[#059669] text-4xl font-black text-white shadow-xl shadow-emerald-200 transition-transform duration-300 group-hover:scale-105">
                {state.topGroup.initials}
              </div>
              <h2 className="text-center text-3xl font-black tracking-tight text-slate-800">{state.topGroup.name}</h2>
              <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
                <span className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-4 py-1.5 text-sm font-extrabold text-slate-600">
                  <Users size={16} /> {state.topGroup.member_count ?? 0} Members Aktif
                </span>
                <span className="flex items-center gap-1.5 rounded-full border border-blue-100 bg-blue-50 px-4 py-1.5 text-sm font-extrabold text-blue-600">
                  <CheckCircle2 size={16} /> {state.topGroup.type}
                </span>
              </div>
              {state.topGroup.description && (
                <p className="mt-6 max-w-lg rounded-xl border border-slate-100 bg-slate-50 p-4 text-center text-sm font-semibold leading-relaxed text-slate-500">
                  {state.topGroup.description}
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
                Periode {state.selectedPeriod.label.toLowerCase()} belum memiliki grup baru.
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
            {!state.isLoading && (
              <span className="rounded-full bg-slate-50 px-3 py-1 text-[11px] font-extrabold text-slate-500">
                {state.selectedPeriod.label}
              </span>
            )}
          </div>

          <div className="relative mt-4 flex flex-1 flex-col justify-end overflow-visible border-l-2 border-b-2 border-slate-100 pb-8">
            {[4, 3, 2, 1].map((value) => {
              const stepHeight = 100 / 4;
              const topPosition = `${(4 - value) * stepHeight}%`;
              const labelValue = Math.ceil((state.maxChartValue / 4) * value);

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
            <span className="absolute -left-8 bottom-7 w-6 text-right text-xs font-bold text-slate-400">0</span>

            {state.dateLabels.length > 0 && (
              <div className="absolute inset-0 pb-8">
                <svg viewBox="0 0 500 150" className="h-full w-full overflow-visible" preserveAspectRatio="none">
                  <path
                    d={generateDashboardOverviewSVGPath(state.userChartData, state.maxChartValue)}
                    fill="none"
                    stroke="#22c55e"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="drop-shadow-sm"
                  />
                  <path
                    d={generateDashboardOverviewSVGPath(state.groupChartData, state.maxChartValue)}
                    fill="none"
                    stroke="#8b5cf6"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeDasharray="6 4"
                  />

                  {state.userChartData.map((value, index) => (
                    <circle
                      key={`u-${state.dateLabels[index]}`}
                      cx={state.userChartData.length > 1 ? (500 / (state.userChartData.length - 1)) * index : 250}
                      cy={(1 - value / state.maxChartValue) * 150}
                      r="4"
                      fill="#fff"
                      stroke="#22c55e"
                      strokeWidth="2"
                    />
                  ))}

                  {state.groupChartData.map((value, index) => (
                    <circle
                      key={`g-${state.dateLabels[index]}`}
                      cx={state.groupChartData.length > 1 ? (500 / (state.groupChartData.length - 1)) * index : 250}
                      cy={(1 - value / state.maxChartValue) * 150}
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
              {state.dateLabels.length > 0 ? state.dateLabels.map((label) => <span key={label}>{label}</span>) : <span>Memuat...</span>}
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
