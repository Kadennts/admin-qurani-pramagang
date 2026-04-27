"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { createClient } from "@/utils/supabase/client";

import {
  DEFAULT_ASSIGNEE_OPTIONS,
  DEFAULT_CONTACT_OPTIONS,
  DEFAULT_NEW_TICKET_FORM,
  DEFAULT_SERVICE_OPTIONS,
} from "../constants";
import { createSupportTicket } from "../repository";
import type { NewTicketFormData } from "../types";

export function useNewTicketForm(profileName?: string) {
  const router = useRouter();
  const [supabase] = useState(() => createClient());
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<NewTicketFormData>(DEFAULT_NEW_TICKET_FORM);

  const assigneeOptions = useMemo(() => {
    const extraAssignee = profileName ? [profileName] : [];
    return [...DEFAULT_ASSIGNEE_OPTIONS, ...extraAssignee];
  }, [profileName]);

  const updateField = useCallback(
    <K extends keyof NewTicketFormData>(field: K, value: NewTicketFormData[K]) => {
      setFormData((current) => ({ ...current, [field]: value }));
    },
    [],
  );

  const appendToBody = useCallback((value: string, prependSpacing = "\n\n") => {
    if (!value) {
      return;
    }

    setFormData((current) => ({
      ...current,
      body: current.body ? `${current.body}${prependSpacing}${value}` : value,
    }));
  }, []);

  const submit = useCallback(async () => {
    if (!formData.subject.trim() || !formData.body.trim()) {
      window.alert("Subject and Body are required!");
      return;
    }

    setIsLoading(true);

    try {
      const ticket = await createSupportTicket(supabase, formData);
      router.push(ticket?.id ? `/dashboard/support/tickets/${ticket.id}` : "/dashboard/support/tickets");
    } catch (error) {
      console.error("Failed to create ticket", error);
      window.alert(`Error creating ticket: ${(error as Error).message}`);
    } finally {
      setIsLoading(false);
    }
  }, [formData, router, supabase]);

  return {
    appendToBody,
    assigneeOptions,
    contactOptions: DEFAULT_CONTACT_OPTIONS,
    formData,
    isLoading,
    serviceOptions: DEFAULT_SERVICE_OPTIONS,
    submit,
    updateField,
  };
}
