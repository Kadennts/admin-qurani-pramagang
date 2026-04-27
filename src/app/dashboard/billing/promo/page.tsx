"use client";

import { useState, useEffect } from "react";
import { Search, Tag, CheckCircle2, Zap, Users, Edit2, Trash2, XCircle, Plus, Calendar as CalendarIcon } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";

export default function BillingPromoPage() {
   const [promos, setPromos] = useState<any[]>([]);
   const [isLoading, setIsLoading] = useState(true);
   const [activeTab, setActiveTab] = useState("Semua");
   const [searchQuery, setSearchQuery] = useState("");
   const [sortOrder, setSortOrder] = useState<'desc'|'asc'>('desc');

   // Modal states
   const [isModalOpen, setIsModalOpen] = useState(false);
   const [isEditing, setIsEditing] = useState(false);
   const [currentId, setCurrentId] = useState<string | null>(null);
   const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
   const [promoToDelete, setPromoToDelete] = useState<{id: string, code: string} | null>(null);

   const initialFormState = {
      code: "",
      name: "",
      description: "",
      discount_type: "Persentase (%)",
      discount_value: "",
      max_discount_value: "",
      min_purchase: "",
      max_usage: "",
      start_date: "",
      end_date: "",
   };
   const [formData, setFormData] = useState(initialFormState);

   const supabase = createClient();

   useEffect(() => {
      fetchData();
   }, []);

   const fetchData = async () => {
      setIsLoading(true);
      const { data, error } = await supabase.from('billing_promos').select('*').order('created_at', { ascending: false });
      if (data) {
         setPromos(data);
      }
      setIsLoading(false);
   };

   // Stats calculation
   const totalKode = promos.length;
   const aktifPromo = promos.filter(p => p.status === 'Aktif').length;
   
   const totalUsage = promos.reduce((sum, p) => sum + (p.current_usage || 0), 0);
   const maxUsageCapacity = promos.reduce((sum, p) => sum + (p.max_usage || 0), 0);
   const avgUsagePercentage = maxUsageCapacity === 0 ? 0 : Math.round((totalUsage / maxUsageCapacity) * 100);

   const openCreateModal = () => {
      setIsEditing(false);
      setCurrentId(null);
      setFormData(initialFormState);
      setIsModalOpen(true);
   };

   const openEditModal = (promo: any) => {
      setIsEditing(true);
      setCurrentId(promo.id);
      setFormData({
         code: promo.code,
         name: promo.name,
         description: promo.description || "",
         discount_type: promo.discount_type,
         discount_value: promo.discount_value.toString(),
         max_discount_value: promo.max_discount_value ? promo.max_discount_value.toString() : "",
         min_purchase: promo.min_purchase ? promo.min_purchase.toString() : "",
         max_usage: promo.max_usage ? promo.max_usage.toString() : "",
         start_date: promo.start_date || "",
         end_date: promo.end_date || "",
      });
      setIsModalOpen(true);
   };

   const openDeleteModal = (id: string, code: string) => {
      setPromoToDelete({ id, code });
      setIsDeleteModalOpen(true);
   };

   const confirmDelete = async () => {
      if (!promoToDelete) return;
      const { error } = await supabase.from('billing_promos').delete().eq('id', promoToDelete.id);
      if(!error) {
         toast.success(`Kode "${promoToDelete.code}" telah dihapus.`);
         fetchData();
      } else {
         toast.error("Gagal menghapus promo");
      }
      setIsDeleteModalOpen(false);
      setPromoToDelete(null);
   };

   const handleSave = async () => {
      if(!formData.code || !formData.name || !formData.discount_value) {
         toast.error("Mohon lengkapi kolom wajib (*)");
         return;
      }

      const payload = {
         code: formData.code.toUpperCase(),
         name: formData.name,
         description: formData.description,
         discount_type: formData.discount_type,
         discount_value: Number(formData.discount_value),
         max_discount_value: Number(formData.max_discount_value || 0),
         min_purchase: Number(formData.min_purchase || 0),
         max_usage: Number(formData.max_usage || 0),
         start_date: formData.start_date || null,
         end_date: formData.end_date || null,
         status: 'Aktif', // Default
         current_usage: isEditing ? undefined : 0,
         usage_percentage: isEditing ? undefined : 0,
      };

      if (isEditing && currentId) {
         const { error } = await supabase.from('billing_promos').update(payload).eq('id', currentId);
         if(error) toast.error("Gagal mengupdate promo");
         else {
            toast.success("Promo berhasil diperbarui!");
            setIsModalOpen(false);
            fetchData();
         }
      } else {
         const { error } = await supabase.from('billing_promos').insert([payload]);
         if(error) toast.error("Gagal menambahkan promo, pastikan Kode unik");
         else {
            toast.success("Promo berhasil ditambahkan!");
            setIsModalOpen(false);
            fetchData();
         }
      }
   };

   const formatCurrency = (val: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits:0 }).format(val);
   const formatDateFull = (d: string) => d ? new Date(d).toLocaleDateString('id-ID', { day:'2-digit', month: 'short', year: 'numeric' }) : "-";

   let filtered = promos;
   if(activeTab !== "Semua") {
      filtered = promos.filter(p => p.status === activeTab);
   }
   if(searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(p => p.code.toLowerCase().includes(q) || p.name.toLowerCase().includes(q));
   }

   filtered = [...filtered].sort((a, b) => {
      const dateA = new Date(a.created_at || 0).getTime();
      const dateB = new Date(b.created_at || 0).getTime();
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
   });

   const getUsageColor = (pct: number) => {
      if(pct >= 90) return 'bg-red-500';
      if(pct >= 60) return 'bg-amber-500';
      return 'bg-[#059669]';
   };

   return (
      <div className="max-w-[1400px] mx-auto pb-12 animate-in fade-in duration-300">
         
         {/* Stats Cards */}
         <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 mt-4">
            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex flex-col justify-between hidden md:block">
               <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-500 flex items-center justify-center shrink-0">
                     <Tag size={20} />
                  </div>
                  <span className="font-bold text-slate-500 text-sm">Total Kode</span>
               </div>
               <h3 className="text-3xl font-black text-slate-800">{totalKode}</h3>
            </div>
            
            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
               <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0">
                     <CheckCircle2 size={20} />
                  </div>
                  <span className="font-bold text-slate-500 text-sm">Aktif</span>
               </div>
               <h3 className="text-3xl font-black text-slate-800">{aktifPromo}</h3>
            </div>

            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
               <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center shrink-0">
                     <Zap size={20} className="fill-current" />
                  </div>
                  <span className="font-bold text-slate-500 text-sm">Tingkat Penggunaan</span>
               </div>
               <h3 className="text-3xl font-black text-slate-800">{avgUsagePercentage}%</h3>
            </div>

            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
               <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
                     <Users size={20} />
                  </div>
                  <span className="font-bold text-slate-500 text-sm">Total Pemakaian</span>
               </div>
               <h3 className="text-3xl font-black text-slate-800">{totalUsage}</h3>
            </div>
         </div>

         {/* Top Bar Filter */}
         <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 mb-3">
            <div className="relative w-full xl:max-w-md">
               <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
               <input 
                  type="text" 
                  placeholder="Cari kode atau nama promo..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-24 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#059669]/20 shadow-sm"
               />
               <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#059669] text-white text-xs font-bold px-4 py-1.5 rounded-xl flex items-center gap-1.5 hover:bg-[#047857]">
                  <Search size={12} /> Cari
               </button>
            </div>

            <button 
               onClick={openCreateModal}
               className="bg-[#059669] hover:bg-[#047857] text-white text-sm font-bold px-5 py-3 rounded-xl shadow-md transition-colors flex items-center gap-2 shadow-[#059669]/20"
            >
               <Plus size={18} strokeWidth={3} /> Buat Promo
            </button>
         </div>

         {/* Main Container Configured */}
         <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden flex flex-col mt-4 min-h-[500px]">
            {/* Tabs */}
            <div className="flex items-center gap-6 px-8 pt-6 pb-2 border-b border-slate-100 overflow-x-auto">
               {['Semua', 'Aktif', 'Nonaktif'].map((tab) => {
                  const mapCount = {
                     'Semua': promos.length,
                     'Aktif': promos.filter(p=>p.status==='Aktif').length,
                     'Nonaktif': promos.filter(p=>p.status==='Nonaktif').length,
                  }[tab];
                  return (
                     <button 
                        key={tab} 
                        onClick={() => setActiveTab(tab)}
                        className={`font-extrabold text-sm pb-4 border-b-2 transition-colors whitespace-nowrap ${activeTab === tab ? 'border-[#059669] text-[#059669]' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
                     >
                        {tab} <span className={activeTab === tab ? "opacity-100" : "opacity-50"}>{mapCount}</span>
                     </button>
                  );
               })}
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
               <table className="w-full whitespace-nowrap">
                  <thead>
                     <tr className="text-slate-500 text-xs font-black tracking-wider text-left border-b border-slate-100">
                        <th className="px-8 py-5">
                           <button onClick={() => setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc')} className="flex items-center gap-1 hover:text-slate-800 transition-colors">
                              KODE PROMO <span className="text-[#059669] font-sans text-[13px]">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                           </button>
                        </th>
                        <th className="px-6 py-5">NAMA</th>
                        <th className="px-6 py-5">DISKON <span className="text-slate-300">↕</span></th>
                        <th className="px-6 py-5 text-center">STATUS</th>
                        <th className="px-6 py-5">PENGGUNAAN <span className="text-slate-300">↕</span></th>
                        <th className="px-6 py-5 flex items-center gap-1">BERLAKU <span className="text-slate-300">↕</span></th>
                        <th className="px-8 py-5 text-center">AKSI</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                     {isLoading ? (
                        <tr><td colSpan={7} className="px-8 py-12 text-center text-slate-500 font-medium">Memuat kode promo...</td></tr>
                     ) : filtered.length === 0 ? (
                        <tr><td colSpan={7} className="px-8 py-12 text-center text-slate-500 font-medium">Tidak ada data promo.</td></tr>
                     ) : (
                        filtered.map((item) => (
                           <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                              <td className="px-8 py-4">
                                 <div className="inline-block border border-emerald-200 bg-emerald-50 text-[#059669] px-3 py-1.5 rounded-lg text-xs font-black tracking-wider uppercase">
                                    {item.code}
                                 </div>
                              </td>
                              <td className="px-6 py-4 max-w-xs truncate">
                                 <h4 className="font-extrabold text-slate-800 text-sm truncate">{item.name}</h4>
                                 <p className="text-xs font-semibold text-slate-400 mt-0.5 truncate">{item.description}</p>
                              </td>
                              <td className="px-6 py-4">
                                 {item.discount_type === 'Persentase (%)' ? (
                                    <span className="font-black text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg text-xs tracking-wide">
                                       {item.discount_value}%
                                    </span>
                                 ) : (
                                    <span className="font-black text-amber-600 bg-amber-50 px-3 py-1.5 rounded-lg text-xs tracking-wide">
                                       {formatCurrency(item.discount_value)}
                                    </span>
                                 )}
                              </td>
                              <td className="px-6 py-4 text-center">
                                 <div className={`inline-flex items-center gap-1.5 text-xs font-extrabold tracking-wide ${
                                    item.status === 'Aktif' ? 'text-[#059669]' : 
                                    item.status === 'Kedaluwarsa' ? 'text-red-500' : 'text-slate-400'
                                 }`}>
                                    <div className={`w-3 h-3 rounded-full flex items-center justify-center border-2 border-white ring-1 ${
                                       item.status === 'Aktif' ? 'ring-[#059669] bg-[#059669]/20' : 
                                       item.status === 'Kedaluwarsa' ? 'ring-red-500 bg-red-500/20' : 'ring-slate-300 bg-slate-100'
                                    }`}>
                                       {item.status === 'Aktif' && <div className="w-1.5 h-1.5 bg-[#059669] rounded-full"></div>}
                                       {item.status === 'Kedaluwarsa' && <XCircle size={8} className="text-red-500" strokeWidth={4}/>}
                                    </div>
                                    {item.status}
                                 </div>
                              </td>
                              <td className="px-6 py-4">
                                 <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                                    <span className="text-slate-800">{item.current_usage}/{item.max_usage}</span>
                                    <span className="text-slate-400">{item.usage_percentage}%</span>
                                 </div>
                                 <div className="w-[120px] h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                    <div 
                                      className={`h-full rounded-full ${getUsageColor(item.usage_percentage)}`} 
                                      style={{ width: `${Math.min(item.usage_percentage, 100)}%` }}
                                    ></div>
                                 </div>
                              </td>
                              <td className="px-6 py-4">
                                 <span className="text-sm font-semibold text-slate-600">
                                    {formatDateFull(item.start_date)} — {formatDateFull(item.end_date)}
                                 </span>
                              </td>
                              <td className="px-8 py-4 text-right">
                                 <div className="flex justify-end gap-2">
                                    <button onClick={() => openEditModal(item)} className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-blue-500 hover:bg-blue-50 transition-colors">
                                       <Edit2 size={14} />
                                    </button>
                                    <button onClick={() => openDeleteModal(item.id, item.code)} className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                                       <Trash2 size={14} />
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
                  Menampilkan <span className="font-extrabold text-[#059669]">1-{Math.min(10, filtered.length)}</span> dari {promos.length} data
               </div>
               <div className="flex items-center gap-2 text-slate-400 font-bold mr-3">
                  <button className="w-8 h-8 flex justify-center items-center rounded-lg hover:bg-slate-200 transition-colors">&lt;</button>
                  <button className="w-8 h-8 flex justify-center items-center rounded-lg border border-slate-200 bg-white text-slate-600 shadow-sm">1</button>
                  <button className="w-8 h-8 flex justify-center items-center rounded-lg hover:bg-slate-200 transition-colors">&gt;</button>
               </div>
            </div>
         </div>


         {/* M O D A L : BUAT & EDIT PROMO */}
         {isModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
               <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-100 flex flex-col relative">
                  
                  {/* Header */}
                  <div className="px-6 py-5 flex items-center justify-between border-b border-slate-100">
                     <h2 className="text-lg font-black text-slate-800">
                        {isEditing ? 'Edit Kode Diskon' : 'Buat Kode Diskon Baru'}
                     </h2>
                     <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                        <XCircle size={20} />
                     </button>
                  </div>

                  {/* Body Wrapper with Scroll */}
                  <div className="p-6 overflow-y-auto max-h-[70vh] custom-scrollbar">
                     <div className="space-y-4">
                        
                        <div className="flex gap-4">
                           <div className="w-1/2">
                              <label className="block text-xs font-extrabold text-slate-600 mb-1.5">Kode Promo <span className="text-red-500">*</span></label>
                              <input 
                                 type="text" 
                                 maxLength={20}
                                 className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#059669] focus:ring-2 focus:ring-[#059669]/20 text-sm font-semibold uppercase"
                                 placeholder="HEMAT25, RAMADAN2026 ..."
                                 value={formData.code}
                                 onChange={(e) => setFormData({...formData, code: e.target.value})}
                              />
                           </div>
                           <div className="w-1/2">
                              <label className="block text-xs font-extrabold text-slate-600 mb-1.5">Nama Promo <span className="text-red-500">*</span></label>
                              <input 
                                 type="text" 
                                 className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#059669] focus:ring-2 focus:ring-[#059669]/20 text-sm font-semibold"
                                 placeholder="Diskon Ramadan 2026"
                                 value={formData.name}
                                 onChange={(e) => setFormData({...formData, name: e.target.value})}
                              />
                           </div>
                        </div>

                        <div>
                           <label className="block text-xs font-extrabold text-slate-600 mb-1.5">Deskripsi</label>
                           <textarea 
                              rows={2}
                              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-[#059669] focus:ring-2 focus:ring-[#059669]/20 text-sm font-semibold text-slate-700"
                              placeholder="Isi deskripsi singkat tentang promo ini..."
                              value={formData.description}
                              onChange={(e) => setFormData({...formData, description: e.target.value})}
                           ></textarea>
                        </div>

                        <div className="flex gap-4">
                           <div className="w-1/2">
                              <label className="block text-xs font-extrabold text-slate-600 mb-1.5">Tipe Diskon</label>
                              <select 
                                 className="w-full px-4 py-2.5 rounded-xl border border-[#059669] bg-emerald-50/20 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#059669]/20 text-sm font-semibold appearance-none"
                                 value={formData.discount_type}
                                 onChange={(e) => setFormData({...formData, discount_type: e.target.value})}
                              >
                                 <option value="Persentase (%)">Persentase (%)</option>
                                 <option value="Nominal (Rp)">Nominal (Rp)</option>
                              </select>
                           </div>
                           <div className="w-1/2 relative">
                              <label className="block text-xs font-extrabold text-slate-600 mb-1.5">
                                 {formData.discount_type === 'Persentase (%)' ? 'Nilai (%)' : 'Nilai (Rp)'}
                              </label>
                              <input 
                                 type="number" 
                                 className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#059669] focus:ring-2 focus:ring-[#059669]/20 text-sm font-semibold pr-8"
                                 placeholder="0"
                                 value={formData.discount_value}
                                 onChange={(e) => setFormData({...formData, discount_value: e.target.value})}
                              />
                              <div className="absolute right-3 top-[34px] flex flex-col pointer-events-none opacity-40">
                                 <span className="text-[10px]">▲</span><span className="text-[10px] -mt-1">▼</span>
                              </div>
                           </div>
                        </div>

                        <div>
                           <label className="block text-xs font-extrabold text-slate-600 mb-1.5">Maks. Diskon (IDR)</label>
                           <input 
                              type="number" 
                              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#059669] text-sm font-semibold focus:ring-2 focus:ring-[#059669]/20"
                              placeholder="999999"
                              value={formData.max_discount_value}
                              onChange={(e) => setFormData({...formData, max_discount_value: e.target.value})}
                           />
                        </div>

                        <div className="flex gap-4">
                           <div className="w-1/2">
                              <label className="block text-xs font-extrabold text-slate-600 mb-1.5">Min. Pembelian (Rp)</label>
                              <input 
                                 type="number" 
                                 className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#059669] text-sm font-semibold focus:ring-2 focus:ring-[#059669]/20"
                                 placeholder="0"
                                 value={formData.min_purchase}
                                 onChange={(e) => setFormData({...formData, min_purchase: e.target.value})}
                              />
                           </div>
                           <div className="w-1/2">
                              <label className="block text-xs font-extrabold text-slate-600 mb-1.5">Batas Penggunaan</label>
                              <input 
                                 type="number" 
                                 className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#059669] text-sm font-semibold focus:ring-2 focus:ring-[#059669]/20"
                                 placeholder="100"
                                 value={formData.max_usage}
                                 onChange={(e) => setFormData({...formData, max_usage: e.target.value})}
                              />
                           </div>
                        </div>

                        <div className="flex gap-4">
                           <div className="w-1/2 relative">
                              <label className="block text-xs font-extrabold text-slate-600 mb-1.5">Berlaku Dari</label>
                              <input 
                                 type="date" 
                                 className="w-full pl-4 pr-10 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#059669] text-sm font-semibold focus:ring-2 focus:ring-[#059669]/20 placeholder-slate-400"
                                 value={formData.start_date}
                                 onChange={(e) => setFormData({...formData, start_date: e.target.value})}
                              />
                              <CalendarIcon size={16} className="absolute right-4 top-[36px] text-slate-400 pointer-events-none" />
                           </div>
                           <div className="w-1/2 relative">
                              <label className="block text-xs font-extrabold text-slate-600 mb-1.5">Berlaku Sampai</label>
                              <input 
                                 type="date" 
                                 className="w-full pl-4 pr-10 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#059669] text-sm font-semibold focus:ring-2 focus:ring-[#059669]/20"
                                 value={formData.end_date}
                                 onChange={(e) => setFormData({...formData, end_date: e.target.value})}
                              />
                              <CalendarIcon size={16} className="absolute right-4 top-[36px] text-slate-400 pointer-events-none" />
                           </div>
                        </div>

                     </div>
                  </div>

                  {/* Footer Actions */}
                  <div className="px-6 py-4 flex items-center justify-end gap-3 bg-white border-t border-slate-100 mt-2">
                     <button onClick={() => setIsModalOpen(false)} className="text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors px-4 py-2">
                        Batal
                     </button>
                     <button 
                        onClick={handleSave}
                        className="bg-[#059669] hover:bg-[#047857] text-white text-sm font-bold px-6 py-2.5 rounded-xl shadow-md transition-colors"
                     >
                        {isEditing ? 'Simpan Perubahan' : 'save'}
                     </button>
                  </div>
               </div>
            </div>
         )}

         {/* M O D A L : CONFIRM DELETE */}
         {isDeleteModalOpen && promoToDelete && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
               <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200 p-6 border border-slate-100">
                  <h3 className="text-lg font-black text-slate-800 mb-2">Hapus kode "{promoToDelete.code}"?</h3>
                  <p className="text-sm font-semibold text-slate-500 mb-8 leading-relaxed">
                     Kode yang sudah dihapus tidak bisa dikembalikan. Pengguna yang belum memakai kode ini tidak bisa menggunakannya lagi.
                  </p>
                  <div className="flex justify-end gap-3">
                     <button onClick={() => setIsDeleteModalOpen(false)} className="px-5 py-2.5 flex-1 md:flex-none rounded-xl border border-slate-200 text-slate-600 text-sm font-bold hover:bg-slate-50 transition-colors">
                        Batal
                     </button>
                     <button onClick={confirmDelete} className="px-5 py-2.5 flex-1 md:flex-none rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-bold transition-colors shadow-md">
                        Konfirmasi
                     </button>
                  </div>
               </div>
            </div>
         )}
      </div>
   );
}
