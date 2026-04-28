"use client";

import { useBillingOrderDetail } from "../hooks/use-billing-order-detail";
import { BillingOrderDetailView } from "./billing-order-detail-view";

export function BillingOrderDetailPage() {
  const state = useBillingOrderDetail();

  return <BillingOrderDetailView state={state} />;
}
