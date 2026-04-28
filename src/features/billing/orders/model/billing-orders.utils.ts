import type {
  BillingGuru,
  BillingGuruProfile,
  BillingMeetingItem,
  BillingOrderDetail,
  BillingOrderDetailDerived,
  BillingOrderInsert,
  BillingOrderPackage,
  BillingOrdersCounts,
  BillingOrderRow,
  BillingOrderStatus,
  BillingOrderTab,
} from "./billing-orders.types";

export function formatBillingOrderCurrency(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
}

export function formatBillingOrderDate(value: string) {
  const date = new Date(value);

  return date.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function formatBillingOrderLongDate(value?: string | null) {
  if (!value) {
    return "-";
  }

  const date = new Date(value);

  return date.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function formatBillingOrderDateTime(value?: string | null) {
  if (!value) {
    return "-";
  }

  const date = new Date(value);

  return `${date.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })}, ${date.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  })}`;
}

export function getBillingOrderStatusBadge(status: string) {
  const variants: Record<
    BillingOrderStatus | "default",
    { className: string; dotClassName: string; label: string }
  > = {
    Lunas: {
      className: "bg-emerald-50 text-emerald-600 border-emerald-200",
      dotClassName: "bg-emerald-500",
      label: "Lunas",
    },
    Selesai: {
      className: "bg-blue-50 text-blue-600 border-blue-200",
      dotClassName: "bg-blue-500",
      label: "Selesai",
    },
    "Menunggu Guru": {
      className: "bg-yellow-50 text-yellow-600 border-yellow-200",
      dotClassName: "bg-yellow-500",
      label: "Menunggu Guru",
    },
    "Menunggu Bayar": {
      className: "bg-yellow-50 text-yellow-600 border-yellow-200",
      dotClassName: "bg-yellow-500",
      label: "Menunggu Bayar",
    },
    Pending: {
      className: "bg-slate-100 text-slate-500 border-slate-200",
      dotClassName: "bg-slate-400",
      label: "Pending",
    },
    Batal: {
      className: "bg-red-50 text-red-600 border-red-200",
      dotClassName: "bg-red-500",
      label: "Batal",
    },
    default: {
      className: "bg-slate-100 text-slate-500 border-slate-200",
      dotClassName: "bg-slate-400",
      label: status,
    },
  };

  return variants[status as BillingOrderStatus] ?? variants.default;
}

export function getBillingOrderTabCounts(
  orders: BillingOrderRow[],
): BillingOrdersCounts {
  return {
    Semua: orders.length,
    Lunas: orders.filter((order) => order.status === "Lunas").length,
    Aktif: orders.filter((order) =>
      ["Menunggu Guru", "Menunggu Bayar"].includes(order.status),
    ).length,
    Pending: orders.filter((order) => order.status === "Pending").length,
    Batal: orders.filter((order) => order.status === "Batal").length,
    Selesai: orders.filter((order) => order.status === "Selesai").length,
  };
}

export function filterBillingOrders(
  orders: BillingOrderRow[],
  tab: BillingOrderTab,
  searchQuery: string,
) {
  let filteredOrders = orders;

  if (tab !== "Semua") {
    filteredOrders = filteredOrders.filter((order) => {
      if (tab === "Aktif") {
        return ["Menunggu Guru", "Menunggu Bayar"].includes(order.status);
      }

      return order.status === tab;
    });
  }

  const normalizedQuery = searchQuery.trim().toLowerCase();

  if (!normalizedQuery) {
    return filteredOrders;
  }

  return filteredOrders.filter((order) =>
    [order.member_name, order.guru_name, order.package_name]
      .filter(Boolean)
      .some((value) => value!.toLowerCase().includes(normalizedQuery)),
  );
}

export function buildPackagesForGuru(guru: BillingGuru | null) {
  if (!guru?.name) {
    return [] as BillingOrderPackage[];
  }

  const firstChar = guru.name.charCodeAt(0) || 0;
  const secondChar = guru.name.charCodeAt(1) || firstChar;
  const seed = firstChar + secondChar;
  const roundedBase = Math.round((70000 + seed * 300) / 5000) * 5000;

  return [
    {
      name: "1x Pertemuan",
      session: "1x sesi - Satuan",
      price: roundedBase,
    },
    {
      name: "5x Pertemuan",
      session: "5x sesi - Hemat",
      price:
        roundedBase * 5 - Math.round((roundedBase * 0.1) / 5000) * 5000,
    },
    {
      name: "10x Pertemuan",
      session: "10x sesi - Intensif",
      price:
        roundedBase * 10 - Math.round((roundedBase * 0.2) / 5000) * 5000,
    },
  ];
}

export function buildBillingOrderInsert(
  draft: NonNullable<unknown> extends never ? never : {
    member: NonNullable<
      import("./billing-orders.types").BillingOrderDraft["member"]
    >;
    guru: NonNullable<
      import("./billing-orders.types").BillingOrderDraft["guru"]
    >;
    paket: NonNullable<
      import("./billing-orders.types").BillingOrderDraft["paket"]
    >;
    paymentMethod: NonNullable<
      import("./billing-orders.types").BillingOrderDraft["paymentMethod"]
    >;
  },
): BillingOrderInsert {
  return {
    member_name: draft.member.name,
    member_email: draft.member.email,
    member_initials: draft.member.initials,
    member_color: draft.member.avatar_color,
    guru_name: draft.guru.name,
    guru_email: draft.guru.email,
    package_name: draft.paket.name,
    package_sessions: draft.paket.session.split(" - ")[0],
    price: draft.paket.price,
    payment_method: draft.paymentMethod,
    status: "Menunggu Guru",
  };
}

export function buildBillingOrderOptimisticRow(
  id: string,
  payload: BillingOrderInsert,
): BillingOrderRow {
  return {
    id,
    order_date: new Date().toISOString(),
    ...payload,
  };
}

export function normalizeBillingGuruProfile(
  guru: BillingGuru | null,
): BillingGuruProfile | null {
  if (!guru) {
    return null;
  }

  let tags: string[] = [];

  if (Array.isArray(guru.tags)) {
    tags = guru.tags.filter(Boolean);
  } else if (typeof guru.tags === "string") {
    tags = guru.tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);
  }

  return {
    ...guru,
    tags,
  };
}

export function buildBillingOrderDetailDerived(
  order: BillingOrderDetail,
): BillingOrderDetailDerived {
  const sessionsDone = order.sessions_completed ?? 0;
  const parsedSessionsTotal = Number.parseInt(order.package_sessions ?? "1", 10);
  const sessionsTotal = order.sessions_total ?? (Number.isNaN(parsedSessionsTotal) ? 1 : parsedSessionsTotal);
  const progress = sessionsTotal === 0 ? 0 : Math.round((sessionsDone / sessionsTotal) * 100);
  const taxAmount = order.tax_amount ?? Math.round((order.price ?? 0) * 0.12);
  const serviceFee = order.service_fee ?? 0;
  const invoiceNumber =
    order.invoice_number ?? `INV-${order.id.slice(0, 8).toUpperCase()}`;
  const paymentMethodKey = (order.payment_method ?? "PAY").replace(/\s+/g, "").toUpperCase();
  const gatewayRef =
    order.gateway_ref ?? `${paymentMethodKey}-REF-${order.id.slice(0, 10)}`;
  const totalPaid = (order.price ?? 0) + taxAmount + serviceFee;

  return {
    sessionsDone,
    sessionsTotal,
    progress,
    taxAmount,
    serviceFee,
    invoiceNumber,
    gatewayRef,
    totalPaid,
  };
}

export function buildBillingMeetings(
  order: BillingOrderDetail,
  derived: BillingOrderDetailDerived,
) {
  if (derived.sessionsTotal <= 0) {
    return [] as BillingMeetingItem[];
  }

  return Array.from(
    { length: Math.min(derived.sessionsTotal, 3) },
    (_, index) => {
      const isPast = index < derived.sessionsDone;
      const isCurrent = index === derived.sessionsDone;
      const baseDate = order.meeting_schedule
        ? new Date(order.meeting_schedule)
        : new Date(order.order_date);
      const meetingDate = new Date(
        baseDate.getTime() +
          (order.meeting_schedule ? index * 7 : index + 3) *
            24 *
            60 *
            60 *
            1000,
      );

      return {
        id: index + 1,
        dateLabel: meetingDate.toLocaleDateString("id-ID", {
          weekday: "long",
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
        timeLabel: order.meeting_time ?? "10:00 - 11:00",
        isCurrent,
        isPast,
      };
    },
  );
}

export function buildBillingOrderNotificationPreview(
  payload: BillingOrderInsert,
) {
  return {
    pendingTitle: "Pesanan Baru - Menunggu Bayar",
    pendingMessage: `${payload.member_name} - ${payload.package_name} - ${payload.guru_name}`,
    successTitle: "Pembayaran Berhasil",
    successMessage: `${payload.member_name} - ${payload.payment_method} - ${formatBillingOrderCurrency(payload.price)}`,
  };
}

export function getBillingOrderPaymentLabel(value: string | null) {
  return value && value !== "-" ? value : "-";
}

export function isBillingOrderDraftReadyForSubmit(
  step: number,
  draft: {
    member: unknown;
    guru: unknown;
    paket: unknown;
    paymentMethod: unknown;
  },
) {
  if (step === 1) {
    return Boolean(draft.member);
  }

  if (step === 2) {
    return Boolean(draft.guru);
  }

  if (step === 3) {
    return Boolean(draft.paket);
  }

  if (step === 4) {
    return Boolean(draft.paymentMethod);
  }

  return true;
}
