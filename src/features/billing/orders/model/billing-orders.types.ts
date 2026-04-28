export type BillingOrderStatus =
  | "Menunggu Guru"
  | "Menunggu Bayar"
  | "Lunas"
  | "Selesai"
  | "Pending"
  | "Batal";

export type BillingOrderTab =
  | "Semua"
  | "Lunas"
  | "Aktif"
  | "Pending"
  | "Batal"
  | "Selesai";

export type BillingPaymentMethod = "GoPay" | "QRIS" | "OVO";

export type BillingOrderRow = {
  id: string;
  order_date: string;
  status: string;
  payment_method: string | null;
  price: number | null;
  member_name: string | null;
  member_email: string | null;
  member_initials: string | null;
  member_color: string | null;
  guru_name: string | null;
  guru_email: string | null;
  package_name: string | null;
  package_sessions: string | null;
};

export type BillingMember = {
  id: string;
  name: string;
  email: string;
  initials: string;
  avatar_color: string;
};

export type BillingGuru = {
  id: string;
  name: string;
  email: string | null;
  avatar_url: string | null;
  rating: number | null;
  murid: number | null;
  location?: string | null;
  experience?: string | null;
  specialization?: string | null;
  tags?: string[] | string | null;
};

export type BillingOrderPackage = {
  name: string;
  session: string;
  price: number;
};

export type BillingOrderNotification = {
  id: number;
  title: string;
  message: string;
};

export type BillingOrderDraft = {
  member: BillingMember | null;
  guru: BillingGuru | null;
  paket: BillingOrderPackage | null;
  paymentMethod: BillingPaymentMethod | null;
};

export type BillingSimulationStep = 1 | 2 | 3 | 4 | 5;

export type BillingOrdersCounts = Record<BillingOrderTab, number>;

export type BillingOrderInsert = {
  member_name: string;
  member_email: string;
  member_initials: string;
  member_color: string;
  guru_name: string;
  guru_email: string | null;
  package_name: string;
  package_sessions: string;
  price: number;
  payment_method: string | null;
  status: BillingOrderStatus;
};

export type BillingOrderDetail = BillingOrderRow & {
  invoice_number?: string | null;
  gateway_ref?: string | null;
  paid_at?: string | null;
  tax_amount?: number | null;
  service_fee?: number | null;
  start_date?: string | null;
  learning_method?: string | null;
  recitation_type?: string | null;
  sessions_completed?: number | null;
  sessions_total?: number | null;
  meeting_schedule?: string | null;
  meeting_time?: string | null;
  meeting_status?: string | null;
};

export type BillingOrderDetailDerived = {
  sessionsDone: number;
  sessionsTotal: number;
  progress: number;
  taxAmount: number;
  serviceFee: number;
  invoiceNumber: string;
  gatewayRef: string;
  totalPaid: number;
};

export type BillingMeetingItem = {
  id: number;
  dateLabel: string;
  timeLabel: string;
  isCurrent: boolean;
  isPast: boolean;
};

export type BillingGuruProfile = BillingGuru & {
  tags: string[];
};
