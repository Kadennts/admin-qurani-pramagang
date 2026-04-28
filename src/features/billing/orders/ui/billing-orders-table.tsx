import { MoreHorizontal } from "lucide-react";

import {
  formatBillingOrderCurrency,
  formatBillingOrderDate,
  getBillingOrderPaymentLabel,
} from "../model/billing-orders.utils";
import { BillingOrderStatusBadge } from "./billing-order-status-badge";
import type { useBillingOrders } from "../hooks/use-billing-orders";

export function BillingOrdersTable({
  state,
}: {
  state: ReturnType<typeof useBillingOrders>;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full whitespace-nowrap">
        <thead>
          <tr className="border-b border-slate-100 text-left text-xs font-black tracking-wide text-slate-800">
            <th className="px-8 py-5">Member</th>
            <th className="px-6 py-5">Guru</th>
            <th className="px-6 py-5">Paket</th>
            <th className="px-6 py-5">Tanggal</th>
            <th className="px-6 py-5">Harga</th>
            <th className="px-6 py-5">Payment</th>
            <th className="px-6 py-5">Status</th>
            <th className="px-8 py-5 text-center">Aksi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {state.isLoading ? (
            <tr>
              <td
                colSpan={8}
                className="px-8 py-12 text-center font-medium text-slate-500"
              >
                Memuat pesanan...
              </td>
            </tr>
          ) : state.filteredOrders.length === 0 ? (
            <tr>
              <td
                colSpan={8}
                className="px-8 py-12 text-center font-medium text-slate-500"
              >
                Tidak ada pesanan.
              </td>
            </tr>
          ) : (
            state.filteredOrders.map((item) => (
              <tr
                key={item.id}
                onClick={() => state.goToOrderDetail(item.id)}
                className="cursor-pointer transition-colors hover:bg-slate-50/80"
              >
                <td className="px-8 py-5">
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-extrabold tracking-wider text-white shadow-sm ${item.member_color || "bg-slate-400"}`}
                    >
                      {item.member_initials}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-extrabold text-slate-800">
                        {item.member_name}
                      </span>
                      <span className="text-[11px] font-bold text-slate-400">
                        {item.member_email}
                      </span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-slate-700">
                      {item.guru_name}
                    </span>
                    <span className="text-[11px] font-medium text-slate-400">
                      {item.guru_email}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div className="flex flex-col">
                    <span className="text-sm font-extrabold text-[#059669]">
                      {item.package_name}
                    </span>
                    <span className="mt-0.5 text-[11px] font-bold text-slate-400">
                      {item.package_sessions}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-5 text-sm font-bold tracking-wide text-slate-500">
                  {formatBillingOrderDate(item.order_date)}
                </td>
                <td className="px-6 py-5 text-sm font-black tracking-wide text-slate-800">
                  {formatBillingOrderCurrency(item.price ?? 0)}
                </td>
                <td className="px-6 py-5">
                  <span className="text-sm font-bold text-slate-600">
                    {getBillingOrderPaymentLabel(item.payment_method)}
                  </span>
                </td>
                <td className="px-6 py-5">
                  <BillingOrderStatusBadge status={item.status} />
                </td>
                <td className="px-8 py-5 text-center">
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                    }}
                    className="mx-auto flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
                  >
                    <MoreHorizontal size={14} />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
