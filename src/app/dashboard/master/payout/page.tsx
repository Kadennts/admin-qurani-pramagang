"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Banknote,
  CheckCircle2,
  Clock3,
  RefreshCcw,
  Search,
  Send,
  Wallet,
} from "lucide-react";
import { toast } from "sonner";

import {
  BillingOrderRow,
  GuruRow,
  PayoutTransferRow,
  calculateFinancials,
  formatCurrency,
  formatDateTime,
  getCoveredOrderIds,
  getDeterministicBankName,
  isSettledOrder,
} from "@/lib/wallet";
import { createClient } from "@/utils/supabase/client";

type PayoutRecord = {
  dbId: string | null;
  guruId: string;
  guruName: string;
  guruEmail: string;
  guruAvatar: string;
  bankName: string;
  orderCount: number;
  grossAmount: number;
  platformFeeAmount: number;
  taxAmount: number;
  netAmount: number;
  orderIds: string[];
  lastTransferAt: string | null;
  transferredTotal: number;
  status: string;
  catatan: string;
};

export default function MasterPayoutPage() {
  const [supabase] = useState(() => createClient());
  const [records, setRecords] = useState<PayoutRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isTransferTableReady, setIsTransferTableReady] = useState(true);
  const [processedTransferTotal, setProcessedTransferTotal] = useState(0);
  const [processingGuruId, setProcessingGuruId] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);

    try {
      const [gurusResponse, ordersResponse, transfersResponse] = await Promise.all([
        supabase.from("master_guru").select("*"),
        supabase.from("billing_pesanan").select("*"),
        supabase.from("master_payout_transfers").select("*").order("created_at", { ascending: false }),
      ]);

      const gurus = (gurusResponse.data ?? []) as GuruRow[];
      const orders = (ordersResponse.data ?? []) as BillingOrderRow[];
      const transfers = transfersResponse.error
        ? []
        : ((transfersResponse.data ?? []) as PayoutTransferRow[]);

      setIsTransferTableReady(!transfersResponse.error);

      const settledOrders = orders.filter(isSettledOrder);
      const coveredOrderIds = getCoveredOrderIds(transfers);

      let newProcessedTotal = 0;
      const nextRecords: PayoutRecord[] = [];

      // 1. Push DB Transfers
      for (const t of transfers) {
        let statusStr = t.status || "Menunggu";
        let notes = "";
        if (statusStr.startsWith("Ditolak|")) {
           notes = statusStr.substring(8);
           statusStr = "Ditolak";
        } else if (statusStr === "Pending") {
           statusStr = "Menunggu";
        }

        if (statusStr === "Sudah Dicairkan") {
           newProcessedTotal += (t.net_amount || 0);
        }

        nextRecords.push({
          dbId: t.id,
          guruId: t.guru_id!,
          guruName: t.guru_name,
          guruEmail: t.guru_email!,
          guruAvatar: (() => { const idx = gurus.findIndex(g => g.id === t.guru_id); return `/img/profil${idx >= 0 ? idx + 1 : 1}.jpg`; })(),
          bankName: t.bank_name || "",
          orderCount: t.order_count || 0,
          grossAmount: t.gross_amount || 0,
          platformFeeAmount: t.platform_fee_amount || 0,
          taxAmount: t.tax_amount || 0,
          netAmount: t.net_amount || 0,
          orderIds: t.covered_order_ids || [],
          lastTransferAt: t.created_at,
          transferredTotal: 0,
          status: statusStr,
          catatan: notes
        });
      }

      // 2. Drafts (new orders)
      const draftRecords = gurus
        .map((guru, index) => {
          const availableOrders = settledOrders.filter(
            (order) => order.guru_name === guru.name && !coveredOrderIds.has(order.id)
          );

          const grossAmount = availableOrders.reduce((total, order) => total + calculateFinancials(order.price).gross, 0);
          const platformFeeAmount = availableOrders.reduce((total, order) => total + calculateFinancials(order.price).platformFee, 0);
          const taxAmount = availableOrders.reduce((total, order) => total + calculateFinancials(order.price).taxFee, 0);
          const netAmount = availableOrders.reduce((total, order) => total + calculateFinancials(order.price).net, 0);

          return {
            dbId: null,
            guruId: guru.id,
            guruName: guru.name,
            guruEmail: guru.email ?? `${guru.name.toLowerCase().replace(/\s+/g, ".")}@qurani.app`,
            guruAvatar: `/img/profil${index + 1}.jpg`,
            bankName: getDeterministicBankName(guru.name, index),
            orderCount: availableOrders.length,
            grossAmount,
            platformFeeAmount,
            taxAmount,
            netAmount,
            orderIds: availableOrders.map((order) => order.id),
            lastTransferAt: null,
            transferredTotal: 0,
            status: "Menunggu",
            catatan: ""
          };
        })
        .filter((record) => record.orderCount > 0);

      const unifiedRecords = [...nextRecords, ...draftRecords].sort((a,b) => b.netAmount - a.netAmount);

      setRecords(unifiedRecords);
      setProcessedTransferTotal(newProcessedTotal);
    } catch (error) {
      console.error("Failed fetching payout data", error);
      setRecords([]);
      setProcessedTransferTotal(0);
    } finally {
      setIsLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  const filteredRecords = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (query === "") {
      return records;
    }

    return records.filter(
      (record) =>
        record.guruName.toLowerCase().includes(query) ||
        record.guruEmail.toLowerCase().includes(query) ||
        record.bankName.toLowerCase().includes(query)
    );
  }, [records, searchQuery]);

  const readyToTransferCount = records.filter((r) => r.status === "Menunggu" || r.status === "Disetujui").length;
  const totalOutstandingGross = records.filter((r) => r.status !== "Sudah Dicairkan").reduce((t, r) => t + r.grossAmount, 0);
  const totalOutstandingNet = records.filter((r) => r.status !== "Sudah Dicairkan").reduce((t, r) => t + r.netAmount, 0);

  // Reject Modal State
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [rejectRecord, setRejectRecord] = useState<PayoutRecord | null>(null);

  const openRejectModal = (rec: PayoutRecord) => {
     setRejectRecord(rec);
     setRejectReason("");
     setRejectModalOpen(true);
  };

  const handleAction = async (record: PayoutRecord, newStatus: string) => {
    if (!isTransferTableReady) return toast.error("Tabel payout master_payout_transfers belum ada.");
    if (record.orderIds.length === 0 || record.netAmount <= 0) return toast.error("Tidak ada saldo.");

    setProcessingGuruId(record.guruId);

    try {
      if (!record.dbId) {
        // Insert new
        await supabase.from("master_payout_transfers").insert([{
          guru_id: record.guruId,
          guru_name: record.guruName,
          guru_email: record.guruEmail,
          bank_name: record.bankName,
          payment_channel: "Transfer Bank",
          gross_amount: record.grossAmount,
          platform_fee_amount: record.platformFeeAmount,
          tax_amount: record.taxAmount,
          net_amount: record.netAmount,
          order_count: record.orderCount,
          covered_order_ids: record.orderIds,
          status: newStatus,
        }]);
      } else {
        // Update existing
        await supabase.from("master_payout_transfers").update({ status: newStatus }).eq("id", record.dbId);
      }

      toast.success(`Berhasil! Status diubah menjadi ${newStatus.split('|')[0]}`);
      await fetchData();
    } catch (error) {
      console.error(error);
      toast.error("Gagal melakukan proses tersebut.");
    } finally {
      setProcessingGuruId(null);
    }
  };

  const handleRejectSubmit = async () => {
    if(!rejectRecord) return;
    if(!rejectReason.trim()) return toast.error("Masukkan alasan penolakan");
    await handleAction(rejectRecord, `Ditolak|${rejectReason}`);
    setRejectModalOpen(false);
  };

  const renderStatusBadge = (status: string) => {
     if (status === "Menunggu") return <span className="inline-flex gap-1 items-center px-3 py-1 rounded-full border border-yellow-200 bg-yellow-50 text-[10px] text-yellow-600 font-bold"><div className="w-1.5 h-1.5 rounded-full bg-yellow-500"></div> Menunggu</span>;
     if (status === "Disetujui") return <span className="inline-flex gap-1 items-center px-3 py-1 rounded-full border border-emerald-200 bg-emerald-50 text-[10px] text-emerald-600 font-bold"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div> Disetujui</span>;
     if (status === "Ditolak") return <span className="inline-flex gap-1 items-center px-3 py-1 rounded-full border border-red-200 bg-red-50 text-[10px] text-red-600 font-bold"><div className="w-1.5 h-1.5 rounded-full bg-red-500"></div> Ditolak</span>;
     return <span className="inline-flex gap-1 items-center px-3 py-1 rounded-full border border-blue-200 bg-blue-50 text-[10px] text-blue-600 font-bold"><div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div> Selesai</span>;
  };

  return (
    <div className="mx-auto max-w-[1400px] space-y-6 pb-12 animate-in fade-in duration-300">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-800">Payout Guru</h1>
        </div>

        <button
          type="button"
          onClick={() => void fetchData()}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-600 shadow-sm transition-colors hover:bg-slate-50"
        >
          <RefreshCcw size={16} />
          Refresh
        </button>
      </div>

      {!isTransferTableReady && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm font-semibold text-amber-700">
          Tabel `master_payout_transfers` belum tersedia. Jalankan file SQL payout transfer agar
          proses transfer dan halaman wallet bisa sinkron dengan Supabase.
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-50 text-amber-500">
              <Clock3 size={18} />
            </div>
            <span className="text-sm font-semibold text-slate-500">Siap Dicairkan</span>
          </div>
          <p className="text-2xl font-black text-slate-800">{readyToTransferCount}</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-50 text-emerald-500">
              <CheckCircle2 size={18} />
            </div>
            <span className="text-sm font-semibold text-slate-500">Total Dicairkan</span>
          </div>
          <p className="text-2xl font-black text-slate-800">
            {formatCurrency(processedTransferTotal)}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-50 text-blue-600">
              <Banknote size={18} />
            </div>
            <span className="text-sm font-semibold text-slate-500">Gross Outstanding</span>
          </div>
          <p className="text-2xl font-black text-slate-800">
            {formatCurrency(totalOutstandingGross)}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-purple-50 text-purple-600">
              <Wallet size={18} />
            </div>
            <span className="text-sm font-semibold text-slate-500">Net Outstanding</span>
          </div>
          <p className="text-2xl font-black text-slate-800">{formatCurrency(totalOutstandingNet)}</p>
        </div>
      </div>

      <div className="relative w-full max-w-md">
        <Search
          size={18}
          className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-slate-400"
        />
        <input
          type="text"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder="Cari guru atau bank..."
          className="w-full rounded-2xl border border-slate-200 bg-white py-3 pr-4 pl-11 text-sm font-semibold text-slate-700 shadow-sm focus:border-[#059669] focus:outline-none focus:ring-2 focus:ring-[#059669]/15"
        />
      </div>

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full whitespace-nowrap">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70 text-left text-[11px] font-black uppercase tracking-wider text-slate-500">
                <th className="px-6 py-4">Guru</th>
                <th className="px-6 py-4">Bank</th>
                <th className="px-6 py-4 text-center">Pesanan</th>
                <th className="px-6 py-4">Gross</th>
                <th className="px-6 py-4">Platform 12%</th>
                <th className="px-6 py-4">PPh 2.5%</th>
                <th className="px-6 py-4">Net</th>
                <th className="px-6 py-4">Transfer Terakhir</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={9} className="px-6 py-12 text-center text-sm font-medium text-slate-500">
                    Memuat data payout...
                  </td>
                </tr>
              ) : filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-6 py-12 text-center text-sm font-medium text-slate-500">
                    Belum ada payout yang siap diproses.
                  </td>
                </tr>
              ) : (
                filteredRecords.map((record, index) => (
                  <tr key={record.dbId ?? `draft-${record.guruId}-${index}`} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={record.guruAvatar}
                          alt={record.guruName}
                          className="h-10 w-10 rounded-full border border-slate-200 bg-slate-100"
                        />
                        <div className="min-w-0">
                          <p className="truncate text-sm font-extrabold text-slate-800">
                            {record.guruName}
                          </p>
                          <p className="truncate text-xs font-semibold text-slate-400">
                            {record.guruEmail}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-slate-700">{record.bankName}</td>
                    <td className="px-6 py-4 text-center text-sm font-extrabold text-slate-800">
                      {record.orderCount}x
                    </td>
                    <td className="px-6 py-4 text-sm font-black text-slate-800">
                      {formatCurrency(record.grossAmount)}
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-rose-500">
                      -{formatCurrency(record.platformFeeAmount)}
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-rose-500">
                      -{formatCurrency(record.taxAmount)}
                    </td>
                    <td className="px-6 py-4 text-sm font-black text-[#059669]">
                      {formatCurrency(record.netAmount)}
                    </td>
                    <td className="px-6 py-4 text-xs font-semibold text-slate-500">
                      {record.lastTransferAt ? formatDateTime(record.lastTransferAt) : "Belum ada"}
                    </td>
                    <td className="px-6 py-4">
                       {renderStatusBadge(record.status)}
                    </td>
                    <td className="px-6 py-4">
                      {record.status === 'Menunggu' && (
                         <div className="flex items-center gap-2">
                           <button onClick={() => void handleAction(record, "Disetujui")} className="inline-flex items-center gap-1 px-3 py-1.5 border border-emerald-200 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-full text-[10px] font-bold">
                              <CheckCircle2 size={12}/> Setujui
                           </button>
                           <button onClick={() => openRejectModal(record)} className="inline-flex items-center gap-1 px-3 py-1.5 border border-rose-200 bg-rose-50 text-rose-500 hover:bg-rose-100 rounded-full text-[10px] font-bold">
                              Tolak
                           </button>
                         </div>
                      )}
                      {record.status === 'Disetujui' && (
                         <button onClick={() => void handleAction(record, "Sudah Dicairkan")} disabled={processingGuruId === record.guruId} className="inline-flex items-center gap-1.5 px-4 py-2 border border-blue-200 bg-blue-50 text-blue-600 hover:bg-blue-100 transition disabled:opacity-50 rounded-full text-[10px] font-bold">
                           <Send size={12}/> Proses Transfer
                         </button>
                      )}
                      {record.status === 'Ditolak' && (
                         <div className="flex items-center gap-2">
                           <button onClick={() => void handleAction(record, "Menunggu")} className="inline-flex items-center gap-1 px-3 py-1.5 border border-slate-200 bg-slate-50 text-slate-500 hover:bg-slate-100 rounded-full text-[10px] font-bold">
                              <RefreshCcw size={12}/> Reset
                           </button>
                           <span className="text-[10px] text-slate-400 italic max-w-[150px] truncate">{record.catatan}</span>
                         </div>
                      )}
                      {record.status === 'Sudah Dicairkan' && (
                         <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-[11px] font-black text-[#059669]">
                          <CheckCircle2 size={13} /> Selesai
                         </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/70 px-6 py-4">
          <p className="text-sm font-medium text-slate-500">
            Menampilkan <span className="font-bold text-[#059669]">{filteredRecords.length}</span>{" "}
            data payout.
          </p>
        </div>
      </div>

      {rejectModalOpen && (
         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-6 border border-slate-100">
               <h3 className="font-black text-slate-800 text-lg">Tolak Payout</h3>
               <p className="text-sm text-slate-500 mb-4">Guru: <span className="font-bold text-slate-800">{rejectRecord?.guruName}</span></p>
               
               <div className="mb-6">
                  <label className="text-xs font-bold text-slate-600 mb-1.5 block">Alasan Penolakan *</label>
                  <textarea 
                     rows={3}
                     className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:border-emerald-500"
                     placeholder="Contoh: Verifikasi rekening gagal, dokumen tidak lengkap..."
                     value={rejectReason}
                     onChange={(e) => setRejectReason(e.target.value)}
                  ></textarea>
               </div>
               
               <div className="flex gap-2 justify-end">
                  <button onClick={() => setRejectModalOpen(false)} className="px-5 py-2 text-sm font-bold text-slate-500 hover:text-slate-800">
                     Batal
                  </button>
                  <button onClick={handleRejectSubmit} className="bg-rose-400 hover:bg-rose-500 text-white px-5 py-2 rounded-xl text-sm font-bold shadow-sm">
                     Tolak Payout
                  </button>
               </div>
            </div>
         </div>
      )}

    </div>
  );
}
