"use client";

import { useBillingOrders } from "../hooks/use-billing-orders";
import { BillingOrdersView } from "./billing-orders-view";

export function BillingOrdersPage() {
  const state = useBillingOrders();

  return <BillingOrdersView state={state} />;
}
