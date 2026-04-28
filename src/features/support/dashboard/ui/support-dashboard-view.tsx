"use client";

import { AlertCircle, Check, CheckCircle2, ChevronDown, Clock3, Loader2, Ticket } from "lucide-react";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

import { SUPPORT_DASHBOARD_CHART_RANGES } from "../model/support-dashboard.constants";
import type { useSupportDashboard } from "../hooks/use-support-dashboard";

export function SupportDashboardView({ state }: { state: ReturnType<typeof useSupportDashboard> }) {
  const statCards = [
    {
      label: "Tickets",
      value: state.ticketStats.total,
      icon: Ticket,
      iconClassName: "bg-[#dbeafe] text-[#2563eb]",
    },
    {
      label: "Open Tickets",
      value: state.ticketStats.open,
      icon: AlertCircle,
      iconClassName: "bg-[#fee2e2] text-[#ef4444]",
    },
    {
      label: "In Progress",
      value: state.ticketStats.inProgress,
      icon: Clock3,
      iconClassName: "bg-[#fef3c7] text-[#d97706]",
    },
    {
      label: "Resolved",
      value: state.ticketStats.resolved,
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
                <span className="pt-1 text-[15px] font-medium text-slate-600">{card.label}</span>
                <div className={`flex h-12 w-12 items-center justify-center rounded-[16px] ${card.iconClassName}`}>
                  <Icon size={22} strokeWidth={2.1} />
                </div>
              </div>
              <div className="text-[2.4rem] leading-none font-extrabold tracking-tight text-[#0f172a]">
                {state.isLoading ? <Loader2 className="animate-spin text-slate-400" size={28} /> : card.value}
              </div>
            </article>
          );
        })}
      </section>

      <section className="overflow-hidden rounded-[24px] border border-slate-200/80 bg-white shadow-[0_8px_24px_rgba(15,23,42,0.05)]">
        <div className="flex flex-col gap-4 border-b border-slate-200/80 px-7 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <h2 className="text-xl leading-none font-bold tracking-tight text-[#0f172a]">Area Chart</h2>
            <p className="text-sm font-medium text-slate-500">{state.selectedRange.subtitle}</p>
          </div>

          <Popover open={state.isRangeMenuOpen} onOpenChange={state.setIsRangeMenuOpen}>
            <PopoverTrigger
              aria-label="Select chart range"
              className="inline-flex h-10 min-w-[160px] items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-[0_4px_12px_rgba(15,23,42,0.05)] transition-colors hover:bg-slate-50"
            >
              <span>{state.selectedRange.label}</span>
              <ChevronDown size={16} className="text-slate-400" />
            </PopoverTrigger>
            <PopoverContent
              align="end"
              sideOffset={10}
              className="w-[220px] rounded-[18px] border border-slate-200 bg-white p-2 shadow-[0_18px_45px_rgba(15,23,42,0.12)]"
            >
              <div className="space-y-1">
                {SUPPORT_DASHBOARD_CHART_RANGES.map((range) => {
                  const isSelected = range.id === state.selectedRange.id;

                  return (
                    <button
                      key={range.id}
                      type="button"
                      onClick={() => {
                        state.setSelectedRangeId(range.id);
                        state.setIsRangeMenuOpen(false);
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
              ref={state.svgRef}
              preserveAspectRatio="none"
              viewBox={`0 0 ${state.svgWidth} ${state.svgHeight}`}
              className="h-full w-full overflow-visible"
              onMouseMove={state.handleMouseMove}
              onMouseLeave={() => state.setHoverIndex(null)}
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
                  y1={state.svgHeight * ratio}
                  x2={state.svgWidth}
                  y2={state.svgHeight * ratio}
                  stroke="#e5e7eb"
                  strokeWidth="1"
                />
              ))}

              <path d={state.desktopAreaPath} fill="url(#supportDesktopFill)" />
              <path d={state.mobileAreaPath} fill="url(#supportMobileFill)" />

              <path
                d={state.desktopLinePath}
                fill="none"
                stroke="#22c55e"
                strokeWidth="3.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d={state.mobileLinePath}
                fill="none"
                stroke="#3b82f6"
                strokeWidth="3.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {state.chartData.map((point, index) => {
                if (index % state.selectedRange.labelEvery !== 0 && index !== state.chartData.length - 1) {
                  return null;
                }

                return (
                  <text
                    key={`${point.dateLabel}-${index}`}
                    x={state.getX(index)}
                    y={state.svgHeight + 24}
                    textAnchor="middle"
                    fill="#64748b"
                    fontSize="11"
                    fontWeight="500"
                  >
                    {point.dateLabel}
                  </text>
                );
              })}

              {state.activePoint && state.hoverIndex !== null && (
                <g pointerEvents="none">
                  <line
                    x1={state.getX(state.hoverIndex)}
                    y1="0"
                    x2={state.getX(state.hoverIndex)}
                    y2={state.svgHeight}
                    stroke="#cbd5e1"
                    strokeWidth="1.5"
                    strokeDasharray="5 5"
                  />
                  <circle
                    cx={state.getX(state.hoverIndex)}
                    cy={state.getY(state.activePoint.desktop)}
                    r="5.5"
                    fill="#22c55e"
                    stroke="#ffffff"
                    strokeWidth="3"
                  />
                  <circle
                    cx={state.getX(state.hoverIndex)}
                    cy={state.getY(state.activePoint.mobile)}
                    r="5.5"
                    fill="#3b82f6"
                    stroke="#ffffff"
                    strokeWidth="3"
                  />
                </g>
              )}
            </svg>

            {state.activePoint && state.hoverIndex !== null && (
              <div
                className="pointer-events-none absolute top-5 z-10 min-w-[152px] rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-[0_18px_40px_rgba(15,23,42,0.14)]"
                style={{
                  left: `calc(${(state.getX(state.hoverIndex) / state.svgWidth) * 100}% ${
                    state.hoverIndex > state.chartData.length / 2 ? "- 182px" : "+ 14px"
                  })`,
                }}
              >
                <div className="mb-3 text-xs font-bold text-slate-800">{state.activePoint.dateLabel}</div>
                <div className="mb-2 flex items-center justify-between gap-5 text-xs">
                  <span className="flex items-center gap-2 text-slate-500">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#22c55e]"></span>
                    Desktop
                  </span>
                  <span className="font-extrabold text-slate-800">{state.activePoint.desktop}</span>
                </div>
                <div className="flex items-center justify-between gap-5 text-xs">
                  <span className="flex items-center gap-2 text-slate-500">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#3b82f6]"></span>
                    Mobile
                  </span>
                  <span className="font-extrabold text-slate-800">{state.activePoint.mobile}</span>
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
