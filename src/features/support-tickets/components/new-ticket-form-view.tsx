"use client";

import Link from "next/link";
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  ArrowLeft,
  Bold,
  ImageIcon,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Mail,
  Paperclip,
  Plus,
  Undo,
} from "lucide-react";

import { KNOWLEDGE_BASE_OPTIONS, PREDEFINED_REPLY_OPTIONS, SUPPORT_TICKET_DEPARTMENTS, SUPPORT_TICKET_PRIORITIES } from "../constants";
import { SupportTicketSelect } from "./support-ticket-select";
import type { useNewTicketForm } from "../hooks/use-new-ticket-form";

type NewTicketFormViewProps = {
  profileName?: string;
  state: ReturnType<typeof useNewTicketForm>;
};

export function NewTicketFormView({ profileName, state }: NewTicketFormViewProps) {
  return (
    <div className="mb-10 flex min-h-[85vh] max-w-[1200px] flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
      <div className="flex items-center gap-4 border-b border-slate-100 px-8 py-6">
        <Link href="/dashboard/support/tickets" className="text-slate-500 transition-colors hover:text-slate-800">
          <ArrowLeft size={24} />
        </Link>
        <h1 className="flex items-center gap-3 text-xl font-bold text-slate-800">
          Ticket Information
          <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-400">
            <Mail size={16} className="text-[#059669]" /> Ticket without contact
          </span>
        </h1>
      </div>

      <div className="flex-1 space-y-6 overflow-y-auto p-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
          <div className="flex flex-col gap-2 md:col-span-8">
            <label className="text-sm font-semibold text-slate-700">Subject</label>
            <input
              type="text"
              value={state.formData.subject}
              onChange={(event) => state.updateField("subject", event.target.value)}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm transition-colors outline-none focus:border-[#059669]/50"
            />
          </div>
          <div className="flex flex-col gap-2 md:col-span-4">
            <label className="flex items-center gap-1 text-sm font-semibold text-slate-700">
              <span className="h-1.5 w-1.5 rounded-full bg-[#059669]"></span> Tags
            </label>
            <input
              type="text"
              placeholder="Tag"
              value={state.formData.tags}
              onChange={(event) => state.updateField("tags", event.target.value)}
              className="w-full rounded-xl border border-transparent bg-transparent px-4 py-3 text-sm outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
          <div className="flex flex-col gap-2 md:col-span-8">
            <label className="text-sm font-semibold text-slate-700">Contact</label>
            <SupportTicketSelect
              value={state.formData.contact}
              onChange={(value) => state.updateField("contact", value)}
              options={state.contactOptions}
            />
          </div>
          <div className="flex flex-col gap-2 md:col-span-4">
            <label className="text-sm font-semibold text-slate-700">Assign ticket (default is current user)</label>
            <SupportTicketSelect
              value={state.formData.assignee}
              onChange={(value) => state.updateField("assignee", value)}
              options={state.assigneeOptions}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
          <div className="flex flex-col gap-2 md:col-span-4">
            <label className="text-sm font-semibold text-slate-700">Name</label>
            <input
              type="text"
              value={state.formData.name}
              onChange={(event) => state.updateField("name", event.target.value)}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm transition-colors outline-none focus:border-[#059669]/50"
            />
          </div>
          <div className="flex flex-col gap-2 md:col-span-4">
            <label className="text-sm font-semibold text-slate-700">Email address</label>
            <input
              type="email"
              value={state.formData.email}
              onChange={(event) => state.updateField("email", event.target.value)}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm transition-colors outline-none focus:border-[#059669]/50"
            />
          </div>
          <div className="flex flex-col gap-2 md:col-span-2">
            <label className="text-sm font-semibold text-slate-700">Priority</label>
            <SupportTicketSelect
              value={state.formData.priority}
              onChange={(value) => state.updateField("priority", value as (typeof SUPPORT_TICKET_PRIORITIES)[number])}
              options={SUPPORT_TICKET_PRIORITIES}
            />
          </div>
          <div className="flex flex-col gap-2 md:col-span-2">
            <label className="text-sm font-semibold text-slate-700">Service</label>
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <SupportTicketSelect
                  value={state.formData.service}
                  onChange={(value) => state.updateField("service", value)}
                  options={state.serviceOptions}
                />
              </div>
              <button className="flex h-[46px] w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500 transition-colors hover:bg-slate-200">
                <Plus size={18} />
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
          <div className="flex flex-col gap-2 md:col-span-6">
            <label className="text-sm font-semibold text-slate-700">Department</label>
            <SupportTicketSelect
              value={state.formData.department}
              onChange={(value) => state.updateField("department", value)}
              options={["Nothing selected", ...SUPPORT_TICKET_DEPARTMENTS]}
            />
          </div>
          <div className="flex flex-col gap-2 md:col-span-6">
            <label className="text-sm font-semibold text-slate-700">CC</label>
            <input
              type="text"
              value={state.formData.cc}
              onChange={(event) => state.updateField("cc", event.target.value)}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm transition-colors outline-none focus:border-[#059669]/50"
            />
          </div>
        </div>

        <div className="my-6 border-t border-slate-100"></div>

        <div className="space-y-4">
          <label className="flex items-center gap-1 text-sm font-bold text-slate-800">
            Ticket Body <span className="text-red-500">*</span>
          </label>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="relative">
              <select
                defaultValue=""
                onChange={(event) => {
                  state.appendToBody(event.target.value);
                  event.target.value = "";
                }}
                className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50/50 bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2214%22%20height%3D%2214%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2394a3b8%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[length:14px_14px] bg-[position:right_16px_center] bg-no-repeat px-4 py-3 text-sm text-slate-600 shadow-sm outline-none transition-colors hover:bg-slate-50"
              >
                <option value="" disabled hidden>
                  Insert predefined reply
                </option>
                {PREDEFINED_REPLY_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            <div className="relative">
              <select
                defaultValue=""
                onChange={(event) => {
                  state.appendToBody(event.target.value, "\n");
                  event.target.value = "";
                }}
                className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50/50 bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2214%22%20height%3D%2214%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2394a3b8%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[length:14px_14px] bg-[position:right_16px_center] bg-no-repeat px-4 py-3 text-sm text-slate-600 shadow-sm outline-none transition-colors hover:bg-slate-50"
              >
                <option value="" disabled hidden>
                  Insert knowledge base link
                </option>
                {KNOWLEDGE_BASE_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-col overflow-hidden rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-1 overflow-x-auto border-b border-slate-200 bg-slate-50/50 p-2">
              <button className="rounded p-2 text-slate-500 hover:bg-slate-200"><Bold size={16} /></button>
              <button className="rounded p-2 text-slate-500 hover:bg-slate-200"><Italic size={16} /></button>
              <div className="mx-1 h-5 w-px bg-slate-300"></div>
              <button className="rounded p-2 text-slate-500 hover:bg-slate-200"><AlignLeft size={16} /></button>
              <button className="rounded p-2 text-slate-500 hover:bg-slate-200"><AlignCenter size={16} /></button>
              <button className="rounded p-2 text-slate-500 hover:bg-slate-200"><AlignRight size={16} /></button>
              <button className="rounded p-2 text-slate-500 hover:bg-slate-200"><AlignJustify size={16} /></button>
              <div className="mx-1 h-5 w-px bg-slate-300"></div>
              <button className="rounded p-2 text-slate-500 hover:bg-slate-200"><ImageIcon size={16} /></button>
              <button className="rounded p-2 text-slate-500 hover:bg-slate-200"><LinkIcon size={16} /></button>
              <button className="rounded p-2 text-slate-500 hover:bg-slate-200"><List size={16} /></button>
              <button className="rounded p-2 text-slate-500 hover:bg-slate-200"><ListOrdered size={16} /></button>
              <div className="mx-1 h-5 w-px bg-slate-300"></div>
              <button className="rounded p-2 text-slate-500 hover:bg-slate-200"><Undo size={16} /></button>
            </div>
            <textarea
              value={state.formData.body}
              onChange={(event) => state.updateField("body", event.target.value)}
              className="min-h-[220px] w-full resize-none p-5 text-sm text-slate-700 outline-none"
              placeholder="Write ticket body here..."
            />
          </div>

          <div className="mt-6 flex items-center justify-between">
            <button className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-600 shadow-sm transition-colors hover:bg-slate-100">
              <Paperclip size={16} /> Attach File
            </button>
            <button
              onClick={() => void state.submit()}
              disabled={state.isLoading}
              className="rounded-lg bg-[#059669] px-6 py-2.5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-[#047857] disabled:opacity-50"
            >
              {state.isLoading ? "Opening..." : "Open Ticket"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
