export type BillingDashboardOrder = {
  id: string;
  order_date: string;
  status: string;
  payment_method: string | null;
  price: number | null;
  member_name: string | null;
  member_email: string | null;
  guru_name: string | null;
  guru_email: string | null;
};

export type BillingDashboardMetrics = {
  totalPesanan: number;
  berhasilCount: number;
  pendingCount: number;
  gagalCount: number;
  refundCount: number;
  activePesanan: number;
  totalRevenue: number;
  avgRevenue: number;
  successRate: number;
  activeRate: number;
  gopayPct: number;
  qrisPct: number;
};
