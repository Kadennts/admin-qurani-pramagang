"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { createClient } from "@/utils/supabase/client";

import { SUPPORT_TICKET_STATUSES } from "../constants";
import {
  createSupportTicketNote,
  createSupportTicketReminder,
  createSupportTicketReply,
  deleteSupportTicketReminder,
  fetchSupportTicketDetail,
  updateSupportTicketPriority,
  updateSupportTicketStatus,
} from "../repository";
import type { SupportTicketDetail, SupportTicketSummary, TicketNote, TicketReminder, TicketReply, TicketTask } from "../types";

export function useSupportTicketDetail(ticketId: string, profileName?: string) {
  const [supabase] = useState(() => createClient());
  const [ticket, setTicket] = useState<SupportTicketDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("add_reply");
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [tasks, setTasks] = useState<TicketTask[]>([]);
  const [newTask, setNewTask] = useState("");
  const [replyText, setReplyText] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);
  const [replyStatus, setReplyStatus] = useState("Answered");
  const [replies, setReplies] = useState<TicketReply[]>([]);
  const [notes, setNotes] = useState<TicketNote[]>([]);
  const [newNoteText, setNewNoteText] = useState("");
  const [reminders, setReminders] = useState<TicketReminder[]>([]);
  const [reminderTitle, setReminderTitle] = useState("");
  const [reminderDatetime, setReminderDatetime] = useState("");
  const [reminderStaff, setReminderStaff] = useState("");
  const [relatedTickets, setRelatedTickets] = useState<SupportTicketSummary[]>([]);

  const loadTicketDetail = useCallback(async () => {
    setIsLoading(true);

    try {
      const detail = await fetchSupportTicketDetail(supabase, ticketId);
      setTicket(detail.ticket);
      setReplyStatus(detail.ticket?.status ?? "Answered");
      setReplies(detail.replies);
      setNotes(detail.notes);
      setReminders(detail.reminders);
      setRelatedTickets(detail.relatedTickets);
    } catch (error) {
      console.error("Failed to load ticket detail", error);
      setTicket(null);
      setReplies([]);
      setNotes([]);
      setReminders([]);
      setRelatedTickets([]);
    } finally {
      setIsLoading(false);
    }
  }, [supabase, ticketId]);

  useEffect(() => {
    void loadTicketDetail();
  }, [loadTicketDetail]);

  const handleStatusChange = useCallback(
    async (nextStatus: string) => {
      setReplyStatus(nextStatus);
      setTicket((current) => (current ? { ...current, status: nextStatus } : current));

      try {
        await updateSupportTicketStatus(supabase, ticketId, nextStatus);
      } catch (error) {
        console.error("Failed to update ticket status", error);
      }
    },
    [supabase, ticketId],
  );

  const handleReplySubmit = useCallback(async () => {
    if ((!replyText || replyText.trim() === "") && attachments.length === 0) {
      return;
    }

    try {
      const newReply = await createSupportTicketReply(supabase, {
        ticketId,
        author: profileName || "Admin",
        text: replyText,
        nextStatus: replyStatus,
        previousStatus: ticket?.status,
      });

      newReply.attachments = [...attachments];
      setReplies((current) => [newReply, ...current]);
      setTicket((current) =>
        current
          ? {
              ...current,
              status: replyStatus,
              last_reply_at: newReply.created_at,
            }
          : current,
      );
      setReplyText("");
      setAttachments([]);
    } catch (error) {
      console.error("Failed to submit reply", error);
    }
  }, [attachments, profileName, replyStatus, replyText, supabase, ticket?.status, ticketId]);

  const handlePriorityChange = useCallback(
    async (priority: string) => {
      setTicket((current) => (current ? { ...current, priority } : current));

      try {
        await updateSupportTicketPriority(supabase, ticketId, priority);
      } catch (error) {
        console.error("Failed to update ticket priority", error);
      }
    },
    [supabase, ticketId],
  );

  const addTask = useCallback(() => {
    if (!newTask.trim()) {
      return;
    }

    setTasks((current) => [...current, { id: Date.now(), text: newTask, completed: false }]);
    setNewTask("");
  }, [newTask]);

  const toggleTask = useCallback((taskId: number) => {
    setTasks((current) =>
      current.map((task) => (task.id === taskId ? { ...task, completed: !task.completed } : task)),
    );
  }, []);

  const deleteTask = useCallback((taskId: number) => {
    setTasks((current) => current.filter((task) => task.id !== taskId));
  }, []);

  const addNote = useCallback(async () => {
    if (!newNoteText.trim()) {
      return;
    }

    try {
      const note = await createSupportTicketNote(supabase, {
        ticketId,
        author: profileName || "Admin Qurani",
        text: newNoteText,
      });
      setNotes((current) => [note, ...current]);
      setNewNoteText("");
    } catch (error) {
      console.error("Failed to create note", error);
    }
  }, [newNoteText, profileName, supabase, ticketId]);

  const addReminder = useCallback(async () => {
    if (!reminderTitle.trim()) {
      return;
    }

    try {
      const reminder = await createSupportTicketReminder(supabase, {
        ticketId,
        title: reminderTitle,
        datetime: reminderDatetime,
        staff: reminderStaff,
      });
      setReminders((current) => [reminder, ...current]);
      setReminderTitle("");
      setReminderDatetime("");
      setReminderStaff("");
    } catch (error) {
      console.error("Failed to create reminder", error);
    }
  }, [reminderDatetime, reminderStaff, reminderTitle, supabase, ticketId]);

  const removeReminder = useCallback(
    async (reminderId: string) => {
      try {
        await deleteSupportTicketReminder(supabase, reminderId);
        setReminders((current) => current.filter((reminder) => reminder.id !== reminderId));
      } catch (error) {
        console.error("Failed to delete reminder", error);
      }
    },
    [supabase],
  );

  const tabs = useMemo(
    () => [
      { id: "add_reply", label: "Add Reply", badge: null },
      { id: "notes", label: "Notes", badge: notes.length },
      { id: "reminders", label: "Reminders", badge: null },
      { id: "related", label: "Related Tickets", badge: null },
      { id: "tasks", label: "Tasks", badge: tasks.length },
    ],
    [notes.length, tasks.length],
  );

  return {
    activeTab,
    addNote,
    addReminder,
    addTask,
    attachments,
    handlePriorityChange,
    handleReplySubmit,
    handleStatusChange,
    isLoading,
    isMobileSidebarOpen,
    newNoteText,
    newTask,
    notes,
    relatedTickets,
    reminderDatetime,
    reminderStaff,
    reminderTitle,
    reminders,
    removeReminder,
    replies,
    replyStatus,
    replyText,
    setActiveTab,
    setAttachments,
    setIsMobileSidebarOpen,
    setNewNoteText,
    setNewTask,
    setReminderDatetime,
    setReminderStaff,
    setReminderTitle,
    setReplyStatus,
    setReplyText,
    tabs,
    tasks,
    ticket,
    toggleTask,
    deleteTask,
    supportedStatuses: SUPPORT_TICKET_STATUSES,
  };
}
