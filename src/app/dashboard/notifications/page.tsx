"use client";

import { useState, useEffect, useRef } from "react";
import { Bell, Search, MoreVertical, X, Trash2, User, XCircle, CheckCircle2 } from "lucide-react";
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
      
      // Start with some dummy initial notifications matching the image specifically
      let fetchedNotifs = [
         {
            id: 'n1',
            type: 'pembatalan_disetujui',
            title: 'Guru Menyetujui Pembatalan — Indi Fitriani',
            desc: 'Indi Fitriani telah menyetujui pembatalan pesanan Nur Hidayah • 5x Pertemuan • GoPay • Rp 595.000',
            time: '1 jam yang lalu',
            iconColor: 'text-blue-500',
            bgColor: 'bg-blue-50',
            borderColor: 'border-blue-100',
            Icon: User,
            dot: 'bg-blue-400'
         },
         {
            id: 'n2',
            type: 'pesanan_batal',
            title: 'Pesanan Dibatalkan — Nur Hidayah',
            desc: 'Nur Hidayah • 5x Pertemuan • Indi Fitriani • GoPay • Rp 595.000',
            time: '2 jam yang lalu',
            iconColor: 'text-rose-500',
            bgColor: 'bg-rose-50',
            borderColor: 'border-rose-100',
            Icon: XCircle,
            dot: 'bg-rose-400'
         }
      ];

      // Fetch live real pesanan from Billing > Pesanan (to link Simulasi result)
      const { data: pesananData } = await supabase.from('billing_pesanan')
         .select('*')
         .order('order_date', { ascending: false })
         .limit(10); // Max 10 recent orders to act as notif source
      
      if (pesananData) {
         const liveNotifs = pesananData
            // Only care about newly created Simulation orders (Menunggu Guru) or fully Selesai/Batal
            .filter(p => p.status === 'Menunggu Guru' || p.status === 'Menunggu Bayar')
            .map(p => {
               const timeDiff = Date.now() - new Date(p.order_date).getTime();
               let timeStr = 'Baru saja';
               if (timeDiff > 3600000) timeStr = `${Math.floor(timeDiff / 3600000)} jam yang lalu`;
               else if (timeDiff > 60000) timeStr = `${Math.floor(timeDiff / 60000)} menit yang lalu`;

               return {
                  id: p.id,
                  type: 'pesanan_baru',
                  title: `Pesanan Baru — ${p.member_name}`,
                  desc: `${p.member_name} • ${p.package_name} • ${p.guru_name} • ${p.payment_method} • Rp ${p.price?.toLocaleString('id-ID')}`,
                  time: timeStr,
                  iconColor: 'text-emerald-600',
                  bgColor: 'bg-emerald-50',
                  borderColor: 'border-emerald-100',
                  Icon: CheckCircle2,
                  dot: 'bg-emerald-400'
               };
            });
         
         // Combine them. We'll put live at the top, then static.
         fetchedNotifs = [...liveNotifs, ...fetchedNotifs];
      }

      setNotifications(fetchedNotifs);
      setIsLoading(false);
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
                     <div key={notif.id} className="p-5 border border-slate-100 hover:border-slate-200 rounded-2xl flex flex-col md:flex-row md:items-start justify-between gap-4 transition-all hover:shadow-sm bg-white group cursor-default relative overflow-hidden">
                        
                        <div className="flex gap-5">
                           {/* Icon Circle */}
                           <div className={`w-12 h-12 rounded-full border ${notif.borderColor} ${notif.bgColor} ${notif.iconColor} flex items-center justify-center shrink-0`}>
                              <notif.Icon size={20} className={notif.type === 'pesanan_baru' ? 'fill-current' : ''} />
                           </div>
                           
                           {/* Content */}
                           <div className="flex flex-col pt-0.5">
                              <h4 className="font-extrabold text-slate-800 text-[15px] mb-1">{notif.title}</h4>
                              <p className="text-sm font-semibold text-slate-500 leading-relaxed max-w-2xl">{notif.desc}</p>
                           </div>
                        </div>

                        {/* Right side Metadata */}
                        <div className="flex items-center md:flex-col md:items-end justify-between md:justify-start gap-2 pl-17 md:pl-0">
                           <div className={`w-2 h-2 rounded-full ${notif.dot} md:mb-1 opacity-70`}></div>
                           <span className="text-xs font-bold text-slate-400 whitespace-nowrap">{notif.time}</span>
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
