import { Calendar, ChevronRight, Search, Zap } from "lucide-react";

import type { useBillingOrders } from "../hooks/use-billing-orders";
import { BillingOrdersNotificationsPopover } from "./billing-orders-notifications-popover";
import { BillingOrdersSimulationModal } from "./billing-orders-simulation-modal";
import { BillingOrdersTable } from "./billing-orders-table";

export function BillingOrdersView({
  state,
}: {
  state: ReturnType<typeof useBillingOrders>;
}) {
  return (
    <div className="animate-in fade-in mx-auto max-w-[1400px] pb-12 duration-300">
      <div className="mt-2 mb-2 flex flex-col justify-between gap-4 xl:flex-row xl:items-center">
        <div className="relative w-full xl:max-w-md">
          <Search
            size={18}
            className="absolute top-1/2 left-4 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            placeholder="Cari member, guru, paket..."
            value={state.searchQuery}
            onChange={(event) => state.setSearchQuery(event.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-white py-3 pr-24 pl-11 text-sm font-semibold shadow-sm focus:ring-2 focus:ring-emerald-500/20 focus:outline-none"
          />
          <button
            type="button"
            className="absolute top-1/2 right-2 flex -translate-y-1/2 items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-4 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-100"
          >
            <Search size={12} />
            Cari
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-600 shadow-sm hover:bg-slate-50"
          >
            <Calendar size={16} className="text-slate-400" />
            Year 2026
            <ChevronRight size={14} className="rotate-90 text-slate-400" />
          </button>

          <BillingOrdersNotificationsPopover state={state} />

          <button
            type="button"
            onClick={state.openSimulation}
            className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#059669] text-white shadow-md shadow-[#059669]/20 transition-colors hover:bg-[#047857]"
          >
            <Zap size={22} className="fill-current" />
          </button>
        </div>
      </div>

      <div className="mt-6 flex min-h-[500px] flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center gap-6 overflow-x-auto border-b border-slate-100 px-8 pt-6 pb-2">
          {state.tabs.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => state.setActiveTab(tab)}
              className={`border-b-2 pb-4 text-sm font-extrabold whitespace-nowrap transition-colors ${
                state.activeTab === tab
                  ? "border-[#059669] text-[#059669]"
                  : "border-transparent text-slate-400 hover:text-slate-600"
              }`}
            >
              {tab}{" "}
              <span
                className={
                  state.activeTab === tab ? "opacity-100" : "opacity-50"
                }
              >
                {state.tabCounts[tab]}
              </span>
            </button>
          ))}
        </div>

        <BillingOrdersTable state={state} />

        <div className="mt-auto flex items-center justify-between border-t border-slate-100 bg-[#fcfcfc] p-5">
          <div className="ml-3 text-sm font-bold tracking-wide text-slate-400">
            Menampilkan{" "}
            <span className="font-extrabold text-[#059669]">
              1-{state.filteredOrders.length}
            </span>{" "}
            dari {state.orders.length} pesanan
          </div>
          <div className="mr-3 flex items-center gap-2 font-bold text-slate-400">
            <button
              type="button"
              className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-slate-200"
            >
              {"<"}
            </button>
            <button
              type="button"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 shadow-sm"
            >
              1
            </button>
            <button
              type="button"
              className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-slate-200"
            >
              {">"}
            </button>
          </div>
        </div>
      </div>

      <BillingOrdersSimulationModal state={state} />
    </div>
  );
}
