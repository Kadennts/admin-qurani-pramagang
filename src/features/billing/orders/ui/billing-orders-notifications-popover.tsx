import { Bell, Trash2, XCircle } from "lucide-react";

import type { useBillingOrders } from "../hooks/use-billing-orders";

export function BillingOrdersNotificationsPopover({
  state,
}: {
  state: ReturnType<typeof useBillingOrders>;
}) {
  return (
    <>
      {state.notifications.length > 0 ? (
        <button
          type="button"
          onClick={state.clearNotifications}
          className="relative flex h-12 w-12 items-center justify-center rounded-2xl border border-rose-200 bg-white text-rose-500 shadow-sm transition-colors hover:bg-rose-50"
        >
          <Trash2 size={20} />
        </button>
      ) : null}

      <div className="relative">
        <button
          type="button"
          onClick={() => state.setIsNotifOpen(!state.isNotifOpen)}
          className="relative flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-500 shadow-sm transition-colors hover:bg-slate-50"
        >
          <Bell size={20} />
          {state.notifications.length > 0 ? (
            <span className="absolute top-2 right-2 h-2.5 w-2.5 rounded-full border-2 border-white bg-red-500" />
          ) : null}
        </button>

        {state.isNotifOpen ? (
          <div className="animate-in fade-in slide-in-from-top-2 absolute top-[56px] right-0 z-50 w-[320px] overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-xl shadow-slate-200/50">
            <div className="flex items-center justify-between border-b border-slate-50 bg-slate-50/50 p-4">
              <h4 className="text-sm font-extrabold text-slate-800">
                Notifikasi Simulasi
              </h4>
              <button
                type="button"
                onClick={() => state.setIsNotifOpen(false)}
                className="text-slate-400 transition-colors hover:text-slate-600"
              >
                <XCircle size={16} />
              </button>
            </div>

            <div className="custom-scrollbar max-h-[300px] overflow-y-auto p-4">
              {state.notifications.length === 0 ? (
                <p className="py-6 text-center text-xs font-bold text-slate-400">
                  Belum ada notifikasi.
                </p>
              ) : (
                <div className="space-y-4">
                  {state.notifications.map((notification) => (
                    <div key={notification.id} className="flex gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-emerald-100 bg-emerald-50 text-xs text-emerald-600 shadow-sm">
                        B
                      </div>
                      <div>
                        <p className="text-[13px] font-extrabold text-slate-800">
                          {notification.title}
                        </p>
                        <p className="mt-0.5 text-xs leading-relaxed font-semibold text-slate-500">
                          {notification.message}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </>
  );
}
