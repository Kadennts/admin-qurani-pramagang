"use client";

import { useState, useEffect, useRef } from "react";
import { Bell, Search, MoreVertical, X, Trash2, CheckCircle2, ShoppingBag, ExternalLink } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";

export default function NotificationsPage() {
   const [notifications, setNotifications] = useState<any[]>([]);
   const [isLoading, setIsLoading] = useState(true);
   const [searchQuery, setSearchQuery] = useState("");
   const [activeTab, setActiveTab] = useState("All");
   const [isMenuOpen, setIsMenuOpen] = useState(false);

   const menuRef = useRef<HTMLDivElement>(null);
   const supabase = createClient();

   const [processingId, setProcessingId] = useState<string | null>(null);

   // Handle click outside for dropdown menu
   useEffect(() => {
      const handleClickOutside = (e: MouseEvent) => {
         if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
            setIsMenuOpen(false);
         }
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
   }, []);

   useEffect(() => {
      fetchNotifications();
   }, []);

   const fetchNotifications = async () => {
      setIsLoading(true);

      const { data: pesananData } = await supabase.from('billing_pesanan')
         .select('*')
         .order('order_date', { ascending: false })
         .limit(30);

      const notifs: any[] = [];

      if (pesananData) {
         for (const p of pesananData) {
            const timeDiff = Date.now() - new Date(p.order_date).getTime();
            let timeStr = 'Baru saja';
            if (timeDiff > 86400000) timeStr = `${Math.floor(timeDiff / 86400000)} hari yang lalu`;
            else if (timeDiff > 3600000) timeStr = `${Math.floor(timeDiff / 3600000)} jam yang lalu`;
            else if (timeDiff > 60000) timeStr = `${Math.floor(timeDiff / 60000)} menit yang lalu`;

            const st = (p.status || '').toLowerCase();

            if (st === 'menunggu guru' || st === 'menunggu bayar') {
               notifs.push({
                  id: p.id,
                  orderId: p.id,
                  type: 'pesanan_baru',
                  title: 'Pesanan Baru — Menunggu Bayar',
                  desc: `${p.member_name} • ${p.package_name} • ${p.guru_name}`,
                  time: timeStr,
                  iconColor: 'text-amber-500',
                  bgColor: 'bg-amber-50',
                  borderColor: 'border-amber-100',
                  dot: 'bg-amber-400',
                  memberName: p.member_name,
                  paymentMethod: p.payment_method,
                  price: p.price,
               });
            } else if (st === 'lunas' || st === 'selesai') {
               const via = p.payment_method || 'Transfer';
               notifs.push({
                  id: `paid-${p.id}`,
                  orderId: p.id,
                  type: 'pembayaran_berhasil',
                  title: 'Pembayaran Berhasil',
                  desc: `${p.member_name} • ${via} • Rp ${(p.price || 0).toLocaleString('id-ID')}`,
                  time: timeStr,
                  iconColor: 'text-emerald-600',
                  bgColor: 'bg-emerald-50',
                  borderColor: 'border-emerald-100',
                  dot: 'bg-emerald-400',
               });
            }
         }
      }

      setNotifications(notifs);
      setIsLoading(false);
   };

   const handlePayNow = async (notif: any) => {
      setProcessingId(notif.orderId);
      try {
         await supabase.from('billing_pesanan').update({
            status: 'Lunas',
            payment_method: 'Transfer'
         }).eq('id', notif.orderId);

         toast.success(`Pembayaran Berhasil — ${notif.memberName}`, {
            description: `Pesanan telah dibayar lunas via Transfer`
         });
         await fetchNotifications();
      } catch {
         toast.error('Gagal memproses pembayaran.');
      } finally {
         setProcessingId(null);
      }
   };

   const handleCancelOrder = async (notif: any) => {
      setProcessingId(notif.orderId);
      try {
         await supabase.from('billing_pesanan').update({ status: 'Batal' }).eq('id', notif.orderId);
         toast.error(`Pesanan ${notif.memberName} telah dibatalkan.`);
         await fetchNotifications();
      } catch {
         toast.error('Gagal membatalkan pesanan.');
      } finally {
         setProcessingId(null);
      }
   };

   // Filtering based on search and tab
   let filtered = notifications;
   if (activeTab === 'Tickets') {
      filtered = filtered.filter(n => n.type === 'pembatalan_disetujui' || n.type === 'pesanan_batal');
   }
   if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(n => 
         n.title.toLowerCase().includes(q) || 
         n.desc.toLowerCase().includes(q)
      );
   }

   const handleDeleteAll = () => {
      setNotifications([]);
      setIsMenuOpen(false);
      toast.success("Semua notifikasi berhasil dihapus");
   };

   return (
      <div className="max-w-[1000px] mx-auto pb-12 animate-in fade-in duration-300 relative">
         
         {/* HEADER */}
         <div className="flex justify-between items-center mb-8 mt-2">
            <h1 className="text-2xl font-black text-slate-800 flex items-center gap-3">
               <Bell className="text-slate-400" size={24} /> 
               Notifications <span className="w-1.5 h-1.5 rounded-full bg-slate-300 mb-2"></span>
            </h1>

            <div className="relative" ref={menuRef}>
               <button 
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="w-10 h-10 rounded-full hover:bg-slate-100 text-slate-500 flex items-center justify-center transition-colors"
               >
                  <MoreVertical size={20} />
               </button>

               {isMenuOpen && (
                  <div className="absolute right-0 top-12 w-56 bg-white rounded-xl shadow-xl border border-rose-100 py-1.5 z-50 animate-in fade-in slide-in-from-top-2">
                     <button 
                        onClick={handleDeleteAll}
                        className="w-full px-4 py-2.5 text-left text-sm font-bold text-rose-500 hover:bg-rose-50 flex items-center gap-2 transition-colors"
                     >
                        <Trash2 size={16} /> Delete All Notifications
                     </button>
                  </div>
               )}
            </div>
         </div>

         {/* MAIN CONTAINER */}
         <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm min-h-[500px] flex flex-col">
            
            {/* SEARCH BAR */}
            <div className="relative mb-6">
               <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
               <input 
                  type="text" 
                  placeholder="Search by username or grup name..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-11 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#059669]/20 shadow-sm transition-all"
               />
               {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                     <X size={14} />
                  </button>
               )}
            </div>

            {/* TABS */}
            <div className="flex gap-3 mb-8">
               <button 
                  onClick={() => setActiveTab('All')}
                  className={`px-5 py-2.5 rounded-full text-sm font-bold flex items-center gap-2 transition-all ${
                     activeTab === 'All' ? 'bg-[#059669] text-white shadow-md' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
               >
                  <Bell size={16} className={activeTab === 'All' ? 'fill-current' : ''} /> All
               </button>
               <button 
                  onClick={() => setActiveTab('Tickets')}
                  className={`px-5 py-2.5 rounded-full text-sm font-bold flex items-center gap-2 transition-all ${
                     activeTab === 'Tickets' ? 'bg-[#059669] text-white shadow-md' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
               >
                  <MessageSquareIcon size={16} className={activeTab === 'Tickets' ? 'fill-current' : ''} /> Tickets
               </button>
            </div>

            {/* NOTIFICATION LIST */}
            <div className="flex-1 space-y-4">
               {isLoading ? (
                  <div className="p-12 text-center text-sm font-semibold text-slate-400">Loading notifications...</div>
               ) : filtered.length === 0 ? (
                  <div className="p-16 flex flex-col items-center justify-center text-center border-2 border-dashed border-slate-100 rounded-3xl">
                     <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-4">
                        <Bell size={32} />
                     </div>
                     <p className="text-slate-500 font-bold mb-1">No Notifications</p>
                     <p className="text-xs text-slate-400 font-medium">You're all caught up! No messages to show.</p>
                  </div>
               ) : (
                  filtered.map((notif) => (
                     <div key={notif.id} className="p-5 border border-slate-100 hover:border-slate-200 rounded-2xl transition-all hover:shadow-sm bg-white">
                        <div className="flex gap-4">
                           {/* Icon Circle */}
                           <div className={`w-12 h-12 rounded-full border ${notif.borderColor} ${notif.bgColor} ${notif.iconColor} flex items-center justify-center shrink-0 mt-0.5`}>
                              {notif.type === 'pesanan_baru' ? <ShoppingBag size={20} /> : <CheckCircle2 size={20} className="fill-current" />}
                           </div>
                           
                           {/* Content */}
                           <div className="flex-1">
                              <div className="flex items-start justify-between gap-2 mb-1">
                                 <h4 className="font-extrabold text-slate-800 text-[15px]">{notif.title}</h4>
                                 <span className="text-xs font-bold text-slate-400 whitespace-nowrap shrink-0">{notif.time}</span>
                              </div>
                              <p className="text-sm font-semibold text-slate-500 leading-relaxed mb-3">{notif.desc}</p>
                              {notif.type === 'pesanan_baru' && (
                                 <div className="flex gap-2">
                                    <button
                                       onClick={() => handlePayNow(notif)}
                                       disabled={processingId === notif.orderId}
                                       className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-full transition-colors disabled:opacity-50"
                                    >
                                       <ExternalLink size={12} /> {processingId === notif.orderId ? 'Memproses...' : 'Lihat & Bayar'}
                                    </button>
                                    <button
                                       onClick={() => handleCancelOrder(notif)}
                                       disabled={processingId === notif.orderId}
                                       className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-slate-200 text-slate-500 hover:bg-slate-50 text-xs font-bold rounded-full transition-colors"
                                    >
                                       Batal
                                    </button>
                                 </div>
                              )}
                           </div>
                        </div>
                     </div>
                  ))
               )}
            </div>

         </div>
         
         {/* Background large bell decoration matching mockup layout roughly */}
         {filtered.length > 0 && (
            <div className="flex justify-center mt-12 mb-8 opacity-40">
               <div className="w-20 h-20 bg-slate-100 rounded-3xl flex items-center justify-center text-slate-400">
                  <Bell size={40} />
               </div>
            </div>
         )}
      </div>
   );
}

// Minimal Ticket icon replica
const MessageSquareIcon = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
   <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
      <polyline points="7 10 12 15 17 10"/>
      <line x1="12" x2="12" y1="15" y2="3"/>
   </svg>
);
