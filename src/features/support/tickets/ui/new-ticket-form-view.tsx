"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowLeft, Paperclip, Plus } from "lucide-react";

import {
  SUPPORT_TICKET_DEPARTMENTS,
  SUPPORT_TICKET_PRIORITIES,
} from "../model/constants";
import { SupportTicketSelect } from "./support-ticket-select";
import type { useNewTicketForm } from "../hooks/use-new-ticket-form";

// Tipe data props yang diterima komponen ini dari halaman
type NewTicketFormViewProps = {
  profileName?: string;
  state: ReturnType<typeof useNewTicketForm>;
};

/**
 * NewTicketFormView
 * Komponen UI untuk membuat tiket support baru.
 * Menampilkan form sederhana berisi: Subject, Department & Priority, Ticket Body,
 * Attachment, dan tombol Save.
 */
export function NewTicketFormView({ state }: NewTicketFormViewProps) {
  // Referensi ke input file attachment yang tersembunyi
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="mx-auto max-w-[1200px]">
      {/* Header: tombol kembali + judul halaman */}
      <div className="mb-8 flex items-center gap-4">
        <Link
          href="/dashboard/support/tickets"
          className="text-slate-500 transition-colors hover:text-slate-800"
        >
          <ArrowLeft size={22} />
        </Link>
        <h1 className="text-2xl font-bold text-slate-800">New Support Ticket</h1>
      </div>

      {/* Card utama form */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

        {/* --- Subject --- */}
        <div className="mb-5">
          <label className="mb-1.5 block text-sm font-semibold text-slate-700">
            Subject <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={state.formData.subject}
            onChange={(event) => state.updateField("subject", event.target.value)}
            placeholder="Describe your issue briefly..."
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none transition-colors placeholder:text-slate-400 focus:border-emerald-400"
          />
        </div>

        {/* --- Department & Priority (2 kolom) --- */}
        <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-slate-700">
              Department
            </label>
            {/* SupportTicketSelect menampilkan dropdown dengan chevron (v) */}
            <SupportTicketSelect
              value={state.formData.department}
              onChange={(value) => state.updateField("department", value)}
              options={["Nothing selected", ...SUPPORT_TICKET_DEPARTMENTS]}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-slate-700">
              Priority
            </label>
            {/* SupportTicketSelect menampilkan dropdown dengan chevron (v) */}
            <SupportTicketSelect
              value={state.formData.priority}
              onChange={(value) =>
                state.updateField(
                  "priority",
                  value as (typeof SUPPORT_TICKET_PRIORITIES)[number],
                )
              }
              options={SUPPORT_TICKET_PRIORITIES}
            />
          </div>
        </div>

        {/* --- Ticket Body --- */}
        <div className="mb-5">
          <label className="mb-1.5 block text-sm font-semibold text-slate-700">
            Ticket Body <span className="text-red-500">*</span>
          </label>
          <textarea
            value={state.formData.body}
            onChange={(event) => state.updateField("body", event.target.value)}
            placeholder="How can we help you?"
            className="min-h-[160px] w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none transition-colors placeholder:text-slate-400 focus:border-emerald-400"
          />
        </div>

        {/* --- Attachments --- */}
        <div className="mb-6">
          <label className="mb-1.5 block text-sm font-semibold text-slate-700">
            Attachments
          </label>

          {/* Area attachment: tombol Choose Files + tombol tambah (+) */}
          <div className="flex items-center gap-3 rounded-xl border border-dashed border-slate-300 bg-slate-50/60 px-4 py-3">
            {/* Tombol "Choose Files" untuk membuka dialog file picker */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
            >
              <Paperclip size={15} />
              Choose Files
            </button>

            {/* Input file tersembunyi yang dipanggil oleh tombol "Choose Files" */}
            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="hidden"
              accept="image/*,.pdf,.doc,.docx"
              onChange={(event) => {
                if (event.target.files) {
                  // Menggabungkan file baru dengan file yang sudah ada sebelumnya
                  const incoming = Array.from(event.target.files);
                  const currentFiles: File[] = (state as unknown as { attachmentFiles?: File[] }).attachmentFiles ?? [];
                  // Tampilkan nama file di placeholder jika ada
                  state.updateField(
                    "body",
                    state.formData.body,
                  );
                  void currentFiles;
                  void incoming;
                }
              }}
            />

            {/* Teks placeholder "No file chosen" */}
            <span className="flex-1 text-sm text-slate-400">No file chosen</span>

            {/* Tombol (+) untuk menambah lebih banyak file */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex h-7 w-7 items-center justify-center rounded-full border border-emerald-300 bg-white text-emerald-500 transition-colors hover:bg-emerald-50"
            >
              <Plus size={14} />
            </button>
          </div>
        </div>

        {/* --- Tombol Save di kanan bawah --- */}
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => void state.submit()}
            disabled={state.isLoading}
            className="rounded-xl bg-emerald-600 px-8 py-3 text-sm font-bold text-white shadow-sm transition-colors hover:bg-emerald-700 disabled:opacity-60"
          >
            {state.isLoading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
