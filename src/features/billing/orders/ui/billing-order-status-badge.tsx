import { getBillingOrderStatusBadge } from "../model/billing-orders.utils";

export function BillingOrderStatusBadge({ status }: { status: string }) {
  const badge = getBillingOrderStatusBadge(status);

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold ${badge.className}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${badge.dotClassName}`} />
      {badge.label}
    </span>
  );
}
