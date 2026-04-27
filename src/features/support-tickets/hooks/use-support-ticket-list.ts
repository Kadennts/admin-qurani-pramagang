"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { createClient } from "@/utils/supabase/client";

import {
  BULK_MODAL_DEFAULT_TAB,
  BULK_UPDATE_EMPTY_VALUE,
  EMPTY_DATE_RANGE,
  SUPPORT_TICKET_LIST_TABS,
} from "../constants";
import { bulkUpdateSupportTickets, deleteSupportTickets, fetchSupportTickets } from "../repository";
import { filterSupportTickets } from "../utils";
import type { BulkModalTab, DateRange, SupportTicketSummary, TicketListTab } from "../types";

export function useSupportTicketList() {
  const [supabase] = useState(() => createClient());
  const [tickets, setTickets] = useState<SupportTicketSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TicketListTab>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTickets, setSelectedTickets] = useState<string[]>([]);
  const [isBulkMenuOpen, setIsBulkMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTab, setModalTab] = useState<BulkModalTab>(BULK_MODAL_DEFAULT_TAB);
  const [isDateMenuOpen, setIsDateMenuOpen] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange>(EMPTY_DATE_RANGE);
  const [tempDate, setTempDate] = useState<DateRange>(EMPTY_DATE_RANGE);
  const [updateStatus, setUpdateStatus] = useState(BULK_UPDATE_EMPTY_VALUE);
  const [updateDepartment, setUpdateDepartment] = useState(BULK_UPDATE_EMPTY_VALUE);
  const [updatePriority, setUpdatePriority] = useState(BULK_UPDATE_EMPTY_VALUE);
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const showNotification = useCallback((message: string, type: "success" | "error" = "success") => {
    setNotification({ message, type });
    window.setTimeout(() => setNotification(null), 3000);
  }, []);

  const loadTickets = useCallback(async () => {
    setIsLoading(true);

    try {
      const data = await fetchSupportTickets(supabase);
      setTickets(data);
    } catch (error) {
      console.error("Failed to fetch support tickets", error);
      setTickets([]);
      showNotification("Failed to load tickets.", "error");
    } finally {
      setIsLoading(false);
    }
  }, [showNotification, supabase]);

  useEffect(() => {
    void loadTickets();
  }, [loadTickets]);

  const filteredTickets = useMemo(() => {
    return filterSupportTickets(tickets, activeTab, searchQuery, dateRange);
  }, [activeTab, dateRange, searchQuery, tickets]);

  const counts = useMemo(() => {
    return SUPPORT_TICKET_LIST_TABS.reduce<Record<string, number>>((accumulator, tab) => {
      accumulator[tab] = tab === "All" ? tickets.length : tickets.filter((ticket) => ticket.status === tab).length;
      return accumulator;
    }, {});
  }, [tickets]);

  const handleSelectAll = useCallback(
    (checked: boolean) => {
      setSelectedTickets(checked ? filteredTickets.map((ticket) => ticket.id) : []);
    },
    [filteredTickets],
  );

  const handleSelectTicket = useCallback((ticketId: string) => {
    setSelectedTickets((current) =>
      current.includes(ticketId) ? current.filter((id) => id !== ticketId) : [...current, ticketId],
    );
  }, []);

  const resetBulkForm = useCallback(() => {
    setUpdateStatus(BULK_UPDATE_EMPTY_VALUE);
    setUpdateDepartment(BULK_UPDATE_EMPTY_VALUE);
    setUpdatePriority(BULK_UPDATE_EMPTY_VALUE);
  }, []);

  const executeBulkAction = useCallback(async () => {
    if (selectedTickets.length === 0) {
      return;
    }

    try {
      if (modalTab === "Update") {
        const updates: Record<string, string> = {};
        if (updateStatus !== BULK_UPDATE_EMPTY_VALUE) updates.status = updateStatus;
        if (updateDepartment !== BULK_UPDATE_EMPTY_VALUE) updates.department = updateDepartment;
        if (updatePriority !== BULK_UPDATE_EMPTY_VALUE) updates.priority = updatePriority;

        await bulkUpdateSupportTickets(supabase, selectedTickets, updates);
      } else {
        await deleteSupportTickets(supabase, selectedTickets);
      }

      showNotification("Bulk action completed.");
      setSelectedTickets([]);
      setIsModalOpen(false);
      resetBulkForm();
      await loadTickets();
    } catch (error) {
      console.error("Failed to execute bulk action", error);
      showNotification("Bulk action failed.", "error");
    }
  }, [
    loadTickets,
    modalTab,
    resetBulkForm,
    selectedTickets,
    showNotification,
    supabase,
    updateDepartment,
    updatePriority,
    updateStatus,
  ]);

  return {
    activeTab,
    counts,
    dateRange,
    executeBulkAction,
    filteredTickets,
    isBulkMenuOpen,
    isDateMenuOpen,
    isLoading,
    isModalOpen,
    modalTab,
    notification,
    searchQuery,
    selectedTickets,
    setActiveTab,
    setDateRange,
    setIsBulkMenuOpen,
    setIsDateMenuOpen,
    setIsModalOpen,
    setModalTab,
    setSearchQuery,
    setTempDate,
    setUpdateDepartment,
    setUpdatePriority,
    setUpdateStatus,
    tempDate,
    updateDepartment,
    updatePriority,
    updateStatus,
    handleSelectAll,
    handleSelectTicket,
    loadTickets,
    resetBulkForm,
    showNotification,
  };
}
