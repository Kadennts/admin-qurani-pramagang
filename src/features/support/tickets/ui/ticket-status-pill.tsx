"use client";

import { AlertCircle, Clock, MessageSquare } from "lucide-react";

type TicketStatusPillProps = {
  status: string;
  labels: Record<string, string>;
};

export function TicketStatusPill({ status, labels }: TicketStatusPillProps) {
  switch (status) {
    case "Answered":
      return (
        <span className="inline-flex items-center gap-1.5 rounded border border-[#bfdbfe] bg-[#eff6ff] px-3 py-1 text-xs font-bold text-[#3b82f6]">
          <MessageSquare size={12} />
          {labels.Answered}
        </span>
      );
    case "Open":
      return (
        <span className="inline-flex items-center gap-1.5 rounded border border-[#fecaca] bg-[#fef2f2] px-3 py-1 text-xs font-bold text-[#ef4444]">
          <AlertCircle size={12} />
          {labels.Open}
        </span>
      );
    case "In Progress":
      return (
        <span className="inline-flex items-center gap-1.5 rounded border border-slate-200 bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
          <Clock size={12} />
          {labels["In Progress"]}
        </span>
      );
    case "On Hold":
      return (
        <span className="inline-flex items-center gap-1.5 rounded border border-slate-300 bg-slate-50 px-3 py-1 text-xs font-bold text-slate-600">
          <Clock size={12} />
          {labels["On Hold"]}
        </span>
      );
    case "Closed":
      return (
        <span className="inline-flex items-center gap-1.5 rounded border border-slate-200 bg-slate-100 px-3 py-1 text-xs font-bold text-slate-500">
          {labels.Closed}
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1.5 rounded bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
          {status}
        </span>
      );
  }
}
