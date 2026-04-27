import type { createClient } from "@/utils/supabase/client";

import { generateTicketIdStr } from "./utils";
import type {
  NewTicketFormData,
  SupportTicketDetail,
  SupportTicketSummary,
  TicketBulkUpdateInput,
  TicketDetailBundle,
  TicketNote,
  TicketPriority,
  TicketReminder,
  TicketReply,
  TicketStatus,
} from "./types";

type SupportSupabaseClient = ReturnType<typeof createClient>;

const SUPPORT_TICKET_LIST_SELECT =
  "id, ticket_id_str, subject, status, priority, department, contact_name, created_at, last_reply_at";

const SUPPORT_TICKET_DETAIL_SELECT = SUPPORT_TICKET_LIST_SELECT;

export async function fetchSupportTickets(client: SupportSupabaseClient) {
  const { data, error } = await client
    .from("support_tickets")
    .select(SUPPORT_TICKET_LIST_SELECT)
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return (data ?? []) as SupportTicketSummary[];
}

export async function bulkUpdateSupportTickets(
  client: SupportSupabaseClient,
  ticketIds: string[],
  updates: TicketBulkUpdateInput,
) {
  if (ticketIds.length === 0 || Object.keys(updates).length === 0) {
    return;
  }

  const { error } = await client.from("support_tickets").update(updates).in("id", ticketIds);

  if (error) {
    throw error;
  }
}

export async function deleteSupportTickets(client: SupportSupabaseClient, ticketIds: string[]) {
  if (ticketIds.length === 0) {
    return;
  }

  const { error } = await client.from("support_tickets").delete().in("id", ticketIds);

  if (error) {
    throw error;
  }
}

export async function fetchSupportTicketDetail(client: SupportSupabaseClient, ticketId: string): Promise<TicketDetailBundle> {
  const { data: ticket, error: ticketError } = await client
    .from("support_tickets")
    .select(SUPPORT_TICKET_DETAIL_SELECT)
    .eq("id", ticketId)
    .single();

  if (ticketError) {
    throw ticketError;
  }

  const [repliesResult, notesResult, remindersResult, relatedResult] = await Promise.all([
    client.from("ticket_replies").select("*").eq("ticket_id", ticketId).order("created_at", { ascending: false }),
    client.from("ticket_notes").select("*").eq("ticket_id", ticketId).order("created_at", { ascending: false }),
    client.from("ticket_reminders").select("*").eq("ticket_id", ticketId).order("created_at", { ascending: false }),
    ticket
      ? client
          .from("support_tickets")
          .select(SUPPORT_TICKET_LIST_SELECT)
          .neq("id", ticketId)
          .or(`department.eq.${ticket.department},contact_name.eq.${ticket.contact_name}`)
          .order("created_at", { ascending: false })
          .limit(5)
      : Promise.resolve({ data: [], error: null }),
  ]);

  if (repliesResult.error) throw repliesResult.error;
  if (notesResult.error) throw notesResult.error;
  if (remindersResult.error) throw remindersResult.error;
  if (relatedResult.error) throw relatedResult.error;

  return {
    ticket: (ticket ?? null) as SupportTicketDetail | null,
    replies: ((repliesResult.data ?? []) as TicketReply[]).map((reply) => ({
      ...reply,
      attachments: [],
    })),
    notes: (notesResult.data ?? []) as TicketNote[],
    reminders: (remindersResult.data ?? []) as TicketReminder[],
    relatedTickets: (relatedResult.data ?? []) as SupportTicketSummary[],
  };
}

export async function updateSupportTicketStatus(
  client: SupportSupabaseClient,
  ticketId: string,
  status: TicketStatus | string,
) {
  const { error } = await client.from("support_tickets").update({ status }).eq("id", ticketId);

  if (error) {
    throw error;
  }
}

export async function updateSupportTicketPriority(
  client: SupportSupabaseClient,
  ticketId: string,
  priority: TicketPriority | string,
) {
  const { error } = await client.from("support_tickets").update({ priority }).eq("id", ticketId);

  if (error) {
    throw error;
  }
}

export async function createSupportTicketReply(
  client: SupportSupabaseClient,
  input: {
    ticketId: string;
    author: string;
    text: string;
    nextStatus: TicketStatus | string;
    previousStatus?: TicketStatus | string;
  },
) {
  const createdAt = new Date().toISOString();
  const updates: Record<string, string> = {
    last_reply_at: createdAt,
  };

  if (input.nextStatus !== input.previousStatus) {
    updates.status = input.nextStatus;
  }

  const { error: ticketUpdateError } = await client.from("support_tickets").update(updates).eq("id", input.ticketId);

  if (ticketUpdateError) {
    throw ticketUpdateError;
  }

  const { data, error } = await client
    .from("ticket_replies")
    .insert([
      {
        ticket_id: input.ticketId,
        author: input.author,
        text: input.text,
        created_at: createdAt,
      },
    ])
    .select()
    .single();

  if (error) {
    throw error;
  }

  return {
    id: data?.id ?? Date.now().toString(),
    author: input.author,
    created_at: createdAt,
    text: input.text,
    attachments: [],
  } as TicketReply;
}

export async function createSupportTicketNote(
  client: SupportSupabaseClient,
  input: {
    ticketId: string;
    author: string;
    text: string;
  },
) {
  const createdAt = new Date().toISOString();
  const { data, error } = await client
    .from("ticket_notes")
    .insert([
      {
        ticket_id: input.ticketId,
        author: input.author,
        text: input.text,
        created_at: createdAt,
      },
    ])
    .select()
    .single();

  if (error) {
    throw error;
  }

  return {
    id: data?.id ?? Date.now().toString(),
    author: input.author,
    created_at: createdAt,
    text: input.text,
  } as TicketNote;
}

export async function createSupportTicketReminder(
  client: SupportSupabaseClient,
  input: {
    ticketId: string;
    title: string;
    datetime: string;
    staff: string;
  },
) {
  const createdAt = new Date().toISOString();
  const { data, error } = await client
    .from("ticket_reminders")
    .insert([
      {
        ticket_id: input.ticketId,
        title: input.title,
        datetime: input.datetime,
        staff: input.staff,
        created_at: createdAt,
      },
    ])
    .select()
    .single();

  if (error) {
    throw error;
  }

  return {
    id: data?.id ?? Date.now().toString(),
    title: input.title,
    datetime: input.datetime,
    staff: input.staff,
    created_at: createdAt,
  } as TicketReminder;
}

export async function deleteSupportTicketReminder(client: SupportSupabaseClient, reminderId: string) {
  const { error } = await client.from("ticket_reminders").delete().eq("id", reminderId);

  if (error) {
    throw error;
  }
}

export async function createSupportTicket(
  client: SupportSupabaseClient,
  formData: NewTicketFormData,
) {
  const contactName =
    formData.name || (formData.contact !== "Nothing selected" ? formData.contact : "Guest Contact");

  const payload = {
    subject: formData.subject,
    contact_name: contactName,
    department: formData.department !== "Nothing selected" ? formData.department : "TECHNICAL",
    priority: formData.priority,
    status: "Open",
    ticket_id_str: generateTicketIdStr(),
    last_reply_at: null,
  };

  const { data, error } = await client.from("support_tickets").insert([payload]).select().single();

  if (error) {
    throw error;
  }

  return {
    ...(data as SupportTicketDetail),
    description: formData.body,
    tags: formData.tags || null,
    email: formData.email || null,
  } as SupportTicketDetail;
}
