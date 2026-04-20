"use client";

import { useState, useEffect } from "react";
import { Search, Filter, MoreHorizontal, Clock, CheckCircle, XCircle, X, Building2, MapPin, Mail, Phone, FileText, Check, FileCheck, CheckSquare, Briefcase, Image as ImageIcon } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

export default function KycOrganisasiPage() {
  const [kycData, setKycData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("Menunggu");
  
  // Modal states
  const [selectedKyc, setSelectedKyc] = useState<any | null>(null);
  const [modalTab, setModalTab] = useState("Umum"); // "Umum" | "Industri"

  const supabase = createClient();

  const fetchKycData = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('support_kyc_organisasi')
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
    await supabase.from('support_kyc_organisasi').update({ status: newStatus }).eq('id', id);
    fetchKycData();
  };

  // Status mapping & Filtering
  let filteredData = kycData;
  if (activeTab === "Menunggu") filteredData = kycData.filter(k => k.status === 'Pending');
  if (activeTab === "Disetujui") filteredData = kycData.filter(k => k.status === 'Approved');
  if (activeTab === "Ditolak") filteredData = kycData.filter(k => k.status === 'Rejected');
  
  if (searchQuery.trim() !== "") {
     filteredData = filteredData.filter(k => k.org_name.toLowerCase().includes(searchQuery.toLowerCase()));
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

  // Helper untuk warna inisial (hardcod dummy per gambar atau dinamis)
  const getAvatarColor = (name: string) => {
     if(name.includes('Lembaga')) return 'bg-emerald-500';
     if(name.includes('Yayasan')) return 'bg-teal-500';
     if(name.includes('Madrasah')) return 'bg-blue-500';
     return 'bg-orange-500';
  }
  const getInitials = (name: string) => {
     return name.split(' ').map(n => n.charAt(0)).slice(0,2).join('').toUpperCase();
  }

  return (
    <div className="max-w-[1400px] mx-auto space-y-6 pb-12">
      
      {/* Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
         <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-80">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Cari nama organisasi..." 
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
                     <th className="px-6 py-5">ORGANISASI</th>
                     <th className="px-6 py-5">TIPE & KATEGORI</th>
                     <th className="px-6 py-5">USER</th>
                     <th className="px-6 py-5">TGL PENGAJUAN</th>
                     <th className="px-6 py-5">STATUS</th>
                     <th className="px-6 py-5 text-center">AKSI</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                  {isLoading ? (
                     <tr><td colSpan={6} className="px-6 py-12 text-center text-slate-500 font-medium">Memuat data Organisasi...</td></tr>
                  ) : filteredData.length === 0 ? (
                     <tr><td colSpan={6} className="px-6 py-12 text-center text-slate-500 font-medium">Tidak ada data ditemukan.</td></tr>
                  ) : (
                     filteredData.map((item) => (
                        <tr 
                          key={item.id} 
                          onClick={() => { setSelectedKyc(item); setModalTab("Umum"); }}
                          className="hover:bg-slate-50 transition-colors cursor-pointer"
                        >
                           <td className="px-6 py-4">
                              <div className="flex items-center gap-4">
                                 <div className={`w-10 h-10 rounded-full text-white font-bold flex justify-center items-center shrink-0 ${getAvatarColor(item.org_name)}`}>
                                    {getInitials(item.org_name)}
                                 </div>
                                 <div className="flex flex-col">
                                    <span className="font-bold text-slate-800 text-sm">{item.org_name}</span>
                                 </div>
                              </div>
                           </td>
                           <td className="px-6 py-4">
                              <div className="flex flex-col items-start gap-1.5">
                                 <div className="flex gap-2">
                                    <span className="inline-flex items-center gap-1 bg-orange-100 text-orange-600 px-2 py-0.5 rounded text-[10px] font-bold uppercase">
                                       <Building2 size={10} /> {item.org_type}
                                    </span>
                                    {item.org_type === 'MADRASAH' && (
                                       <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-600 px-2 py-0.5 rounded text-[10px] font-bold uppercase">
                                          PENDIDIKAN
                                       </span>
                                    )}
                                 </div>
                                 <span className="text-xs font-semibold text-slate-500 capitalize">{item.org_category}</span>
                              </div>
                           </td>
                           <td className="px-6 py-4">
                              <div className="flex flex-col">
                                 <span className="font-bold text-slate-700 text-sm">{item.pic_name}</span>
                                 <span className="text-xs font-semibold text-slate-400">{item.pic_username}</span>
                              </div>
                           </td>
                           <td className="px-6 py-4">
                              <div className="flex items-center gap-2 text-sm font-semibold text-slate-600">
                                 <Clock size={14} className="text-slate-400" /> {formatDate(item.created_at)}
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
                     ))
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

      {/* Detail Modal (Full Overlay style) */}
      {selectedKyc && (
         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 relative border border-slate-200">
               
               {/* Modal Header Bar */}
               <div className="px-6 py-4 flex items-center justify-between border-b border-slate-100">
                  <div className="flex items-center gap-3">
                     <div className="bg-orange-50 text-orange-500 w-10 h-10 rounded-xl flex items-center justify-center">
                        <Building2 size={20} />
                     </div>
                     <span className="font-bold text-slate-800 text-lg">Verifikasi Organisasi</span>
                  </div>
                  <div className="flex items-center gap-4">
                     <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider ${selectedKyc.status === 'Pending' ? 'bg-orange-100 text-orange-600' : selectedKyc.status === 'Approved' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                        {selectedKyc.status}
                     </span>
                     <button onClick={() => setSelectedKyc(null)} className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full p-1.5 transition">
                        <X size={20} />
                     </button>
                  </div>
               </div>

               {/* Modal Body: Two Columns */}
               <div className="flex-1 overflow-hidden flex flex-col md:flex-row bg-[#f8fafc]">
                  
                  {/* Sidebar (Left Panel) */}
                  <div className="w-full md:w-1/3 bg-white border-r border-slate-100 overflow-y-auto px-8 py-10 flex flex-col items-center">
                     
                     {/* Avatar & Title */}
                     <div className={`w-32 h-32 rounded-full flex items-center justify-center text-4xl font-bold text-white shadow-xl shadow-slate-200 mb-6 ${getAvatarColor(selectedKyc.org_name)}`}>
                        {getInitials(selectedKyc.org_name)}
                     </div>
                     <h2 className="text-xl font-bold text-slate-800 text-center mb-2">{selectedKyc.org_name}</h2>
                     <span className="inline-flex items-center gap-1 bg-orange-100 text-orange-600 px-3 py-1 rounded-md text-[10px] font-extrabold uppercase mb-4 tracking-wider">
                        <Building2 size={12} /> {selectedKyc.org_type}
                     </span>
                     <p className="text-sm font-medium text-slate-500 text-center mb-10 leading-relaxed px-2">
                        {selectedKyc.org_description}
                     </p>

                     {/* Informasi Kontak & Lokasi */}
                     <div className="w-full">
                        <h4 className="text-[10px] font-bold text-slate-400 flex items-center gap-2 tracking-widest uppercase mb-6">
                           <MoreHorizontal size={14} /> Informasi Kontak & Lokasi
                        </h4>
                        
                        <div className="space-y-6 w-full">
                           <div className="flex gap-4">
                              <div className="text-slate-300 shrink-0"><Briefcase size={20} /></div>
                              <div>
                                 <p className="text-[10px] font-bold text-slate-400 tracking-wider uppercase mb-1">Nama Resmi</p>
                                 <p className="text-sm font-bold text-slate-700">{selectedKyc.org_name}</p>
                              </div>
                           </div>
                           <div className="flex gap-4">
                              <div className="text-slate-300 shrink-0"><Mail size={20} /></div>
                              <div>
                                 <p className="text-[10px] font-bold text-slate-400 tracking-wider uppercase mb-1">Email Perusahaan</p>
                                 <p className="text-sm font-bold text-[#059669]">{selectedKyc.email}</p>
                              </div>
                           </div>
                           <div className="flex gap-4">
                              <div className="text-slate-300 shrink-0"><Phone size={20} /></div>
                              <div>
                                 <p className="text-[10px] font-bold text-slate-400 tracking-wider uppercase mb-1">Nomor Telepon</p>
                                 <p className="text-sm font-bold text-slate-700">{selectedKyc.phone}</p>
                              </div>
                           </div>
                           <div className="flex gap-4">
                              <div className="text-slate-300 shrink-0"><MapPin size={20} /></div>
                              <div>
                                 <p className="text-[10px] font-bold text-slate-400 tracking-wider uppercase mb-1">Alamat</p>
                                 <p className="text-sm font-bold text-slate-700 leading-relaxed">{selectedKyc.address}</p>
                              </div>
                           </div>
                           <div className="flex gap-4">
                              <div className="text-slate-300 shrink-0"><FileText size={20} /></div>
                              <div>
                                 <p className="text-[10px] font-bold text-slate-400 tracking-wider uppercase mb-1">Website</p>
                                 <p className="text-sm font-bold text-blue-500 break-all">{selectedKyc.website}</p>
                              </div>
                           </div>
                        </div>

                        {/* Peta Placeholder */}
                        <div className="mt-8 bg-slate-50 border border-slate-100 rounded-2xl p-6 flex flex-col items-center justify-center text-center">
                           <div className="w-12 h-12 rounded-full bg-slate-200 flex justify-center items-center text-slate-400 mb-3 shadow-sm">
                              <MapPin size={20} />
                           </div>
                           <h5 className="font-bold text-slate-700 text-sm mb-1">Peta Belum Tersedia</h5>
                           <p className="text-xs font-medium text-slate-500 mb-4">Integrasi Maps dinonaktifkan sementara.</p>
                           <div className="bg-white border border-slate-200 px-4 py-2 rounded-lg text-xs font-bold text-slate-500 tracking-wider">
                              Koordinat: {selectedKyc.coordinates}
                           </div>
                        </div>

                     </div>
                  </div>

                  {/* Main Content (Right Panel) */}
                  <div className="w-full md:w-2/3 h-full overflow-y-auto px-10 py-10">
                     <h2 className="text-2xl font-bold text-slate-800 mb-1">Dokumen Legalitas</h2>
                     <p className="text-slate-500 font-medium mb-8">Periksa keabsahan dokumen yang diunggah.</p>
                     
                     {/* Sub Tabs */}
                     <div className="flex gap-4 border-b border-slate-200 mb-8">
                        <button 
                          onClick={() => setModalTab("Umum")}
                          className={`pb-3 px-2 font-bold text-sm border-b-2 transition-colors ${modalTab === "Umum" ? 'border-slate-800 text-slate-800' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
                        >
                           Umum
                        </button>
                        <button 
                          onClick={() => setModalTab("Industri")}
                          className={`pb-3 px-2 font-bold text-sm border-b-2 transition-colors ${modalTab === "Industri" ? 'border-slate-800 text-slate-800' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
                        >
                           Industri
                        </button>
                     </div>

                     {/* Tab Content: UMUM */}
                     {modalTab === "Umum" && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-10">
                           
                           {/* Card KTP */}
                           <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow-md transition-shadow relative group h-[200px] flex flex-col items-center justify-center">
                              <div className="absolute top-4 left-4 flex gap-2 items-center z-10 w-full pr-8">
                                 <FileText size={16} className="text-orange-500 shrink-0" />
                                 <span className="font-bold text-sm text-slate-800 truncate">KTP Penanggung Jawab</span>
                              </div>
                              <div className="absolute top-4 right-4 flex gap-2 text-slate-300">
                                 <Check size={14} /> <X size={14} />
                              </div>
                              
                              <div className="w-16 h-16 bg-slate-50 rounded-xl mt-6 border border-slate-100 flex items-center justify-center text-slate-300 group-hover:text-blue-500 transition-colors">
                                 <FileText size={32} />
                              </div>
                              
                              <div className="mt-auto px-4 py-1.5 rounded-md bg-blue-50 text-blue-600 text-xs font-bold w-fit mx-auto mt-4 truncate max-w-[90%] shadow-sm">
                                 <FileText size={12} className="inline mr-1" /> KTP-{selectedKyc.pic_name.replace(/\s+/g,'')}.jpg
                              </div>
                           </div>

                           {/* Card Gedung */}
                           <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow-md transition-shadow relative group h-[200px] flex flex-col items-center justify-center">
                              <div className="absolute top-4 left-4 flex gap-2 items-center z-10 w-full pr-8">
                                 <FileText size={16} className="text-orange-500 shrink-0" />
                                 <span className="font-bold text-sm text-slate-800 truncate">Foto Gedung / Kantor</span>
                              </div>
                              <div className="absolute top-4 right-4 flex gap-2 text-slate-300">
                                 <Check size={14} /> <X size={14} />
                              </div>
                              
                              <div className="w-16 h-16 bg-slate-50 rounded-xl mt-6 border border-slate-100 flex items-center justify-center text-slate-300 group-hover:text-blue-500 transition-colors">
                                 <ImageIcon size={32} />
                              </div>
                              
                              <div className="mt-auto px-4 py-1.5 rounded-md bg-blue-50 text-blue-600 text-xs font-bold w-fit mx-auto mt-4 truncate max-w-[90%] shadow-sm">
                                 <FileText size={12} className="inline mr-1" /> gedung-depan-2.jpg
                              </div>
                           </div>

                           {/* Card Surat Keabsahan */}
                           <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow-md transition-shadow relative group h-[200px] flex flex-col items-center justify-center">
                              <div className="absolute top-4 left-4 flex gap-2 items-center z-10 w-full pr-8">
                                 <FileText size={16} className="text-orange-500 shrink-0" />
                                 <span className="font-bold text-sm text-slate-800 truncate">Surat Keabsahan Dokumen</span>
                              </div>
                              <div className="absolute top-4 right-4 flex gap-2 text-slate-300">
                                 <Check size={14} /> <X size={14} />
                              </div>
                              
                              <div className="w-16 h-16 bg-slate-50 rounded-xl mt-6 border border-slate-100 flex items-center justify-center text-slate-300 group-hover:text-blue-500 transition-colors">
                                 <FileCheck size={32} />
                              </div>
                              
                              <div className="mt-auto px-4 py-1.5 rounded-md bg-blue-50 text-blue-600 text-xs font-bold w-fit mx-auto mt-4 truncate max-w-[90%] shadow-sm">
                                 <FileText size={12} className="inline mr-1" /> SK-Penunjukan-ORG-...pdf
                              </div>
                           </div>

                        </div>
                     )}

                     {/* Tab Content: INDUSTRI */}
                     {modalTab === "Industri" && (
                        <div className="space-y-6 pb-10">
                           <div className="bg-blue-50 border border-blue-200 text-blue-600 p-4 rounded-xl flex gap-3 text-sm font-bold w-full mx-auto shadow-sm">
                              <CheckCircle size={20} className="shrink-0" />
                              <p>Pastikan NIB terdaftar dan aktif di portal validasi OSS.</p>
                           </div>

                           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              {/* Card NIB */}
                              <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow-md transition-shadow relative h-[210px] flex flex-col">
                                 <div className="flex justify-between items-start mb-6">
                                    <div className="flex gap-2 items-center">
                                       <FileText size={16} className="text-orange-500 shrink-0" />
                                       <span className="font-bold text-sm text-slate-800">Nomor Induk Berusaha (NIB)</span>
                                    </div>
                                    <div className="flex gap-2 text-slate-300">
                                       <Check size={14} /> <X size={14} />
                                    </div>
                                 </div>
                                 <div className="flex-1 flex items-center justify-center">
                                    <p className="font-extrabold text-lg tracking-widest text-[#059669] flex items-center gap-2">
                                       <FileText size={20} /> {selectedKyc.nib || 'Belum Diatur'}
                                    </p>
                                 </div>
                                 <button className="w-full mt-auto py-3 bg-[#1e293b] hover:bg-[#0f172a] text-white rounded-xl text-xs font-bold transition-colors">
                                    Validasi Real-time
                                 </button>
                              </div>

                              {/* Card NPWP */}
                              <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow-md transition-shadow relative h-[160px] flex flex-col">
                                 <div className="flex justify-between items-start mb-6">
                                    <div className="flex gap-2 items-center">
                                       <FileText size={16} className="text-orange-500 shrink-0" />
                                       <span className="font-bold text-sm text-slate-800">NPWP Badan</span>
                                    </div>
                                    <div className="flex gap-2 text-slate-300">
                                       <Check size={14} /> <X size={14} />
                                    </div>
                                 </div>
                                 <div className="flex-1 flex items-center justify-center">
                                    <p className="font-extrabold text-lg tracking-wide text-blue-600 flex items-center gap-2">
                                       <FileText size={20} /> {selectedKyc.npwp || 'Belum Diatur'}
                                    </p>
                                 </div>
                              </div>
                              
                              {/* Card SK Kemenkumham */}
                              <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow-md transition-shadow relative h-[160px] flex flex-col">
                                 <div className="flex justify-between items-start mb-6">
                                    <div className="flex gap-2 items-center">
                                       <FileText size={16} className="text-orange-500 shrink-0" />
                                       <span className="font-bold text-sm text-slate-800">SK Kemenkumham</span>
                                    </div>
                                    <div className="flex gap-2 text-slate-300">
                                       <Check size={14} /> <X size={14} />
                                    </div>
                                 </div>
                                 <div className="flex-1 flex items-center justify-center">
                                    <p className="font-bold text-sm text-slate-400">Berkas Tervalidasi Oleh Sistem</p>
                                 </div>
                              </div>
                           </div>
                        </div>
                     )}

                  </div>
               </div>

               {/* Modal Footer */}
               <div className="bg-white px-8 py-5 border-t border-slate-100 flex items-center justify-between shadow-sm z-10 shrink-0">
                  <span className="font-extrabold text-slate-400 text-sm tracking-wider">ID: {selectedKyc.org_id_str}</span>
                  <div className="flex items-center gap-4">
                     {selectedKyc.status !== 'Rejected' && (
                        <button 
                          onClick={() => handleAction(selectedKyc.id, 'Rejected')}
                          className="px-6 py-2.5 rounded-full font-bold text-red-500 bg-white border border-red-200 hover:bg-red-50 transition-colors flex items-center gap-2 text-sm shadow-sm"
                        >
                           <XCircle size={18} /> Tolak
                        </button>
                     )}
                     {selectedKyc.status !== 'Approved' && (
                        <button 
                          onClick={() => handleAction(selectedKyc.id, 'Approved')}
                          className="px-8 py-2.5 rounded-full font-bold text-white bg-[#059669] hover:bg-[#047857] transition-colors flex items-center gap-2 text-sm shadow-sm"
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
