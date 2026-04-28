import type {
  BillingOrderDraft,
  BillingOrderTab,
  BillingPaymentMethod,
} from "./billing-orders.types";

export const BILLING_ORDER_TABS: BillingOrderTab[] = [
  "Semua",
  "Lunas",
  "Aktif",
  "Pending",
  "Batal",
  "Selesai",
];

export const BILLING_PAYMENT_METHODS: BillingPaymentMethod[] = [
  "GoPay",
  "QRIS",
  "OVO",
];

export const EMPTY_BILLING_ORDER_DRAFT: BillingOrderDraft = {
  member: null,
  guru: null,
  paket: null,
  paymentMethod: null,
};
