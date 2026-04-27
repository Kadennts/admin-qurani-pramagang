"use client";

import { useAppPreferences } from "@/components/providers/app-preferences-provider";
import { useSupportTicketList } from "@/features/support-tickets/hooks/use-support-ticket-list";
import { SupportTicketListView } from "@/features/support-tickets/components/support-ticket-list-view";

export default function SupportTicketsPage() {
  const { language, profile, t } = useAppPreferences();
  const state = useSupportTicketList();

  return <SupportTicketListView language={language} profile={profile} t={t} state={state} />;
}
