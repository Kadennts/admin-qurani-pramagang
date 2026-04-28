import {
  AlertCircle,
  ArrowLeft,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  CreditCard,
  Loader2,
  MapPin,
  Mic,
  Package,
  Star,
  Wifi,
} from "lucide-react";

import {
  formatBillingOrderCurrency,
  formatBillingOrderDateTime,
  formatBillingOrderLongDate,
} from "../model/billing-orders.utils";
import { BillingOrderStatusBadge } from "./billing-order-status-badge";
import type { useBillingOrderDetail } from "../hooks/use-billing-order-detail";

export function BillingOrderDetailView({
  state,
}: {
  state: ReturnType<typeof useBillingOrderDetail>;
}) {
  if (state.isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-emerald-600">
          <Loader2 size={36} className="animate-spin" />
          <p className="text-sm font-bold text-slate-500">
            Memuat data pesanan...
          </p>
        </div>
      </div>
    );
  }

  if (!state.order || !state.derived) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-slate-400">
        <AlertCircle size={48} className="text-slate-300" />
        <h2 className="text-lg font-black text-slate-600">
          Pesanan Tidak Ditemukan
        </h2>
        <p className="text-sm font-medium">
          ID pesanan tidak ada di database.
        </p>
        <button
          type="button"
          onClick={state.goBack}
          className="mt-2 rounded-xl bg-emerald-600 px-6 py-2.5 text-sm font-bold text-white transition-colors hover:bg-emerald-700"
        >
          Kembali
        </button>
      </div>
    );
  }

  const { order, derived, guru } = state;

  return (
    <div className="animate-in fade-in mx-auto max-w-[1300px] pb-16 duration-300">
      <button
        type="button"
        onClick={state.goBack}
        className="mb-6 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-600 shadow-sm transition-colors hover:bg-slate-50"
      >
        <ArrowLeft size={16} />
        Kembali
      </button>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-sm font-black tracking-wider text-slate-800 uppercase">
                <BookOpen size={16} className="text-emerald-600" />
                Progress Belajar
              </h2>
              <span className="text-xs font-black text-slate-400">
                {derived.sessionsDone} / {derived.sessionsTotal} Selesai
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-2 rounded-full bg-emerald-500 transition-all duration-700"
                style={{ width: `${derived.progress}%` }}
              />
            </div>
            <p className="mt-3 text-xs font-semibold text-slate-400">
              {derived.progress === 0
                ? "0% perjalanan belajar selesai"
                : `${derived.progress}% perjalanan belajar selesai`}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-sm font-black tracking-wider text-slate-800 uppercase">
                <Calendar size={16} className="text-emerald-600" />
                Jadwal Pertemuan
              </h2>
              <span className="text-xs font-bold text-slate-400">
                {derived.sessionsTotal} pertemuan terjadwal
              </span>
            </div>

            {state.meetings.length > 0 ? (
              <div className="space-y-3">
                {state.meetings.map((meeting) => (
                  <div
                    key={meeting.id}
                    className={`flex items-center justify-between rounded-xl border px-5 py-3.5 transition-colors ${
                      meeting.isCurrent
                        ? "border-emerald-200 bg-emerald-50/60"
                        : meeting.isPast
                          ? "border-slate-100 bg-slate-50 opacity-60"
                          : "border-slate-100 bg-white"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-full ${
                          meeting.isCurrent ? "bg-emerald-100" : "bg-slate-100"
                        }`}
                      >
                        <Clock
                          size={18}
                          className={
                            meeting.isCurrent
                              ? "text-emerald-600"
                              : "text-slate-400"
                          }
                        />
                      </div>
                      <div>
                        <p className="text-sm font-black text-slate-800">
                          Pertemuan {meeting.id}
                        </p>
                        <p className="text-xs font-semibold text-slate-400">
                          {meeting.dateLabel}
                        </p>
                      </div>
                      {meeting.isCurrent ? (
                        <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-[10px] font-black tracking-widest text-amber-600">
                          PENDING
                        </span>
                      ) : null}
                      {meeting.isPast ? (
                        <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-black tracking-widest text-emerald-600">
                          SELESAI
                        </span>
                      ) : null}
                    </div>
                    <span className="text-sm font-bold text-slate-600">
                      {meeting.timeLabel}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="py-4 text-center text-sm font-semibold text-slate-400">
                Jadwal belum ditentukan.
              </p>
            )}
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-5 flex items-center gap-2 text-sm font-black tracking-wider text-slate-800 uppercase">
              <CreditCard size={16} className="text-emerald-600" />
              Informasi Pembayaran
            </h2>

            <div className="grid gap-x-10 gap-y-4 sm:grid-cols-2">
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
                    #Invoice
                  </span>
                  <span className="font-black text-slate-800">
                    {derived.invoiceNumber}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
                    Ref. Gateway
                  </span>
                  <span className="text-xs font-bold text-slate-600">
                    {derived.gatewayRef}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
                    Payment
                  </span>
                  <span className="font-bold text-slate-700">
                    {order.payment_method || "-"}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
                    Status
                  </span>
                  <BillingOrderStatusBadge status={order.status} />
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
                    Waktu Bayar
                  </span>
                  <span className="text-xs font-bold text-slate-600">
                    {formatBillingOrderDateTime(order.paid_at ?? order.order_date)}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
                    Harga Paket
                  </span>
                  <span className="font-bold text-slate-700">
                    {formatBillingOrderCurrency(order.price ?? 0)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
                    Pajak (12%)
                  </span>
                  <span className="font-bold text-slate-700">
                    {formatBillingOrderCurrency(derived.taxAmount)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
                    Biaya Layanan
                  </span>
                  <span
                    className={`font-bold ${
                      derived.serviceFee === 0
                        ? "text-emerald-600"
                        : "text-slate-700"
                    }`}
                  >
                    {derived.serviceFee === 0
                      ? "Gratis"
                      : formatBillingOrderCurrency(derived.serviceFee)}
                  </span>
                </div>
                <div className="mt-1 flex justify-between border-t border-slate-100 pt-3 text-base">
                  <span className="font-black text-slate-800">Total Bayar</span>
                  <span className="font-black text-emerald-600">
                    {formatBillingOrderCurrency(derived.totalPaid)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-5 flex items-center gap-2 text-sm font-black tracking-wider text-slate-800 uppercase">
              <Package size={16} className="text-emerald-600" />
              Informasi Pesanan
            </h2>
            <div className="space-y-4 text-sm">
              <div className="flex items-start justify-between">
                <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
                  Nama Paket
                </span>
                <span className="font-black text-slate-800">
                  {order.package_name}
                </span>
              </div>
              <div className="flex items-start justify-between">
                <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
                  Metode Belajar
                </span>
                <div className="flex gap-2">
                  {(order.learning_method ?? "Online")
                    .split(",")
                    .map((method) => (
                      <span
                        key={method}
                        className="flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-bold text-slate-600"
                      >
                        {method.trim().toLowerCase() === "online" ? (
                          <Wifi size={11} />
                        ) : (
                          <Mic size={11} />
                        )}
                        {method.trim()}
                      </span>
                    ))}
                </div>
              </div>
              <div className="flex items-start justify-between">
                <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
                  Mulai Sesi
                </span>
                <span className="font-bold text-slate-700">
                  {formatBillingOrderLongDate(order.start_date ?? order.order_date)}
                </span>
              </div>
              {order.recitation_type ? (
                <div className="flex items-start justify-between">
                  <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
                    Jenis Tilawah
                  </span>
                  <span className="font-bold text-slate-700">
                    {order.recitation_type}
                  </span>
                </div>
              ) : null}
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-4">
              <div
                className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-lg font-black text-white shadow-sm ${order.member_color || "bg-emerald-600"}`}
              >
                {order.member_initials || order.member_name?.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <p className="text-base font-black text-slate-800">
                  {order.member_name}
                </p>
                <p className="text-xs font-bold text-slate-400">
                  @{order.member_name?.toLowerCase().replace(/\s/g, ".")}
                </p>
              </div>
            </div>
            <div className="mt-4 space-y-2.5 text-sm">
              <div className="flex items-center gap-2 font-medium text-slate-500">
                <span className="text-emerald-600">@</span>
                <span className="text-xs">{order.member_email}</span>
              </div>
              <div className="flex items-center gap-2 font-medium text-slate-500">
                <MapPin size={13} className="shrink-0 text-emerald-600" />
                <span className="text-xs">-</span>
              </div>
              <div className="flex items-center gap-2 font-medium text-slate-500">
                <Calendar size={13} className="shrink-0 text-emerald-600" />
                <span className="text-xs">
                  Bergabung {formatBillingOrderLongDate(order.order_date)}
                </span>
              </div>
            </div>
          </div>

          {guru ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="h-14 w-14 shrink-0 overflow-hidden rounded-full border border-slate-200 bg-slate-100">
                  {guru.avatar_url ? (
                    <>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={guru.avatar_url}
                        alt={guru.name}
                        className="h-full w-full object-cover"
                      />
                    </>
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-lg font-black text-slate-400">
                      {guru.name.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                </div>
                <div>
                  <p className="font-black text-slate-800">{guru.name}</p>
                  <p className="text-xs font-bold text-slate-400">
                    @{guru.name.toLowerCase().replace(/\s/g, ".")}
                  </p>
                </div>
              </div>
              <div className="mt-4 space-y-2.5 text-sm">
                {guru.rating ? (
                  <div className="flex items-center gap-2">
                    <Star size={13} className="fill-amber-400 text-amber-400" />
                    <span className="text-xs font-black text-amber-500">
                      {guru.rating}
                    </span>
                    <span className="text-xs font-bold text-slate-400">
                      {guru.murid ?? "-"} Murid
                    </span>
                  </div>
                ) : null}
                {guru.location ? (
                  <div className="flex items-center gap-2 text-slate-500">
                    <MapPin size={13} className="shrink-0 text-emerald-600" />
                    <span className="text-xs font-medium">{guru.location}</span>
                  </div>
                ) : null}
                {guru.experience ? (
                  <div className="flex items-center gap-2 text-slate-500">
                    <Clock size={13} className="shrink-0 text-emerald-600" />
                    <span className="text-xs font-medium">
                      {guru.experience}
                    </span>
                  </div>
                ) : null}
                {guru.specialization ? (
                  <div className="flex items-center gap-2 text-slate-500">
                    <BookOpen size={13} className="shrink-0 text-emerald-600" />
                    <span className="text-xs font-medium">
                      {guru.specialization}
                    </span>
                  </div>
                ) : null}
                {guru.tags.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {guru.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-3 flex items-center gap-3">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-slate-100 text-lg font-black text-slate-400">
                  {order.guru_name?.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <p className="font-black text-slate-800">{order.guru_name}</p>
                  <p className="text-xs font-medium text-slate-400">
                    {order.guru_email}
                  </p>
                </div>
              </div>
              <p className="text-xs font-medium italic text-slate-400">
                Detail profil guru tidak ditemukan di database.
              </p>
            </div>
          )}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-3 flex items-center gap-2 text-xs font-black tracking-wider text-slate-500 uppercase">
              <CheckCircle2 size={14} className="text-emerald-600" />
              Ringkasan Status
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="font-semibold text-slate-500">Status</span>
                <BillingOrderStatusBadge status={order.status} />
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-slate-500">Sesi</span>
                <span className="font-bold text-slate-800">
                  {derived.sessionsDone}/{derived.sessionsTotal}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-slate-500">
                  Tanggal Order
                </span>
                <span className="text-xs font-bold text-slate-600">
                  {formatBillingOrderLongDate(order.order_date)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
