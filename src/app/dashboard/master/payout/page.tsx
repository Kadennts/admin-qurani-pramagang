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

      const nextRecords = gurus
        .map((guru, index) => {
          const availableOrders = settledOrders.filter(
            (order) => order.guru_name === guru.name && !coveredOrderIds.has(order.id)
          );
          const relatedTransfers = transfers.filter(
            (transfer) => transfer.guru_id === guru.id || transfer.guru_name === guru.name
          );

          const grossAmount = availableOrders.reduce(
            (total, order) => total + calculateFinancials(order.price).gross,
            0
          );
          const platformFeeAmount = availableOrders.reduce(
            (total, order) => total + calculateFinancials(order.price).platformFee,
            0
          );
          const taxAmount = availableOrders.reduce(
            (total, order) => total + calculateFinancials(order.price).taxFee,
            0
          );
          const netAmount = availableOrders.reduce(
            (total, order) => total + calculateFinancials(order.price).net,
            0
          );
          const transferredTotal = relatedTransfers.reduce(
            (total, transfer) => total + Number(transfer.net_amount ?? 0),
            0
          );
          const lastTransferAt =
            relatedTransfers[0]?.processed_at ?? relatedTransfers[0]?.created_at ?? null;

          return {
            guruId: guru.id,
            guruName: guru.name,
            guruEmail:
              guru.email ??
              `${guru.name.toLowerCase().replace(/\s+/g, ".")}@qurani.app`,
            guruAvatar:
              guru.avatar_url ?? `https://api.dicebear.com/7.x/avataaars/svg?seed=${guru.name}`,
            bankName: getDeterministicBankName(guru.name, index),
            orderCount: availableOrders.length,
            grossAmount,
            platformFeeAmount,
            taxAmount,
            netAmount,
            orderIds: availableOrders.map((order) => order.id),
            lastTransferAt,
            transferredTotal,
          };
        })
        .filter((record) => record.orderCount > 0 || record.transferredTotal > 0);

      setRecords(nextRecords);
      setProcessedTransferTotal(
        transfers.reduce((total, transfer) => total + Number(transfer.net_amount ?? 0), 0)
      );
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

  const readyToTransferCount = records.filter((record) => record.netAmount > 0).length;
  const totalOutstandingGross = records.reduce((total, record) => total + record.grossAmount, 0);
  const totalOutstandingNet = records.reduce((total, record) => total + record.netAmount, 0);

  const handleProcessTransfer = async (record: PayoutRecord) => {
    if (!isTransferTableReady) {
      toast.error("Tabel payout transfer belum tersedia. Jalankan SQL payout terlebih dahulu.");
      return;
    }

    if (record.orderIds.length === 0 || record.netAmount <= 0) {
      toast.error("Tidak ada saldo payout baru yang bisa diproses untuk guru ini.");
      return;
    }

    setProcessingGuruId(record.guruId);

    try {
      const { error } = await supabase.from("master_payout_transfers").insert([
        {
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
          status: "Pending",
        },
      ]);

      if (error) {
        throw error;
      }

      toast.success(`Transfer ${record.guruName} berhasil dicatat ke Supabase.`);
      await fetchData();
    } catch (error) {
      console.error("Failed processing payout transfer", error);
      toast.error("Gagal menyimpan proses transfer payout.");
    } finally {
      setProcessingGuruId(null);
    }
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
                filteredRecords.map((record) => (
                  <tr key={record.guruId} className="hover:bg-slate-50/80 transition-colors">
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
                      {record.netAmount > 0 ? (
                        <button
                          type="button"
                          onClick={() => void handleProcessTransfer(record)}
                          disabled={processingGuruId === record.guruId}
                          className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-xs font-black text-blue-600 transition-colors hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          <Send size={14} />
                          {processingGuruId === record.guruId ? "Memproses..." : "Proses Transfer"}
                        </button>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-[11px] font-black text-[#059669]">
                          <CheckCircle2 size={13} />
                          Sudah Dicairkan
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
          <p className="text-sm font-semibold text-slate-400">
            Transfer yang diproses di sini akan langsung masuk ke halaman Wallet.
          </p>
        </div>
      </div>
    </div>
  );
}
