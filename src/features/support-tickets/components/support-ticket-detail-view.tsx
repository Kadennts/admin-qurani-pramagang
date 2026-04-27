"use client";

import Link from "next/link";
import {
  AlignLeft,
  ArrowLeft,
  Bell,
  Check,
  CheckSquare,
  ChevronDown,
  Clock,
  FileText,
  GripVertical,
  Info,
  Layers,
  MessageSquare,
  Paperclip,
  Plus,
  Trash2,
  X,
  AlertCircle,
} from "lucide-react";
import type { AppProfile } from "@/components/providers/app-preferences-provider";

import { formatTicketDateTime } from "../utils";
import type { useSupportTicketDetail } from "../hooks/use-support-ticket-detail";

type SupportTicketDetailViewProps = {
  profile: AppProfile;
  ticketId: string;
  state: ReturnType<typeof useSupportTicketDetail>;
};

const TAB_ICONS = {
  add_reply: AlignLeft,
  notes: FileText,
  reminders: Bell,
  related: Layers,
  tasks: CheckSquare,
};

export function SupportTicketDetailView({ profile, ticketId, state }: SupportTicketDetailViewProps) {
  return (
    <div className="mx-auto max-w-[1400px] space-y-6">
      <div className="flex items-center gap-4 border-b border-slate-200 pb-6">
        <Link href="/dashboard/support/tickets" className="text-slate-500 transition-colors hover:text-slate-800">
          <ArrowLeft size={24} />
        </Link>
        {state.isLoading ? (
          <div className="h-8 flex-1 animate-pulse rounded-lg bg-slate-100" />
        ) : (
          <h1 className="flex flex-1 items-center gap-2 truncate text-xl font-bold text-slate-800 sm:gap-3 sm:text-2xl">
            <span className="truncate">
              {state.ticket?.ticket_id_str || `#${ticketId}`}
              <span className="hidden font-light text-slate-300 sm:inline"> | </span>
              <span className="hidden text-slate-700 sm:inline">{state.ticket?.subject}</span>
            </span>
          </h1>
        )}
        <button
          onClick={() => state.setIsMobileSidebarOpen(true)}
          className="ml-auto shrink-0 rounded-lg p-2 text-slate-500 transition-colors hover:bg-emerald-50 hover:text-emerald-600 lg:hidden"
        >
          <Info size={24} />
        </button>
      </div>

      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
        <div className="flex min-h-[500px] flex-col lg:col-span-8">
          <div className="mb-6 flex items-center gap-6 overflow-x-auto border-b border-slate-200">
            {state.tabs.map((tab) => {
              const isActive = state.activeTab === tab.id;
              const Icon = TAB_ICONS[tab.id as keyof typeof TAB_ICONS];

              return (
                <button
                  key={tab.id}
                  onClick={() => state.setActiveTab(tab.id)}
                  className={`flex items-center gap-2 border-b-2 px-1 py-4 text-sm font-bold whitespace-nowrap transition-all ${
                    isActive
                      ? "border-[#059669] text-[#059669]"
                      : "border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700"
                  }`}
                >
                  <Icon size={16} className={isActive ? "text-[#059669]" : "text-slate-400"} />
                  {tab.label}
                  {tab.badge !== null && tab.badge > 0 && (
                    <span className="ml-1 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-500">
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="flex-1">
            {state.activeTab === "add_reply" && (
              <div className="space-y-6">
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                  <div className="border-b border-slate-100 px-5 py-4 text-sm font-semibold text-slate-700">
                    Reply to Ticket
                  </div>

                  {state.notes.length > 0 && (
                    <div className="flex flex-col gap-1 border-b border-amber-100 bg-amber-50 px-5 py-3">
                      <span className="text-[11px] font-bold tracking-wider text-amber-800 uppercase">
                        Latest Note:
                      </span>
                      <p className="text-sm font-medium text-amber-900">{state.notes[0].text}</p>
                    </div>
                  )}

                  <textarea
                    value={state.replyText}
                    onChange={(event) => state.setReplyText(event.target.value)}
                    className="min-h-[140px] w-full resize-none p-5 text-sm text-slate-700 outline-none placeholder:text-slate-400"
                    placeholder="Enter your reply here..."
                  />
                  {state.attachments.length > 0 && (
                    <div className="flex flex-wrap gap-3 px-5 pb-3">
                      {state.attachments.map((file, index) => (
                        <div key={`${file.name}-${index}`} className="relative h-16 w-16 overflow-hidden rounded-xl border border-slate-200">
                          <img src={URL.createObjectURL(file)} alt="attachment" className="h-full w-full object-cover" />
                          <button
                            onClick={() => state.setAttachments(state.attachments.filter((_, itemIndex) => itemIndex !== index))}
                            className="absolute top-1 right-1 rounded-full bg-black/50 p-0.5 text-white hover:bg-black/70"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ))}
                      <label className="flex h-16 w-16 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 text-slate-400 hover:bg-slate-50">
                        <Plus size={16} />
                        <span className="mt-1 text-[10px] font-medium">Add</span>
                        <input
                          type="file"
                          multiple
                          className="hidden"
                          accept="image/*"
                          onChange={(event) => {
                            if (event.target.files) {
                              state.setAttachments([...state.attachments, ...Array.from(event.target.files)]);
                            }
                          }}
                        />
                      </label>
                    </div>
                  )}
                  <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50 px-5 py-3">
                    <label className="cursor-pointer rounded-lg p-2 text-slate-400 transition-colors hover:text-slate-700">
                      <Paperclip size={18} />
                      <input
                        type="file"
                        multiple
                        className="hidden"
                        accept="image/*"
                        onChange={(event) => {
                          if (event.target.files) {
                            state.setAttachments([...state.attachments, ...Array.from(event.target.files)]);
                          }
                        }}
                      />
                    </label>
                    {state.attachments.length > 0 && (
                      <span className="mr-auto ml-2 flex items-center gap-1 text-xs font-semibold text-slate-500">
                        <Paperclip size={12} /> {state.attachments.length} files
                      </span>
                    )}

                    <div className={`flex items-center gap-3 ${state.attachments.length === 0 ? "ml-auto" : ""}`}>
                      <div className="relative">
                        <select
                          value={state.replyStatus}
                          onChange={(event) => void state.handleStatusChange(event.target.value)}
                          className="appearance-none rounded-lg border border-slate-300 bg-white px-4 py-2 pr-10 text-sm font-semibold text-slate-700 outline-none hover:border-slate-400"
                        >
                          {state.supportedStatuses.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                        <ChevronDown size={14} className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-slate-500" />
                      </div>
                      <button
                        onClick={() => void state.handleReplySubmit()}
                        disabled={!state.replyText.trim() && state.attachments.length === 0}
                        className={`flex items-center gap-2 rounded-lg px-6 py-2 text-sm font-bold transition-colors ${
                          state.replyText.trim() || state.attachments.length > 0
                            ? "bg-[#059669] text-white hover:bg-[#047857]"
                            : "cursor-not-allowed bg-slate-200 text-slate-400"
                        }`}
                      >
                        <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" /></svg>
                        Reply
                      </button>
                    </div>
                  </div>
                </div>

                {state.replies.map((reply) => (
                  <div
                    key={reply.id}
                    className="flex flex-col items-start gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                  >
                    <div className="flex w-full items-center gap-3">
                      <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full border border-slate-200">
                        <img src="/img/profile admin.jpg" alt={reply.author} className="h-full w-full object-cover" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-800">
                          {reply.author} <span className="font-normal text-slate-500">replied</span>
                        </div>
                        <div className="mt-0.5 text-xs font-semibold text-slate-400">
                          {formatTicketDateTime(reply.created_at, "en-US", profile.timezone || "Asia/Jakarta")}
                        </div>
                      </div>
                    </div>
                    {reply.text && <p className="text-sm whitespace-pre-wrap text-slate-700">{reply.text}</p>}
                    {reply.attachments.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {reply.attachments.map((file, index) => (
                          <img
                            key={`${file.name}-${index}`}
                            src={URL.createObjectURL(file)}
                            className="h-20 w-20 rounded-xl border border-slate-200 object-cover"
                            alt="attachment"
                          />
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {state.activeTab === "notes" && (
              <div className="space-y-6">
                <div className="relative">
                  <textarea
                    value={state.newNoteText}
                    onChange={(event) => state.setNewNoteText(event.target.value)}
                    className="min-h-[120px] w-full rounded-2xl border border-slate-200 bg-white p-5 pr-16 text-sm text-slate-700 shadow-sm outline-none placeholder:text-slate-400 focus:border-[#059669]/30"
                    placeholder="Add an internal note..."
                  />
                  <button
                    onClick={() => void state.addNote()}
                    className="absolute top-1/2 right-4 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-xl bg-slate-100 text-slate-500 transition-colors hover:bg-slate-200"
                  >
                    <Plus size={20} />
                  </button>
                </div>

                {state.notes.length === 0 ? (
                  <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 py-8 text-center text-sm italic text-slate-400">
                    No internal notes added yet.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {state.notes.map((note) => (
                      <div
                        key={note.id}
                        className="rounded-2xl border border-amber-200 bg-amber-50 p-5 transition-colors hover:bg-amber-100/50"
                      >
                        <div className="mb-3 flex items-center justify-between">
                          <span className="text-sm font-bold text-amber-900">{note.author}</span>
                          <span className="text-xs font-semibold text-amber-700/60">
                            {formatTicketDateTime(note.created_at, "en-GB", profile.timezone || "Asia/Jakarta").replace(",", "")}
                          </span>
                        </div>
                        <div className="text-sm font-medium whitespace-pre-wrap text-amber-900">{note.text}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {state.activeTab === "reminders" && (
              <div className="space-y-6">
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h3 className="mb-6 font-bold text-slate-800">Add Reminder</h3>
                  <div className="space-y-4">
                    <input
                      type="text"
                      placeholder="Reminder title..."
                      value={state.reminderTitle}
                      onChange={(event) => state.setReminderTitle(event.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm outline-none transition-colors focus:border-[#059669]/50"
                    />
                    <div className="flex flex-col gap-4 sm:flex-row">
                      <input
                        type="datetime-local"
                        value={state.reminderDatetime}
                        onChange={(event) => state.setReminderDatetime(event.target.value)}
                        className="flex-1 rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-600 outline-none transition-colors focus:border-[#059669]/50"
                      />
                      <input
                        type="text"
                        placeholder="Staff..."
                        value={state.reminderStaff}
                        onChange={(event) => state.setReminderStaff(event.target.value)}
                        className="flex-1 rounded-xl border border-slate-200 bg-white p-3 text-sm outline-none transition-colors focus:border-[#059669]/50"
                      />
                    </div>
                    <button
                      onClick={() => void state.addReminder()}
                      className="w-full rounded-xl bg-[#059669] py-3.5 font-bold text-white shadow-sm transition-colors hover:bg-[#047857]"
                    >
                      Create Reminder
                    </button>
                  </div>
                </div>

                {state.reminders.length === 0 ? (
                  <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 py-8 text-center text-sm italic text-slate-400">
                    No reminders yet.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {state.reminders.map((reminder) => (
                      <div
                        key={reminder.id}
                        className="group flex items-start justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
                      >
                        <div className="flex items-start gap-4">
                          <div className="mt-1 text-slate-400"><Bell size={20} /></div>
                          <div>
                            <h4 className="text-sm font-bold text-slate-800">{reminder.title}</h4>
                            <p className="mt-1 text-xs text-slate-500">
                              {reminder.datetime
                                ? formatTicketDateTime(reminder.datetime, "id-ID", profile.timezone || "Asia/Jakarta")
                                : formatTicketDateTime(reminder.created_at, "id-ID", profile.timezone || "Asia/Jakarta")}
                              {reminder.staff ? ` • ${reminder.staff}` : ""}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => void state.removeReminder(reminder.id)}
                          className="rounded-lg bg-slate-50 p-1.5 text-slate-300 transition-colors hover:bg-red-50 hover:text-red-500"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {state.activeTab === "related" && (
              <div className="space-y-4">
                <div className="flex items-center gap-3 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
                  <AlertCircle size={18} className="text-emerald-600" />
                  Menampilkan tiket lain dengan Department ({state.ticket?.department}) atau Contact ({state.ticket?.contact_name}) yang sama.
                </div>
                {state.relatedTickets.length === 0 ? (
                  <div className="flex items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 py-12 text-sm font-medium text-slate-400">
                    No related tickets found.
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {state.relatedTickets.map((relatedTicket) => (
                      <Link
                        href={`/dashboard/support/tickets/${relatedTicket.id}`}
                        key={relatedTicket.id}
                        className="group block rounded-2xl border border-slate-200 bg-white p-5 transition-all hover:border-emerald-500 hover:shadow-md"
                      >
                        <div className="mb-2 flex items-start justify-between">
                          <h4 className="font-bold text-slate-800 transition-colors group-hover:text-emerald-600">
                            {relatedTicket.subject}
                          </h4>
                          <span className="rounded-full border bg-slate-50 px-2.5 py-1 text-xs font-bold text-slate-600">
                            {relatedTicket.status}
                          </span>
                        </div>
                        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-500">
                          <div className="flex items-center gap-1.5">
                            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-[10px] font-bold text-emerald-600 uppercase">
                              {relatedTicket.contact_name?.charAt(0) || "?"}
                            </span>
                            {relatedTicket.contact_name}
                          </div>
                          <div className="flex items-center gap-1.5 font-semibold tracking-wider text-slate-600 uppercase">
                            {relatedTicket.department}
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Clock size={12} />
                            {formatTicketDateTime(relatedTicket.created_at, "id-ID", profile.timezone || "Asia/Jakarta")}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}

            {state.activeTab === "tasks" && (
              <div className="space-y-4">
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={state.newTask}
                    onChange={(event) => state.setNewTask(event.target.value)}
                    onKeyDown={(event) => event.key === "Enter" && state.addTask()}
                    placeholder="New task..."
                    className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm shadow-sm outline-none transition-colors focus:border-[#059669]/50"
                  />
                  <button
                    onClick={state.addTask}
                    className="flex w-12 shrink-0 items-center justify-center rounded-xl bg-[#059669] text-white shadow-sm transition-colors hover:bg-[#047857]"
                  >
                    <Plus size={20} />
                  </button>
                </div>

                <div className="space-y-2">
                  {state.tasks.map((task) => (
                    <div
                      key={task.id}
                      className="group flex cursor-pointer flex-col items-center rounded-xl border border-slate-200 bg-white px-4 py-3.5 shadow-sm transition-all hover:border-[#059669]/30 sm:flex-row"
                      onClick={() => state.toggleTask(task.id)}
                    >
                      <div className="flex w-full flex-1 items-center gap-4">
                        <GripVertical size={16} className="hidden text-slate-300 sm:block" />
                        <div
                          className={`flex h-5 w-5 shrink-0 items-center justify-center overflow-hidden rounded border transition-all ${
                            task.completed ? "border-[#059669] bg-[#059669]" : "border-slate-300 bg-white"
                          }`}
                        >
                          {task.completed && <Check size={14} className="text-white" strokeWidth={3} />}
                        </div>
                        <span
                          className={`select-none text-sm font-medium transition-all ${
                            task.completed ? "text-slate-400 line-through" : "text-slate-700"
                          }`}
                        >
                          {task.text}
                        </span>
                      </div>
                      <div className="mt-3 ml-auto flex w-full justify-end transition-opacity sm:mt-0 sm:w-auto sm:opacity-0 group-hover:opacity-100">
                        <button
                          onClick={(event) => {
                            event.stopPropagation();
                            state.deleteTask(task.id);
                          }}
                          className="rounded-lg bg-slate-50 p-2 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-500"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                  {state.tasks.length === 0 && (
                    <div className="py-8 text-center text-sm italic text-slate-400">No tasks added yet.</div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {state.isMobileSidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden"
            onClick={() => state.setIsMobileSidebarOpen(false)}
          />
        )}

        <div
          className={`self-start space-y-6 lg:sticky lg:top-8 lg:col-span-4 ${
            state.isMobileSidebarOpen
              ? "fixed inset-y-0 right-0 z-50 block w-[85%] max-w-[340px] overflow-y-auto bg-white p-6 shadow-2xl"
              : "hidden lg:block"
          }`}
        >
          {state.isMobileSidebarOpen && (
            <div className="mb-6 flex items-center justify-between border-b border-slate-100 pb-4 lg:hidden">
              <h3 className="flex items-center gap-2 font-bold text-slate-800">
                <Info size={18} className="text-emerald-600" /> Ticket Details
              </h3>
              <button
                onClick={() => state.setIsMobileSidebarOpen(false)}
                className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
              >
                <X size={20} />
              </button>
            </div>
          )}

          <div>
            <h4 className="mb-2 text-xs font-bold tracking-wider text-slate-400">STATUS</h4>
            <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white p-1 shadow-sm">
              <div className="flex-1 rounded-lg border border-slate-200 bg-slate-100 px-3 py-2 text-sm font-bold text-slate-700">
                {state.ticket?.status || "Open"}
              </div>
            </div>
          </div>

          <div>
            <h4 className="mb-2 text-xs font-bold tracking-wider text-slate-400">PRIORITY</h4>
            <div className="flex items-center rounded-xl border border-slate-200/60 bg-slate-100/80 p-1 shadow-inner">
              {["Low", "Medium", "High"].map((priority) => (
                <button
                  key={priority}
                  onClick={() => void state.handlePriorityChange(priority)}
                  className={`flex-1 rounded-lg py-2 text-sm transition-colors ${
                    state.ticket?.priority === priority
                      ? "bg-white font-bold text-slate-900 shadow-sm"
                      : "font-semibold text-slate-500 hover:text-slate-700"
                  }`}
                >
                  {priority}
                </button>
              ))}
            </div>
          </div>

          <div className="my-6 border-b border-slate-200" />

          <div>
            <h4 className="mb-4 text-xs font-bold tracking-wider text-slate-400">DETAILS</h4>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Department</span>
                <span className="font-bold text-slate-800">{state.ticket?.department || "TECHNICAL"}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Contact</span>
                <span className="font-medium text-slate-800">{state.ticket?.contact_name || "-"}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Created</span>
                <span className="font-medium text-slate-800">
                  {formatTicketDateTime(state.ticket?.created_at ?? null, "en-US", profile.timezone || "Asia/Jakarta")}
                </span>
              </div>
            </div>
          </div>

          <div className="my-6 border-b border-slate-200" />

          <div>
            <h4 className="mb-3 text-xs font-bold tracking-wider text-slate-400">TAGS</h4>
            <div className="flex flex-wrap gap-2">
              {(state.ticket?.tags?.split(",").map((item) => item.trim()).filter(Boolean) ?? ["#support", "#bug"]).map((tag) => (
                <span
                  key={tag}
                  className="rounded-md border border-slate-200 bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-600"
                >
                  {tag.startsWith("#") ? tag : `#${tag}`}
                </span>
              ))}
            </div>
          </div>

          <div className="my-6 border-b border-slate-200" />

          <div>
            <h4 className="mb-2 text-xs font-bold tracking-wider text-slate-400">ASSIGNEE</h4>
            <div className="relative">
              <select className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-500 shadow-sm outline-none transition-colors hover:border-slate-300">
                <option>Unassigned</option>
                <option>Admin Qurani</option>
              </select>
              <ChevronDown size={16} className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-slate-400" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
