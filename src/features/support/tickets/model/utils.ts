import type { DateRange, SupportTicketSummary, TicketListTab } from "./types";

export function generateTicketIdStr() {
  return Math.random().toString(36).substring(2, 10).toUpperCase();
}

export function buildPresetDateRange(days: number): DateRange {
  const end = new Date();
  const start = new Date();
  start.setDate(end.getDate() - days);

  return {
    start: start.toISOString().split("T")[0],
    end: end.toISOString().split("T")[0],
  };
}

export function formatTicketDate(dateStr: string | null) {
  if (!dateStr) {
    return null;
  }

  const date = new Date(dateStr);
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const dd = String(date.getDate()).padStart(2, "0");
  const mmm = months[date.getMonth()];
  const yyyy = date.getFullYear();
  const hh = String(date.getHours()).padStart(2, "0");
  const min = String(date.getMinutes()).padStart(2, "0");

  return {
    date: `${mmm} ${dd}, ${yyyy}`,
    time: `${hh}:${min}`,
  };
}

export function getRelativeTime(dateStr: string | null) {
  if (!dateStr) {
    return null;
  }

  const date = new Date(dateStr);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes === 1) return "a minute ago";
  if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours === 1) return "an hour ago";
  if (diffInHours < 24) return `${diffInHours} hours ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays === 1) return "a day ago";
  if (diffInDays < 7) return `${diffInDays} days ago`;
  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks === 1) return "a week ago";
  if (diffInWeeks < 4) return `${diffInWeeks} weeks ago`;
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths === 1) return "a month ago";
  return `${diffInMonths} months ago`;
}

export function getPriorityTextClass(priority: string) {
  if (priority === "High") return "text-red-500 font-bold";
  if (priority === "Medium") return "text-amber-500 font-bold";
  return "text-slate-400 font-bold";
}

export function getAvatarColorClass(char: string) {
  if (["V", "M", "F"].includes(char)) return "bg-emerald-100 text-[#059669]";
  if (["A", "K", "U"].includes(char)) return "bg-teal-100 text-teal-700";
  return "bg-green-100 text-green-700";
}

export function filterSupportTickets(
  tickets: SupportTicketSummary[],
  activeTab: TicketListTab,
  searchQuery: string,
  dateRange: DateRange,
) {
  let filtered = activeTab === "All" ? tickets : tickets.filter((ticket) => ticket.status === activeTab);

  if (searchQuery.trim() !== "") {
    const normalizedQuery = searchQuery.toLowerCase();
    filtered = filtered.filter((ticket) => {
      return (
        ticket.subject.toLowerCase().includes(normalizedQuery) ||
        ticket.ticket_id_str?.toLowerCase().includes(normalizedQuery)
      );
    });
  }

  if (dateRange.start && dateRange.end) {
    const startMs = new Date(dateRange.start).getTime();
    const endMs = new Date(dateRange.end).getTime() + 86400000;
    filtered = filtered.filter((ticket) => {
      if (!ticket.created_at) {
        return false;
      }

      const ticketTime = new Date(ticket.created_at).getTime();
      return ticketTime >= startMs && ticketTime <= endMs;
    });
  }

  return filtered;
}

export function formatTicketDateTime(dateStr: string | null, locale = "en-US", timezone = "Asia/Jakarta") {
  if (!dateStr) {
    return "-";
  }

  return new Date(dateStr).toLocaleString(locale, {
    timeZone: timezone,
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
