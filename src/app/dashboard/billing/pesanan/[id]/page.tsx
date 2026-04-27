"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  BookOpen,
  Calendar,
  Clock,
  CreditCard,
  Loader2,
  MapPin,
  Star,
  Users,
  CheckCircle2,
  AlertCircle,
  Package,
  Wifi,
  Mic,
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";

type Order = {
  id: string;
  member_name: string;
  member_email: string;
  member_initials: string;
  member_color: string;
  guru_name: string;
  guru_email: string;
  package_name: string;
  package_sessions: string;
  price: number;
  payment_method: string;
  status: string;
  order_date: string;
  invoice_number?: string;
  gateway_ref?: string;
  paid_at?: string;
  tax_amount?: number;
  service_fee?: number;
  start_date?: string;
  learning_method?: string;
  recitation_type?: string;
  sessions_completed?: number;
  sessions_total?: number;
  meeting_schedule?: string;
  meeting_time?: string;
  meeting_status?: string;
};

type Guru = {
  id: string;
  name: string;
  avatar_url?: string;
  rating?: number;
  murid?: number;
  location?: string;
  experience?: string;
  specialization?: string;
  tags?: string[];
  email?: string;
};

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [guru, setGuru] = useState<Guru | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);

  const formatDate = (dStr?: string) => {
    if (!dStr) return "—";
    const d = new Date(dStr);
    return d.toLocaleDateString("id-ID", {
      weekday: "long",
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatDateShort = (dStr?: string) => {
    if (!dStr) return "—";
    const d = new Date(dStr);
    return d.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }) + ", " + d.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
  };

  useEffect(() => {
    async function fetchDetail() {
      setIsLoading(true);
      const { data } = await supabase
        .from("billing_pesanan")
        .select("*")
        .eq("id", id)
        .single();

      if (data) {
        setOrder(data);
        // Fetch guru data by name or email
        const guruQuery = await supabase
          .from("master_guru")
          .select("*")
          .ilike("name", `%${data.guru_name}%`)
          .limit(1);

        if (guruQuery.data && guruQuery.data.length > 0) {
          const g = guruQuery.data[0];
          setGuru({
            ...g,
            tags: g.tags
              ? typeof g.tags === "string"
                ? g.tags.split(",").map((t: string) => t.trim())
                : g.tags
              : [],
          });
        }
      }
      setIsLoading(false);
    }

    if (id) fetchDetail();
  }, [id]);

  const getStatusBadge = (status: string) => {
    const map: Record<string, { color: string; dot: string; label: string }> = {
      Lunas: { color: "bg-emerald-50 text-emerald-700 border-emerald-200", dot: "bg-emerald-500", label: "LUNAS" },
      "Menunggu Guru": { color: "bg-yellow-50 text-yellow-700 border-yellow-200", dot: "bg-yellow-500", label: "MENUNGGU GURU" },
      "Menunggu Bayar": { color: "bg-yellow-50 text-yellow-700 border-yellow-200", dot: "bg-yellow-500", label: "MENUNGGU BAYAR" },
      Pending: { color: "bg-slate-100 text-slate-600 border-slate-200", dot: "bg-slate-400", label: "PENDING" },
      Batal: { color: "bg-red-50 text-red-600 border-red-200", dot: "bg-red-500", label: "BATAL" },
      Selesai: { color: "bg-blue-50 text-blue-600 border-blue-200", dot: "bg-blue-500", label: "SELESAI" },
    };
    const s = map[status] ?? map["Pending"];
    return (
      <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-black border tracking-widest ${s.color}`}>
        <span className={`w-2 h-2 rounded-full ${s.dot}`} />
        {s.label}
      </span>
    );
  };

  const sessionsDone = order?.sessions_completed ?? 0;
  const sessionsTotal = order?.sessions_total ?? parseInt(order?.package_sessions ?? "1") ?? 1;
  const progress = Math.round((sessionsDone / sessionsTotal) * 100);
  const taxAmount = order?.tax_amount ?? Math.round((order?.price ?? 0) * 0.12);
  const serviceFee = order?.service_fee ?? 0;
  const invoiceNumber = order?.invoice_number ?? `INV-${id?.toString().slice(0, 8).toUpperCase()}`;
  const gatewayRef = order?.gateway_ref ?? `${order?.payment_method?.toUpperCase().replace(/\s/g, "")}-REF-${id?.toString().slice(0, 10)}`;

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-emerald-600">
          <Loader2 size={36} className="animate-spin" />
          <p className="text-sm font-bold text-slate-500">Memuat data pesanan...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-slate-400">
        <AlertCircle size={48} className="text-slate-300" />
        <h2 className="text-lg font-black text-slate-600">Pesanan Tidak Ditemukan</h2>
        <p className="text-sm font-medium">ID pesanan tidak ada di database.</p>
        <button
          onClick={() => router.back()}
          className="mt-2 rounded-xl bg-emerald-600 px-6 py-2.5 text-sm font-bold text-white hover:bg-emerald-700 transition-colors"
        >
          ← Kembali
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1300px] pb-16 animate-in fade-in duration-300">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="mb-6 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-600 shadow-sm transition-colors hover:bg-slate-50"
      >
        <ArrowLeft size={16} />
        Kembali
      </button>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* LEFT COLUMN */}
        <div className="space-y-6">

          {/* Progress Belajar */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-sm font-black tracking-wider text-slate-800 uppercase">
                <BookOpen size={16} className="text-emerald-600" />
                Progress Belajar
              </h2>
              <span className="text-xs font-black text-slate-400">
                {sessionsDone} / {sessionsTotal} Selesai
              </span>
            </div>
            <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
              <div
                className="h-2 rounded-full bg-emerald-500 transition-all duration-700"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="mt-3 text-xs font-semibold text-slate-400">
              {progress === 0 ? "0% perjalanan belajar selesai" : `${progress}% perjalanan belajar selesai`}
            </p>
          </div>

          {/* Jadwal Pertemuan */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-sm font-black tracking-wider text-slate-800 uppercase">
                <Calendar size={16} className="text-emerald-600" />
                Jadwal Pertemuan
              </h2>
              <span className="text-xs font-bold text-slate-400">
                {sessionsTotal} pertemuan terjadwal
              </span>
            </div>

            {sessionsTotal > 0 ? (
              <div className="space-y-3">
                {Array.from({ length: Math.min(sessionsTotal, 3) }, (_, i) => {
                  const isPast = i < sessionsDone;
                  const isCurrent = i === sessionsDone;
                  const meetingDate = order.meeting_schedule
                    ? new Date(new Date(order.meeting_schedule).getTime() + i * 7 * 24 * 60 * 60 * 1000)
                    : new Date(new Date(order.order_date).getTime() + (i + 3) * 24 * 60 * 60 * 1000);

                  return (
                    <div
                      key={i}
                      className={`flex items-center justify-between rounded-xl border px-5 py-3.5 transition-colors ${
                        isCurrent
                          ? "border-emerald-200 bg-emerald-50/60"
                          : isPast
                          ? "border-slate-100 bg-slate-50 opacity-60"
                          : "border-slate-100 bg-white"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`flex h-10 w-10 items-center justify-center rounded-full ${isCurrent ? "bg-emerald-100" : "bg-slate-100"}`}>
                          <Clock size={18} className={isCurrent ? "text-emerald-600" : "text-slate-400"} />
                        </div>
                        <div>
                          <p className="text-sm font-black text-slate-800">
                            Pertemuan {i + 1}
                          </p>
                          <p className="text-xs font-semibold text-slate-400">
                            {meetingDate.toLocaleDateString("id-ID", {
                              weekday: "long",
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })}
                          </p>
                        </div>
                        {isCurrent && (
                          <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-[10px] font-black tracking-widest text-amber-600">
                            PENDING
                          </span>
                        )}
                        {isPast && (
                          <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-black tracking-widest text-emerald-600">
                            SELESAI
                          </span>
                        )}
                      </div>
                      <span className="text-sm font-bold text-slate-600">
                        {order.meeting_time ?? "10:00 - 11:00"}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="py-4 text-center text-sm font-semibold text-slate-400">Jadwal belum ditentukan.</p>
            )}
          </div>

          {/* Informasi Pembayaran */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-5 flex items-center gap-2 text-sm font-black tracking-wider text-slate-800 uppercase">
              <CreditCard size={16} className="text-emerald-600" />
              Informasi Pembayaran
            </h2>

            <div className="grid gap-x-10 gap-y-4 sm:grid-cols-2">
              {/* Left: Invoice Details */}
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="font-black tracking-widest text-[10px] text-slate-400 uppercase">#Invoice</span>
                  <span className="font-black text-slate-800">{invoiceNumber}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="font-black tracking-widest text-[10px] text-slate-400 uppercase">Ref. Gateway</span>
                  <span className="font-bold text-slate-600 text-xs">{gatewayRef}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="font-black tracking-widest text-[10px] text-slate-400 uppercase">Payment</span>
                  <span className="font-bold text-slate-700">{order.payment_method || "—"}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="font-black tracking-widest text-[10px] text-slate-400 uppercase">Status</span>
                  {getStatusBadge(order.status)}
                </div>
                <div className="flex justify-between text-sm">
                  <span className="font-black tracking-widest text-[10px] text-slate-400 uppercase">Waktu Bayar</span>
                  <span className="font-bold text-slate-600 text-xs">
                    {order.paid_at ? formatDateShort(order.paid_at) : formatDateShort(order.order_date)}
                  </span>
                </div>
              </div>

              {/* Right: Price Breakdown */}
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="font-black tracking-widest text-[10px] text-slate-400 uppercase">Harga Paket</span>
                  <span className="font-bold text-slate-700">{formatCurrency(order.price)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="font-black tracking-widest text-[10px] text-slate-400 uppercase">Pajak (12%)</span>
                  <span className="font-bold text-slate-700">{formatCurrency(taxAmount)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="font-black tracking-widest text-[10px] text-slate-400 uppercase">Biaya Layanan</span>
                  <span className={`font-bold ${serviceFee === 0 ? "text-emerald-600" : "text-slate-700"}`}>
                    {serviceFee === 0 ? "Gratis" : formatCurrency(serviceFee)}
                  </span>
                </div>
                <div className="mt-1 flex justify-between border-t border-slate-100 pt-3 text-base">
                  <span className="font-black text-slate-800">Total Bayar</span>
                  <span className="font-black text-emerald-600">{formatCurrency(order.price + taxAmount + serviceFee)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Informasi Pesanan */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-5 flex items-center gap-2 text-sm font-black tracking-wider text-slate-800 uppercase">
              <Package size={16} className="text-emerald-600" />
              Informasi Pesanan
            </h2>
            <div className="space-y-4 text-sm">
              <div className="flex items-start justify-between">
                <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase">Nama Paket</span>
                <span className="font-black text-slate-800">{order.package_name}</span>
              </div>
              <div className="flex items-start justify-between">
                <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase">Metode Belajar</span>
                <div className="flex gap-2">
                  {(order.learning_method ?? "Online").split(",").map((m) => (
                    <span
                      key={m}
                      className="flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-bold text-slate-600"
                    >
                      {m.trim().toLowerCase() === "online" ? <Wifi size={11} /> : <Mic size={11} />}
                      {m.trim()}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex items-start justify-between">
                <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase">Mulai Sesi</span>
                <span className="font-bold text-slate-700">
                  {formatDate(order.start_date ?? order.order_date)}
                </span>
              </div>
              {order.recitation_type && (
                <div className="flex items-start justify-between">
                  <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase">Jenis Tilawah</span>
                  <span className="font-bold text-slate-700">{order.recitation_type}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-5">
          {/* Member Card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-4">
              <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-white font-black text-lg shadow-sm ${order.member_color || "bg-emerald-600"}`}>
                {order.member_initials || order.member_name.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <p className="font-black text-slate-800 text-base">{order.member_name}</p>
                <p className="text-xs font-bold text-slate-400">@{order.member_name.toLowerCase().replace(/\s/g, ".")}</p>
              </div>
            </div>
            <div className="mt-4 space-y-2.5 text-sm">
              <div className="flex items-center gap-2 text-slate-500 font-medium">
                <span className="text-emerald-600">✉</span>
                <span className="text-xs">{order.member_email}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-500 font-medium">
                <MapPin size={13} className="text-emerald-600 shrink-0" />
                <span className="text-xs">—</span>
              </div>
              <div className="flex items-center gap-2 text-slate-500 font-medium">
                <Calendar size={13} className="text-emerald-600 shrink-0" />
                <span className="text-xs">Bergabung {formatDate(order.order_date)}</span>
              </div>
            </div>
          </div>

          {/* Guru Card */}
          {guru ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="h-14 w-14 shrink-0 overflow-hidden rounded-full border border-slate-200 bg-slate-100">
                  {guru.avatar_url ? (
                    <img src={guru.avatar_url} alt={guru.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-lg font-black text-slate-400">
                      {guru.name.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                </div>
                <div>
                  <p className="font-black text-slate-800">{guru.name}</p>
                  <p className="text-xs font-bold text-slate-400">@{guru.name.toLowerCase().replace(/\s/g, ".")}</p>
                </div>
              </div>
              <div className="mt-4 space-y-2.5 text-sm">
                {guru.rating && (
                  <div className="flex items-center gap-2">
                    <Star size={13} className="fill-amber-400 text-amber-400" />
                    <span className="font-black text-amber-500 text-xs">{guru.rating}</span>
                    <span className="font-bold text-slate-400 text-xs">{guru.murid ?? "—"} Murid</span>
                  </div>
                )}
                {guru.location && (
                  <div className="flex items-center gap-2 text-slate-500">
                    <MapPin size={13} className="text-emerald-600 shrink-0" />
                    <span className="text-xs font-medium">{guru.location}</span>
                  </div>
                )}
                {guru.experience && (
                  <div className="flex items-center gap-2 text-slate-500">
                    <Clock size={13} className="text-emerald-600 shrink-0" />
                    <span className="text-xs font-medium">{guru.experience}</span>
                  </div>
                )}
                {guru.specialization && (
                  <div className="flex items-center gap-2 text-slate-500">
                    <BookOpen size={13} className="text-emerald-600 shrink-0" />
                    <span className="text-xs font-medium">{guru.specialization}</span>
                  </div>
                )}
                {guru.tags && guru.tags.length > 0 && (
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
                )}
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-slate-100 text-lg font-black text-slate-400">
                  {order.guru_name?.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <p className="font-black text-slate-800">{order.guru_name}</p>
                  <p className="text-xs font-medium text-slate-400">{order.guru_email}</p>
                </div>
              </div>
              <p className="text-xs font-medium text-slate-400 italic">Detail profil guru tidak ditemukan di database.</p>
            </div>
          )}

          {/* Order Summary Card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-3 flex items-center gap-2 text-xs font-black tracking-wider text-slate-500 uppercase">
              <CheckCircle2 size={14} className="text-emerald-600" />
              Ringkasan Status
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500 font-semibold">Status</span>
                {getStatusBadge(order.status)}
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-semibold">Sesi</span>
                <span className="font-bold text-slate-800">{sessionsDone}/{sessionsTotal}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-semibold">Tanggal Order</span>
                <span className="font-bold text-slate-600 text-xs">{formatDate(order.order_date)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
