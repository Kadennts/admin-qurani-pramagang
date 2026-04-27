"use client";

import { useState, useEffect } from "react";
import { Search, Package, Users, Activity, BarChart3, ChevronLeft, ChevronRight, Eye, RefreshCw, XCircle, CheckCircle2 } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";

interface PackageInfo {
   id: string;
   guru_id: string;
   guru_name: string;
   guru_avatar: string;
   name: string;
   desc: string;
   sessions: string;
   price: number;
   fee: number;
   totalOrders: number;
   revenue: number;
   isActive: boolean;
}

export default function MasterPaketPage() {
   const [packages, setPackages] = useState<PackageInfo[]>([]);
   const [gurus, setGurus] = useState<any[]>([]);
   const [pesananList, setPesananList] = useState<any[]>([]);
   const [isLoading, setIsLoading] = useState(true);

   const [activeGuruFilter, setActiveGuruFilter] = useState("Semua");
   const [activeStatusTab, setActiveStatusTab] = useState("Semua");
   const [searchQuery, setSearchQuery] = useState("");

   const supabase = createClient();

   // Fixed name-based avatar mapping: Hasyim=profil1, Indi=profil2, Nanda=profil3
   const getGuruAvatar = (name: string, _guruList?: any[]) => {
      const n = name.toLowerCase();
      if (n.includes('hasyim')) return '/img/profil1.jpg';
      if (n.includes('indi')) return '/img/profil2.jpg';
      if (n.includes('nanda')) return '/img/profil3.jpg';
      // fallback: use avatar_url from DB if provided
      const fromDb = _guruList?.find(g => g.name === name)?.avatar_url;
      return fromDb || '/img/profil1.jpg';
   };

   useEffect(() => {
      fetchData();
   }, []);

   const fetchData = async () => {
      setIsLoading(true);

      const [{ data: gurusData }, { data: ordersData }] = await Promise.all([
         supabase.from('master_guru').select('*'),
         supabase.from('billing_pesanan').select('*')
      ]);

      const loadedGurus = gurusData || [];
      const loadedOrders = ordersData || [];

      setGurus(loadedGurus);
      setPesananList(loadedOrders);

      // Construct packages
      const constructedPackages: PackageInfo[] = [];

      loadedGurus.forEach(guru => {
         const seed = guru.name.charCodeAt(0) + guru.name.charCodeAt(1);
         const roundedBase = Math.round((70000 + (seed * 300)) / 5000) * 5000;

         const pkgsStr = [
            { name: '1x Pertemuan', sessions: '1x sesi', desc: `Sesi perdana pengenalan metode bersama Ust. ${guru.name.split(' ')[0]}`, price: roundedBase },
            { name: '5x Pertemuan', sessions: '5x sesi', desc: `5 sesi intensif tajwid & makharijul huruf...`, price: (roundedBase * 5) - Math.round((roundedBase * 0.1) / 5000) * 5000 },
            { name: '10x Pertemuan', sessions: '10x sesi', desc: `Program tahsin intensif 10 sesi, cocok b...`, price: (roundedBase * 10) - Math.round((roundedBase * 0.2) / 5000) * 5000 }
         ];

         pkgsStr.forEach((p, idx) => {
            const pkgOrders = loadedOrders.filter(o => o.guru_name === guru.name && o.package_name === p.name);
            const totalOrders = pkgOrders.length;
            const revenue = pkgOrders.reduce((acc, curr) => acc + (curr.price || 0), 0);
            
            constructedPackages.push({
               id: `${guru.id}-${idx}`,
               guru_id: guru.id,
               guru_name: guru.name,
               guru_avatar: getGuruAvatar(guru.name, loadedGurus),
               name: p.name,
               desc: p.desc,
               sessions: p.sessions,
               price: p.price,
               fee: 5000,
               totalOrders,
               revenue,
               isActive: true // start as active
            });
         });
      });

      setPackages(constructedPackages.sort((a,b) => b.totalOrders - a.totalOrders));
      setIsLoading(false);
   };

   const formatCurrency = (amount: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);

   const toggleStatus = (id: string) => {
      setPackages(prev => prev.map(p => {
         if (p.id === id) {
            const newStatus = !p.isActive;
            toast.success(`Paket ${p.name} milik ${p.guru_name} berhasil di${newStatus ? 'aktifkan' : 'nonaktifkan'}`);
            return { ...p, isActive: newStatus };
         }
         return p;
      }));
   };

   // Filtering
   let filtered = packages;
   if (activeGuruFilter !== 'Semua') {
      filtered = filtered.filter(p => p.guru_id === activeGuruFilter);
   }
   if (activeStatusTab === 'Aktif') {
      filtered = filtered.filter(p => p.isActive);
   } else if (activeStatusTab === 'Nonaktif') {
      filtered = filtered.filter(p => !p.isActive);
   }
   if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(p => 
         p.name.toLowerCase().includes(q) || 
         p.guru_name.toLowerCase().includes(q) || 
         p.desc.toLowerCase().includes(q)
      );
   }

   // Global Aggregations
   const totalPackages = packages.length;
   const activePackages = packages.filter(p => p.isActive).length;
   const totalGurusWithPackages = gurus.length; // since we generate for all
   const globalTotalOrders = packages.reduce((acc, p) => acc + p.totalOrders, 0);
   const globalTotalRevenue = packages.reduce((acc, p) => acc + p.revenue, 0);

   // Active Guru Specific Aggregations
   const selectedGuruObj = activeGuruFilter !== 'Semua' ? gurus.find(g => g.id === activeGuruFilter) : null;
   const selectedGuruPackages = packages.filter(p => p.guru_id === activeGuruFilter);
   const sv_activePkgs = selectedGuruPackages.filter(p => p.isActive).length;
   const sv_totalOrders = selectedGuruPackages.reduce((acc, p) => acc + p.totalOrders, 0);
   const sv_totalRevenue = selectedGuruPackages.reduce((acc, p) => acc + p.revenue, 0);

   return (
      <div className="max-w-[1400px] mx-auto pb-12 animate-in fade-in duration-300">
         
         {/* HEADER */}
         <div className="flex justify-between items-center mb-8 mt-2">
            <h1 className="text-3xl font-black text-slate-800 font-serif">Manajemen Paket</h1>
            <div className="bg-emerald-50 text-[#059669] text-sm font-bold px-4 py-2.5 rounded-xl border border-emerald-100 flex items-center gap-2 shadow-sm">
               <GraduationCapIcon /> Paket dibuat & dikelola oleh masing-masing Guru
            </div>
         </div>

         {/* TOP STAT CARDS */}
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
               <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4"><Package size={20} /></div>
               <h3 className="text-xs font-bold text-slate-400 mb-1">Total Paket</h3>
               <p className="text-2xl font-black text-slate-800">{totalPackages}</p>
               <p className="text-[11px] font-bold text-slate-400 mt-1">{activePackages} aktif</p>
            </div>
            <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
               <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#059669] flex items-center justify-center mb-4"><GraduationCapIcon /></div>
               <h3 className="text-xs font-bold text-slate-400 mb-1">Total Guru</h3>
               <p className="text-2xl font-black text-slate-800">{totalGurusWithPackages}</p>
               <p className="text-[11px] font-bold text-slate-400 mt-1">punya paket</p>
            </div>
            <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
               <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4"><Users size={20} /></div>
               <h3 className="text-xs font-bold text-slate-400 mb-1">Total Pesanan</h3>
               <p className="text-2xl font-black text-slate-800">{globalTotalOrders}</p>
               <p className="text-[11px] font-bold text-slate-400 mt-1">dari semua paket</p>
            </div>
            <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
               <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center mb-4"><BarChart3 size={20} /></div>
               <h3 className="text-xs font-bold text-slate-400 mb-1">Total Revenue</h3>
               <p className="text-2xl font-black text-slate-800">{formatCurrency(globalTotalRevenue)}</p>
               <p className="text-[11px] font-bold text-slate-400 mt-1">dari semua paket</p>
            </div>
         </div>

         {/* FILTER PER GURU CAROUSEL */}
         <div className="mb-6">
            <h4 className="text-xs font-black text-slate-400 tracking-wider mb-3">FILTER PER GURU</h4>
            <div className="flex gap-3 overflow-x-auto pb-2 hide-scrollbar">
               <button 
                  onClick={() => setActiveGuruFilter('Semua')}
                  className={`flex shrink-0 items-center gap-2 px-4 py-2.5 rounded-full text-sm font-extrabold transition-all border ${
                     activeGuruFilter === 'Semua' ? 'bg-[#059669] text-white border-[#059669] shadow-md' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
               >
                  <SparklesIcon /> Semua Guru <span className={`text-[10px] px-1.5 py-0.5 rounded-md ${activeGuruFilter === 'Semua' ? 'bg-white/20' : 'bg-slate-100 text-slate-500'}`}>{totalGurusWithPackages}</span>
               </button>

               {gurus.map(g => {
                  const pkgsAmt = packages.filter(p => p.guru_id === g.id).length;
                  return (
                     <button
                        key={g.id}
                        onClick={() => setActiveGuruFilter(g.id)}
                        className={`flex shrink-0 items-center gap-3 px-4 py-2 rounded-full text-sm font-extrabold transition-all border ${
                           activeGuruFilter === g.id ? 'bg-[#059669] text-white border-[#059669] shadow-md' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                        }`}
                     >
                        <img src={getGuruAvatar(g.name, gurus)} alt="" className="w-6 h-6 rounded-full bg-slate-100 border border-slate-200 object-cover"/>
                        {g.name} <span className={`text-[10px] px-1.5 py-0.5 rounded-md ${activeGuruFilter === g.id ? 'bg-white/20' : 'bg-slate-100 text-slate-500'}`}>{pkgsAmt}</span>
                     </button>
                  );
               })}
            </div>
         </div>

         {/* SELECTED GURU SPECIFIC BANNER (IF ANY) */}
         {selectedGuruObj && (
            <div className="bg-emerald-50 rounded-3xl p-6 border border-emerald-100 mb-8 animate-in fade-in slide-in-from-top-2">
               <div className="flex flex-col md:flex-row md:items-center gap-8">
                  <div className="flex items-center gap-4 border-b md:border-b-0 md:border-r border-emerald-200/50 pb-6 md:pb-0 md:pr-12">
                     <div className="w-14 h-14 rounded-full bg-white border-2 border-[#059669] p-0.5 overflow-hidden">
                        <img src={getGuruAvatar(selectedGuruObj.name, gurus)} alt="" className="w-full h-full object-cover rounded-full"/>
                     </div>
                     <div>
                        <h3 className="font-black text-slate-800 text-lg">{selectedGuruObj.name}</h3>
                        <p className="text-xs font-bold text-[#059669]">Paket milik guru ini</p>
                     </div>
                  </div>
                  
                  <div className="flex flex-1 justify-around gap-4 text-center">
                     <div>
                        <p className="text-xs font-bold text-slate-500 mb-1">Paket Aktif</p>
                        <p className="text-lg font-black text-slate-800">{sv_activePkgs} / {selectedGuruPackages.length}</p>
                     </div>
                     <div>
                        <p className="text-xs font-bold text-slate-500 mb-1">Total Pesanan</p>
                        <p className="text-xl font-black text-slate-800">{sv_totalOrders}x</p>
                     </div>
                     <div>
                        <p className="text-xs font-bold text-slate-500 mb-1">Revenue</p>
                        <p className="text-xl font-black text-slate-800">{formatCurrency(sv_totalRevenue)}</p>
                     </div>
                  </div>
               </div>
            </div>
         )}


         {/* SUB-FILTER & SEARCH */}
         <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-6">
            <div className="bg-white border border-slate-200 rounded-full p-1 flex">
               {['Semua', 'Aktif', 'Nonaktif'].map(s => (
                  <button
                     key={s}
                     onClick={() => setActiveStatusTab(s)}
                     className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${activeStatusTab === s ? 'bg-[#059669] text-white shadow-sm' : 'text-slate-500 hover:bg-slate-50'}`}
                  >
                     {s}
                  </button>
               ))}
            </div>

            <div className="relative w-full md:w-[350px]">
               <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
               <input 
                  type="text" 
                  placeholder="Cari nama paket, guru, atau deskripsi..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-full text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#059669]/20 shadow-sm"
               />
            </div>
         </div>


         {/* TABLE */}
         <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden flex flex-col min-h-[500px]">
            <div className="overflow-x-auto">
               <table className="w-full whitespace-nowrap">
                  <thead>
                     <tr className="text-slate-800 text-xs font-black tracking-wider text-left border-b border-slate-100 bg-slate-50/50">
                        <th className="px-8 py-5"><div className="flex items-center gap-1">Nama Paket <span className="text-slate-400">↕</span></div></th>
                        <th className="px-6 py-5">Guru Pemilik</th>
                        <th className="px-6 py-5"><div className="flex items-center gap-1">Sesi <span className="text-slate-400">↕</span></div></th>
                        <th className="px-6 py-5"><div className="flex items-center gap-1">Harga <span className="text-slate-400">↕</span></div></th>
                        <th className="px-6 py-5"><div className="flex items-center gap-1">Total Pesanan <span className="text-slate-400">↕</span></div></th>
                        <th className="px-6 py-5"><div className="flex items-center gap-1 font-bold text-[#059669]">Revenue <span className="text-slate-400">↓</span></div></th>
                        <th className="px-6 py-5 text-center">Status</th>
                        <th className="px-8 py-5 text-center">Aksi</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                     {isLoading ? (
                        <tr><td colSpan={8} className="px-8 py-12 text-center text-slate-500 font-medium">Memuat data paket...</td></tr>
                     ) : filtered.length === 0 ? (
                        <tr><td colSpan={8} className="px-8 py-12 text-center text-slate-500 font-medium">Tidak ada data pake.</td></tr>
                     ) : (
                        filtered.map((item) => (
                           <tr key={item.id} className="hover:bg-slate-50/80 transition-colors group">
                              <td className="px-8 py-4">
                                 <h4 className="font-extrabold text-slate-800 text-[13px]">{item.name}</h4>
                                 <p className="text-[11px] font-semibold text-slate-400 mt-0.5 truncate max-w-[200px]" title={item.desc}>{item.desc}</p>
                              </td>
                              <td className="px-6 py-4">
                                 <div className="flex items-center gap-3">
                                    <img src={item.guru_avatar} alt="avatar" className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200" />
                                    <span className="font-extrabold text-slate-700 text-xs">{item.guru_name}</span>
                                 </div>
                              </td>
                              <td className="px-6 py-4">
                                 <span className="font-black text-slate-800 text-sm">{item.sessions}</span>
                              </td>
                              <td className="px-6 py-4 flex flex-col justify-center translate-y-2">
                                 <span className="font-black text-slate-800 text-sm">{formatCurrency(item.price)}</span>
                                 <span className="text-[10px] font-semibold text-slate-400 mt-0.5">+Rp {item.fee.toLocaleString('id-ID')} fee</span>
                              </td>
                              <td className="px-6 py-4">
                                 <span className="font-extrabold text-slate-800 text-[13px]">{item.totalOrders} pesanan</span>
                              </td>
                              <td className="px-6 py-4">
                                 <span className="font-black text-[#059669] text-[13px]">{formatCurrency(item.revenue)}</span>
                              </td>
                              <td className="px-6 py-4 text-center">
                                 {item.isActive ? (
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black"><div className="w-1.5 h-1.5 rounded-full bg-[#059669]"></div> Aktif</span>
                                 ) : (
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-500 rounded-full text-[10px] font-black"><div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div> Nonaktif</span>
                                 )}
                              </td>
                              <td className="px-8 py-4 text-right">
                                 <div className="flex items-center justify-end gap-2">
                                    <button className="flex items-center gap-1.5 text-xs font-black text-blue-500 bg-blue-50 hover:bg-blue-100 border border-blue-100 px-3 py-1.5 rounded-full transition-colors"><Eye size={14}/> Detail</button>
                                    <button 
                                       onClick={() => toggleStatus(item.id)}
                                       className={`flex items-center gap-1.5 text-xs font-black px-3 py-1.5 rounded-full transition-colors border ${
                                          item.isActive ? 'text-amber-500 bg-amber-50 hover:bg-amber-100 border-amber-100' : 'text-[#059669] bg-emerald-50 hover:bg-emerald-100 border-emerald-100'
                                       }`}
                                    >
                                       {item.isActive ? <XCircle size={14} /> : <CheckCircle2 size={14} />}
                                       {item.isActive ? 'Nonaktifkan' : 'Aktifkan'}
                                    </button>
                                 </div>
                              </td>
                           </tr>
                        ))
                     )}
                  </tbody>
               </table>
            </div>

            <div className="bg-[#fcfcfc] border-t border-slate-100 p-5 mt-auto flex items-center justify-between">
               <div className="text-sm font-bold text-slate-400 tracking-wide ml-3">
                  Menampilkan 1-{Math.min(10, filtered.length)} dari {filtered.length} paket
               </div>
               <div className="flex items-center gap-2 text-slate-400 font-bold mr-3">
                  <button className="w-8 h-8 flex justify-center items-center rounded-lg hover:bg-slate-200 transition-colors"><ChevronLeft size={16}/></button>
                  <button className="w-8 h-8 flex justify-center items-center rounded-lg bg-[#059669] text-white shadow-sm">1</button>
                  <button className="w-8 h-8 flex justify-center items-center rounded-lg hover:bg-slate-200 transition-colors"><ChevronRight size={16}/></button>
               </div>
            </div>
         </div>

      </div>
   );
}

// Micro Icon Wrappers
const GraduationCapIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lucide"><path d="M21.42 10.922a2 2 0 0 1-.01 3.016l-7.11 7.11a2 2 0 0 1-2.6.02L2.59 13.9A2 2 0 0 1 2 12.35v-6.3a2 2 0 0 1 2-2h6.35a2 2 0 0 1 1.55.59l9.52 9.51Z"/><path d="m15 5-3 3"/><path d="M7 11h.01"/><path d="M12 16h.01"/></svg>;
const SparklesIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lucide"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M3 5h4"/><path d="M19 17v4"/><path d="M17 19h4"/></svg>;
