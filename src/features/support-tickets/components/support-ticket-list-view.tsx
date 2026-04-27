"use client";

import Link from "next/link";
import type { AppProfile } from "@/components/providers/app-preferences-provider";
import { AlertCircle, AlertTriangle, Calendar, CheckCircle, Download, Filter, MessageSquare, MoreHorizontal, Plus, RefreshCcw, Search } from "lucide-react";
import type { AppLanguage } from "@/components/providers/app-preferences-provider";
import { useRouter } from "next/navigation";

import { SUPPORT_TICKET_DEPARTMENTS, SUPPORT_TICKET_LIST_TABS, SUPPORT_TICKET_PRIORITIES, SUPPORT_TICKET_STATUSES } from "../constants";
import { buildPresetDateRange, formatTicketDate, getAvatarColorClass, getPriorityTextClass, getRelativeTime } from "../utils";
import { SupportTicketSelect } from "./support-ticket-select";
import { TicketStatusPill } from "./ticket-status-pill";
import type { useSupportTicketList } from "../hooks/use-support-ticket-list";

type SupportTicketListViewProps = {
  language: AppLanguage;
  profile: AppProfile;
  t: (key:
    | "tickets.all"
    | "tickets.open"
    | "tickets.inProgress"
    | "tickets.answered"
    | "tickets.onHold"
    | "tickets.closed"
    | "tickets.newTicket"
    | "tickets.bulkActions"
    | "tickets.update"
    | "tickets.delete"
    | "tickets.searchPlaceholder"
    | "tickets.dateRange"
    | "tickets.subject"
    | "tickets.status"
    | "tickets.priority"
    | "tickets.department"
    | "tickets.contact") => string;
  state: ReturnType<typeof useSupportTicketList>;
};

