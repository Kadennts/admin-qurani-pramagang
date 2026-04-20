"use client";

import { useState, useEffect } from "react";
import { Search, Calendar, RefreshCw, Download, Trash2, Bell, Zap, CheckCircle2, ChevronRight, XCircle, ArrowLeft, Eye, Clock, Users, ShieldCheck, MapPin, Map, GraduationCap } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import Link from "next/link";

export default function MasterPesananPage() {
   const [pesanan, setPesanan] = useState<any[]>([]);
   const [members, setMembers] = useState<any[]>([]);
   const [gurus, setGurus] = useState<any[]>([]);

   const [isLoading, setIsLoading] = useState(true);
   const [activeTab, setActiveTab] = useState("Semua");
   const [paketFilter, setPaketFilter] = useState("Semua");
   const [searchQuery, setSearchQuery] = useState("");

   const [notifications, setNotifications] = useState<any[]>([]);
   const [isNotifOpen, setIsNotifOpen] = useState(false);

   // Simulation Modal
   const [isModalOpen, setIsModalOpen] = useState(false);
   const [modalStep, setModalStep] = useState(1);
   const [orderDraft, setOrderDraft] = useState<any>({ member: null, guru: null, paket: null, paymentMethod: null });

   // Detail View Tracking
   const [detailOrderId, setDetailOrderId] = useState<string | null>(null);

   const supabase = createClient();

   useEffect(() => {
      fetchData();
   }, [supabase]);

   const fetchData = async () => {
      setIsLoading(true);
      const { data: pesananData } = await supabase.from('billing_pesanan').select('*').order('order_date', { ascending: false });
      if (pesananData) setPesanan(pesananData);

      const { data: membersData } = await supabase.from('billing_members').select('*');
      if (membersData) setMembers(membersData);

      const { data: gurusData } = await supabase.from('master_guru').select('*');
      if (gurusData) setGurus(gurusData);

      setIsLoading(false);
   };

   // Logic For Active / Pending counts
   const countSemua = pesanan.length;
   const countLunas = pesanan.filter(p => ['Lunas', 'Selesai'].includes(p.status)).length;
   const countPending = pesanan.filter(p => ['Menunggu Bayar', 'Menunggu Guru', 'Pending'].includes(p.status)).length;

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

   const formatCurrency = (amount: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
   const formatDate = (dStr: string) => new Date(dStr).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });

   // Simulasi functions (reused)
   const openSimulasi = () => { setModalStep(1); setOrderDraft({ member: null, guru: null, paket: null, paymentMethod: null }); setIsModalOpen(true); };
   const clearNotifications = () => setNotifications([]);

   const handleNextStep = () => {
      if (modalStep === 3) {
         toast("Pesanan Baru — Menunggu Bayar", { description: `${orderDraft.member.name} • ${orderDraft.paket.name} • ${orderDraft.guru.name}` });
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
         member_name: orderDraft.member.name, member_email: orderDraft.member.email, member_initials: orderDraft.member.initials, member_color: orderDraft.member.avatar_color,
         guru_name: orderDraft.guru.name, guru_email: orderDraft.guru.email, package_name: orderDraft.paket.name, package_sessions: orderDraft.paket.session.split(' - ')[0],
         price: orderDraft.paket.price, payment_method: orderDraft.paymentMethod, status: 'Menunggu Guru'
      };
      setPesanan(prev => [{ id: Date.now().toString(), order_date: new Date().toISOString(), ...newOrder }, ...prev]);
      setModalStep(5);
      await supabase.from('billing_pesanan').insert([newOrder]);
   };

   const getProgressFromPackage = (pkg: string, status: string) => {
      let total = 1;
      if(pkg.includes("5x")) total = 5;
      if(pkg.includes("10x")) total = 10;
      
      let curr = 0;
      if(status === 'Selesai') curr = total;
      else if(status === 'Lunas') curr = Math.min(total, 1);
      
      // randomize slightly for pending / active cases if we want
      if(pkg.includes("10x") && status === 'Lunas') curr = 4;
      
      const pct = (curr/total) * 100;
      return { curr, total, pct, text: `${curr}/${total} sesi` };
   };

   let filtered = pesanan;
   if (activeTab !== "Semua") {
      filtered = filtered.filter(p => {
         if (activeTab === 'Lunas') return ['Lunas', 'Selesai'].includes(p.status);
         if (activeTab === 'Pending') return ['Menunggu Bayar', 'Menunggu Guru', 'Pending'].includes(p.status);
         return true;
      });
   }
   if (paketFilter !== "Semua") {
      filtered = filtered.filter(p => p.package_name === paketFilter);
   }
   if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(p =>
         p.member_name.toLowerCase().includes(q) || p.guru_name.toLowerCase().includes(q) || p.package_name.toLowerCase().includes(q) ||
         p.member_email?.toLowerCase().includes(q)
      );
   }

   // RENDERING DETAIL VIEW
   if (detailOrderId) {
      const order = pesanan.find(p => p.id === detailOrderId);
      if (!order) return null;
      
      const invoiceNum = `INV-2026-${order.id.slice(-4)}`;
      const gatewayRef = `QRS-2026-02-${order.id.slice(-4)}`;
      const tax = (order.price || 0) * 0.12;
      const total = (order.price || 0) + tax;
      
      const prog = getProgressFromPackage(order.package_name, order.status);

      return (
         <div className="max-w-[1400px] mx-auto pb-12 animate-in fade-in duration-300">
            <button onClick={() => setDetailOrderId(null)} className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-500 hover:text-slate-800 shadow-sm mb-6 transition-colors">
               <ArrowLeft size={18} />
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
               
               {/* LEFT CONTENT */}
               <div className="lg:col-span-2 space-y-6">
                  
                  {/* Progress */}
                  <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
                     <div className="flex justify-between items-center mb-4">
                        <h3 className="font-extrabold text-slate-800 text-sm flex items-center gap-2"><BookOpenIcon /> PROGRESS BELAJAR</h3>
                        <span className="text-sm font-bold text-[#059669]">{prog.curr} / {prog.total} Selesai</span>
                     </div>
                     <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mb-2">
                        <div className="bg-[#059669] h-full rounded-full transition-all" style={{width: `${prog.pct}%`}}></div>
                     </div>
                     <span className="text-[11px] font-bold text-slate-400">{Math.round(prog.pct)}% perjalanan belajar selesai</span>
                  </div>

                  {/* Jadwal */}
                  <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
                     <div className="flex justify-between items-center mb-6">
                        <h3 className="font-extrabold text-[#059669] text-sm flex items-center gap-2"><Calendar size={18} /> JADWAL PERTEMUAN</h3>
                        <span className="text-xs font-bold text-slate-400">1 pertemuan terjadwal</span>
                     </div>
                     
                     <div className="flex items-center justify-between py-4 border-t border-slate-50">
                        <div className="flex items-center gap-3">
                           <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center">
                              <Clock size={18} />
                           </div>
                           <div>
                              <div className="flex items-center gap-2">
                                 <span className="font-extrabold text-slate-800 text-sm">Pertemuan {prog.curr + 1}</span>
                                 <span className="bg-blue-50 text-blue-500 text-[10px] font-black px-2 py-0.5 rounded-md uppercase">Terjadwal</span>
                              </div>
                              <span className="text-[11px] font-bold text-slate-400">{formatDate(order.order_date)}</span>
                           </div>
                        </div>
                        <span className="font-black text-slate-800">14:00 - 15:00</span>
                     </div>
                  </div>

                  {/* Informasi Pembayaran */}
                  <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
                     <div className="flex justify-between items-center mb-6">
                        <h3 className="font-extrabold text-[#059669] text-sm flex items-center gap-2"><CreditCardIcon /> INFORMASI PEMBAYARAN</h3>
                     </div>
                     
                     <div className="grid grid-cols-2 gap-x-12 gap-y-6">
                        <div className="space-y-4">
                           <div className="flex justify-between items-center text-sm">
                              <span className="font-bold text-slate-400">#INVOICE</span>
                              <span className="font-extrabold text-slate-800">{invoiceNum}</span>
                           </div>
                           <div className="flex justify-between items-center text-sm">
                              <span className="font-bold text-slate-400">REF. GATEWAY</span>
                              <span className="font-bold text-slate-600 tracking-wide">{gatewayRef}</span>
                           </div>
                           <div className="flex justify-between items-center text-sm">
                              <span className="font-bold text-slate-400">PAYMENT</span>
                              <span className="font-bold text-slate-800">{order.payment_method || '—'}</span>
                           </div>
                           <div className="flex justify-between items-center text-sm">
                              <span className="font-bold text-slate-400">STATUS</span>
                              <span className={`text-[10px] uppercase font-black px-2 py-1 rounded-md ${['Lunas', 'Selesai'].includes(order.status) ? 'bg-emerald-50 text-[#059669]' : 'bg-amber-50 text-amber-500'}`}>
                                 {['Lunas', 'Selesai'].includes(order.status) ? 'LUNAS' : 'BELUM DIBAYAR'}
                              </span>
                           </div>
                           <div className="flex justify-between items-center text-sm">
                              <span className="font-bold text-slate-400">WAKTU BAYAR</span>
                              <span className="font-bold text-slate-800">—</span>
                           </div>
                        </div>
                        
                        <div className="space-y-4 pt-1">
                           <div className="flex justify-between items-center text-sm">
                              <span className="font-bold text-slate-400">HARGA PAKET</span>
                              <span className="font-extrabold text-slate-800">{formatCurrency(order.price)}</span>
                           </div>
                           <div className="flex justify-between items-center text-sm">
                              <span className="font-bold text-slate-400">PAJAK (12%)</span>
                              <span className="font-extrabold text-slate-800">{formatCurrency(tax)}</span>
                           </div>
                           <div className="flex justify-between items-center text-sm">
                              <span className="font-bold text-slate-400">BIAYA LAYANAN</span>
                              <span className="font-extrabold text-[#059669]">Gratis</span>
                           </div>
                           <div className="flex justify-between items-center pt-2 mt-2 border-t border-slate-100">
                              <span className="font-black text-slate-800 text-[15px]">TOTAL BAYAR</span>
                              <span className="font-black text-[#059669] text-lg">{formatCurrency(total)}</span>
                           </div>
                        </div>
                     </div>
                  </div>

               </div>

               {/* RIGHT CONTENT */}
               <div className="space-y-6">
                  
                  {/* Member Card */}
                  <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
                     <div className="flex items-center gap-4 border-b border-slate-100 pb-5 mb-5">
                        <div className={`w-14 h-14 rounded-full flex items-center justify-center text-white text-xl font-black ${order.member_color || 'bg-emerald-500'}`}>
                           {order.member_initials}
                        </div>
                        <div>
                           <h3 className="font-black text-slate-800 text-base">{order.member_name}</h3>
                           <span className="text-xs font-bold text-[#059669]">{order.member_email}</span>
                        </div>
                     </div>
                     <div className="space-y-3">
                        <div className="flex items-center gap-3 text-sm font-semibold text-slate-500">
                           <ShieldCheck size={16} className="text-[#059669]"/> {order.member_email.replace('@', '')}@yahoo.com
                        </div>
                        <div className="flex items-center gap-3 text-sm font-semibold text-slate-500">
                           <MapPin size={16} className="text-[#059669]"/> +62 878-1122-3344
                        </div>
                        <div className="flex items-center gap-3 text-sm font-semibold text-slate-500">
                           <Map size={16} className="text-[#059669]"/> Bandung
                        </div>
                        <div className="flex items-center gap-3 text-sm font-semibold text-slate-500">
                           <Calendar size={16} className="text-[#059669]"/> Bergabung Januari 2025
                        </div>
                     </div>
                  </div>

                  {/* Guru Card */}
                  <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
                     <div className="flex items-center gap-4 border-b border-slate-100 pb-5 mb-5">
                        <div className="w-14 h-14 rounded-full overflow-hidden border border-slate-200">
                           <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${order.guru_name}`} alt="guru" className="w-full h-full object-cover"/>
                        </div>
                        <div>
                           <h3 className="font-black text-slate-800 text-base">{order.guru_name}</h3>
                           <span className="text-xs font-bold text-[#059669]">{order.guru_email}</span>
                        </div>
                     </div>
                     <div className="space-y-3">
                        <div className="flex items-center gap-3 text-sm font-semibold text-slate-500">
                           <span className="text-amber-500">⭐ 4.9</span> 39 Murid
                        </div>
                        <div className="flex items-center gap-3 text-sm font-semibold text-slate-500">
                           <MapPin size={16} className="text-[#059669]"/> Bekasi
                        </div>
                        <div className="flex items-center gap-3 text-sm font-semibold text-slate-500">
                           <Clock size={16} className="text-[#059669]"/> 5 Tahun Pengalaman
                        </div>
                        <div className="flex items-center gap-3 text-sm font-semibold text-slate-500">
                           <GraduationCap size={16} className="text-[#059669]"/> Tahsinul Qur'an & Tahfidzul Qur'an
                        </div>
                     </div>
                     <div className="mt-4 flex gap-2">
                        <span className="text-[10px] font-black text-purple-600 bg-purple-50 border border-purple-100 px-3 py-1.5 rounded-full">Tahsinul Qur'an</span>
                        <span className="text-[10px] font-black text-purple-600 bg-purple-50 border border-purple-100 px-3 py-1.5 rounded-full">Tahfidzul Qur'an</span>
                     </div>
                  </div>

                  {/* Informasi Pesanan */}
                  <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
                     <h3 className="font-extrabold text-[#059669] text-sm flex items-center gap-2 mb-6"><DocIcon /> INFORMASI PESANAN</h3>
                     <div className="space-y-4">
                        <div>
                           <h4 className="text-[11px] font-bold text-slate-400 tracking-wider mb-1">NAMA PAKET</h4>
                           <span className="font-black text-slate-800 text-sm">{order.package_name}</span>
                        </div>
                        <div>
                           <h4 className="text-[11px] font-bold text-slate-400 tracking-wider mb-1">METODE BELAJAR</h4>
                           <div className="flex gap-2 items-center">
                              <span className="text-[10px] font-black text-amber-600 border border-amber-200 px-2 py-1 rounded-md">Offline</span>
                              <span className="text-xs font-bold text-slate-600">Tilawati</span>
                           </div>
                        </div>
                        <div>
                           <h4 className="text-[11px] font-bold text-slate-400 tracking-wider mb-1">MULAI SESI</h4>
                           <span className="font-black text-slate-800 text-sm">Selasa, 10 Februari 2026</span>
                        </div>
                     </div>
                  </div>

               </div>
            </div>
         </div>
      );
   }

   // MAIN LIST VIEW 
   return (
      <div className="max-w-[1400px] mx-auto pb-12 animate-in fade-in duration-300">
         {/* HEADER */}
         <div className="flex justify-between items-center mb-6 mt-2">
            <h1 className="text-3xl font-black text-slate-800 font-serif">Pesanan</h1>
            
            <div className="flex items-center gap-3">
               {/* Notif Bell */}
               <div className="relative">
                  <button onClick={() => setIsNotifOpen(!isNotifOpen)} className="w-10 h-10 bg-white border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-xl flex items-center justify-center shadow-sm transition-colors relative">
                     <Bell size={18} />
                     {notifications.length > 0 && <span className="absolute 1 top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>}
                  </button>
                  {isNotifOpen && (
                     <div className="absolute right-0 top-[48px] w-[300px] bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
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
                                          <p className="font-extrabold text-slate-800 text-[13px]">{n.title}</p>
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

               <button onClick={openSimulasi} className="bg-emerald-50 text-[#059669] border border-emerald-200 text-sm font-bold px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-sm hover:bg-emerald-100 transition-colors">
                  <Zap size={16} className="fill-current" /> Simulasi
               </button>
               
               <button onClick={fetchData} className="bg-white border border-slate-200 text-slate-600 text-sm font-bold px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-sm hover:bg-slate-50 transition-colors hidden sm:flex">
                  <RefreshCw size={16} /> Refresh
               </button>

               <button className="bg-white border border-slate-200 text-slate-600 text-sm font-bold px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-sm hover:bg-slate-50 transition-colors">
                  <Download size={16} /> Export
               </button>
            </div>
         </div>

         {/* FILTER TABS */}
         <div className="flex flex-col md:flex-row items-center gap-4 mb-6 pt-2">
            <button onClick={() => setActiveTab("Semua")} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-extrabold transition-all border ${activeTab === 'Semua' ? 'bg-[#059669] border-[#059669] text-white shadow-md' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
               <Users size={16}/> Semua: {countSemua}
            </button>
            <button onClick={() => setActiveTab("Lunas")} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-extrabold transition-all border ${activeTab === 'Lunas' ? 'bg-slate-800 border-slate-800 text-white shadow-md' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
               <CheckCircle2 size={16}/> Lunas: {countLunas}
            </button>
            <button onClick={() => setActiveTab("Pending")} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-extrabold transition-all border ${activeTab === 'Pending' ? 'bg-slate-800 border-slate-800 text-white shadow-md' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
               <Clock size={16}/> Pending: {countPending}
            </button>
         </div>

         {/* SEARCH BAR & PAKET FILTER */}
         <div className="flex flex-col xl:flex-row items-center gap-4 mb-8">
            <div className="relative flex-1 w-full">
               <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
               <input 
                  type="text" 
                  placeholder="Cari nama, email, trainer, atau paket..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#059669]/20 shadow-sm"
               />
            </div>
            
            <div className="flex items-center gap-4 w-full xl:w-auto overflow-x-auto pb-2 xl:pb-0 hide-scrollbar">
               <span className="text-sm font-bold text-slate-400 flex items-center gap-1"><FilterIcon /> Paket:</span>
               <div className="flex gap-2">
                  {['Semua', '1x Pertemuan', '5x Pertemuan', '10x Pertemuan'].map(p => (
                     <button
                        key={p}
                        onClick={() => setPaketFilter(p)}
                        className={`px-4 py-2 rounded-full text-xs font-black tracking-wide whitespace-nowrap transition-colors border ${
                           paketFilter === p ? 'bg-[#059669] text-white border-[#059669]' : 'bg-white text-slate-500 border-slate-200 hover:bg-emerald-50 hover:text-[#059669] hover:border-emerald-200'
                        }`}
                     >
                        {p === 'Semua' && <span className="mr-1">✨</span>}
                        {p}
                     </button>
                  ))}
               </div>
            </div>
         </div>

         {/* TABLE CONTAINER */}
         <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden flex flex-col min-h-[500px]">
            <div className="overflow-x-auto">
               <table className="w-full whitespace-nowrap">
                  <thead>
                     <tr className="text-slate-800 text-xs font-black tracking-wider text-left border-b border-slate-100 bg-slate-50/50">
                        <th className="px-8 py-5"><div className="flex items-center gap-1">ID <span className="text-slate-400">↕</span></div></th>
                        <th className="px-6 py-5">Member</th>
                        <th className="px-6 py-5">Guru</th>
                        <th className="px-6 py-5"><div className="flex items-center gap-1">Paket <span className="text-slate-400">↕</span></div></th>
                        <th className="px-6 py-5"><div className="flex items-center gap-1">Sesi <span className="text-slate-400">↕</span></div></th>
                        <th className="px-6 py-5"><div className="flex items-center gap-1">Progress <span className="text-slate-400">↕</span></div></th>
                        <th className="px-6 py-5"><div className="flex items-center gap-1">Harga <span className="text-slate-400">↕</span></div></th>
                        <th className="px-6 py-5 text-center">Status</th>
                        <th className="px-6 py-5"><div className="flex items-center gap-1">Tgl Pesan <span className="text-slate-400">↕</span></div></th>
                        <th className="px-6 py-5">Payment</th>
                        <th className="px-8 py-5 text-right">Aksi</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                     {isLoading ? (
                        <tr><td colSpan={11} className="px-8 py-12 text-center text-slate-500 font-medium">Memuat data pesanan...</td></tr>
                     ) : filtered.length === 0 ? (
                        <tr><td colSpan={11} className="px-8 py-12 text-center text-slate-500 font-medium">Tidak ada data.</td></tr>
                     ) : (
                        filtered.map((item, idx) => {
                           const prog = getProgressFromPackage(item.package_name, item.status);
                           
                           return (
                              <tr key={item.id} className="hover:bg-slate-50/80 transition-colors group">
                                 <td className="px-8 py-5 text-sm font-bold text-slate-400">#{3010 - idx}</td>
                                 <td className="px-6 py-5">
                                    <div className="flex items-center gap-3">
                                       <div className={`w-8 h-8 rounded-full flex justify-center items-center text-white font-extrabold text-xs shadow-sm ${item.member_color || 'bg-slate-400'}`}>
                                          {item.member_initials}
                                       </div>
                                       <span className="font-extrabold text-slate-800 text-sm max-w-[100px] truncate">{item.member_name}</span>
                                    </div>
                                 </td>
                                 <td className="px-6 py-5">
                                    <div className="flex flex-col">
                                       <span className="font-bold text-slate-700 text-sm truncate max-w-[120px]">{item.guru_name}</span>
                                    </div>
                                 </td>
                                 <td className="px-6 py-5 font-bold text-slate-700 text-sm">
                                    {item.package_name}
                                 </td>
                                 <td className="px-6 py-5">
                                    <span className="text-[11px] font-black text-[#059669] bg-emerald-50 px-2 py-1 rounded-md">{item.package_sessions}</span>
                                 </td>
                                 <td className="px-6 py-5">
                                    <span className={`text-[11px] font-black px-2 py-1 rounded-md ${prog.curr === prog.total ? 'bg-emerald-50 text-[#059669]' : 'bg-slate-100 text-slate-500'}`}>
                                       {prog.text}
                                    </span>
                                 </td>
                                 <td className="px-6 py-5 font-black text-slate-800 text-sm">
                                    {formatCurrency(item.price)}
                                 </td>
                                 <td className="px-6 py-5 text-center">
                                    {['Lunas', 'Selesai'].includes(item.status) ? (
                                       <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black"><div className="w-1.5 h-1.5 rounded-full bg-[#059669]"></div> Lunas</span>
                                    ) : (
                                       <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-600 rounded-full text-[10px] font-black"><div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div> Pending</span>
                                    )}
                                 </td>
                                 <td className="px-6 py-5 font-bold text-slate-500 text-xs">{formatDate(item.order_date)}</td>
                                 <td className="px-6 py-5 font-extrabold text-[#059669] text-sm">{item.payment_method || '—'}</td>
                                 <td className="px-8 py-5 text-right flex items-center justify-end gap-3 mt-1">
                                    <button onClick={() => setDetailOrderId(item.id)} className="flex items-center gap-1.5 text-xs font-black text-[#059669] hover:text-[#047857] transition-colors"><Eye size={14}/> Detail</button>
                                    <button className="flex items-center gap-1.5 text-xs font-black text-rose-500 hover:text-rose-600 transition-colors"><Trash2 size={14}/> Batalkan</button>
                                 </td>
                              </tr>
                           );
                        })
                     )}
                  </tbody>
               </table>
            </div>

            <div className="bg-[#fcfcfc] border-t border-slate-100 p-5 mt-auto flex items-center justify-between">
               <div className="text-sm font-bold text-slate-400 tracking-wide ml-3">
                  Menampilkan 1-{filtered.length} dari {pesanan.length} data
               </div>
               <div className="flex items-center gap-2 text-slate-400 font-bold mr-3">
                  <button className="w-8 h-8 flex justify-center items-center rounded-lg hover:bg-slate-200 transition-colors">&lt;</button>
                  <button className="w-8 h-8 flex justify-center items-center rounded-lg bg-[#059669] text-white shadow-sm">1</button>
                  <button className="w-8 h-8 flex justify-center items-center rounded-lg hover:bg-slate-200 transition-colors">&gt;</button>
               </div>
            </div>
         </div>


         {/* NEW ORDER WIZARD MODAL (Reused exactly from Billing logic) */}
         {isModalOpen && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
               <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-100 flex flex-col relative" style={{ minHeight: '600px' }}>
                  
                  <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 transition-colors z-20"><XCircle size={20} /></button>

                  <div className="px-8 pt-8 pb-6 border-b border-slate-100">
                     <h2 className="text-lg font-black text-slate-800 flex items-center gap-2 mb-6 font-serif">
                        <Zap size={20} className="text-[#059669] fill-current shadow-sm" /> Simulasi Pesanan Baru
                     </h2>
                     <div className="flex items-center justify-between relative px-2">
                        <div className="absolute left-0 right-0 top-3 border-t-2 border-slate-100 z-0"></div>
                        {[
                           { n: 1, l: "Pilih Member" }, { n: 2, l: "Pilih Guru" }, { n: 3, l: "Pilih Paket" }, { n: 4, l: "Pembayaran" }
                        ].map((s) => (
                           <div key={s.n} className="z-10 bg-white px-2">
                              <div className="flex items-center gap-2">
                                 <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${modalStep > s.n ? 'bg-[#059669] text-white' : modalStep === s.n ? 'bg-[#059669] text-white' : 'bg-slate-100 text-slate-400'}`}>
                                    {modalStep > s.n ? <CheckCircle2 size={12} strokeWidth={3} /> : s.n}
                                 </div>
                                 <span className={`text-xs font-bold tracking-wide ${modalStep >= s.n ? 'text-slate-700' : 'text-slate-400'}`}>{s.l}</span>
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>

                  {/* Step Contents - Minimal copy logic to make simulation work exactly */}
                  <div className="p-8 flex-1 overflow-y-auto custom-scrollbar flex flex-col items-center">
                     {modalStep === 1 && (
                        <div className="w-full">
                           <p className="text-sm font-bold text-slate-800 mb-3 font-serif">Pilih member yang memesan:</p>
                           <div className="space-y-3 h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                              {members.map(m => (
                                 <div key={m.id} onClick={() => setOrderDraft({ ...orderDraft, member: m })}
                                    className={`p-4 rounded-xl border-2 flex items-center justify-between cursor-pointer transition-all ${orderDraft.member?.id === m.id ? 'border-[#059669] bg-emerald-50/50' : 'border-slate-100'}`}>
                                    <div className="flex items-center gap-4">
                                       <div className={`w-10 h-10 rounded-full flex justify-center items-center text-white font-black text-xs ${m.avatar_color}`}>{m.initials}</div>
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
                        <div className="w-full">
                           <p className="text-sm font-bold text-slate-800 mb-3 font-serif">Pilih guru:</p>
                           <div className="space-y-3 h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                              {gurus.map(g => (
                                 <div key={g.id} onClick={() => setOrderDraft({ ...orderDraft, guru: g, paket: null })}
                                    className={`p-4 rounded-xl border-2 flex items-center justify-between cursor-pointer transition-all ${orderDraft.guru?.id === g.id ? 'border-[#059669] bg-emerald-50/50' : 'border-slate-100'}`}>
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
                        <div className="w-full">
                           <p className="text-sm font-bold text-slate-800 mb-3 font-serif">Pilih paket:</p>
                           <div className="space-y-2">
                              {getPackagesForGuru(orderDraft.guru).map((pkg, idx) => (
                                 <div key={idx} onClick={() => setOrderDraft({ ...orderDraft, paket: pkg })}
                                    className={`p-3 rounded-xl border-2 flex items-center justify-between cursor-pointer transition-all ${orderDraft.paket?.name === pkg.name ? 'border-[#059669] bg-emerald-50/50' : 'border-slate-100'}`}>
                                    <div className="flex flex-col">
                                       <h4 className="font-extrabold text-slate-800 text-sm font-serif">{pkg.name}</h4>
                                       <p className="text-[11px] font-semibold text-slate-400">{pkg.session}</p>
                                    </div>
                                    <div className="flex flex-col items-end gap-1">
                                       <span className="font-black text-[#059669] text-sm">{formatCurrency(pkg.price)}</span>
                                    </div>
                                 </div>
                              ))}
                           </div>
                        </div>
                     )}

                     {modalStep === 4 && (
                        <div className="w-full">
                           <p className="text-sm font-bold text-slate-600 mb-4">Pilih metode pembayaran:</p>
                           <div className="space-y-3">
                              {['GoPay', 'QRIS', 'OVO'].map((method) => (
                                 <div key={method} onClick={() => setOrderDraft({ ...orderDraft, paymentMethod: method })}
                                    className={`p-4 rounded-xl border-2 text-sm font-extrabold cursor-pointer transition-all ${orderDraft.paymentMethod === method ? 'border-[#059669] text-[#059669] bg-emerald-50/50' : 'border-slate-100 text-slate-700'}`}>
                                    {method}
                                 </div>
                              ))}
                           </div>
                        </div>
                     )}

                     {modalStep === 5 && (
                        <div className="w-full h-full flex flex-col items-center justify-center animate-in zoom-in-50">
                           <div className="w-24 h-24 bg-emerald-50 text-[#059669] rounded-full flex items-center justify-center mb-6"><CheckCircle2 size={48} strokeWidth={3} /></div>
                           <h2 className="text-2xl font-black text-slate-800">Pembayaran Berhasil!</h2>
                           <p className="text-slate-500 font-semibold mt-2 text-center max-w-sm">Pesanan telah diproses.</p>
                        </div>
                     )}
                  </div>

                  <div className="px-8 py-5 border-t border-slate-100 bg-[#fafafa] flex items-center justify-between">
                     {modalStep < 5 ? (
                        <>
                           {modalStep > 1 ? <button onClick={() => setModalStep(prev => prev - 1)} className="text-sm font-bold text-slate-500">← Kembali</button> : <button onClick={() => setIsModalOpen(false)} className="text-sm font-bold text-slate-500">Batal</button>}
                           <button onClick={handleNextStep}
                              disabled={(modalStep === 1 && !orderDraft.member) || (modalStep === 2 && !orderDraft.guru) || (modalStep === 3 && !orderDraft.paket) || (modalStep === 4 && !orderDraft.paymentMethod)}
                              className={`px-6 py-2.5 rounded-full text-white text-sm font-bold shadow-md flex items-center gap-2 ${((modalStep === 1 && !orderDraft.member) || (modalStep === 2 && !orderDraft.guru) || (modalStep === 3 && !orderDraft.paket) || (modalStep === 4 && !orderDraft.paymentMethod)) ? 'bg-emerald-200 opacity-70' : 'bg-[#059669] hover:bg-[#047857]'}`}>
                              {modalStep === 3 ? "Pesan" : modalStep === 4 ? "Konfirmasi" : "Lanjut"} <ChevronRight size={16} strokeWidth={3} />
                           </button>
                        </>
                     ) : <button onClick={() => setIsModalOpen(false)} className="w-full py-3 bg-slate-800 hover:bg-slate-900 text-white rounded-full font-bold text-sm">Tutup</button>}
                  </div>
               </div>
            </div>
         )}

      </div>
   );
}

// Micro Icon Wrappers
const BookOpenIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-book-open"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>;
const CreditCardIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-credit-card"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>;
const DocIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-file-text"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/></svg>;
const FilterIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>;
