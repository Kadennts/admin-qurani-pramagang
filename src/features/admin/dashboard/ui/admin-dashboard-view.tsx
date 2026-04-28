"use client";

import type { CSSProperties } from "react";
import { Activity, Shield, UserX, Users } from "lucide-react";

import { getAdminDashboardAxisValues } from "../model/admin-dashboard.utils";
import type { useAdminDashboard } from "../hooks/use-admin-dashboard";

const radius = 15.91549430918954;

function AdminDashboardBarChart({
  title,
  subtitle,
  data,
  showScroll = false,
  onHover,
  onLeave,
}: {
  title: string;
  subtitle: string;
  data: { name: string; count: number }[];
  showScroll?: boolean;
  onHover: (payload: { x: number; y: number; title: string; count: number; color: string }) => void;
  onLeave: () => void;
}) {
  const maxCount = Math.max(...data.map((item) => item.count), 1);
  const axisValues = getAdminDashboardAxisValues(data);

  return (
    <div className="flex h-[400px] flex-col rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-slate-800">{title}</h3>
        <p className="text-sm text-slate-500">{subtitle}</p>
      </div>
      <div
        className="flex-1 overflow-y-auto pr-2"
        style={showScroll ? ({ overflowY: "auto", scrollbarWidth: "thin", scrollbarColor: "#cbd5e1 transparent" } as CSSProperties) : {}}
      >
        <div className="space-y-4">
          {data.map((item) => (
            <div
              key={item.name}
              className="flex cursor-pointer items-center gap-4"
              onMouseMove={(event) =>
                onHover({
                  x: event.clientX,
                  y: event.clientY,
                  title: item.name,
                  count: item.count,
                  color: "#059669",
                })
              }
              onMouseLeave={onLeave}
            >
              <div className="w-24 shrink-0 truncate text-right text-xs font-semibold text-slate-500">
                {item.name}
              </div>
              <div className="flex h-3.5 flex-1 items-center rounded-full bg-transparent">
                <div
                  className="h-full rounded-sm bg-[#059669] transition-all duration-1000 ease-out"
                  style={{ width: `${(item.count / maxCount) * 100}%`, minWidth: item.count > 0 ? "4px" : "0" }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-4 ml-28 flex justify-between border-t border-slate-100 pt-2 text-xs font-medium text-slate-400">
        {axisValues.map((value, index) => (
          <span key={`${title}-${value}-${index}`}>{value}</span>
        ))}
      </div>
    </div>
  );
}

export function AdminDashboardView({ state }: { state: ReturnType<typeof useAdminDashboard> }) {
  if (state.isLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6 pb-10">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Users", value: state.stats.totalUsers, icon: Users },
          { label: "Admins", value: state.stats.admins, icon: Shield },
          { label: "Active Users", value: state.stats.active, icon: Activity },
          { label: "Blocked Users", value: state.stats.blocked, icon: UserX },
        ].map((card) => {
          const Icon = card.icon;

          return (
            <div key={card.label} className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <div>
                <p className="mb-1 text-sm font-semibold text-slate-500">{card.label}</p>
                <h2 className="text-3xl font-bold text-[#059669]">{card.value}</h2>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-[#059669]">
                <Icon size={20} strokeWidth={2} />
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="flex h-[400px] flex-col items-center justify-between rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 w-full text-left">
            <h3 className="text-lg font-bold text-slate-800">Gender</h3>
            <p className="text-sm text-slate-500">User distribution</p>
          </div>

          <div className="relative flex max-h-[220px] w-full flex-1 items-center justify-center">
            <svg viewBox="0 0 42 42" className="h-[200px] w-[200px] -rotate-90 drop-shadow-sm">
              <circle
                cx="21"
                cy="21"
                r={radius}
                fill="transparent"
                stroke="#8ca0b1"
                strokeWidth="8"
                strokeDasharray={`${state.unknownPercent} ${100 - state.unknownPercent}`}
                strokeDashoffset="25"
                className="cursor-pointer transition-opacity hover:opacity-80"
                onMouseMove={(event) =>
                  state.setTooltip({
                    visible: true,
                    x: event.clientX,
                    y: event.clientY,
                    title: "Unknown",
                    count: state.genderData.unknown,
                    color: "#8ca0b1",
                  })
                }
                onMouseLeave={() => state.setTooltip(null)}
              />
              {state.malePercent > 0 && (
                <circle
                  cx="21"
                  cy="21"
                  r={radius}
                  fill="transparent"
                  stroke="#059669"
                  strokeWidth="8"
                  strokeDasharray={`${state.malePercent} ${100 - state.malePercent}`}
                  strokeDashoffset="100"
                  className="cursor-pointer transition-opacity hover:opacity-80"
                  onMouseMove={(event) =>
                    state.setTooltip({
                      visible: true,
                      x: event.clientX,
                      y: event.clientY,
                      title: "Male",
                      count: state.genderData.male,
                      color: "#059669",
                    })
                  }
                  onMouseLeave={() => state.setTooltip(null)}
                />
              )}
            </svg>
          </div>

          <div className="mt-6 flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-sm bg-[#059669]"></span>
              <span className="text-xs font-bold text-slate-600">Male</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-sm bg-[#8ca0b1]"></span>
              <span className="text-xs font-bold text-slate-600">Unknown</span>
            </div>
          </div>
        </div>

        <AdminDashboardBarChart
          title="Top Countries"
          subtitle="Top locations by users"
          data={state.countriesData}
          onHover={(payload) => state.setTooltip({ visible: true, ...payload })}
          onLeave={() => state.setTooltip(null)}
        />
        <AdminDashboardBarChart
          title="Top States"
          subtitle="Top locations by users"
          data={state.statesData}
          onHover={(payload) => state.setTooltip({ visible: true, ...payload })}
          onLeave={() => state.setTooltip(null)}
        />
        <AdminDashboardBarChart
          title="Top Cities"
          subtitle="Top locations by users"
          data={state.citiesData}
          showScroll
          onHover={(payload) => state.setTooltip({ visible: true, ...payload })}
          onLeave={() => state.setTooltip(null)}
        />
      </div>

      {state.tooltip?.visible && (
        <div
          className="pointer-events-none fixed z-50 flex gap-3 rounded-lg border border-slate-200 bg-white p-3 text-xs shadow-xl transition-opacity"
          style={{ left: state.tooltip.x + 15, top: state.tooltip.y + 15 }}
        >
          <div className="w-1 rounded-full" style={{ backgroundColor: state.tooltip.color }} />
          <div className="flex min-w-[70px] flex-col">
            <span className="font-bold text-slate-700">{state.tooltip.title}</span>
            <span className="mt-0.5 text-slate-500">{state.tooltip.count} users</span>
          </div>
        </div>
      )}
    </div>
  );
}
