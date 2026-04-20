"use client";

import { useState, useEffect } from "react";
import { Search, Filter, Phone, MessageSquare, Lightbulb, XCircle, Calendar, LayoutGrid } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

export default function BillingKeluhanPage() {
   const [feedbacks, setFeedbacks] = useState<any[]>([]);
   const [isLoading, setIsLoading] = useState(true);
   const [activeFilter, setActiveFilter] = useState("Semua");
   const [searchQuery, setSearchQuery] = useState("");

   const supabase = createClient();

   useEffect(() => {
      fetchData();
   }, []);

   const fetchData = async () => {
      setIsLoading(true);
      const { data, error } = await supabase.from('billing_keluhan').select('*').order('date', { ascending: false });
      if (data) {
         setFeedbacks(data);
      }
      setIsLoading(false);
   };

   // Counters
   const countSemua = feedbacks.length;
   const countSaran = feedbacks.filter(f => f.type === 'Saran').length;
   const countKeluhan = feedbacks.filter(f => f.type === 'Keluhan').length;
   const countPembatalan = feedbacks.filter(f => f.type === 'Pembatalan').length;

   // Filtration
   let filteredInfo = feedbacks;
   if(activeFilter !== "Semua") {
      filteredInfo = feedbacks.filter(f => f.type === activeFilter);
   }
   if(searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      filteredInfo = filteredInfo.filter(f => 
         f.user_name?.toLowerCase().includes(q) || 
         f.title?.toLowerCase().includes(q) ||
         f.detail_paket?.toLowerCase().includes(q)
      );
   }

   const formatDate = (d: string) => {
      const date = new Date(d);
      return date.toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' });
   };

   return (
      <div className="max-w-[1400px] mx-auto pb-12 animate-in fade-in duration-300">
         
         {/* HEADER */}
         <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6 mt-2">
            <div>
               <h1 className="text-2xl font-black text-slate-800 font-serif">Keluhan</h1>
               <p className="text-slate-500 font-medium text-sm mt-1">Kelola komplain, saran, dan pembatalan pesanan dari user</p>
            </div>
            <div className="flex items-center">
               <span className="bg-emerald-100 text-[#059669] text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5">
                  {countSemua} Masuk
               </span>
            </div>
         </div>

         {/* SEARCH BAR */}
         <div className="flex gap-4 mb-6 relative">
            <div className="relative flex-1">
               <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
               <input 
                  type="text" 
                  placeholder="Cari nama, mode dan paket" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-24 py-3.5 bg-white border border-slate-200 rounded-2xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#059669]/20 shadow-sm"
               />
               <button className="absolute right-2.5 top-1/2 -translate-y-1/2 bg-slate-50 text-slate-600 border border-slate-200 text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 hover:bg-slate-100 transition-colors">
                  <Search size={14} /> Cari
               </button>
            </div>
            <button className="bg-[#059669] hover:bg-[#047857] text-white w-14 h-14 rounded-2xl flex items-center justify-center shadow-md shadow-[#059669]/20 transition-colors shrink-0">
               <Filter size={20} />
            </button>
         </div>

         {/* MAIN LAYOUT */}
         <div className="flex flex-col lg:flex-row gap-6 items-start">
            
            {/* SIDEBAR FILTER */}
            <div className="w-full lg:w-64 shrink-0 bg-white border border-slate-100 rounded-3xl p-5 shadow-sm sticky top-24">
               <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 ml-2">Filter</h3>
               
               <div className="space-y-2">
                  <button 
                     onClick={() => setActiveFilter("Semua")}
                     className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all ${
                        activeFilter === "Semua" ? "bg-emerald-50 text-[#059669] font-bold" : "text-slate-600 hover:bg-slate-50 font-semibold"
                     }`}
                  >
                     <div className="flex items-center gap-3 text-sm">
                        <LayoutGrid size={18} className={activeFilter === "Semua" ? "text-[#059669]" : "text-slate-400"} />
                        Semua
                     </div>
                     {activeFilter === "Semua" && <span className="bg-[#059669]/10 text-[#059669] text-[10px] font-black px-2 py-0.5 rounded-full">{countSemua}</span>}
                  </button>

                  <button 
                     onClick={() => setActiveFilter("Saran")}
                     className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all ${
                        activeFilter === "Saran" ? "bg-emerald-50 text-[#059669] font-bold" : "text-slate-600 hover:bg-slate-50 font-semibold"
                     }`}
                  >
                     <div className="flex items-center gap-3 text-sm">
                        <Lightbulb size={18} className={activeFilter === "Saran" ? "text-[#059669]" : "text-slate-400"} />
                        Saran
                     </div>
                     <span className={`${activeFilter === "Saran" ? "bg-[#059669]/10 text-[#059669]" : "text-slate-400"} text-[10px] font-black px-2 py-0.5 rounded-full`}>{countSaran}</span>
                  </button>

                  <button 
                     onClick={() => setActiveFilter("Keluhan")}
                     className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all ${
                        activeFilter === "Keluhan" ? "bg-emerald-50 text-[#059669] font-bold" : "text-slate-600 hover:bg-slate-50 font-semibold"
                     }`}
                  >
                     <div className="flex items-center gap-3 text-sm">
                        <MessageSquare size={18} className={activeFilter === "Keluhan" ? "text-[#059669]" : "text-slate-400"} />
                        Keluhan
                     </div>
                     <span className={`${activeFilter === "Keluhan" ? "bg-[#059669]/10 text-[#059669]" : "text-slate-400"} text-[10px] font-black px-2 py-0.5 rounded-full`}>{countKeluhan}</span>
                  </button>

                  <button 
                     onClick={() => setActiveFilter("Pembatalan")}
                     className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all ${
                        activeFilter === "Pembatalan" ? "bg-emerald-50 text-[#059669] font-bold" : "text-slate-600 hover:bg-slate-50 font-semibold"
                     }`}
                  >
                     <div className="flex items-center gap-3 text-sm">
                        <XCircle size={18} className={activeFilter === "Pembatalan" ? "text-[#059669]" : "text-slate-400"} />
                        Pembatalan
                     </div>
                     <span className={`${activeFilter === "Pembatalan" ? "bg-[#059669]/10 text-[#059669]" : "text-slate-400"} text-[10px] font-black px-2 py-0.5 rounded-full`}>{countPembatalan}</span>
                  </button>
               </div>
            </div>

            {/* FEEDBACK CARDS */}
            <div className="flex-1 flex flex-col gap-5 pb-10">
               {isLoading ? (
                  <div className="p-12 text-center text-sm font-semibold text-slate-400 border border-slate-100 rounded-3xl bg-white">Memuat data keluhan...</div>
               ) : filteredInfo.length === 0 ? (
                  <div className="p-12 text-center text-sm font-semibold text-slate-400 border border-slate-100 rounded-3xl bg-white">Tidak ada data ditemukan.</div>
               ) : (
                  filteredInfo.map((item) => (
                     <div key={item.id} className="bg-white border text-sm border-slate-200 rounded-3xl shadow-sm p-6 relative flex flex-col">
                        
                        {/* Top Profile & Badge */}
                        <div className="flex justify-between items-start mb-6 w-full">
                           <div className="flex items-center gap-3">
                              <div className={`w-12 h-12 rounded-full text-white flex items-center justify-center font-extrabold text-sm ${item.user_color || 'bg-slate-400'}`}>
                                 {item.user_initials}
                              </div>
                              <div className="flex flex-col">
                                 <span className="font-extrabold text-slate-800">{item.user_name}</span>
                                 <span className="text-xs font-semibold text-[#059669]">{item.user_username}</span>
                                 <span className="text-[10px] font-semibold text-slate-400 mt-1 flex items-center gap-1.5"><Calendar size={10}/> {formatDate(item.date)}</span>
                              </div>
                           </div>

                           <div className="flex gap-2">
                              {/* Kategori Badge */}
                              {item.type === 'Keluhan' && <span className="border border-rose-200 bg-rose-50 text-rose-500 font-extrabold text-[10px] uppercase px-3 py-1.5 rounded-lg tracking-wider flex items-center gap-1.5"><MessageSquare size={12}/> KELUHAN</span>}
                              {item.type === 'Saran' && <span className="border border-amber-200 bg-amber-50 text-amber-500 font-extrabold text-[10px] uppercase px-3 py-1.5 rounded-lg tracking-wider flex items-center gap-1.5"><Lightbulb size={12}/> SARAN</span>}
                              {item.type === 'Pembatalan' && <span className="border border-slate-200 bg-slate-50 text-slate-500 font-extrabold text-[10px] uppercase px-3 py-1.5 rounded-lg tracking-wider flex items-center gap-1.5"><XCircle size={12}/> PEMBATALAN</span>}
                              
                              {/* Status Badge specifically for Pembatalan */}
                              {item.status === 'Menunggu' && <span className="bg-amber-50 text-amber-600 font-extrabold text-[10px] uppercase px-3 py-1.5 rounded-lg tracking-wider">MENUNGGU</span>}
                              {item.status === 'Selesai' && <span className="bg-emerald-50 text-[#059669] font-extrabold text-[10px] uppercase px-3 py-1.5 rounded-lg tracking-wider">SELESAI</span>}
                           </div>
                        </div>

                        {/* NORMAL TEXT BODY (SARAN / KELUHAN) */}
                        {item.type !== 'Pembatalan' ? (
                           <div className="mb-6">
                              <h3 className="font-black text-slate-800 text-sm mb-2">{item.title}</h3>
                              <p className="text-sm text-slate-500 font-medium leading-relaxed pr-8">{item.description}</p>
                           </div>
                        ) : (
                           /* PEMBATALAN DETAILED BOX */
                           <div className="border border-rose-100 bg-rose-50/30 rounded-2xl p-5 mb-6">
                              <h4 className="flex items-center gap-2 font-black text-rose-500 text-sm mb-5 uppercase tracking-wide">
                                 <XCircle size={16} /> DETAIL PEMBATALAN — {item.order_id}
                              </h4>
                              
                              <div className="space-y-4">
                                 <div className="flex justify-between items-center text-sm">
                                    <span className="font-bold text-slate-400">PAKET</span>
                                    <span className="font-semibold text-slate-700">{item.detail_paket}</span>
                                 </div>
                                 <div className="flex justify-between items-center text-sm">
                                    <span className="font-bold text-slate-400">KATEGORI</span>
                                    <span className="font-semibold text-slate-700">{item.detail_kategori}</span>
                                 </div>
                                 <div className="flex flex-col gap-2 pt-2">
                                    <span className="font-bold text-slate-400 text-sm">PESAN/ULASAN</span>
                                    <p className="font-medium text-slate-500 text-sm italic border-l-2 border-rose-200 pl-4 py-1 leading-relaxed">
                                       "{item.detail_ulasan}"
                                    </p>
                                 </div>
                                 <div className="flex justify-between items-center text-sm pt-2">
                                    <span className="font-bold text-slate-400">RESOLUSI DIMINTA</span>
                                    <span className="font-bold text-blue-500">{item.detail_resolusi}</span>
                                 </div>
                                 <div className="flex justify-between items-center text-sm">
                                    <span className="font-bold text-slate-400">LAMPIRAN</span>
                                    <span className="font-medium text-slate-400 italic">{item.detail_lampiran}</span>
                                 </div>
                              </div>
                           </div>
                        )}

                        {/* FOOTER : GURU & ACTION BUTTON */}
                        <div className="flex items-center justify-between border-t border-slate-100 pt-5 mt-auto">
                           <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full overflow-hidden border border-slate-200 shrink-0">
                                 <img src={item.guru_avatar} alt={item.guru_name} className="w-full h-full object-cover"/>
                              </div>
                              <div>
                                 <span className="text-[11px] font-bold text-slate-400 tracking-wider">GURU: </span>
                                 <span className="text-sm font-extrabold text-slate-700">{item.guru_name}</span>
                              </div>
                           </div>
                           <button className="bg-[#059669] hover:bg-[#047857] text-white px-5 py-2.5 flex items-center justify-center gap-2 rounded-xl text-sm font-bold transition-colors shadow-sm">
                              <Phone size={14} className="fill-current"/> Hubungi User
                           </button>
                        </div>

                     </div>
                  ))
               )}
               
               {!isLoading && filteredInfo.length > 0 && (
                  <div className="text-center text-xs font-bold text-slate-400 mt-2">
                     Menampilkan {filteredInfo.length} dari {filteredInfo.length} entri
                  </div>
               )}
            </div>
         </div>
      </div>
   );
}