export function SupportTicketListView({ language, profile, t, state }: SupportTicketListViewProps) {
  const router = useRouter();
  const statusLabels = {
    Open: t("tickets.open"),
    "In Progress": t("tickets.inProgress"),
    Answered: t("tickets.answered"),
    "On Hold": t("tickets.onHold"),
    Closed: t("tickets.closed"),
  };

  const tabLabelMap: Record<string, string> = {
    All: t("tickets.all"),
    Open: t("tickets.open"),
    "In Progress": t("tickets.inProgress"),
    Answered: t("tickets.answered"),
    "On Hold": t("tickets.onHold"),
    Closed: t("tickets.closed"),
  };

  return (
    <div className="relative mx-auto max-w-[1400px] space-y-6">
      {state.notification && (
        <div
          className={`fixed top-6 right-6 z-50 flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-bold text-white shadow-lg ${
            state.notification.type === "success" ? "bg-[#059669]" : "bg-red-500"
          }`}
        >
          {state.notification.type === "success" ? <CheckCircle size={18} /> : <AlertTriangle size={18} />}
          {state.notification.message}
        </div>
      )}

      <div className="mb-6 flex items-center justify-between border-b border-slate-200 pb-px">
        <div className="flex space-x-1 overflow-x-auto">
          {SUPPORT_TICKET_LIST_TABS.map((tabName) => (
            <button
              key={tabName}
              onClick={() => state.setActiveTab(tabName)}
              className={`flex items-center gap-2 border-b-2 px-5 py-4 text-sm font-semibold whitespace-nowrap transition-colors ${
                state.activeTab === tabName
                  ? "border-[#059669] text-[#059669]"
                  : "border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700"
              }`}
            >
              {tabLabelMap[tabName]}
              <span
                className={`rounded-full bg-slate-100 px-2 py-0.5 text-xs ${
                  state.activeTab === tabName ? "text-[#059669]" : "text-slate-500"
                }`}
              >
                {state.counts[tabName] || 0}
              </span>
            </button>
          ))}
        </div>
        <Link
          href="/dashboard/support/tickets/new"
          className="mb-2 flex items-center gap-2 rounded-lg bg-[#059669] px-4 py-2 text-sm font-bold text-white shadow-sm transition-colors hover:bg-[#047857]"
        >
          <Plus size={16} strokeWidth={3} />
          {t("tickets.newTicket")}
        </Link>
      </div>

      <div className="flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col items-center justify-between gap-4 border-b border-slate-100 bg-slate-50/50 p-4 md:flex-row">
          <div className="relative flex w-full items-center gap-3 md:w-auto">
            <button
              onClick={() => state.setIsBulkMenuOpen(!state.isBulkMenuOpen)}
              className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 shadow-sm hover:bg-slate-50"
            >
              {t("tickets.bulkActions")}
              <span className="ml-2 text-xs text-slate-400">▼</span>
            </button>

            {state.isBulkMenuOpen && (
              <div className="absolute top-full left-0 z-20 mt-1.5 w-40 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
                <button
                  onClick={() => {
                    state.setIsBulkMenuOpen(false);
                    if (state.selectedTickets.length === 0) {
                      state.showNotification("Please select tickets first", "error");
                      return;
                    }
                    state.setIsModalOpen(true);
                  }}
                  className="w-full px-4 py-2.5 text-left text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
                >
                  {t("tickets.update")}
                </button>
              </div>
            )}

            <button className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 shadow-sm hover:bg-slate-50">
              <Download size={16} className="text-slate-400" />
              Export
            </button>
          </div>

          <div className="flex w-full items-center gap-3 md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search size={16} className="absolute top-1/2 left-3 h-6 w-6 -translate-y-1/2 rounded-sm bg-[#059669] p-1 text-white" />
              <input
                type="text"
                placeholder={t("tickets.searchPlaceholder")}
                value={state.searchQuery}
                onChange={(event) => state.setSearchQuery(event.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white py-2 pr-4 pl-11 text-sm font-medium text-slate-700 shadow-sm outline-none placeholder:font-normal placeholder:text-slate-400 focus:border-[#059669] focus:ring-2 focus:ring-[#059669]/20"
              />
            </div>

            <div className="relative">
              <button
                onClick={() => state.setIsDateMenuOpen(!state.isDateMenuOpen)}
                className="flex shrink-0 items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-[#059669] shadow-sm hover:bg-slate-50"
              >
                <Calendar size={16} />
                {t("tickets.dateRange")}
              </button>

              {state.isDateMenuOpen && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => state.setIsDateMenuOpen(false)} />
                  <div className="absolute top-full right-0 z-40 mt-2 w-[340px] rounded-2xl border border-slate-200 bg-white p-5 shadow-xl">
                    <div className="mb-6 grid grid-cols-2 gap-2">
                      {[
                        { label: "This Month", days: 30 },
                        { label: "Last 3 Months", days: 90 },
                        { label: "Last 6 Months", days: 180 },
                        { label: "Last Year", days: 365 },
                      ].map((preset) => (
                        <button
                          key={preset.label}
                          onClick={() => state.setTempDate(buildPresetDateRange(preset.days))}
                          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-50"
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>

                    <div className="mb-6 flex items-center gap-3">
                      <div className="flex-1">
                        <label className="mb-1 block text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                          Start
                        </label>
                        <input
                          type="date"
                          value={state.tempDate.start}
                          onChange={(event) =>
                            state.setTempDate({ ...state.tempDate, start: event.target.value })
                          }
                          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-600 outline-none focus:border-[#059669]"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="mb-1 block text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                          End
                        </label>
                        <input
                          type="date"
                          value={state.tempDate.end}
                          onChange={(event) =>
                            state.setTempDate({ ...state.tempDate, end: event.target.value })
                          }
                          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-600 outline-none focus:border-[#059669]"
                        />
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => {
                          state.setDateRange({ start: "", end: "" });
                          state.setTempDate({ start: "", end: "" });
                          state.setIsDateMenuOpen(false);
                        }}
                        className="flex-1 rounded-lg border border-red-200 bg-white py-2.5 text-sm font-bold text-red-500 transition-colors hover:bg-red-50"
                      >
                        Clear
                      </button>
                      <button
                        onClick={() => {
                          state.setDateRange(state.tempDate);
                          state.setIsDateMenuOpen(false);
                        }}
                        className="flex-1 rounded-lg bg-[#059669] py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#047857]"
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            <button className="flex shrink-0 items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-[#059669] shadow-sm hover:bg-slate-50">
              <Filter size={16} />
              Filters
            </button>
            <button
              onClick={() => void state.loadTickets()}
              className="shrink-0 rounded-lg border border-slate-200 bg-white p-2.5 text-slate-400 shadow-sm transition-all hover:bg-slate-50 hover:text-slate-600 active:scale-95"
            >
              <RefreshCcw size={16} className={state.isLoading ? "animate-spin" : ""} />
            </button>
          </div>
        </div>

        <div className="min-h-[400px] overflow-x-auto">
          <table className="w-full whitespace-nowrap">
            <thead>
              <tr className="border-b border-slate-100 bg-white text-left text-sm font-bold text-slate-700">
                <th className="w-10 px-6 py-4">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-slate-300 text-[#059669] focus:ring-[#059669]"
                    onChange={(event) => state.handleSelectAll(event.target.checked)}
                    checked={
                      state.filteredTickets.length > 0 &&
                      state.selectedTickets.length === state.filteredTickets.length
                    }
                  />
                </th>
                <th className="px-6 py-4">{t("tickets.subject")}</th>
                <th className="px-6 py-4 text-center">{t("tickets.status")}</th>
                <th className="px-6 py-4 text-center">{t("tickets.priority")}</th>
                <th className="px-6 py-4">{t("tickets.department")}</th>
                <th className="px-6 py-4">{t("tickets.contact")}</th>
                <th className="px-6 py-4 text-center">
                  {language === "id" ? "Dibuat" : language === "ar" ? "أُنشئت" : "Created"}
                </th>
                <th className="px-6 py-4 text-center">
                  {language === "id" ? "Balasan Terakhir" : language === "ar" ? "آخر رد" : "Last Reply"}
                </th>
                <th className="w-10 px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {state.isLoading ? (
                <tr>
                  <td colSpan={9} className="px-6 py-12 text-center font-medium text-slate-500">
                    <RefreshCcw className="mx-auto mb-2 animate-spin text-emerald-600" size={24} />
                    {language === "id"
                      ? "Memuat tiket dari sumber data..."
                      : language === "ar"
                        ? "تحميل التذاكر من مصدر البيانات..."
                        : "Loading tickets from data source..."}
                  </td>
                </tr>
              ) : state.filteredTickets.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-6 py-12 text-center font-medium text-slate-500">
                    {language === "id"
                      ? "Tidak ada tiket yang ditemukan sesuai kriteria Anda."
                      : language === "ar"
                        ? "لم يتم العثور على تذاكر تطابق معاييرك."
                        : "No tickets found matching your criteria."}
                  </td>
                </tr>
              ) : (
                state.filteredTickets.map((ticket, index) => {
                  const created = formatTicketDate(ticket.created_at);
                  const createdTitle = ticket.created_at
                    ? new Date(ticket.created_at).toLocaleString("en-US", {
                        timeZone: profile.timezone || "Asia/Jakarta",
                      })
                    : "";
                  const initial = ticket.contact_name ? ticket.contact_name.charAt(0).toUpperCase() : "?";
                  const isChecked = state.selectedTickets.includes(ticket.id);

                  return (
                    <tr
                      key={ticket.id}
                      onClick={(event) => {
                        const target = event.target as HTMLElement;
                        if (target.tagName.toLowerCase() === "input") {
                          return;
                        }

                        router.push(`/dashboard/support/tickets/${ticket.id}`);
                      }}
                      className={`cursor-pointer transition-colors ${
                        index % 2 === 0 ? "bg-white" : "bg-slate-50/40"
                      } ${isChecked ? "!bg-[#059669]/5" : "hover:bg-slate-50"}`}
                    >
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          className="h-4 w-4 rounded border-slate-300 text-[#059669] focus:ring-[#059669]"
                          checked={isChecked}
                          onChange={() => state.handleSelectTicket(ticket.id)}
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-[13px] font-bold text-slate-800">{ticket.subject}</span>
                          <span className="mt-0.5 text-[11px] font-bold text-slate-400">
                            {ticket.ticket_id_str ?? "-"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <TicketStatusPill status={ticket.status} labels={statusLabels} />
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`text-[13px] ${getPriorityTextClass(ticket.priority)}`}>
                          {ticket.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-[13px] font-bold text-slate-600">{ticket.department}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div
                            className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${getAvatarColorClass(initial)}`}
                          >
                            {initial}
                          </div>
                          <span className="text-[13px] font-semibold text-slate-700">
                            {ticket.contact_name ?? "-"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        {created ? (
                          <div className="flex flex-col items-center" title={createdTitle}>
                            <span className="text-[13px] font-semibold text-slate-600">{created.date}</span>
                            <span className="text-[11px] font-medium text-slate-400">-{created.time}</span>
                          </div>
                        ) : (
                          "-"
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {ticket.last_reply_at ? (
                          <span
                            className="cursor-help text-[13px] font-bold text-slate-500"
                            title={new Date(ticket.last_reply_at).toLocaleString("en-US", {
                              timeZone: profile.timezone || "Asia/Jakarta",
                            })}
                          >
                            {getRelativeTime(ticket.last_reply_at)}
                          </span>
                        ) : (
                          <span className="font-bold text-slate-400">-</span>
                        )}
                      </td>
                      <td className="cursor-pointer px-6 py-4 text-slate-400 hover:text-slate-600">
                        <MoreHorizontal size={18} />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {state.isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-xl">
            <div className="px-6 pt-6 pb-4">
              <h3 className="mb-4 text-xl font-bold text-slate-900">Bulk Actions</h3>

              <div className="flex rounded-lg bg-slate-100 p-1">
                <button
                  onClick={() => state.setModalTab("Update")}
                  className={`flex-1 rounded-md py-1.5 text-sm font-bold transition-colors ${
                    state.modalTab === "Update"
                      ? "bg-white text-slate-800 shadow-sm"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  {t("tickets.update")}
                </button>
                <button
                  onClick={() => state.setModalTab("Delete")}
                  className={`flex-1 rounded-md py-1.5 text-sm font-bold transition-colors ${
                    state.modalTab === "Delete"
                      ? "bg-red-50 text-red-600 shadow-sm"
                      : "text-red-400 hover:text-red-600"
                  }`}
                >
                  {t("tickets.delete")}
                </button>
              </div>
            </div>

            {state.modalTab === "Update" ? (
              <div className="space-y-4 px-6 pb-6">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold tracking-widest text-slate-500 uppercase">
                    {t("tickets.status")}
                  </label>
                  <SupportTicketSelect
                    value={state.updateStatus}
                    onChange={state.setUpdateStatus}
                    options={["No Change", ...SUPPORT_TICKET_STATUSES]}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold tracking-widest text-slate-500 uppercase">
                    {t("tickets.department")}
                  </label>
                  <SupportTicketSelect
                    value={state.updateDepartment}
                    onChange={state.setUpdateDepartment}
                    options={["No Change", ...SUPPORT_TICKET_DEPARTMENTS]}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold tracking-widest text-slate-500 uppercase">
                    {t("tickets.priority")}
                  </label>
                  <SupportTicketSelect
                    value={state.updatePriority}
                    onChange={state.setUpdatePriority}
                    options={["No Change", ...SUPPORT_TICKET_PRIORITIES]}
                  />
                </div>
              </div>
            ) : (
              <div className="m-6 mt-0 flex flex-col items-center rounded-xl border border-red-100 bg-red-50/50 px-6 py-8 text-center">
                <AlertCircle size={40} className="mb-3 text-red-500" />
                <h4 className="mb-1 font-bold text-red-600">
                  Warning: You are about to delete {state.selectedTickets.length} tickets!
                </h4>
                <p className="text-xs font-semibold text-red-400">This action cannot be undone.</p>
              </div>
            )}

            <div className="mt-4 flex items-center justify-between gap-3 rounded-b-2xl border-t border-slate-100 bg-slate-50 px-6 py-4">
              <button
                onClick={() => state.setIsModalOpen(false)}
                className="flex-1 rounded-lg border border-slate-200 bg-white py-2.5 text-sm font-bold text-slate-700 shadow-sm transition-colors hover:bg-slate-100"
              >
                Cancel
              </button>

              <button
                onClick={() => void state.executeBulkAction()}
                className={`flex-1 rounded-lg py-2.5 text-sm font-bold text-white shadow-sm transition-colors ${
                  state.modalTab === "Update"
                    ? "bg-[#059669] hover:bg-[#047857]"
                    : "bg-red-600 hover:bg-red-700"
                }`}
              >
                {state.modalTab === "Update" ? "Update" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
