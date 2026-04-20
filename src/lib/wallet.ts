export const PLATFORM_FEE_RATE = 0.12;
export const TAX_FEE_RATE = 0.025;
export const TOTAL_DEDUCTION_RATE = PLATFORM_FEE_RATE + TAX_FEE_RATE;
export const NET_PAYOUT_RATE = 1 - TOTAL_DEDUCTION_RATE;

export type BillingOrderRow = {
  id: string;
  member_name: string | null;
  member_email: string | null;
  guru_name: string | null;
  guru_email: string | null;
  package_name: string | null;
  package_sessions: string | null;
  order_date: string;
  price: number | null;
  payment_method: string | null;
  status: string | null;
};

export type GuruRow = {
  id: string;
  name: string;
  email: string | null;
  revenue: number | null;
  avatar_url: string | null;
};

export type PayoutTransferRow = {
  id: string;
  guru_id: string | null;
  guru_name: string;
  guru_email: string | null;
  bank_name: string | null;
  payment_channel: string | null;
  gross_amount: number | null;
  platform_fee_amount: number | null;
  tax_amount: number | null;
  net_amount: number | null;
  order_count: number | null;
  covered_order_ids: string[] | null;
  status: string | null;
  requested_at: string | null;
  processed_at: string | null;
  created_at: string | null;
};

export type WalletPeriodId =
  | "all-time"
  | "today"
  | "yesterday"
  | "this-week"
  | "last-week"
  | "this-month"
  | "last-month"
  | "this-year"
  | "last-year";

export type WalletPeriodOption = {
  id: WalletPeriodId;
  label: string;
};

export type DateRange = {
  start: Date;
  end: Date;
};

const IDR_FORMATTER = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const DATE_FORMATTER = new Intl.DateTimeFormat("id-ID", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

const DATETIME_FORMATTER = new Intl.DateTimeFormat("id-ID", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

export const WALLET_PERIOD_OPTIONS: WalletPeriodOption[] = [
  { id: "all-time", label: "All time" },
  { id: "today", label: "Today" },
  { id: "yesterday", label: "Yesterday" },
  { id: "this-week", label: "This week" },
  { id: "last-week", label: "Last week" },
  { id: "this-month", label: "This month" },
  { id: "last-month", label: "Last month" },
  { id: "this-year", label: "This year" },
  { id: "last-year", label: "Last year" },
];

export function formatCurrency(amount: number) {
  return IDR_FORMATTER.format(amount);
}

export function formatDate(value: string | null | undefined) {
  if (!value) {
    return "-";
  }

  return DATE_FORMATTER.format(new Date(value));
}

export function formatDateTime(value: string | null | undefined) {
  if (!value) {
    return "-";
  }

  return DATETIME_FORMATTER.format(new Date(value));
}

export function normalizeStatus(status: string | null | undefined) {
  return (status ?? "").trim().toLowerCase();
}

export function hasRealPaymentMethod(method: string | null | undefined) {
  const value = (method ?? "").trim();
  return value !== "" && value !== "-" && value !== "—";
}

export function isPaidOrder(order: BillingOrderRow) {
  if (!hasRealPaymentMethod(order.payment_method)) {
    return false;
  }

  const status = normalizeStatus(order.status);
  return !["menunggu bayar", "pending", "batal", "cancelled", "failed"].includes(status);
}

export function isSettledOrder(order: BillingOrderRow) {
  return isPaidOrder(order) && normalizeStatus(order.status) === "selesai";
}

export function isPendingGuruOrder(order: BillingOrderRow) {
  return isPaidOrder(order) && !isSettledOrder(order);
}

export function calculateFinancials(amount: number | null | undefined) {
  const gross = Math.max(0, Number(amount ?? 0));
  const platformFee = Math.round(gross * PLATFORM_FEE_RATE);
  const taxFee = Math.round(gross * TAX_FEE_RATE);
  const totalDeduction = platformFee + taxFee;
  const net = Math.max(0, gross - totalDeduction);

  return {
    gross,
    platformFee,
    taxFee,
    totalDeduction,
    net,
  };
}

export function getDeterministicBankName(guruName: string, fallbackIndex = 0) {
  const banks = [
    "Bank Mandiri",
    "BSI",
    "BCA",
    "BNI",
    "BRI",
    "CIMB Niaga",
    "Permata",
  ];

  const nameScore = guruName
    .split("")
    .reduce((total, char) => total + char.charCodeAt(0), fallbackIndex);

  return banks[nameScore % banks.length];
}

export function getWalletPeriodRange(
  periodId: WalletPeriodId,
  referenceDate = new Date()
): DateRange | null {
  const year = referenceDate.getFullYear();
  const month = referenceDate.getMonth();
  const day = referenceDate.getDate();
  const currentDay = new Date(year, month, day);

  switch (periodId) {
    case "all-time":
      return null;
    case "today":
      return {
        start: currentDay,
        end: new Date(year, month, day + 1),
      };
    case "yesterday":
      return {
        start: new Date(year, month, day - 1),
        end: currentDay,
      };
    case "this-week": {
      const weekDay = currentDay.getDay();
      const start = new Date(currentDay);
      start.setDate(currentDay.getDate() - weekDay);
      return {
        start,
        end: new Date(start.getFullYear(), start.getMonth(), start.getDate() + 7),
      };
    }
    case "last-week": {
      const weekDay = currentDay.getDay();
      const end = new Date(currentDay);
      end.setDate(currentDay.getDate() - weekDay);
      const start = new Date(end);
      start.setDate(end.getDate() - 7);
      return { start, end };
    }
    case "this-month":
      return {
        start: new Date(year, month, 1),
        end: new Date(year, month + 1, 1),
      };
    case "last-month":
      return {
        start: new Date(year, month - 1, 1),
        end: new Date(year, month, 1),
      };
    case "this-year":
      return {
        start: new Date(year, 0, 1),
        end: new Date(year + 1, 0, 1),
      };
    case "last-year":
      return {
        start: new Date(year - 1, 0, 1),
        end: new Date(year, 0, 1),
      };
    default:
      return null;
  }
}

export function isWithinRange(value: string | null | undefined, range: DateRange | null) {
  if (!value) {
    return false;
  }

  if (!range) {
    return true;
  }

  const date = new Date(value);
  return date >= range.start && date < range.end;
}

export function getCoveredOrderIds(transfers: PayoutTransferRow[]) {
  const ids = new Set<string>();

  for (const transfer of transfers) {
    for (const orderId of transfer.covered_order_ids ?? []) {
      ids.add(orderId);
    }
  }

  return ids;
}
