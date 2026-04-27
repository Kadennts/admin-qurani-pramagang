import type { BulkModalTab, DateRange, NewTicketFormData, TicketListTab, TicketPriority, TicketStatus } from "./types";

export const SUPPORT_TICKET_STATUSES: TicketStatus[] = [
  "Open",
  "In Progress",
  "Answered",
  "On Hold",
  "Closed",
];

export const SUPPORT_TICKET_PRIORITIES: TicketPriority[] = ["Low", "Medium", "High"];

export const SUPPORT_TICKET_LIST_TABS: TicketListTab[] = [
  "All",
  "Open",
  "In Progress",
  "Answered",
  "On Hold",
  "Closed",
];

export const SUPPORT_TICKET_DEPARTMENTS = [
  "Marketing",
  "Technical",
  "Product",
  "Engineering",
  "Data",
  "Audio",
  "Sales",
  "Support",
];

export const BULK_UPDATE_EMPTY_VALUE = "No Change";

export const BULK_MODAL_DEFAULT_TAB: BulkModalTab = "Update";

export const EMPTY_DATE_RANGE: DateRange = {
  start: "",
  end: "",
};

export const DEFAULT_NEW_TICKET_FORM: NewTicketFormData = {
  subject: "",
  tags: "",
  contact: "Nothing selected",
  assignee: "Nothing selected",
  name: "",
  email: "",
  priority: "Medium",
  service: "Nothing select",
  department: "Nothing selected",
  cc: "",
  body: "",
};

export const DEFAULT_CONTACT_OPTIONS = ["Nothing selected", "Amir", "Aisyah"];

export const DEFAULT_ASSIGNEE_OPTIONS = ["Nothing selected", "02_Alvia Agustin", "Alisha Zahra", "Ardi Ajalah"];

export const DEFAULT_SERVICE_OPTIONS = ["Nothing select", "Hosting", "Server"];

export const PREDEFINED_REPLY_OPTIONS = [
  "Thank you for contacting us. We will follow up on your report soon.",
  "We apologize for any inconvenience. Our team is working on this.",
  "Please try the following steps to resolve your issue.",
];

export const KNOWLEDGE_BASE_OPTIONS = [
  "KB: How to Reset Password",
  "KB: Memorization Feature FAQ",
  "KB: Sync Guide",
];
