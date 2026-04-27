"use client";

import { use } from "react";

import { useAppPreferences } from "@/components/providers/app-preferences-provider";
import { SupportTicketDetailView } from "@/features/support-tickets/components/support-ticket-detail-view";
import { useSupportTicketDetail } from "@/features/support-tickets/hooks/use-support-ticket-detail";

export default function TicketDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { profile } = useAppPreferences();
  const state = useSupportTicketDetail(resolvedParams.id, profile?.name);

  return <SupportTicketDetailView profile={profile} ticketId={resolvedParams.id} state={state} />;
}
