"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { DollarSign, CreditCard, Users, Briefcase, CheckCircle2, Clock, XCircle, RefreshCcw } from "lucide-react";

export default function BillingDashboardPage() {
   const [pesanan, setPesanan] = useState<any[]>([]);
   const [isLoading, setIsLoading] = useState(true);

   const supabase = createClient();

   useEffect(() => {
      fetchData();
   }, []);

   const fetchData = async () => {
      setIsLoading(true);
      const { data, error } = await supabase.from('billing_pesanan').select('*').order('order_date', { ascending: false });
      if (data) {
         setPesanan(data);
      }
      setIsLoading(false);
   };

   // Calculations
   const totalPesanan = pesanan.length;
   
   // Normalize status based on image mapping:
   // Lunas/Selesai -> Berhasil
   // Menunggu Bayar/Menunggu Guru -> Pending
   // Batal -> Gagal
   const berhasilCount = pesanan.filter(p => ['Lunas', 'Selesai'].includes(p.status)).length;
   const pendingCount = pesanan.filter(p => ['Menunggu Bayar', 'Menunggu Guru', 'Pending'].includes(p.status)).length;
   const gagalCount = pesanan.filter(p => p.status === 'Batal').length;
   const refundCount = 0; // dummy for now

   const activePesanan = pendingCount + berhasilCount; // e.g. 5 dari 9

   const totalRevenue = pesanan.filter(p => ['Lunas', 'Selesai'].includes(p.status)).reduce((sum, p) => sum + (p.price || 0), 0);
   const avgRevenue = berhasilCount > 0 ? totalRevenue / berhasilCount : 0;

   // Success rate
   const successRate = totalPesanan === 0 ? 0 : Math.round((berhasilCount / totalPesanan) * 100);
   const activeRate = totalPesanan === 0 ? 0 : Math.round((activePesanan / totalPesanan) * 100);

   // Payment methods
   const gopayOrders = pesanan.filter(p => p.payment_method?.toLowerCase() === 'gopay');
   const qrisOrders = pesanan.filter(p => p.payment_method?.toLowerCase() === 'qris');
   const gopayTotal = gopayOrders.reduce((sum, p) => sum + (p.price || 0), 0);
   const qrisTotal = qrisOrders.reduce((sum, p) => sum + (p.price || 0), 0);
   const sumMethods = gopayTotal + qrisTotal;
   const gopayPct = sumMethods === 0 ? 0 : Math.round((gopayTotal / sumMethods) * 100);
   const qrisPct = sumMethods === 0 ? 0 : Math.round((qrisTotal / sumMethods) * 100);

   const formatCurrency = (val: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val);
   const formatDate = (dateString: string) => {
      const d = new Date(dateString);
      return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
   };

   // SVG Circular Progress Helper
   const CircularProgress = ({ val, color, text, subtext }: { val: number, color: string, text: string, subtext: string }) => {
      const radius = 35;
      const circumference = 2 * Math.PI * radius;
      const strokeDashoffset = circumference - (val / 100) * circumference;

      return (
         <div className="flex flex-col items-center justify-center">
            <div className="relative flex items-center justify-center w-24 h-24">
               <svg className="transform -rotate-90 w-24 h-24 text-slate-100">
                  <circle cx="48" cy="48" r={radius} stroke="currentColor" strokeWidth="8" fill="none" />
                  <circle 
                     cx="48" cy="48" r={radius} 
                     stroke={color} strokeWidth="8" fill="none" 
                     strokeDasharray={circumference} 
                     strokeDashoffset={strokeDashoffset} 
                     strokeLinecap="round" 
                     className="transition-all duration-1000 ease-out"
                  />
               </svg>
               <span className="absolute font-black text-slate-800 text-lg">{val}{val !== 2 ? '%' : ''}</span>
            </div>
            <span className="font-extrabold text-slate-700 text-sm mt-3">{text}</span>
            <span className="text-xs font-semibold text-slate-400">{subtext}</span>
         </div>
      );
   };

   return (
      <div className="max-w-[1400px] mx-auto pb-12 animate-in fade-in duration-300">
         
         {/* HEADER */}
         <div className="flex justify-between items-center mb-6 mt-2">
            <h1 className="text-2xl font-black text-slate-800 font-serif">Billing Dashboard</h1>
            <div className="bg-white border border-slate-200 px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 flex items-center gap-2 shadow-sm">
               <Clock size={16} className="text-slate-400" />
               April 2026 <span className="text-[10px] ml-2 text-slate-400">▼</span>
            </div>
         </div>

         {/* ROW 1: STATUS KEUANGAN & TOTAL REVENUE */}
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            
            {/* Status Keuangan - 2 cols span */}
            <div className="lg:col-span-2 bg-white border border-slate-100 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
               <h3 className="font-extrabold text-slate-800 mb-6">Status Keuangan</h3>
               <div className="flex justify-around items-center pt-2 pb-4">
                  <CircularProgress val={successRate} color="#059669" text="Tingkat Sukses" subtext={`${berhasilCount} dari ${totalPesanan}`} />
                  <CircularProgress val={activeRate} color="#3b82f6" text="Pesanan Aktif" subtext={`${activePesanan} dari ${totalPesanan}`} />
                  <CircularProgress val={2} color="#f59e0b" text="Payout Pending" subtext="2 menunggu" />
               </div>
            </div>

            {/* Total Revenue */}
            <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm flex flex-col">
               <h3 className="font-extrabold text-slate-800 mb-4">Total Revenue</h3>
               <h2 className="text-3xl font-black text-[#059669] mb-1">{formatCurrency(totalRevenue)}</h2>
               <span className="text-sm font-bold text-slate-400 flex items-center gap-1 mb-8"><span className="text-[#059669]">↗</span> {berhasilCount} transaksi</span>
               
               <div className="space-y-4">
                  <div>
                     <div className="flex justify-between text-xs font-extrabold text-slate-600 mb-2">
                        <span>GoPay</span><span>{gopayPct}%</span>
                     </div>
                     <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-[#059669] h-full rounded-full" style={{ width: `${gopayPct}%` }}></div>
                     </div>
                  </div>
                  <div>
                     <div className="flex justify-between text-xs font-extrabold text-slate-600 mb-2">
                        <span>QRIS</span><span>{qrisPct}%</span>
                     </div>
                     <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-[#059669] h-full rounded-full" style={{ width: `${qrisPct}%` }}></div>
                     </div>
                  </div>
               </div>
            </div>
         </div>


         {/* ROW 2: OVERVIEW CARDS */}
         <div className="mb-6">
            <h3 className="font-extrabold text-slate-800 mb-4 ml-1">Overview</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
               <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                     <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#059669] flex items-center justify-center shrink-0"><DollarSign size={20} /></div>
                     <span className="font-extrabold text-slate-800 text-sm">Total Revenue</span>
                  </div>
                  <h3 className="text-2xl font-black text-slate-800 mb-1">{formatCurrency(totalRevenue)}</h3>
                  <p className="text-xs font-semibold text-slate-400">{berhasilCount} transaksi berhasil</p>
               </div>
               
               <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                     <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center shrink-0"><CreditCard size={20} /></div>
                     <span className="font-extrabold text-slate-800 text-sm">Total Pembayaran</span>
                  </div>
                  <h3 className="text-2xl font-black text-slate-800 mb-1">{berhasilCount + pendingCount}</h3>
                  <p className="text-xs font-semibold text-slate-400">{berhasilCount} berhasil</p>
               </div>

               <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                     <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-500 flex items-center justify-center shrink-0"><Users size={20} /></div>
                     <span className="font-extrabold text-slate-800 text-sm">Pesanan Aktif</span>
                  </div>
                  <h3 className="text-2xl font-black text-slate-800 mb-1">{activePesanan}</h3>
                  <p className="text-xs font-semibold text-slate-400">dari {totalPesanan} total pesanan</p>
               </div>

               <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                     <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center shrink-0"><Briefcase size={20} /></div>
                     <span className="font-extrabold text-slate-800 text-sm">Avg. Transaksi</span>
                  </div>
                  <h3 className="text-2xl font-black text-slate-800 mb-1">{formatCurrency(avgRevenue)}</h3>
                  <p className="text-xs font-semibold text-slate-400">{berhasilCount} transaksi</p>
               </div>
            </div>
         </div>

         {/* ROW 3: STATISTIK & TREN */}
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            
            {/* Statistik Pembayaran */}
            <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm flex flex-col">
               <h3 className="font-extrabold text-slate-800 mb-6">Statistik Pembayaran</h3>
               <div className="grid grid-cols-2 gap-4 flex-1">
                  <div className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 bg-emerald-50/30">
                     <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-emerald-100 text-[#059669] flex justify-center items-center"><CheckCircle2 size={20}/></div>
                        <div>
                           <div className="font-extrabold text-slate-800 text-sm">Berhasil</div>
                           <div className="text-[10px] font-bold text-slate-400">Transaksi</div>
                        </div>
                     </div>
                     <div className="text-2xl font-black text-slate-800">{berhasilCount}</div>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 bg-amber-50/30">
                     <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-600 flex justify-center items-center"><Clock size={20}/></div>
                        <div>
                           <div className="font-extrabold text-slate-800 text-sm">Pending</div>
                           <div className="text-[10px] font-bold text-slate-400">Transaksi</div>
                        </div>
                     </div>
                     <div className="text-2xl font-black text-slate-800">{pendingCount}</div>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 bg-rose-50/30">
                     <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-500 flex justify-center items-center"><XCircle size={20}/></div>
                        <div>
                           <div className="font-extrabold text-slate-800 text-sm">Gagal</div>
                           <div className="text-[10px] font-bold text-slate-400">Transaksi</div>
                        </div>
                     </div>
                     <div className="text-2xl font-black text-slate-800">{gagalCount}</div>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 bg-blue-50/30">
                     <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-500 flex justify-center items-center"><RefreshCcw size={20}/></div>
                        <div>
                           <div className="font-extrabold text-slate-800 text-sm">Refund</div>
                           <div className="text-[10px] font-bold text-slate-400">Transaksi</div>
                        </div>
                     </div>
                     <div className="text-2xl font-black text-slate-800">{refundCount}</div>
                  </div>
               </div>
            </div>

            {/* Tren Revenue (Pseudo Chart) */}
            <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm flex flex-col">
               <div className="flex justify-between items-center mb-6">
                  <h3 className="font-extrabold text-slate-800">Tren Revenue</h3>
                  <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-[#059669]"></div><span className="text-[10px] font-bold text-slate-400">Revenue</span></div>
               </div>
               <div className="relative flex-1 w-full flex items-end">
                  {/* Grid Lines */}
                  <div className="absolute inset-0 flex flex-col justify-between pt-2 pb-6">
                     <div className="border-b border-slate-100 w-full"></div>
                     <div className="border-b border-slate-100 w-full"></div>
                     <div className="border-b border-slate-100 w-full"></div>
                     <div className="border-b border-slate-100 w-full"></div>
                  </div>
                  {/* Very basic pseudo chart polygon mimicking image */}
                  <svg viewBox="0 0 400 150" className="w-full h-40 z-10 preserve-3d" preserveAspectRatio="none">
                     <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                           <stop offset="0%" stopColor="#059669" stopOpacity="0.2" />
                           <stop offset="100%" stopColor="#059669" stopOpacity="0" />
                        </linearGradient>
                     </defs>
                     <polygon points="0,150 0,10 130,5 260,110 400,100 400,150" fill="url(#gradient)" />
                     <polyline points="0,10 130,5 260,110 400,100" fill="none" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                     {/* Data points */}
                     <circle cx="0" cy="10" r="3" fill="#fff" stroke="#059669" strokeWidth="2" />
                     <circle cx="130" cy="5" r="3" fill="#fff" stroke="#059669" strokeWidth="2" />
                     <circle cx="260" cy="110" r="3" fill="#fff" stroke="#059669" strokeWidth="2" />
                     <circle cx="400" cy="100" r="3" fill="#fff" stroke="#059669" strokeWidth="2" />
                  </svg>
                  {/* X-axis labels */}
                  <div className="absolute bottom-0 w-full flex justify-between text-[10px] font-bold text-slate-400 px-1">
                     <span>W1</span><span>W2</span><span>W3</span><span>W4</span>
                  </div>
               </div>
            </div>

         </div>

         {/* TABLE: Pembayaran */}
         <div className="bg-white border border-slate-100 rounded-3xl shadow-sm flex flex-col p-6 overflow-hidden">
            <div className="flex justify-between items-center mb-6">
               <h3 className="font-extrabold text-slate-800 text-lg">Pembayaran</h3>
               <span className="text-xs font-bold text-slate-400">{totalPesanan} transaksi</span>
            </div>

            <div className="overflow-x-auto">
               <table className="w-full whitespace-nowrap">
                  <thead>
                     <tr className="text-slate-500 text-xs font-black tracking-wider text-left border-b border-slate-100">
                        <th className="px-4 py-4">ID</th>
                        <th className="px-4 py-4">User</th>
                        <th className="px-4 py-4">Trainer</th>
                        <th className="px-4 py-4">Payment</th>
                        <th className="px-4 py-4">Jumlah</th>
                        <th className="px-4 py-4">Status</th>
                        <th className="px-4 py-4 text-right">Tanggal</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                     {isLoading ? (
                        <tr><td colSpan={7} className="px-4 py-12 text-center text-slate-400 font-bold text-sm">Memuat data...</td></tr>
                     ) : pesanan.length === 0 ? (
                        <tr><td colSpan={7} className="px-4 py-12 text-center text-slate-400 font-bold text-sm">Belum ada pesanan.</td></tr>
                     ) : (
                        pesanan.map((item, idx) => {
                           let badgeClass = "bg-slate-100 text-slate-500";
                           let finalStatus = "Unknown";
                           if (['Lunas', 'Selesai'].includes(item.status)) {
                              badgeClass = "bg-emerald-50 text-[#059669]";
                              finalStatus = "Berhasil";
                           } else if (['Menunggu Bayar', 'Menunggu Guru', 'Pending'].includes(item.status)) {
                              badgeClass = "bg-amber-50 text-amber-600";
                              finalStatus = "Pending";
                           } else if (item.status === 'Batal') {
                              badgeClass = "bg-rose-50 text-rose-500";
                              finalStatus = "Gagal";
                           }

                           return (
                              <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                                 <td className="px-4 py-4 text-sm font-bold text-slate-400">#{1013 + idx}</td>
                                 <td className="px-4 py-4">
                                    <div className="flex flex-col">
                                       <span className="text-sm font-extrabold text-slate-800">{item.member_name}</span>
                                       <span className="text-[10px] font-semibold text-slate-500">{item.member_email}</span>
                                    </div>
                                 </td>
                                 <td className="px-4 py-4">
                                    <div className="flex flex-col">
                                       <span className="text-sm font-semibold text-slate-600">{item.guru_name}</span>
                                       <span className="text-[10px] font-semibold text-slate-400">{item.guru_email}</span>
                                    </div>
                                 </td>
                                 <td className="px-4 py-4 text-sm font-bold text-slate-500">{item.payment_method}</td>
                                 <td className="px-4 py-4 text-sm font-black text-slate-800">{formatCurrency(item.price)}</td>
                                 <td className="px-4 py-4">
                                    <span className={`px-3 py-1.5 rounded-lg text-[10px] font-black tracking-wide ${badgeClass}`}>
                                       {finalStatus}
                                    </span>
                                 </td>
                                 <td className="px-4 py-4 text-right text-sm font-bold text-slate-400">{formatDate(item.order_date)}</td>
                              </tr>
                           );
                        })
                     )}
                  </tbody>
               </table>
            </div>
         </div>

      </div>
   );
}
