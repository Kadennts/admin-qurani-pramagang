export type TicketStatus = "Open" | "In Progress" | "Answered" | "On Hold" | "Closed";

export type TicketPriority = "Low" | "Medium" | "High";

export type TicketListTab = "All" | TicketStatus;

export type BulkModalTab = "Update" | "Delete";

export type DateRange = {
  start: string;
  end: string;
};

export type SupportTicketSummary = {
  id: string;
  ticket_id_str: string | null;
  subject: string;
  status: TicketStatus | string;
  priority: TicketPriority | string;
  department: string;
  contact_name: string | null;
  created_at: string | null;
  last_reply_at: string | null;
};

export type SupportTicketDetail = SupportTicketSummary & {
  description?: string | null;
  tags?: string | null;
  email?: string | null;
};

export type TicketReply = {
  id: string;
  author: string;
  created_at: string;
  text: string;
  attachments: File[];
};

export type TicketNote = {
  id: string;
  author: string;
  created_at: string;
  text: string;
};

export type TicketReminder = {
  id: string;
  title: string;
  datetime: string;
  staff: string;
  created_at: string;
};

export type TicketTask = {
  id: number;
  text: string;
  completed: boolean;
};

export type TicketBulkUpdateInput = Partial<{
  status: TicketStatus | string;
  department: string;
  priority: TicketPriority | string;
}>;

export type NewTicketFormData = {
  subject: string;
  tags: string;
  contact: string;
  assignee: string;
  name: string;
  email: string;
  priority: TicketPriority;
  service: string;
  department: string;
  cc: string;
  body: string;
};

export type TicketDetailBundle = {
  ticket: SupportTicketDetail | null;
  replies: TicketReply[];
  notes: TicketNote[];
  reminders: TicketReminder[];
  relatedTickets: SupportTicketSummary[];
};
