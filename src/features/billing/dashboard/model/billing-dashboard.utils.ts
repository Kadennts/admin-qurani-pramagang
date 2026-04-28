import type { BillingDashboardMetrics, BillingDashboardOrder } from "./billing-dashboard.types";

export function buildBillingDashboardMetrics(orders: BillingDashboardOrder[]): BillingDashboardMetrics {
  const totalPesanan = orders.length;
  const berhasilCount = orders.filter((order) => ["Lunas", "Selesai"].includes(order.status)).length;
  const pendingCount = orders.filter((order) => ["Menunggu Bayar", "Menunggu Guru", "Pending"].includes(order.status)).length;
  const gagalCount = orders.filter((order) => order.status === "Batal").length;
  const refundCount = 0;
  const activePesanan = pendingCount + berhasilCount;
  const totalRevenue = orders
    .filter((order) => ["Lunas", "Selesai"].includes(order.status))
    .reduce((sum, order) => sum + (order.price || 0), 0);
  const avgRevenue = berhasilCount > 0 ? totalRevenue / berhasilCount : 0;
  const successRate = totalPesanan === 0 ? 0 : Math.round((berhasilCount / totalPesanan) * 100);
  const activeRate = totalPesanan === 0 ? 0 : Math.round((activePesanan / totalPesanan) * 100);

  const gopayOrders = orders.filter((order) => order.payment_method?.toLowerCase() === "gopay");
  const qrisOrders = orders.filter((order) => order.payment_method?.toLowerCase() === "qris");
  const gopayTotal = gopayOrders.reduce((sum, order) => sum + (order.price || 0), 0);
  const qrisTotal = qrisOrders.reduce((sum, order) => sum + (order.price || 0), 0);
  const sumMethods = gopayTotal + qrisTotal;
  const gopayPct = sumMethods === 0 ? 0 : Math.round((gopayTotal / sumMethods) * 100);
  const qrisPct = sumMethods === 0 ? 0 : Math.round((qrisTotal / sumMethods) * 100);

  return {
    totalPesanan,
    berhasilCount,
    pendingCount,
    gagalCount,
    refundCount,
    activePesanan,
    totalRevenue,
    avgRevenue,
    successRate,
    activeRate,
    gopayPct,
    qrisPct,
  };
}

export function formatBillingCurrency(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
}

export function formatBillingDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" });
}

export function getBillingOrderStatusBadge(status: string) {
  if (["Lunas", "Selesai"].includes(status)) {
    return { badgeClass: "bg-emerald-50 text-[#059669]", finalStatus: "Berhasil" };
  }

  if (["Menunggu Bayar", "Menunggu Guru", "Pending"].includes(status)) {
    return { badgeClass: "bg-amber-50 text-amber-600", finalStatus: "Pending" };
  }

  if (status === "Batal") {
    return { badgeClass: "bg-rose-50 text-rose-500", finalStatus: "Gagal" };
  }

  return { badgeClass: "bg-slate-100 text-slate-500", finalStatus: "Unknown" };
}
