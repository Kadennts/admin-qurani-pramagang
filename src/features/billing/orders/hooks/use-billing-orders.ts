"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { createClient } from "@/utils/supabase/client";

import {
  fetchBillingOrdersPageSnapshot,
  insertBillingOrder,
} from "../data/billing-orders.repository";
import {
  BILLING_ORDER_TABS,
  EMPTY_BILLING_ORDER_DRAFT,
} from "../model/billing-orders.constants";
import {
  buildBillingOrderInsert,
  buildBillingOrderNotificationPreview,
  buildBillingOrderOptimisticRow,
  buildPackagesForGuru,
  filterBillingOrders,
  getBillingOrderTabCounts,
  isBillingOrderDraftReadyForSubmit,
} from "../model/billing-orders.utils";
import type {
  BillingGuru,
  BillingMember,
  BillingOrderDraft,
  BillingOrderNotification,
  BillingOrderRow,
  BillingOrderTab,
  BillingSimulationStep,
} from "../model/billing-orders.types";

export function useBillingOrders() {
  const router = useRouter();
  const [supabase] = useState(() => createClient());
  const [orders, setOrders] = useState<BillingOrderRow[]>([]);
  const [members, setMembers] = useState<BillingMember[]>([]);
  const [gurus, setGurus] = useState<BillingGuru[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<BillingOrderTab>("Semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [notifications, setNotifications] = useState<
    BillingOrderNotification[]
  >([]);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalStep, setModalStep] = useState<BillingSimulationStep>(1);
  const [orderDraft, setOrderDraft] = useState<BillingOrderDraft>(
    EMPTY_BILLING_ORDER_DRAFT,
  );

  useEffect(() => {
    let isMounted = true;

    async function loadBillingOrders() {
      setIsLoading(true);

      try {
        const snapshot = await fetchBillingOrdersPageSnapshot(supabase);

        if (!isMounted) {
          return;
        }

        setOrders(snapshot.orders);
        setMembers(snapshot.members);
        setGurus(snapshot.gurus);
      } catch (error) {
        console.error("Failed to load billing orders", error);

        if (!isMounted) {
          return;
        }

        setOrders([]);
        setMembers([]);
        setGurus([]);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadBillingOrders();

    return () => {
      isMounted = false;
    };
  }, [supabase]);

  const filteredOrders = useMemo(
    () => filterBillingOrders(orders, activeTab, searchQuery),
    [activeTab, orders, searchQuery],
  );

  const tabCounts = useMemo(() => getBillingOrderTabCounts(orders), [orders]);

  const availablePackages = useMemo(
    () => buildPackagesForGuru(orderDraft.guru),
    [orderDraft.guru],
  );

  const canContinue = useMemo(
    () => isBillingOrderDraftReadyForSubmit(modalStep, orderDraft),
    [modalStep, orderDraft],
  );

  const openSimulation = () => {
    setModalStep(1);
    setOrderDraft(EMPTY_BILLING_ORDER_DRAFT);
    setIsModalOpen(true);
  };

  const closeSimulation = () => {
    setIsModalOpen(false);
  };

  const clearNotifications = () => {
    setNotifications([]);
    setIsNotifOpen(false);
  };

  const selectMember = (member: BillingMember) => {
    setOrderDraft((currentDraft) => ({
      ...currentDraft,
      member,
    }));
  };

  const selectGuru = (guru: BillingGuru) => {
    setOrderDraft((currentDraft) => ({
      ...currentDraft,
      guru,
      paket: null,
    }));
  };

  const selectPackage = (paket: BillingOrderDraft["paket"]) => {
    setOrderDraft((currentDraft) => ({
      ...currentDraft,
      paket,
    }));
  };

  const selectPaymentMethod = (
    paymentMethod: BillingOrderDraft["paymentMethod"],
  ) => {
    setOrderDraft((currentDraft) => ({
      ...currentDraft,
      paymentMethod,
    }));
  };

  const goToPreviousStep = () => {
    setModalStep((currentStep) =>
      currentStep > 1 ? ((currentStep - 1) as BillingSimulationStep) : 1,
    );
  };

  const goToOrderDetail = (orderId: string) => {
    router.push(`/dashboard/billing/pesanan/${orderId}`);
  };

  const addNotification = (title: string, message: string) => {
    setNotifications((currentNotifications) => [
      {
        id: Date.now(),
        title,
        message,
      },
      ...currentNotifications,
    ]);
  };

  const submitNewOrder = async () => {
    if (
      !orderDraft.member ||
      !orderDraft.guru ||
      !orderDraft.paket ||
      !orderDraft.paymentMethod
    ) {
      return;
    }

    const payload = buildBillingOrderInsert({
      member: orderDraft.member,
      guru: orderDraft.guru,
      paket: orderDraft.paket,
      paymentMethod: orderDraft.paymentMethod,
    });
    const preview = buildBillingOrderNotificationPreview(payload);

    setOrders((currentOrders) => [
      buildBillingOrderOptimisticRow(Date.now().toString(), payload),
      ...currentOrders,
    ]);
    setModalStep(5);

    toast.success("Pembayaran Lunas - Pesanan Baru", {
      description: `Pesanan atas nama ${payload.member_name} telah diproses dan masuk ke dalam sistem via ${payload.payment_method}.`,
    });
    addNotification(preview.successTitle, preview.successMessage);

    try {
      await insertBillingOrder(supabase, payload);
    } catch (error) {
      console.error("Failed to insert billing order", error);
      toast.error("Gagal menyimpan pesanan baru");
    }
  };

  const handleNextStep = async () => {
    if (!canContinue) {
      return;
    }

    if (modalStep === 3) {
      if (!orderDraft.member || !orderDraft.guru || !orderDraft.paket) {
        return;
      }

      const payload = buildBillingOrderInsert({
        member: orderDraft.member,
        guru: orderDraft.guru,
        paket: orderDraft.paket,
        paymentMethod: "GoPay",
      });
      const preview = buildBillingOrderNotificationPreview(payload);

      toast(preview.pendingTitle, {
        description: preview.pendingMessage,
      });
      addNotification(preview.pendingTitle, preview.pendingMessage);
      setModalStep(4);
      return;
    }

    if (modalStep === 4) {
      await submitNewOrder();
      return;
    }

    setModalStep((currentStep) =>
      (currentStep + 1) as BillingSimulationStep,
    );
  };

  return {
    activeTab,
    availablePackages,
    canContinue,
    clearNotifications,
    closeSimulation,
    filteredOrders,
    goToOrderDetail,
    goToPreviousStep,
    gurus,
    handleNextStep,
    isLoading,
    isModalOpen,
    isNotifOpen,
    members,
    modalStep,
    notifications,
    openSimulation,
    orderDraft,
    orders,
    searchQuery,
    selectGuru,
    selectMember,
    selectPackage,
    selectPaymentMethod,
    setActiveTab,
    setIsNotifOpen,
    setSearchQuery,
    tabCounts,
    tabs: BILLING_ORDER_TABS,
  };
}
