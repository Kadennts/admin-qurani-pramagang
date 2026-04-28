"use client";

import { useAppPreferences } from "@/components/providers/app-preferences-provider";
import { NewTicketFormView } from "@/features/support/tickets/ui/new-ticket-form-view";
import { useNewTicketForm } from "@/features/support/tickets/hooks/use-new-ticket-form";

export default function NewTicketPage() {
  const { profile } = useAppPreferences();
  const state = useNewTicketForm(profile?.name);

  return <NewTicketFormView profileName={profile?.name} state={state} />;
}
