"use client";

import { useState, useEffect } from "react";
import { Search, Filter, Pencil, Trash2, CheckCircle2, DollarSign, Globe, Plus, ToggleRight, ToggleLeft, FileText, ChevronUp, ChevronDown, CheckCircle, XCircle } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

export default function TaxRatesPage() {
  const [taxData, setTaxData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [activeType, setActiveType] = useState("Semua Tipe");
  const [showInactive, setShowInactive] = useState(false);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingData, setEditingData] = useState<any | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    tax_code: '',
    tax_type: 'VAT',
    tax_name: '',
    country_code: '',
    country_name: '',
    tax_rate: '',
    description: '',
    is_active: true
  });

  const supabase = createClient();

  const fetchTaxes = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('master_tax_rates')
      .select('*')
      .order('created_at', { ascending: true }); // Based on dummy timeline
    
    if (data) setTaxData(data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchTaxes();
  }, [supabase]);

  // Handle Disable/Enable (Toggle Action)
  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    // Optimistic Update
    setTaxData(prev => prev.map(t => t.id === id ? { ...t, is_active: !currentStatus } : t));
    // Database Update
    await supabase.from('master_tax_rates').update({ is_active: !currentStatus }).eq('id', id);
    fetchTaxes();
  };

  // Handle Delete
  const handleDelete = async (id: string) => {
    if(!confirm("Yakin ingin menghapus Data Tax Rate ini?")) return;
    setTaxData(prev => prev.filter(t => t.id !== id));
    await supabase.from('master_tax_rates').delete().eq('id', id);
  };

  // Setup Form for Add or Edit
  const openModal = (data: any = null) => {
    if (data) {
       setEditingData(data);
       setFormData({
         tax_code: data.tax_code,
         tax_type: data.tax_type,
         tax_name: data.tax_name,
         country_code: data.country_code,
         country_name: data.country_name,
         tax_rate: data.tax_rate.toString(),
         description: data.description || '',
         is_active: data.is_active
       });
    } else {
       setEditingData(null);
       setFormData({
         tax_code: '',
         tax_type: 'VAT',
         tax_name: '',
         country_code: '',
         country_name: '',
         tax_rate: '',
         description: '',
         is_active: true
       });
    }
    setIsModalOpen(true);
  };

  // Handle Submit Form
  const handleSubmitForm = async (e: React.FormEvent) => {
     e.preventDefault();
     
     const payload = {
        ...formData,
        tax_rate: parseFloat(formData.tax_rate)
     };

     if (editingData) {
        // Update
        setTaxData(prev => prev.map(t => t.id === editingData.id ? { ...t, ...payload } : t));
        await supabase.from('master_tax_rates').update(payload).eq('id', editingData.id);
     } else {
        // Insert
        // Using random UUID temporarily for optimistic UI if needed, but easier to just reset and fetch
        const { error } = await supabase.from('master_tax_rates').insert([payload]);
     }
     
     setIsModalOpen(false);
     fetchTaxes();
  };

  // Filters Processing
  let filteredData = taxData;
  if (!showInactive) {
     filteredData = filteredData.filter(t => t.is_active === true);
  }
  if (activeType !== "Semua Tipe") {
     filteredData = filteredData.filter(t => t.tax_type === activeType);
  }
  if (searchQuery.trim() !== "") {
     const q = searchQuery.toLowerCase();
     filteredData = filteredData.filter(t => 
        t.tax_code.toLowerCase().includes(q) || 
        t.tax_name.toLowerCase().includes(q) || 
        t.country_name.toLowerCase().includes(q)
     );
  }

  // Summary Metrics
  const summary = {
     total: taxData.length,
     active: taxData.filter(t => t.is_active).length,
     countries: new Set(taxData.map(t => t.country_name)).size
  };

  const formatDate = (dateStr: string) => {
    if(!dateStr) return "-";
    const date = new Date(dateStr);
    const dd = String(date.getDate()).padStart(2, '0');
    const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agt", "Sep", "Okt", "Nov", "Des"];
    const mmm = months[date.getMonth()];
    const yyyy = date.getFullYear();
    return `${dd} ${mmm} ${yyyy}`;
  };

  const getTypeStyle = (type: string) => {
     switch(type) {
        case 'VAT': return "bg-blue-50 text-blue-600 border-blue-200";
        case 'PPh': return "bg-orange-50 text-orange-600 border-orange-200";
        case 'GST': return "bg-purple-50 text-purple-600 border-purple-200";
        case 'Exempt': return "bg-slate-50 text-slate-600 border-slate-200";
        default: return "bg-gray-50 text-gray-600 border-gray-200";
     }
  };

  return (
    <div className="max-w-[1400px] mx-auto space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
         <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-50 text-[#059669] rounded-xl flex items-center justify-center border border-emerald-100 shadow-sm">
               <DollarSign size={24} />
            </div>
            <div>
               <h1 className="text-2xl font-extrabold text-slate-800">Tax Rates</h1>
            </div>
         </div>
         <button 
           onClick={() => openModal()}
           className="bg-[#059669] hover:bg-[#047857] text-white px-5 py-2.5 rounded-full text-sm font-bold flex items-center gap-2 shadow-md transition-colors"
         >
           <Plus size={16} /> Tambah Tax Rate
         </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
         <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between h-[120px]">
            <div className="flex items-center gap-3">
               <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-500 flex justify-center items-center">
                  <DollarSign size={16} strokeWidth={2.5} />
               </div>
               <span className="text-sm font-bold text-slate-500">Total Tax Rate</span>
            </div>
            <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">{summary.total}</h2>
         </div>
         <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between h-[120px]">
            <div className="flex items-center gap-3">
               <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-500 flex justify-center items-center">
                  <CheckCircle2 size={16} strokeWidth={2.5} />
               </div>
               <span className="text-sm font-bold text-slate-500">Aktif</span>
            </div>
            <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">{summary.active}</h2>
         </div>
         <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between h-[120px]">
            <div className="flex items-center gap-3">
               <div className="w-8 h-8 rounded-full bg-purple-50 text-purple-500 flex justify-center items-center">
                  <Globe size={16} strokeWidth={2.5} />
               </div>
               <span className="text-sm font-bold text-slate-500">Negara</span>
            </div>
            <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">{summary.countries}</h2>
         </div>
      </div>

      {/* Search & Filters Toolbar */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 mb-2">
         
         <div className="flex flex-wrap items-center gap-2">
            {["Semua Tipe", "VAT", "GST", "PPh", "Exempt"].map((type) => (
               <button
                 key={type}
                 onClick={() => setActiveType(type)}
                 className={`px-5 py-2 rounded-full text-sm font-bold transition-colors border ${
                    activeType === type 
                    ? "bg-[#059669] text-white border-[#059669] shadow-sm" 
                    : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50"
                 }`}
               >
                 {type}
               </button>
            ))}

            <div className="w-px h-8 bg-slate-200 mx-2 hidden sm:block"></div>

            <button 
              onClick={() => setShowInactive(!showInactive)}
              className={`px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 transition-colors border ${
                 showInactive 
                 ? "bg-slate-100 text-slate-500 border-slate-200" 
                 : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50 shadow-sm"
              }`}
            >
              <Filter size={16} /> {showInactive ? "Sembunyikan Nonaktif" : "Tampilkan Nonaktif"}
            </button>
         </div>

         <div className="relative w-full xl:w-80">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
               type="text" 
               placeholder="Cari kode, nama, negara..." 
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#059669]/20 shadow-sm font-medium"
            />
         </div>
      </div>

      {/* Main Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col min-h-[400px]">
         <div className="overflow-x-auto">
            <table className="w-full whitespace-nowrap">
               <thead>
                  <tr className="text-slate-500 text-xs font-extrabold text-left border-b border-slate-100 bg-slate-50/50">
                     <th className="px-6 py-4"><div className="flex items-center gap-1 cursor-pointer hover:text-slate-700">Kode <ChevronUp size={12}/></div></th>
                     <th className="px-6 py-4">Tipe</th>
                     <th className="px-6 py-4">
                        <span className="flex items-center gap-1 text-[#059669]">Negara <ChevronUp size={12}/></span>
                     </th>
                     <th className="px-6 py-4"><div className="flex items-center gap-1 cursor-pointer hover:text-slate-700">Tarif <ChevronUp size={12}/></div></th>
                     <th className="px-6 py-4"><div className="flex items-center gap-1 cursor-pointer hover:text-slate-700">Tgl Dibuat <ChevronUp size={12}/></div></th>
                     <th className="px-6 py-4">Status</th>
                     <th className="px-6 py-4">Aksi</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                  {isLoading ? (
                     <tr><td colSpan={7} className="px-6 py-12 text-center text-slate-500 font-medium">Memuat data Tax Rates...</td></tr>
                  ) : filteredData.length === 0 ? (
                     <tr><td colSpan={7} className="px-6 py-12 text-center text-slate-500 font-medium">Tidak ada data pajak ditemukan.</td></tr>
                  ) : (
                     filteredData.map((item) => (
                        <tr key={item.id} className={`hover:bg-slate-50 transition-colors ${!item.is_active ? 'opacity-60' : ''}`}>
                           <td className="px-6 py-4">
                              <div className="flex flex-col">
                                 <span className="font-extrabold text-[#059669] text-sm tracking-wide">{item.tax_code}</span>
                                 <span className="text-xs font-semibold text-slate-400 truncate max-w-[200px]">{item.tax_name}</span>
                              </div>
                           </td>
                           <td className="px-6 py-4">
                              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded border text-[10px] font-extrabold tracking-wider uppercase ${getTypeStyle(item.tax_type)}`}>
                                 <FileText size={10} /> {item.tax_type}
                              </span>
                           </td>
                           <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                 <span className="text-[10px] font-extrabold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded tracking-wider">{item.country_code}</span>
                                 <span className="font-bold text-slate-700 text-sm tracking-wide">{item.country_name}</span>
                              </div>
                           </td>
                           <td className="px-6 py-4 text-slate-800 font-extrabold text-sm tracking-wider">
                              {item.tax_rate}%
                           </td>
                           <td className="px-6 py-4 text-xs font-semibold text-slate-500">
                              {formatDate(item.created_at)}
                           </td>
                           <td className="px-6 py-4">
                              {item.is_active ? (
                                 <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 text-[11px] font-extrabold tracking-wide">
                                    <CheckCircle size={12} /> Aktif
                                 </span>
                              ) : (
                                 <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-500 border border-slate-200 text-[11px] font-extrabold tracking-wide">
                                    <XCircle size={12} /> Nonaktif
                                 </span>
                              )}
                           </td>
                           <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                 <button onClick={() => openModal(item)} className="text-blue-400 hover:text-blue-600 transition-colors" title="Edit">
                                    <Pencil size={18} />
                                 </button>
                                 <button 
                                   onClick={() => handleToggleStatus(item.id, item.is_active)} 
                                   className={`${item.is_active ? 'text-orange-400 hover:text-orange-500' : 'text-slate-300 hover:text-slate-400'} transition-colors`} 
                                   title={item.is_active ? "Nonaktifkan" : "Aktifkan"}
                                 >
                                    {item.is_active ? <ToggleRight size={22} /> : <ToggleLeft size={22} />}
                                 </button>
                                 <button onClick={() => handleDelete(item.id)} className="text-red-300 hover:text-red-500 transition-colors" title="Hapus">
                                    <Trash2 size={18} />
                                 </button>
                              </div>
                           </td>
                        </tr>
                     ))
                  )}
               </tbody>
            </table>
         </div>

         {/* Pagination Footer */}
         <div className="bg-slate-50 border-t border-slate-100 p-4 mt-auto flex items-center justify-between">
            <div className="text-sm font-medium text-slate-500">
               Menampilkan <span className="font-bold text-[#059669]">1-{filteredData.length}</span> dari {filteredData.length} data
            </div>
            <div className="flex items-center gap-2 text-slate-400 font-bold">
               <button className="w-8 h-8 flex justify-center items-center rounded hover:bg-slate-200 transition-colors">&lt;</button>
               <button className="w-8 h-8 flex justify-center items-center rounded bg-[#059669] text-white shadow-sm">1</button>
               <button className="w-8 h-8 flex justify-center items-center rounded hover:bg-slate-200 transition-colors">&gt;</button>
            </div>
         </div>
      </div>

      {/* Modal Add/Edit */}
      {isModalOpen && (
         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white rounded-3xl shadow-xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-200 flex flex-col max-h-[90vh]">
               
               {/* Modal Header */}
               <div className="px-8 py-5 flex items-center justify-between border-b border-slate-100 shrink-0">
                  <h2 className="text-xl font-extrabold text-slate-800 tracking-wide">
                     {editingData ? "Edit Tax Rate" : "Tambah Tax Rate Baru"}
                  </h2>
                  <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full p-2 transition">
                     <XCircle size={20} />
                  </button>
               </div>

               {/* Modal Body Base Scrollable */}
               <div className="p-8 overflow-y-auto custom-scrollbar">
                  <form id="taxForm" onSubmit={handleSubmitForm} className="space-y-6">
                     
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Kode Pajak */}
                        <div className="space-y-2">
                           <label className="text-xs font-extrabold text-slate-700 tracking-wide">Kode Pajak <span className="text-red-500">*</span></label>
                           <input 
                             type="text" 
                             required
                             value={formData.tax_code}
                             onChange={(e) => setFormData({...formData, tax_code: e.target.value})}
                             placeholder="PPN-ID-11"
                             className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#059669]/30 transition-shadow"
                           />
                        </div>

                        {/* Tipe Pajak */}
                        <div className="space-y-2">
                           <label className="text-xs font-extrabold text-slate-700 tracking-wide">Tipe Pajak</label>
                           <div className="relative">
                              <select 
                                value={formData.tax_type}
                                onChange={(e) => setFormData({...formData, tax_type: e.target.value})}
                                className="w-full pl-4 pr-10 py-3 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#059669]/30 appearance-none transition-shadow"
                              >
                                 <option value="VAT">VAT (PPn)</option>
                                 <option value="GST">GST</option>
                                 <option value="PPh">PPh (Income)</option>
                                 <option value="Exempt">Exempt (0%)</option>
                              </select>
                              <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                           </div>
                        </div>
                     </div>

                     {/* Nama Tax Rate */}
                     <div className="space-y-2">
                        <label className="text-xs font-extrabold text-slate-700 tracking-wide">Nama Tax Rate <span className="text-red-500">*</span></label>
                        <input 
                          type="text" 
                          required
                          value={formData.tax_name}
                          onChange={(e) => setFormData({...formData, tax_name: e.target.value})}
                          placeholder="PPN Indonesia 11%"
                          className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#059669]/30 transition-shadow"
                        />
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Kode Negara */}
                        <div className="space-y-2">
                           <label className="text-xs font-extrabold text-slate-700 tracking-wide">Kode Negara <span className="text-red-500">*</span></label>
                           <input 
                             type="text" 
                             required
                             maxLength={5}
                             value={formData.country_code}
                             onChange={(e) => setFormData({...formData, country_code: e.target.value.toUpperCase()})}
                             placeholder="ID, MY, SG..."
                             className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#059669]/30 transition-shadow"
                           />
                        </div>

                        {/* Nama Negara */}
                        <div className="space-y-2">
                           <label className="text-xs font-extrabold text-slate-700 tracking-wide">Nama Negara <span className="text-red-500">*</span></label>
                           <input 
                             type="text" 
                             required
                             value={formData.country_name}
                             onChange={(e) => setFormData({...formData, country_name: e.target.value})}
                             placeholder="Indonesia, Malaysia..."
                             className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#059669]/30 transition-shadow"
                           />
                        </div>
                     </div>

                     {/* Tarif Pajak */}
                     <div className="space-y-2">
                        <label className="text-xs font-extrabold text-slate-700 tracking-wide">Tarif Pajak (%) <span className="text-red-500">*</span></label>
                        <div className="relative">
                           <input 
                             type="number" 
                             required
                             step="0.01"
                             value={formData.tax_rate}
                             onChange={(e) => setFormData({...formData, tax_rate: e.target.value})}
                             placeholder="11"
                             className="w-full pl-4 pr-12 py-3 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#059669]/30 transition-shadow"
                           />
                           <span className="absolute right-5 top-1/2 -translate-y-1/2 font-bold text-slate-400">%</span>
                        </div>
                     </div>

                     {/* Deskripsi */}
                     <div className="space-y-2">
                        <label className="text-xs font-extrabold text-slate-700 tracking-wide">Deskripsi</label>
                        <textarea 
                          rows={3}
                          value={formData.description}
                          onChange={(e) => setFormData({...formData, description: e.target.value})}
                          placeholder="Keterangan pajak..."
                          className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#059669]/30 transition-shadow resize-none"
                        ></textarea>
                     </div>

                     {/* Toggle Aktif */}
                     <div className="flex items-center gap-3 pt-2 cursor-pointer" onClick={() => setFormData({...formData, is_active: !formData.is_active})}>
                        <div className={`transition-colors duration-300 ${formData.is_active ? 'text-[#059669]' : 'text-slate-300'}`}>
                           {formData.is_active ? <ToggleRight size={32} /> : <ToggleLeft size={32} />}
                        </div>
                        <span className="text-sm font-bold text-slate-700">{formData.is_active ? 'Aktif' : 'Nonaktif'}</span>
                     </div>

                  </form>
               </div>

               {/* Modal Footer */}
               <div className="bg-[#fafafa] px-8 py-5 border-t border-slate-100 flex items-center justify-end gap-3 shrink-0">
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-6 py-2.5 rounded-full text-slate-500 font-bold text-sm bg-white border border-slate-200 hover:bg-slate-50 transition-colors shadow-sm"
                  >
                     Batal
                  </button>
                  <button 
                    type="submit"
                    form="taxForm"
                    className="px-8 py-2.5 rounded-full bg-[#059669] hover:bg-[#047857] text-white font-bold text-sm transition-colors shadow-md"
                  >
                     {editingData ? "Simpan Perubahan" : "Tambah Tax Rate"}
                  </button>
               </div>

            </div>
         </div>
      )}

    </div>
  );
}
