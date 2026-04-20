"use client";

import { useState, useEffect } from "react";
import { Search, Filter, MoreHorizontal, Clock, CheckCircle, XCircle, X, Image as ImageIcon, MapPin, Phone, Hash, ShieldAlert, FileText, Check, Users } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

export default function KycMemberPage() {
  const [kycData, setKycData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("Menunggu");
  
  // Modal states
  const [selectedKyc, setSelectedKyc] = useState<any | null>(null);

  const supabase = createClient();

  const fetchKycData = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('support_kyc_members')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (data) setKycData(data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchKycData();
  }, [supabase]);

  const handleAction = async (id: string, newStatus: string) => {
    // Optimistic Update
    setKycData(prev => prev.map(k => k.id === id ? { ...k, status: newStatus } : k));
    setSelectedKyc(null); // Close modal
    
    // Supabase Update
    await supabase.from('support_kyc_members').update({ status: newStatus }).eq('id', id);
    fetchKycData();
  };

  // Status mapping
  const getStatusText = (status: string) => {
     if (status === 'Pending') return 'Menunggu';
     if (status === 'Approved') return 'Disetujui';
     if (status === 'Rejected') return 'Ditolak';
     return status;
  };

  // Filter based on tab
  let filteredData = kycData;
  if (activeTab === "Menunggu") filteredData = kycData.filter(k => k.status === 'Pending');
  if (activeTab === "Disetujui") filteredData = kycData.filter(k => k.status === 'Approved');
  if (activeTab === "Ditolak") filteredData = kycData.filter(k => k.status === 'Rejected');
  
  // Filter search
  if (searchQuery.trim() !== "") {
     filteredData = filteredData.filter(k => k.full_name.toLowerCase().includes(searchQuery.toLowerCase()));
  }

  const counts = {
     "Menunggu": kycData.filter(k => k.status === 'Pending').length,
     "Disetujui": kycData.filter(k => k.status === 'Approved').length,
     "Ditolak": kycData.filter(k => k.status === 'Rejected').length,
     "Semua": kycData.length
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    const dd = String(date.getDate()).padStart(2, '0');
    const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agt", "Sep", "Okt", "Nov", "Des"];
    const mmm = months[date.getMonth()];
    const yyyy = date.getFullYear();
    return `${dd} ${mmm} ${yyyy}`;
  };

  const StatusBadge = ({ status }: { status: string }) => {
     if (status === 'Pending') {
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 text-orange-500 font-bold border border-orange-200 text-xs"><Clock size={12}/> Pending</span>
     }
     if (status === 'Approved') {
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 font-bold border border-emerald-200 text-xs"><CheckCircle size={12}/> Disetujui</span>
     }
     if (status === 'Rejected') {
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-red-600 font-bold border border-red-200 text-xs"><XCircle size={12}/> Ditolak</span>
     }
     return null;
  };

  return (
    <div className="max-w-[1400px] mx-auto space-y-6 pb-12">
      
      {/* Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
         <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-80">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Cari nama member..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#059669]/20 shadow-sm font-medium"
              />
            </div>
            <button className="bg-[#059669] hover:bg-[#047857] text-white px-5 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 shadow-sm transition-colors">
              <Search size={16} /> Cari
            </button>
            <button className="bg-white border border-slate-200 text-slate-600 px-4 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-slate-50 shadow-sm">
              <Filter size={16} /> Filter
            </button>
         </div>
      </div>

      {/* Main Card */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col min-h-[500px]">
         
         {/* Tabs */}
         <div className="px-2 pt-2 border-b border-slate-200 flex space-x-1">
            {["Menunggu", "Disetujui", "Ditolak", "Semua"].map((tab) => (
               <button
                 key={tab}
                 onClick={() => setActiveTab(tab)}
                 className={`px-6 py-4 border-b-2 font-bold text-sm transition-colors flex items-center gap-2 ${
                   activeTab === tab ? "border-[#059669] text-[#059669]" : "border-transparent text-slate-500 hover:text-slate-700"
                 }`}
               >
                 {tab}
                 {tab === "Menunggu" && counts["Menunggu"] > 0 && (
                    <span className="w-5 h-5 flex items-center justify-center rounded-full bg-[#059669] text-white text-[10px]">
                       {counts["Menunggu"]}
                    </span>
                 )}
               </button>
            ))}
         </div>

         {/* Table */}
         <div className="overflow-x-auto">
            <table className="w-full whitespace-nowrap">
               <thead>
                  <tr className="text-slate-400 text-xs uppercase font-extrabold text-left border-b border-slate-100 tracking-wider">
                     <th className="px-6 py-5">USER</th>
                     <th className="px-6 py-5">TIPE DOKUMEN</th>
                     <th className="px-6 py-5">TGL PENGAJUAN</th>
                     <th className="px-6 py-5">STATUS</th>
                     <th className="px-6 py-5 text-center">AKSI</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                  {isLoading ? (
                     <tr><td colSpan={5} className="px-6 py-12 text-center text-slate-500 font-medium">Memuat data KYC...</td></tr>
                  ) : filteredData.length === 0 ? (
                     <tr><td colSpan={5} className="px-6 py-12 text-center text-slate-500 font-medium">Tidak ada data ditemukan.</td></tr>
                  ) : (
                     filteredData.map((item) => {
                        const initial = item.full_name.charAt(0).toUpperCase();
                        return (
                           <tr 
                             key={item.id} 
                             onClick={() => setSelectedKyc(item)}
                             className="hover:bg-slate-50 transition-colors cursor-pointer"
                           >
                              <td className="px-6 py-4">
                                 <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-slate-200 text-slate-600 font-bold flex justify-center items-center shrink-0">
                                       <ImageIcon size={16} /> {/* Placeholder avatar */}
                                    </div>
                                    <div className="flex flex-col">
                                       <span className="font-bold text-slate-800 text-sm">{item.full_name}</span>
                                       <span className="text-xs font-semibold text-slate-400">{item.username}</span>
                                    </div>
                                 </div>
                              </td>
                              <td className="px-6 py-4">
                                 <div className="flex items-center gap-2 text-sm font-semibold text-slate-600">
                                    <FileText size={14} /> {item.document_type}
                                 </div>
                              </td>
                              <td className="px-6 py-4">
                                 <div className="flex items-center gap-2 text-sm font-semibold text-slate-600">
                                    <Clock size={14} /> {formatDate(item.created_at)}
                                 </div>
                              </td>
                              <td className="px-6 py-4">
                                 <StatusBadge status={item.status} />
                              </td>
                              <td className="px-6 py-4 text-center">
                                 <button className="text-slate-400 hover:text-slate-600">
                                    <MoreHorizontal size={18} />
                                 </button>
                              </td>
                           </tr>
                        )
                     })
                  )}
               </tbody>
            </table>
         </div>

         {/* Pagination Footer */}
         <div className="bg-slate-50 border-t border-slate-100 p-4 mt-auto flex items-center justify-between">
            <div className="text-sm font-medium text-slate-500">
               Menampilkan <span className="font-bold text-[#059669]">1-{filteredData.length}</span> dari {filteredData.length} data <span className="ml-2">Baris:</span>
               <select className="ml-1 bg-transparent border-none font-bold text-slate-700 outline-none">
                  <option>10</option>
               </select>
            </div>
            <div className="flex items-center gap-2">
               <button className="w-8 h-8 flex justify-center items-center rounded text-slate-400 hover:bg-slate-200">&lt;</button>
               <button className="w-8 h-8 flex justify-center items-center rounded bg-[#059669] text-white font-bold text-sm">1</button>
               <button className="w-8 h-8 flex justify-center items-center rounded text-slate-400 hover:bg-slate-200">&gt;</button>
            </div>
         </div>
      </div>

      {/* Detail KYC Modal (Full Overlay style per gambar 3/4) */}
      {selectedKyc && (
         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in">
            <div className="bg-[#f8fafc] rounded-2xl shadow-2xl w-full max-w-5xl h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
               
               {/* Header Modal */}
               <div className="bg-white px-6 py-4 border-b border-slate-200 flex items-center justify-between shadow-sm shrink-0">
                  <div className="flex items-center gap-4">
                     <div className="w-12 h-12 rounded-full bg-slate-200 flex justify-center items-center text-slate-400">
                        <ImageIcon size={20} />
                     </div>
                     <div>
                        <h2 className="font-extrabold text-lg text-slate-800">{selectedKyc.full_name}</h2>
                        <p className="text-sm font-semibold text-slate-500">{selectedKyc.username}</p>
                     </div>
                  </div>
                  <div className="flex items-center gap-6">
                     <div className="flex flex-col items-end">
                        <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Status Pengajuan</span>
                        <div className="flex items-center gap-3 mt-1">
                           <span className="font-semibold text-slate-600 text-sm">{formatDate(selectedKyc.created_at)}</span>
                           <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full uppercase ${selectedKyc.status === 'Pending' ? 'bg-orange-100 text-orange-600' : selectedKyc.status === 'Approved' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                              {selectedKyc.status}
                           </span>
                        </div>
                     </div>
                     <button onClick={() => setSelectedKyc(null)} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
                        <X size={24} />
                     </button>
                  </div>
               </div>

               {/* Body Modal */}
               <div className="flex-1 overflow-y-auto p-6 flex flex-col md:flex-row gap-6">
                  
                  {/* Left Column (Data & Info) */}
                  <div className="w-full md:w-1/3 flex flex-col h-full">
                     <h3 className="text-xs font-bold text-slate-400 tracking-wider mb-4 flex items-center gap-2 uppercase">
                        <Users size={14}/> Data & Informasi User
                     </h3>
                     
                     <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex-1 space-y-5">
                        
                        <div>
                           <p className="text-[10px] font-bold text-slate-400 mb-1 tracking-widest uppercase">Nama Lengkap</p>
                           <p className="font-extrabold text-[#1e293b] text-[15px]">{selectedKyc.full_name}</p>
                        </div>
                        
                        <div>
                           <p className="text-[10px] font-bold text-slate-400 mb-1 tracking-widest uppercase">No. Whatsapp</p>
                           <p className="font-semibold text-[#059669] flex items-center gap-1.5 text-sm">
                              <Phone size={14} /> {selectedKyc.phone_number || '-'}
                           </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                           <div>
                              <p className="text-[10px] font-bold text-slate-400 mb-1 tracking-widest uppercase">Tempat Lahir</p>
                              <p className="font-bold text-slate-700 text-sm whitespace-nowrap overflow-hidden text-ellipsis">{selectedKyc.birth_place || '-'}</p>
                           </div>
                           <div>
                              <p className="text-[10px] font-bold text-slate-400 mb-1 tracking-widest uppercase">Tanggal Lahir</p>
                              <p className="font-bold text-slate-700 text-sm flex items-center gap-1.5">
                                 <CalendarIcon /> {formatDate(selectedKyc.birth_date)}
                              </p>
                           </div>
                        </div>

                        <div>
                           <p className="text-[10px] font-bold text-slate-400 mb-2 tracking-widest uppercase">Alamat Domisili (KTP)</p>
                           <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl flex items-start gap-2">
                              <MapPin size={16} className="text-slate-400 shrink-0 mt-0.5" />
                              <p className="font-bold text-slate-600 text-xs leading-relaxed uppercase">{selectedKyc.address || '-'}</p>
                           </div>
                        </div>

                        <div>
                           <p className="text-[10px] font-bold text-slate-400 mb-2 tracking-widest uppercase">Nomor Induk Kependudukan (NIK)</p>
                           <div className="bg-blue-50 border border-blue-100 p-3 rounded-xl flex items-center gap-2 text-blue-600">
                              <Hash size={16} />
                              <p className="font-extrabold text-sm tracking-widest">{selectedKyc.nik || '-'}</p>
                           </div>
                        </div>

                        <div>
                           <p className="text-[10px] font-bold text-slate-400 mb-1 tracking-widest uppercase">Tipe Dokumen</p>
                           <p className="font-extrabold text-slate-800 text-sm">{selectedKyc.document_type || 'KTP'}</p>
                        </div>

                        {/* Status Verifikasi Banner */}
                        <div className="mt-8 pt-6 border-t border-slate-100">
                           <p className="text-[10px] font-bold text-slate-400 mb-3 tracking-widest uppercase"><ShieldAlert size={12} className="inline mr-1" /> Status Verifikasi</p>
                           
                           {selectedKyc.status === 'Pending' && (
                              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex gap-3">
                                 <div className="text-yellow-600 shrink-0"><Clock size={20} /></div>
                                 <div>
                                    <h4 className="font-bold text-yellow-800 text-sm">Menunggu Persetujuan</h4>
                                    <p className="text-xs font-medium text-yellow-600 mt-0.5">Mohon periksa kelengkapan dokumen.</p>
                                 </div>
                              </div>
                           )}

                           {selectedKyc.status === 'Approved' && (
                              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex gap-3">
                                 <div className="text-emerald-600 shrink-0"><CheckCircle size={20} /></div>
                                 <div>
                                    <h4 className="font-bold text-emerald-800 text-sm">Telah Disetujui</h4>
                                    <p className="text-xs font-medium text-emerald-600 mt-0.5">Dokumen valid dan diotorisasi.</p>
                                 </div>
                              </div>
                           )}

                           {selectedKyc.status === 'Rejected' && (
                              <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex gap-3">
                                 <div className="text-red-600 shrink-0"><XCircle size={20} /></div>
                                 <div>
                                    <h4 className="font-bold text-red-800 text-sm">Ditolak</h4>
                                    <p className="text-xs font-medium text-red-600 mt-0.5">Berkas tidak memenuhi standar verifikasi.</p>
                                 </div>
                              </div>
                           )}
                        </div>
                     </div>

                  </div>

                  {/* Right Column (Images) */}
                  <div className="w-full md:w-2/3 flex flex-col gap-4">
                     <div className="flex gap-4 h-full flex-col lg:flex-row">
                        {/* Box Dokumen Asli */}
                        <div className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden flex flex-col">
                           <div className="absolute top-4 left-4 bg-slate-800 text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 z-10">
                              <FileText size={14} /> Dokumen Asli
                           </div>
                           {/* Placeholder Area Document */}
                           <div className="flex-1 bg-slate-100 m-2 mt-14 rounded-xl flex items-center justify-center p-4 group">
                              <div className="text-center opacity-60 group-hover:opacity-100 transition-opacity">
                                 <ImageIcon size={48} className="text-slate-300 mx-auto mb-3" />
                                 <p className="text-sm font-bold text-slate-400">(Area Render KTP Asli)</p>
                              </div>
                           </div>
                        </div>

                        {/* Box Foto Selfie */}
                        <div className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden flex flex-col">
                           <div className="absolute top-4 left-4 bg-slate-800 text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 z-10">
                              <ImageIcon size={14} /> Foto Selfie
                           </div>
                           {/* Placeholder Area Selfie */}
                           <div className="flex-1 bg-slate-100 m-2 rounded-xl flex items-center justify-center p-4">
                              <div className="w-full h-full bg-slate-200 rounded-lg flex items-center justify-center flex-col">
                                 <Users size={64} className="text-slate-300 mb-4" />
                                 <p className="text-sm font-bold text-slate-400">(Area Render Foto Selfie Member)</p>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>

               </div>

               {/* Footer / Actions Modal */}
               <div className="bg-white px-6 py-4 border-t border-slate-200 flex items-center justify-between shrink-0">
                  <span className="font-extrabold text-slate-400 text-sm tracking-wider">ID: {selectedKyc.user_id_str}</span>
                  <div className="flex items-center gap-3">
                     <button className="px-5 py-2.5 rounded-xl font-bold text-slate-500 bg-white border border-slate-200 hover:bg-slate-100 transition-colors flex items-center gap-2 text-sm shadow-sm">
                        Laporkan
                     </button>
                     {selectedKyc.status !== 'Rejected' && (
                        <button 
                          onClick={() => handleAction(selectedKyc.id, 'Rejected')}
                          className="px-6 py-2.5 rounded-xl font-bold text-red-500 bg-white border border-red-200 hover:bg-red-50 transition-colors flex items-center gap-2 text-sm shadow-sm"
                        >
                           <XCircle size={18} /> Tolak
                        </button>
                     )}
                     {selectedKyc.status !== 'Approved' && (
                        <button 
                          onClick={() => handleAction(selectedKyc.id, 'Approved')}
                          className="px-6 py-2.5 rounded-xl font-bold text-white bg-emerald-500 hover:bg-emerald-600 transition-colors flex items-center gap-2 text-sm shadow-sm"
                        >
                           <CheckCircle size={18} /> Setujui
                        </button>
                     )}
                  </div>
               </div>

            </div>
         </div>
      )}

    </div>
  );
}

const CalendarIcon = () => (
<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
);
