"use client";

import { useState, useEffect } from "react";
import { Search, Calendar, Trash2, Bell, Zap, MoreHorizontal, CheckCircle2, ChevronRight, XCircle } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function BillingPesananPage() {
   const router = useRouter();
   const [pesanan, setPesanan] = useState<any[]>([]);
   const [members, setMembers] = useState<any[]>([]);
   const [gurus, setGurus] = useState<any[]>([]);

   const [isLoading, setIsLoading] = useState(true);
   const [activeTab, setActiveTab] = useState("Semua");
   const [searchQuery, setSearchQuery] = useState("");

   const [notifications, setNotifications] = useState<any[]>([]);
   const [isNotifOpen, setIsNotifOpen] = useState(false);

   // Simulation Modal States
   const [isModalOpen, setIsModalOpen] = useState(false);
   const [modalStep, setModalStep] = useState(1); // 1: Member, 2: Guru, 3: Paket, 4: Payment, 5: Success
   const [orderDraft, setOrderDraft] = useState<any>({
      member: null,
      guru: null,
      paket: null,
      paymentMethod: null
   });

   const supabase = createClient();

   useEffect(() => {
      fetchData();
   }, [supabase]);

   const fetchData = async () => {
      setIsLoading(true);

      // Fetch Pesanan
      const { data: pesananData } = await supabase.from('billing_pesanan').select('*').order('order_date', { ascending: false });
      if (pesananData) setPesanan(pesananData);

      // Fetch Members
      const { data: membersData } = await supabase.from('billing_members').select('*');
      if (membersData) setMembers(membersData);

      // Fetch Gurus
      const { data: gurusData } = await supabase.from('master_guru').select('*');
      if (gurusData) setGurus(gurusData);

      setIsLoading(false);
   };

   const clearNotifications = () => {
      setNotifications([]);
   };

   const openSimulasi = () => {
      setModalStep(1);
      setOrderDraft({ member: null, guru: null, paket: null, paymentMethod: null });
      setIsModalOpen(true);
   };

   // Helper untuk generate harga simulasi secara deterministic
   const getPackagesForGuru = (guru: any) => {
      if (!guru) return [];
      const seed = guru.name.charCodeAt(0) + guru.name.charCodeAt(1);
      const roundedBase = Math.round((70000 + (seed * 300)) / 5000) * 5000;
      return [
         { name: '1x Pertemuan', session: '1x sesi - Satuan', price: roundedBase },
         { name: '5x Pertemuan', session: '5x sesi - Hemat', price: (roundedBase * 5) - Math.round((roundedBase * 0.1) / 5000) * 5000 },
         { name: '10x Pertemuan', session: '10x sesi - Intensif', price: (roundedBase * 10) - Math.round((roundedBase * 0.2) / 5000) * 5000 }
      ];
   };

   const handleNextStep = () => {
      if (modalStep === 3) {
         // Trigger notification simulation when reaching Payment Step (step 4)
         toast("Pesanan Baru — Menunggu Bayar", {
            description: `${orderDraft.member.name} • ${orderDraft.paket.name} • ${orderDraft.guru.name}`,
            icon: "🛍️"
         });
         setNotifications(prev => [{ id: Date.now(), title: "Pesanan Baru — Menunggu Bayar", msg: `${orderDraft.member.name} • ${orderDraft.paket.name} • ${orderDraft.guru.name}` }, ...prev]);
         setModalStep(4);
      } else if (modalStep === 4) {
         submitNewOrder();
      } else {
         setModalStep(prev => prev + 1);
      }
   };

   const submitNewOrder = async () => {
      const newOrder = {
         member_name: orderDraft.member.name,
         member_email: orderDraft.member.email,
         member_initials: orderDraft.member.initials,
         member_color: orderDraft.member.avatar_color,
         guru_name: orderDraft.guru.name,
         guru_email: orderDraft.guru.email,
         package_name: orderDraft.paket.name,
         package_sessions: orderDraft.paket.session.split(' - ')[0],
         price: orderDraft.paket.price,
         payment_method: orderDraft.paymentMethod,
         status: 'Menunggu Guru'
      };

      // Optimistic
      setPesanan(prev => [
         { id: Date.now().toString(), order_date: new Date().toISOString(), ...newOrder },
         ...prev
      ]);
      setModalStep(5); // Success Screen

      // Toast: payment done notification
      toast.success(`Pembayaran Lunas — Pesanan Baru`, {
         description: `Pesanan atas nama ${orderDraft.member.name} telah diproses dan masuk ke dalam sistem via ${orderDraft.paymentMethod || 'Transfer'}.`
      });
      setNotifications(prev => [{ id: Date.now(), title: "Pembayaran Berhasil", msg: `${orderDraft.member.name} • ${orderDraft.paymentMethod} • Rp ${orderDraft.paket.price?.toLocaleString('id-ID')}` }, ...prev]);

      // Database insert
      await supabase.from('billing_pesanan').insert([newOrder]);
   };

   const getStatusBadge = (status: string) => {
      switch (status) {
         case 'Menunggu Guru':
         case 'Menunggu Bayar':
            return <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-yellow-50 text-yellow-600 rounded-full text-xs font-bold border border-yellow-200"><div className="w-1.5 h-1.5 rounded-full bg-yellow-500"></div> {status}</span>;
         case 'Lunas':
            return <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-xs font-bold border border-emerald-200"><div className="w-1.5 h-1.5 rounded-full bg-[#059669]"></div> {status}</span>;
         case 'Selesai':
            return <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold border border-blue-200"><div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div> {status}</span>;
         case 'Pending':
            return <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-500 rounded-full text-xs font-bold border border-slate-200"><div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div> {status}</span>;
         case 'Batal':
            return <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-50 text-red-600 rounded-full text-xs font-bold border border-red-200"><div className="w-1.5 h-1.5 rounded-full bg-red-500"></div> {status}</span>;
         default:
            return <span>{status}</span>;
      }
   };

   const formatCurrency = (amount: number) => {
      return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
   };

   const formatDate = (dStr: string) => {
      const d = new Date(dStr);
      return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
   };

   let filtered = pesanan;
   if (activeTab !== "Semua") {
      filtered = pesanan.filter(p => {
         if (activeTab === 'Lunas') return p.status === 'Lunas';
         if (activeTab === 'Aktif') return p.status === 'Menunggu Guru' || p.status === 'Menunggu Bayar';
         if (activeTab === 'Pending') return p.status === 'Pending';
         if (activeTab === 'Batal') return p.status === 'Batal';
         if (activeTab === 'Selesai') return p.status === 'Selesai';
         return true;
      });
   }

   if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(p =>
         p.member_name.toLowerCase().includes(q) ||
         p.guru_name.toLowerCase().includes(q) ||
         p.package_name.toLowerCase().includes(q)
      );
   }

   const stepIndicator = (num: number, label: string) => (
      <div className="flex items-center gap-2">
         <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${modalStep > num ? 'bg-[#059669] text-white' : modalStep === num ? 'bg-[#059669] text-white' : 'bg-slate-100 text-slate-400'}`}>
            {modalStep > num ? <CheckCircle2 size={12} strokeWidth={3} /> : num}
         </div>
         <span className={`text-xs font-bold tracking-wide ${modalStep >= num ? 'text-slate-700' : 'text-slate-400'}`}>{label}</span>
      </div>
   );

   return (
      <div className="max-w-[1400px] mx-auto pb-12 animate-in fade-in duration-300">

         {/* Top Filter Bar */}
         <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 mb-2 mt-2">

            <div className="relative w-full xl:max-w-md">
               <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
               <input
                  type="text"
                  placeholder="Cari member, guru, paket..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-24 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 shadow-sm"
               />
               <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-slate-50 border border-slate-200 text-slate-600 text-xs font-bold px-4 py-1.5 rounded-xl flex items-center gap-1.5 hover:bg-slate-100">
                  <Search size={12} /> Cari
               </button>
            </div>

            <div className="flex items-center gap-3">
               <button className="bg-white border border-slate-200 text-slate-600 text-sm font-bold px-5 py-3 rounded-2xl flex items-center gap-2 shadow-sm hover:bg-slate-50">
                  <Calendar size={16} className="text-slate-400" /> Year 2026 <ChevronRight size={14} className="rotate-90 text-slate-400" />
               </button>

               {notifications.length > 0 && (
                  <button onClick={clearNotifications} className="w-12 h-12 bg-white border border-rose-200 text-rose-500 hover:bg-rose-50 rounded-2xl flex items-center justify-center shadow-sm transition-colors relative animate-in fade-in zoom-in">
                     <Trash2 size={20} />
                  </button>
               )}

               <div className="relative">
                  <button
                     onClick={() => setIsNotifOpen(!isNotifOpen)}
                     className="w-12 h-12 bg-white border border-slate-200 text-slate-500 hover:bg-slate-50 rounded-2xl flex items-center justify-center shadow-sm transition-colors relative"
                  >
                     <Bell size={20} />
                     {notifications.length > 0 && (
                        <span className="absolute 1 top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
                     )}
                  </button>

                  {isNotifOpen && (
                     <div className="absolute right-0 top-[56px] w-[320px] bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
                        <div className="p-4 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
                           <h4 className="font-extrabold text-slate-800 text-sm">Notifikasi Simulasi</h4>
                           <button onClick={() => setIsNotifOpen(false)} className="text-slate-400 hover:text-slate-600"><XCircle size={16}/></button>
                        </div>
                        <div className="p-4 max-h-[300px] overflow-y-auto custom-scrollbar">
                           {notifications.length === 0 ? (
                              <p className="text-center text-slate-400 text-xs font-bold py-6">Belum ada notifikasi.</p>
                           ) : (
                              <div className="space-y-4">
                                 {notifications.map((n) => (
                                    <div key={n.id} className="flex gap-3">
                                       <div className="w-8 h-8 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 shadow-sm text-xs">🛍️</div>
                                       <div>
                                          <p className="font-extrabold text-slate-800 text-[13px]">{n.title || "Pesanan Baru"}</p>
                                          <p className="text-xs font-semibold text-slate-500 mt-0.5 leading-relaxed">{n.msg}</p>
                                       </div>
                                    </div>
                                 ))}
                              </div>
                           )}
                        </div>
                     </div>
                  )}
               </div>

               <button
                  onClick={openSimulasi}
                  className="w-12 h-12 bg-[#059669] hover:bg-[#047857] text-white rounded-2xl flex items-center justify-center shadow-md transition-colors shadow-[#059669]/20"
               >
                  <Zap size={22} className="fill-current" />
               </button>
            </div>
         </div>

         {/* Main Container */}
         <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden flex flex-col min-h-[500px] mt-6">

            {/* Tabs */}
            <div className="flex items-center gap-6 px-8 pt-6 pb-2 border-b border-slate-100 overflow-x-auto">
               {['Semua', 'Lunas', 'Aktif', 'Pending', 'Batal', 'Selesai'].map((tab) => {
                  const mapCount = {
                     'Semua': pesanan.length,
                     'Lunas': pesanan.filter(p => p.status === 'Lunas').length,
                     'Aktif': pesanan.filter(p => p.status === 'Menunggu Guru' || p.status === 'Menunggu Bayar').length,
                     'Pending': 0, 'Batal': 0, 'Selesai': pesanan.filter(p => p.status === 'Selesai').length
                  }[tab];

                  return (
                     <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`font-extrabold text-sm pb-4 border-b-2 transition-colors whitespace-nowrap ${activeTab === tab ? 'border-[#059669] text-[#059669]' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
                     >
                        {tab} <span className={activeTab === tab ? "opacity-100 transition-opacity" : "opacity-50"}>{mapCount}</span>
                     </button>
                  );
               })}
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
               <table className="w-full whitespace-nowrap">
                  <thead>
                     <tr className="text-slate-800 text-xs font-black tracking-wide text-left border-b border-slate-100">
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
                     {isLoading ? (
                        <tr><td colSpan={8} className="px-8 py-12 text-center text-slate-500 font-medium">Memuat pesanan...</td></tr>
                     ) : filtered.length === 0 ? (
                        <tr><td colSpan={8} className="px-8 py-12 text-center text-slate-500 font-medium">Tidak ada pesanan.</td></tr>
                     ) : (
                        filtered.map((item) => (
                           <tr 
                              key={item.id} 
                              onClick={() => router.push(`/dashboard/billing/pesanan/${item.id}`)}
                              className="hover:bg-slate-50/80 transition-colors cursor-pointer"
                           >
                              <td className="px-8 py-5">
                                 <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-extrabold text-xs tracking-wider shadow-sm shrink-0 ${item.member_color || 'bg-slate-400'}`}>
                                       {item.member_initials}
                                    </div>
                                    <div className="flex flex-col">
                                       <span className="font-extrabold text-slate-800 text-sm">{item.member_name}</span>
                                       <span className="text-[11px] font-bold text-slate-400">{item.member_email}</span>
                                    </div>
                                 </div>
                              </td>
                              <td className="px-6 py-5">
                                 <div className="flex flex-col">
                                    <span className="font-bold text-slate-700 text-sm">{item.guru_name}</span>
                                    <span className="text-[11px] font-medium text-slate-400">{item.guru_email}</span>
                                 </div>
                              </td>
                              <td className="px-6 py-5">
                                 <div className="flex flex-col">
                                    <span className="font-extrabold text-[#059669] text-sm">{item.package_name}</span>
                                    <span className="text-[11px] font-bold text-slate-400 mt-0.5">{item.package_sessions}</span>
                                 </div>
                              </td>
                              <td className="px-6 py-5 text-slate-500 font-bold text-sm tracking-wide">
                                 {formatDate(item.order_date)}
                              </td>
                              <td className="px-6 py-5 text-slate-800 font-black text-sm tracking-wide">
                                 {formatCurrency(item.price)}
                              </td>
                              <td className="px-6 py-5">
                                 {item.payment_method === '—' || !item.payment_method ? (
                                    <span className="text-slate-400 font-bold">—</span>
                                 ) : (
                                    <span className="text-slate-600 font-bold text-sm">{item.payment_method}</span>
                                 )}
                              </td>
                              <td className="px-6 py-5">
                                 {getStatusBadge(item.status)}
                              </td>
                              <td className="px-8 py-5 text-center">
                                 <button className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center mx-auto text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors">
                                    <MoreHorizontal size={14} />
                                 </button>
                              </td>
                           </tr>
                        ))
                     )}
                  </tbody>
               </table>
            </div>

            <div className="bg-[#fcfcfc] border-t border-slate-100 p-5 mt-auto flex items-center justify-between">
               <div className="text-sm font-bold text-slate-400 tracking-wide ml-3">
                  Menampilkan <span className="font-extrabold text-[#059669]">1-{filtered.length}</span> dari {pesanan.length} pesanan
               </div>
               <div className="flex items-center gap-2 text-slate-400 font-bold mr-3">
                  <button className="w-8 h-8 flex justify-center items-center rounded-lg hover:bg-slate-200 transition-colors">&lt;</button>
                  <button className="w-8 h-8 flex justify-center items-center rounded-lg border border-slate-200 bg-white text-slate-600 shadow-sm">1</button>
                  <button className="w-8 h-8 flex justify-center items-center rounded-lg hover:bg-slate-200 transition-colors">&gt;</button>
               </div>
            </div>
         </div>


         {/* NEW ORDER WIZARD MODAL */}
         {isModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
               <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-100 flex flex-col relative" style={{ minHeight: '600px' }}>

                  <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 transition-colors z-20">
                     <XCircle size={20} />
                  </button>

                  {/* Modal Header */}
                  <div className="px-8 pt-8 pb-6 border-b border-slate-100">
                     <h2 className="text-lg font-black text-slate-800 flex items-center gap-2 mb-6 font-serif">
                        <Zap size={20} className="text-[#059669] fill-current shadow-sm" /> Simulasi Pesanan Baru
                     </h2>

                     <div className="flex items-center justify-between relative px-2">
                        <div className="absolute left-0 right-0 top-3 border-t-2 border-slate-100 z-0"></div>
                        <div className="z-10 bg-white pr-2">{stepIndicator(1, "Pilih Member")}</div>
                        <div className="z-10 bg-white px-2">{stepIndicator(2, "Pilih Guru")}</div>
                        <div className="z-10 bg-white px-2">{stepIndicator(3, "Pilih Paket")}</div>
                        <div className="z-10 bg-white pl-2">{stepIndicator(4, "Pembayaran")}</div>
                     </div>
                  </div>

                  {/* Step Content */}
                  <div className="p-8 flex-1 overflow-y-auto custom-scrollbar flex flex-col items-center">

                     {modalStep === 1 && (
                        <div className="w-full animate-in slide-in-from-right-4 duration-300">
                           <p className="text-sm font-bold text-slate-800 mb-3 font-serif">Pilih member yang memesan:</p>
                           <div className="space-y-3 h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                              {members.map(m => (
                                 <div
                                    key={m.id}
                                    onClick={() => setOrderDraft({ ...orderDraft, member: m })}
                                    className={`p-4 rounded-xl border-2 flex items-center justify-between cursor-pointer transition-all ${orderDraft.member?.id === m.id ? 'border-[#059669] bg-emerald-50/50 shadow-sm' : 'border-slate-100 hover:border-slate-200'
                                       }`}
                                 >
                                    <div className="flex items-center gap-4">
                                       <div className={`w-10 h-10 rounded-full flex justify-center items-center text-white font-black text-xs shadow-sm ${m.avatar_color}`}>{m.initials}</div>
                                       <div>
                                          <h4 className="font-extrabold text-slate-800 text-sm">{m.name}</h4>
                                          <p className="text-xs font-semibold text-slate-400">{m.email}</p>
                                       </div>
                                    </div>
                                    {orderDraft.member?.id === m.id && <CheckCircle2 className="text-[#059669]" size={20} />}
                                 </div>
                              ))}
                           </div>
                        </div>
                     )}

                     {modalStep === 2 && (
                        <div className="w-full animate-in slide-in-from-right-4 duration-300">
                           <p className="text-sm font-bold text-slate-800 mb-3 font-serif">Pilih guru:</p>
                           <div className="space-y-3 h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                              {gurus.map(g => (
                                 <div
                                    key={g.id}
                                    onClick={() => setOrderDraft({ ...orderDraft, guru: g, paket: null })}
                                    className={`p-4 rounded-xl border-2 flex items-center justify-between cursor-pointer transition-all ${orderDraft.guru?.id === g.id ? 'border-[#059669] bg-emerald-50/50 shadow-sm' : 'border-slate-100 hover:border-slate-200'
                                       }`}
                                 >
                                    <div className="flex items-center gap-4">
                                       <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 border border-slate-200">
                                          <img src={g.avatar_url} alt="Guru" className="w-full h-full object-cover" />
                                       </div>
                                       <div>
                                          <h4 className="font-extrabold text-slate-800 text-sm">{g.name}</h4>
                                          <p className="text-xs font-bold text-amber-500 tracking-wide mt-0.5">⭐ {g.rating || '0.0'} <span className="text-slate-400 ml-1">• {g.murid} murid</span></p>
                                       </div>
                                    </div>
                                    {orderDraft.guru?.id === g.id && <CheckCircle2 className="text-[#059669]" size={20} />}
                                 </div>
                              ))}
                           </div>
                        </div>
                     )}

                     {modalStep === 3 && (
                        <div className="w-full animate-in slide-in-from-right-4 duration-300">
                           <p className="text-sm font-bold text-slate-800 mb-3 font-serif">Pilih paket dari {orderDraft.guru.name}:</p>
                           <div className="space-y-2">
                              {getPackagesForGuru(orderDraft.guru).map((pkg, idx) => (
                                 <div
                                    key={idx}
                                    onClick={() => setOrderDraft({ ...orderDraft, paket: pkg })}
                                    className={`p-3 rounded-xl border-2 flex items-center justify-between cursor-pointer transition-all ${orderDraft.paket?.name === pkg.name ? 'border-[#059669] bg-emerald-50/50 shadow-sm' : 'border-slate-100 hover:border-slate-200'
                                       }`}
                                 >
                                    <div className="flex flex-col">
                                       <h4 className="font-extrabold text-slate-800 text-sm font-serif">{pkg.name}</h4>
                                       <p className="text-[11px] font-semibold text-slate-400 mt-0.5">{pkg.session}</p>
                                    </div>
                                    <div className="flex flex-col items-end gap-1">
                                       <span className="font-black text-[#059669] text-sm">{formatCurrency(pkg.price)}</span>
                                       {orderDraft.paket?.name === pkg.name && <CheckCircle2 className="text-[#059669]" size={14} />}
                                    </div>
                                 </div>
                              ))}
                           </div>

                           {orderDraft.paket && (
                              <div className="mt-4 border-t border-slate-100 pt-4 animate-in fade-in slide-in-from-bottom-2">
                                 <h4 className="text-[11px] font-black tracking-wider text-slate-800 uppercase mb-2">RINGKASAN:</h4>
                                 <div className="space-y-1">
                                    <div className="flex justify-between items-center text-xs font-bold w-full">
                                       <span className="text-slate-400">Member</span>
                                       <span className="text-slate-700 font-serif">{orderDraft.member.name}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-xs font-bold w-full">
                                       <span className="text-slate-400">Guru</span>
                                       <span className="text-slate-700 font-serif">{orderDraft.guru.name}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-xs font-bold border-b border-slate-100 pb-1.5 w-full">
                                       <span className="text-slate-400">Paket</span>
                                       <span className="text-slate-700 font-serif">{orderDraft.paket.name}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm font-black pt-1 w-full">
                                       <span className="text-slate-800">Total</span>
                                       <span className="text-[#059669]">{formatCurrency(orderDraft.paket.price)}</span>
                                    </div>
                                 </div>
                              </div>
                           )}
                        </div>
                     )}

                     {modalStep === 4 && (
                        <div className="w-full animate-in slide-in-from-right-4 duration-300">
                           <p className="text-sm font-bold text-slate-600 mb-4">Pilih metode pembayaran:</p>
                           <div className="space-y-3">
                              {['GoPay', 'QRIS', 'OVO'].map((method) => (
                                 <div
                                    key={method}
                                    onClick={() => setOrderDraft({ ...orderDraft, paymentMethod: method })}
                                    className={`p-4 rounded-xl border-2 text-sm font-extrabold cursor-pointer transition-all ${orderDraft.paymentMethod === method ? 'border-[#059669] text-[#059669] bg-emerald-50/50 shadow-sm' : 'border-slate-100 text-slate-700 hover:border-slate-200'
                                       }`}
                                 >
                                    {method}
                                 </div>
                              ))}
                           </div>

                           {orderDraft.paymentMethod && (
                              <div className="mt-8 bg-amber-50 border border-amber-200 text-amber-700 text-xs font-extrabold p-3 rounded-lg flex gap-2 animate-in slide-in-from-bottom-2">
                                 ⚠️ Pesanan #9{Math.floor(Math.random() * 100) + 10} sudah masuk. Pilih metode untuk konfirmasi.
                              </div>
                           )}
                        </div>
                     )}

                     {modalStep === 5 && (
                        <div className="w-full h-full flex flex-col items-center justify-center animate-in zoom-in-50 duration-500">
                           <div className="w-24 h-24 bg-emerald-50 text-[#059669] rounded-full flex items-center justify-center mb-6">
                              <CheckCircle2 size={48} strokeWidth={3} />
                           </div>
                           <h2 className="text-2xl font-black text-slate-800">Pembayaran Berhasil!</h2>
                           <p className="text-slate-500 font-semibold mt-2 text-center max-w-sm">Pesanan atas nama {orderDraft.member.name} telah diproses dan masuk ke dalam sistem.</p>
                        </div>
                     )}
                  </div>

                  {/* Modal Footer */}
                  <div className="px-8 py-5 border-t border-slate-100 bg-[#fafafa] flex items-center justify-between mt-auto">
                     {modalStep < 5 ? (
                        <>
                           {modalStep > 1 ? (
                              <button onClick={() => setModalStep(prev => prev - 1)} className="text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors">
                                 ← Kembali
                              </button>
                           ) : (
                              <button onClick={() => setIsModalOpen(false)} className="text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors">
                                 Batal
                              </button>
                           )}

                           <button
                              onClick={handleNextStep}
                              disabled={(modalStep === 1 && !orderDraft.member) || (modalStep === 2 && !orderDraft.guru) || (modalStep === 3 && !orderDraft.paket) || (modalStep === 4 && !orderDraft.paymentMethod)}
                              className={`px-6 py-2.5 rounded-full text-white text-sm font-bold tracking-wide transition-all shadow-md flex items-center gap-2 ${(modalStep === 1 && !orderDraft.member) || (modalStep === 2 && !orderDraft.guru) || (modalStep === 3 && !orderDraft.paket) || (modalStep === 4 && !orderDraft.paymentMethod)
                                    ? 'bg-emerald-200 cursor-not-allowed opacity-70'
                                    : 'bg-[#059669] hover:bg-[#047857]'
                                 }`}
                           >
                              {modalStep === 3 ? "Pesan Sekarang" : modalStep === 4 ? "Konfirmasi Bayar" : "Lanjut"}
                              {modalStep < 4 ? <ChevronRight size={16} strokeWidth={3} /> : modalStep === 4 && <CheckCircle2 size={16} strokeWidth={3} />}
                           </button>
                        </>
                     ) : (
                        <button
                           onClick={() => setIsModalOpen(false)}
                           className="w-full py-3 bg-slate-800 hover:bg-slate-900 text-white rounded-full font-bold text-sm transition-colors shadow-md"
                        >
                           Tutup
                        </button>
                     )}
                  </div>

               </div>
            </div>
         )}

      </div>
   );
}
