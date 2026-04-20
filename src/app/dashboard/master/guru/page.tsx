"use client";

import { useState, useEffect } from "react";
import { Search, Eye, Ban, CheckCircle2, Star, User, BookOpen, Quote, Image as ImageIcon, MessageSquare, ChevronLeft, Award, Video, FileText, MapPin, Clock, ShieldCheck, Check } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner"; // If you have sonner installed, if not this will just silently work if imported or log error. Providing an alternative below.

export default function MasterGuruPage() {
  const [guruData, setGuruData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("Semua");
  const [selectedGuru, setSelectedGuru] = useState<any | null>(null);
  const [detailTab, setDetailTab] = useState("Informasi"); // 'Informasi', 'Galeri', 'Ulasan'

  const supabase = createClient();

  const fetchGuru = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('master_guru')
      .select('*')
      .order('join_date', { ascending: false });
    
    if (data) setGuruData(data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchGuru();
  }, [supabase]);

  // Handle Action Verifikasi / Nonaktifkan
  const handleToggleStatus = async (guru: any, newStatus: string) => {
    // Tampilkan Toast
    // Fallback if toast component is not mounted at root layout:
    try {
      if(newStatus === 'Nonaktif') {
         toast.success(`${guru.name} berhasil dinonaktifkan.`);
      } else {
         toast.success(`${guru.name} berhasil diverifikasi dan diaktifkan.`);
      }
    } catch (e) {
      alert(`${guru.name} berhasil diubah statusnya menjadi ${newStatus}.`);
    }

    // Update Local State Optimistically
    setGuruData(prev => prev.map(g => g.id === guru.id ? { ...g, status: newStatus } : g));
    if (selectedGuru && selectedGuru.id === guru.id) {
       setSelectedGuru({ ...selectedGuru, status: newStatus });
    }

    // Update Database
    await supabase.from('master_guru').update({ status: newStatus }).eq('id', guru.id);
  };

  // Filter Logic
  let filteredData = guruData;
  if (activeTab === "Terverifikasi") filteredData = guruData.filter(g => g.status === 'Terverifikasi');
  if (activeTab === "Menunggu") filteredData = guruData.filter(g => g.status === 'Menunggu');
  if (activeTab === "Nonaktif") filteredData = guruData.filter(g => g.status === 'Nonaktif');
  
  if (searchQuery.trim() !== "") {
     const q = searchQuery.toLowerCase();
     filteredData = filteredData.filter(g => 
        g.name.toLowerCase().includes(q) || 
        g.email.toLowerCase().includes(q) ||
        g.metode?.toLowerCase().includes(q)
     );
  }

  const counts = {
     "Semua": guruData.length,
     "Terverifikasi": guruData.filter(g => g.status === 'Terverifikasi').length,
     "Menunggu": guruData.filter(g => g.status === 'Menunggu').length,
     "Nonaktif": guruData.filter(g => g.status === 'Nonaktif').length,
  };

  const formatCurrency = (amount: number) => {
     if(amount === null || amount === undefined || amount === 0) return "-";
     return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
  };

  // ======================
  // RENDER DETAIL VIEW
  // ======================
  if (selectedGuru) {
     return (
        <div className="max-w-[1400px] mx-auto space-y-6 pb-20 animate-in fade-in zoom-in-95 duration-200">
           
           {/* Top Navigation Back */}
           <div className="flex items-center justify-between mb-4">
              <button 
                onClick={() => setSelectedGuru(null)}
                className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-500 hover:bg-slate-50 transition-colors shadow-sm"
              >
                 <ChevronLeft size={20} />
              </button>
              <div dangerouslySetInnerHTML={{__html: ""}} />
           </div>

           <div className="flex flex-col lg:flex-row gap-6">
              
              {/* LEFT MAIN CONTENT */}
              <div className="w-full lg:w-2/3 space-y-6">
                 
                 {/* Profile Block Card */}
                 <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col relative">
                    
                    {/* Header Image Cover */}
                    <div className="h-44 w-full bg-gradient-to-r from-emerald-800 to-[#10b981] relative">
                       {/* Ornamen overlay simpel */}
                       <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] bg-repeat"></div>
                    </div>

                    {/* Content Profile */}
                    <div className="px-8 pb-8 pt-4 relative">
                       
                       {/* Overlapping Avatar */}
                       <div className="absolute -top-16 left-8 bg-white p-1.5 rounded-2xl shadow-md border border-slate-100">
                          <div className="w-24 h-24 bg-slate-100 rounded-xl overflow-hidden text-center text-xs">
                             <img src={selectedGuru.avatar_url || "https://api.dicebear.com/7.x/avataaars/svg?seed=Dummy"} alt="Avatar" className="w-full h-full object-cover" />
                          </div>
                       </div>

                       {/* Header Status Badge at Right */}
                       <div className="absolute top-4 right-8">
                          {selectedGuru.status === 'Terverifikasi' ? (
                             <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-600 text-sm font-bold border border-emerald-100">
                                <ShieldCheck size={16} /> Terverifikasi
                             </span>
                          ) : selectedGuru.status === 'Menunggu' ? (
                             <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-yellow-50 text-yellow-600 text-sm font-bold border border-yellow-100">
                                <Clock size={16} /> Menunggu Verifikasi
                             </span>
                          ) : (
                             <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-50 text-red-600 text-sm font-bold border border-red-100">
                                <Ban size={16} /> Dinonaktifkan
                             </span>
                          )}
                       </div>

                       <div className="mt-12 mb-6">
                          <h1 className="text-2xl font-extrabold text-slate-800 flex items-center gap-2">
                             {selectedGuru.name} 
                             {selectedGuru.status === 'Terverifikasi' && <CheckCircle2 size={24} className="text-[#059669] fill-[#059669]/10" />}
                          </h1>
                          <p className="text-sm font-bold text-[#059669] mt-1">{selectedGuru.education}</p>
                          
                          <div className="flex items-center gap-3 mt-3">
                             <div className="flex text-amber-400">
                                <Star size={16} className="fill-amber-400" />
                                <Star size={16} className="fill-amber-400" />
                                <Star size={16} className="fill-amber-400" />
                                <Star size={16} className="fill-amber-400" />
                                <Star size={16} className="fill-amber-400" />
                             </div>
                             <span className="font-extrabold text-slate-700">{selectedGuru.rating || "0.0"}</span>
                             <span className="text-slate-400 text-sm font-medium">({selectedGuru.reviews_count || 0} Ulasan)</span>
                          </div>

                          <div className="flex flex-wrap items-center gap-6 mt-6">
                             <div className="flex items-center gap-2 text-sm font-bold text-slate-500">
                                <MapPin size={16} className="text-slate-400" /> {selectedGuru.location}
                             </div>
                             <div className="flex items-center gap-2 text-sm font-bold text-slate-500">
                                <Clock size={16} className="text-slate-400" /> {selectedGuru.experience}
                             </div>
                          </div>

                          <div className="flex flex-wrap gap-2 mt-4">
                             {selectedGuru.badges && selectedGuru.badges.map((badge: string, idx: number) => (
                                <span key={idx} className="bg-slate-50 border border-slate-200 text-slate-600 flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold">
                                   <BookOpen size={12} className="text-indigo-400" /> {badge}
                                </span>
                             ))}
                          </div>
                          
                       </div>

                       {/* Action Tab Switcher */}
                       <div className="flex gap-2 border-b border-slate-200 mt-2">
                          <button 
                             onClick={() => setDetailTab("Informasi")}
                             className={`px-8 py-3.5 text-sm font-bold border-b-2 flex items-center gap-2 transition-all ${detailTab === 'Informasi' ? 'border-[#059669] text-[#059669]' : 'border-transparent text-slate-400 hover:text-slate-700'}`}
                          >
                             <User size={16} /> Informasi
                          </button>
                          <button 
                             onClick={() => setDetailTab("Galeri")}
                             className={`px-8 py-3.5 text-sm font-bold border-b-2 flex items-center gap-2 transition-all ${detailTab === 'Galeri' ? 'border-[#059669] text-[#059669]' : 'border-transparent text-slate-400 hover:text-slate-700'}`}
                          >
                             <ImageIcon size={16} /> Galeri
                          </button>
                          <button 
                             onClick={() => setDetailTab("Ulasan")}
                             className={`px-8 py-3.5 text-sm font-bold border-b-2 flex items-center gap-2 transition-all ${detailTab === 'Ulasan' ? 'border-[#059669] text-[#059669]' : 'border-transparent text-slate-400 hover:text-slate-700'}`}
                          >
                             <MessageSquare size={16} /> Ulasan
                          </button>
                       </div>
                    </div>
                 </div>

                 {/* Tab Contents */}
                 {detailTab === "Informasi" && (
                    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-8 space-y-8 animate-in slide-in-from-bottom-2">
                       
                       <div>
                          <h3 className="flex items-center gap-3 text-sm font-extrabold tracking-wider text-slate-800 uppercase mb-4">
                             <div className="w-8 h-8 rounded-full bg-emerald-50 text-[#059669] flex justify-center items-center"><Quote size={14} /></div>
                             TENTANG PENGAJAR
                          </h3>
                          <p className="text-slate-600 leading-relaxed font-medium">
                             {selectedGuru.about}
                          </p>
                       </div>

                       <div className="border-t border-slate-100 pt-8">
                          <h3 className="flex items-center gap-3 text-sm font-extrabold tracking-wider text-slate-800 uppercase mb-4">
                             <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-500 flex justify-center items-center"><BookOpen size={14} /></div>
                             TENTANG KURSUS
                          </h3>
                          <p className="text-slate-600 leading-relaxed font-medium">
                             {selectedGuru.course_desc}
                          </p>
                       </div>

                       <div className="border-t border-slate-100 pt-8">
                          <h3 className="flex items-center gap-3 text-sm font-extrabold tracking-wider text-slate-800 uppercase mb-4">
                             <div className="w-8 h-8 rounded-full bg-purple-50 text-purple-500 flex justify-center items-center"><Award size={14} /></div>
                             METODE BELAJAR
                          </h3>
                          <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 flex gap-4">
                             <div className="w-12 h-12 bg-purple-500 text-white rounded-lg flex items-center justify-center font-extrabold text-sm shadow-md">
                                {selectedGuru.metode ? selectedGuru.metode.substring(0,2).toUpperCase() : 'UM'}
                             </div>
                             <div>
                                <h4 className="font-extrabold text-purple-900 text-sm tracking-wide">{selectedGuru.metode}</h4>
                                <p className="text-xs text-purple-700/80 font-semibold mt-0.5">Belajar mendalam langsung menggunakan metode terstruktur.</p>
                             </div>
                          </div>
                       </div>
                    </div>
                 )}

                 {detailTab === "Galeri" && (
                    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-8 animate-in slide-in-from-bottom-2">
                       <h3 className="flex items-center gap-3 text-sm font-extrabold tracking-wider text-slate-800 uppercase mb-6">
                           <div className="w-8 h-8 rounded-full bg-orange-50 text-orange-500 flex justify-center items-center"><Award size={14} /></div>
                           SERTIFIKAT
                       </h3>
                       
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          
                          {/* Dummy Certificates placeholders as requested */}
                          {[1,2,3].map((item) => (
                             <div key={item} className="border border-slate-200 rounded-2xl overflow-hidden group cursor-pointer hover:shadow-lg transition-all">
                                <div className="h-40 bg-slate-100 flex justify-center items-center relative overflow-hidden">
                                   <div className="absolute inset-0 bg-gradient-to-tr from-orange-100 to-emerald-50 opacity-40"></div>
                                   <ImageIcon size={48} className="text-slate-300 group-hover:scale-110 transition-transform duration-300" />
                                   <div className="absolute top-3 right-3 bg-amber-400 text-white font-black text-xs px-2 py-1 rounded">202{item}</div>
                                </div>
                                <div className="p-4 bg-white border-t border-slate-100">
                                   <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2"><Award size={14} className="text-amber-500"/> Ijazah Sanad Tipe {item}</h4>
                                   <p className="text-xs text-slate-400 font-medium mt-1 hover:text-blue-500 line-clamp-1">Universitas / Pesantren Contoh</p>
                                </div>
                             </div>
                          ))}
                          
                       </div>
                    </div>
                 )}

                 {detailTab === "Ulasan" && (
                    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-8 animate-in slide-in-from-bottom-2 flex gap-8 flex-col lg:flex-row">
                       <div className="w-full lg:w-1/3 border-b lg:border-b-0 lg:border-r border-slate-100 pb-6 lg:pb-0 pr-0 lg:pr-8 flex flex-col items-center">
                          <h2 className="text-6xl font-black text-slate-800">{selectedGuru.rating || "0.0"}</h2>
                          <div className="flex text-amber-400 mt-2 mb-1">
                             {[...Array(5)].map((_, i) => <Star key={i} size={18} className="fill-amber-400" />)}
                          </div>
                          <span className="text-slate-400 font-bold text-sm">{selectedGuru.reviews_count || 0} ulasan</span>
                       </div>
                       
                       <div className="w-full lg:w-2/3 space-y-4">
                          {/* Progress Bars Reviews */}
                          {[5,4,3,2,1].map((star, idx) => (
                             <div key={star} className="flex items-center gap-3">
                                <div className="w-8 text-sm font-bold text-slate-500 flex items-center gap-1 justify-end">{star} <Star size={12} className="fill-amber-400 text-amber-400"/></div>
                                <div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden">
                                   <div className="h-full bg-amber-400 rounded-full" style={{ width: star === 5 ? '78%' : star === 4 ? '15%' : '0%' }}></div>
                                </div>
                                <div className="w-8 text-xs font-bold text-slate-400 text-right">{star === 5 ? '78%' : star === 4 ? '15%' : '0%'}</div>
                             </div>
                          ))}
                       </div>
                    </div>
                 )}
                 {detailTab === "Ulasan" && (
                     <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-8 mt-6">
                        <div className="space-y-6">
                           <div className="border-b border-slate-100 pb-6">
                              <div className="flex justify-between items-start mb-2">
                                 <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-rose-100 shrink-0"></div>
                                    <div>
                                       <h4 className="font-bold text-slate-800 text-sm">Dewi Rahayu</h4>
                                       <div className="flex text-amber-400 mt-0.5">
                                          {[...Array(5)].map((_, i) => <Star key={i} size={12} className="fill-amber-400" />)}
                                       </div>
                                    </div>
                                 </div>
                                 <span className="text-xs font-semibold text-slate-400">1 bulan yang lalu</span>
                              </div>
                              <p className="text-slate-600 text-sm font-medium mt-3 leading-relaxed">Metode yang digunakan sangat efektif. Saya merasa ada kemajuan pesat dalam bacaan Al-Qur'an saya hanya dalam 3 sesi. Sangat direkomendasikan!</p>
                              <div className="flex gap-2 mt-3">
                                 <span className="text-[10px] bg-emerald-50 text-emerald-600 px-2.5 py-1 rounded font-bold border border-emerald-100">Metode Efektif</span>
                                 <span className="text-[10px] bg-emerald-50 text-emerald-600 px-2.5 py-1 rounded font-bold border border-emerald-100">Progress Cepat</span>
                              </div>
                           </div>
                           
                           <div>
                              <div className="flex justify-between items-start mb-2">
                                 <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-blue-100 shrink-0"></div>
                                    <div>
                                       <h4 className="font-bold text-slate-800 text-sm">Halimah Tussa'diyah</h4>
                                       <div className="flex text-amber-400 mt-0.5">
                                          {[...Array(5)].map((_, i) => <Star key={i} size={12} className="fill-amber-400" />)}
                                       </div>
                                    </div>
                                 </div>
                                 <span className="text-xs font-semibold text-slate-400">2 bulan yang lalu</span>
                              </div>
                              <p className="text-slate-600 text-sm font-medium mt-3 leading-relaxed">Ustadz berpegelaman dan penuh kesabaran. Mampu menjelaskan konsep yang sulit dengan cara yang mudah dipahami.</p>
                           </div>
                        </div>
                     </div>
                 )}

              </div>

              {/* RIGHT SIDEBAR CONTENT */}
              <div className="w-full lg:w-1/3 space-y-6">
                 
                 {/* Verifikasi Pengajar */}
                 <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-6 relative overflow-hidden">
                    <div className="absolute -top-10 -right-10 text-emerald-100 opacity-50"><ShieldCheck size={120} /></div>
                    <h3 className="font-extrabold text-emerald-800 text-sm uppercase tracking-wider flex items-center gap-2 mb-6 relative z-10"><ShieldCheck size={18} /> Verifikasi Pengajar</h3>
                    
                    <div className="space-y-4 relative z-10">
                       <div className="bg-white border border-emerald-100 rounded-xl p-4 flex items-center justify-between shadow-sm">
                          <div>
                             <h4 className="font-bold text-emerald-800 text-xs flex items-center gap-2 text-sm"><CheckCircle2 className="text-[#059669]" size={16} /> Data Diri <span className="bg-red-100 text-red-600 text-[9px] px-1.5 py-0.5 rounded font-black uppercase tracking-wider">Wajib</span></h4>
                             <p className="text-[10px] text-slate-400 font-bold ml-6 mt-1">Nama, foto, lokasi, spesialisasi</p>
                          </div>
                          <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-500 flex justify-center items-center"><User size={14} /></div>
                       </div>
                       
                       <div className="bg-white border border-emerald-100 rounded-xl p-4 flex items-center justify-between shadow-sm">
                          <div>
                             <h4 className="font-bold text-emerald-800 text-xs flex items-center gap-2 text-sm"><CheckCircle2 className="text-[#059669]" size={16} /> Video Membaca <span className="bg-red-100 text-red-600 text-[9px] px-1.5 py-0.5 rounded font-black uppercase tracking-wider">Wajib</span></h4>
                             <p className="text-[10px] text-slate-400 font-bold ml-6 mt-1">Bukti kelancaran bacaan</p>
                          </div>
                          <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-500 flex justify-center items-center"><Video size={14} /></div>
                       </div>

                       <div className="bg-white border border-emerald-100 rounded-xl p-4 flex items-center justify-between shadow-sm">
                          <div>
                             <h4 className="font-bold text-emerald-800 text-xs flex items-center gap-2 text-sm"><CheckCircle2 className="text-[#059669]" size={16} /> Video Mengajar <span className="bg-slate-100 text-slate-500 text-[9px] px-1.5 py-0.5 rounded font-black uppercase tracking-wider">Opsional</span></h4>
                             <p className="text-[10px] text-slate-400 font-bold ml-6 mt-1">Contoh kegiatan mengajar</p>
                          </div>
                          <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-500 flex justify-center items-center"><Video size={14} /></div>
                       </div>

                       <div className="bg-white border border-emerald-100 rounded-xl p-4 flex items-center justify-between shadow-sm">
                          <div>
                             <h4 className="font-bold text-emerald-800 text-xs flex items-center gap-2 text-sm"><CheckCircle2 className="text-[#059669]" size={16} /> Sertifikat / Ijazah <span className="bg-slate-100 text-slate-500 text-[9px] px-1.5 py-0.5 rounded font-black uppercase tracking-wider">Opsional</span></h4>
                             <p className="text-[10px] text-slate-400 font-bold ml-6 mt-1">Dokumen pendukung keahlian</p>
                          </div>
                          <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-500 flex justify-center items-center"><FileText size={14} /></div>
                       </div>
                    </div>
                    
                    <button className="w-full mt-6 bg-white border border-emerald-200 text-[#059669] font-bold py-3 rounded-xl flex items-center justify-center gap-2 shadow-sm">
                       <CheckCircle2 size={16} /> Pengajar Terverifikasi
                    </button>
                    
                 </div>

                 {/* Statistik Pengajar */}
                 <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                    <h3 className="font-bold text-slate-800 text-sm mb-6">Statistik Pengajar</h3>
                    <div className="space-y-4">
                       <div className="flex justify-between items-center text-sm font-semibold">
                          <span className="text-slate-500">Total Murid</span>
                          <span className="text-slate-800 font-extrabold">{selectedGuru.murid || 0} murid</span>
                       </div>
                       <div className="flex justify-between items-center text-sm font-semibold">
                          <span className="text-slate-500">Total Pesanan</span>
                          <span className="text-slate-800 font-extrabold">{selectedGuru.pesanan_aktif || 0} pesanan</span>
                       </div>
                       <div className="flex justify-between items-center text-sm font-semibold">
                          <span className="text-slate-500">Total Revenue</span>
                          <span className="text-slate-800 font-extrabold">{formatCurrency(selectedGuru.revenue)}</span>
                       </div>
                       <div className="flex justify-between items-center text-sm font-semibold">
                          <span className="text-slate-500">Rating</span>
                          <span className="text-slate-800 font-extrabold flex items-center gap-1">{selectedGuru.rating || '0.0'} / 5.0 <Star size={12} className="fill-amber-400 text-amber-400"/></span>
                       </div>
                       <div className="flex justify-between items-center text-sm font-semibold">
                          <span className="text-slate-500">Bergabung</span>
                          <span className="text-slate-800 font-extrabold">
                             {new Date(selectedGuru.join_date).toLocaleDateString('id-ID', {day: 'numeric', month: 'short', year: 'numeric'})}
                          </span>
                       </div>
                    </div>
                 </div>

              </div>

           </div>
        </div>
     );
  }

  // ======================
  // RENDER MASTER LIST
  // ======================
  return (
    <div className="max-w-[1400px] mx-auto space-y-6 pb-12 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="mb-6">
         <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">Manajemen Guru</h1>
         <p className="text-slate-500 font-medium text-sm mt-1">Verifikasi, nonaktifkan, atau aktifkan kembali akun guru</p>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
         <div className="flex flex-wrap items-center gap-2">
            <button
               onClick={() => setActiveTab("Semua")}
               className={`px-4 py-2.5 rounded-full text-sm font-bold transition-all border ${
                  activeTab === "Semua" ? "bg-[#059669] text-white border-[#059669] shadow-md" : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50"
               }`}
            >
               Semua: {counts["Semua"]}
            </button>
            <button
               onClick={() => setActiveTab("Terverifikasi")}
               className={`px-4 py-2.5 rounded-full text-sm font-bold transition-all border ${
                  activeTab === "Terverifikasi" ? "bg-white text-[#059669] border-[#059669] shadow-sm" : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50"
               }`}
            >
               Terverifikasi: {counts["Terverifikasi"]}
            </button>
            <button
               onClick={() => setActiveTab("Menunggu")}
               className={`px-4 py-2.5 rounded-full text-sm font-bold transition-all border ${
                  activeTab === "Menunggu" ? "bg-white text-yellow-600 border-yellow-400 shadow-sm" : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50"
               }`}
            >
               Menunggu: {counts["Menunggu"]}
            </button>
            <button
               onClick={() => setActiveTab("Nonaktif")}
               className={`px-4 py-2.5 rounded-full text-sm font-bold transition-all border ${
                  activeTab === "Nonaktif" ? "bg-white text-red-600 border-red-400 shadow-sm" : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50"
               }`}
            >
               Nonaktif: {counts["Nonaktif"]}
            </button>
         </div>

         <div className="relative w-full sm:w-80">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
               type="text" 
               placeholder="Cari nama, email, atau spesialisasi..." 
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#059669]/20 shadow-sm font-medium"
            />
         </div>
      </div>

      {/* Main Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden min-h-[400px] flex flex-col">
         <div className="overflow-x-auto">
            <table className="w-full whitespace-nowrap">
               <thead>
                  <tr className="text-slate-600 text-xs font-black tracking-wide text-left border-b border-slate-100 bg-slate-50/70">
                     <th className="px-6 py-5 cursor-pointer">Guru</th>
                     <th className="px-4 py-5 cursor-pointer">Rating <span className="text-slate-300">↕</span></th>
                     <th className="px-4 py-5">Metode Mengaji</th>
                     <th className="px-4 py-5 cursor-pointer">Murid <span className="text-slate-300">↕</span></th>
                     <th className="px-4 py-5 cursor-pointer">Total Revenue <span className="text-slate-300">↕</span></th>
                     <th className="px-4 py-5">Pesanan Aktif</th>
                     <th className="px-4 py-5">Status</th>
                     <th className="px-6 py-5 text-center">Aksi</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                  {isLoading ? (
                     <tr><td colSpan={8} className="px-6 py-12 text-center text-slate-500 font-medium">Memuat data Guru...</td></tr>
                  ) : filteredData.length === 0 ? (
                     <tr><td colSpan={8} className="px-6 py-12 text-center text-slate-500 font-medium">Tidak ada data ditemukan.</td></tr>
                  ) : (
                     filteredData.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                           <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                 <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden ring-1 ring-slate-200 shrink-0">
                                    <img src={item.avatar_url || "https://api.dicebear.com/7.x/avataaars/svg?seed=Dummy"} alt="Avatar" className="w-full h-full object-cover" />
                                 </div>
                                 <div className="flex flex-col">
                                    <span className="font-extrabold text-slate-800 text-sm">{item.name}</span>
                                    <span className="text-[11px] font-bold text-slate-400">{item.email}</span>
                                 </div>
                              </div>
                           </td>
                           <td className="px-4 py-4">
                              <div className="flex items-center gap-1.5 font-extrabold text-slate-700 text-sm">
                                 {item.rating ? (
                                   <><Star size={14} className="fill-amber-400 text-amber-400" /> {item.rating}</>
                                 ) : (
                                   <><span className="text-slate-300 font-black">—</span></>
                                 )}
                              </div>
                           </td>
                           <td className="px-4 py-4">
                              <span className="text-sm font-bold text-slate-600 italic">
                                 {item.metode || "—"}
                              </span>
                           </td>
                           <td className="px-4 py-4 text-slate-800 font-bold text-sm tracking-wide">
                              {item.murid ? `${item.murid} murid` : <span className="text-slate-300">—</span>}
                           </td>
                           <td className="px-4 py-4 text-slate-800 font-bold text-sm tracking-wide">
                              {formatCurrency(item.revenue)}
                           </td>
                           <td className="px-4 py-4">
                              {item.pesanan_aktif > 0 ? (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 text-blue-600 text-[11px] font-black border border-blue-100">
                                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div> {item.pesanan_aktif} aktif
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-slate-500 text-[11px] font-black border border-slate-200">
                                  <div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div> 0 aktif
                                </span>
                              )}
                           </td>
                           <td className="px-4 py-4">
                             {item.status === 'Terverifikasi' ? (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 font-black border border-emerald-100 text-[10px] uppercase tracking-wider">
                                   <div className="w-1.5 h-1.5 rounded-full bg-[#059669]"></div> Terverifikasi
                                </span>
                             ) : item.status === 'Menunggu' ? (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-yellow-50 text-yellow-600 font-black border border-yellow-200 text-[10px] uppercase tracking-wider">
                                   <div className="w-1.5 h-1.5 rounded-full bg-yellow-500"></div> Menunggu
                                </span>
                             ) : (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-slate-500 font-black border border-slate-200 text-[10px] uppercase tracking-wider">
                                   <div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div> Nonaktif
                                </span>
                             )}
                           </td>
                           <td className="px-6 py-4">
                              <div className="flex justify-center items-center gap-3">
                                 <button 
                                   onClick={() => setSelectedGuru(item)}
                                   className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50/50 hover:bg-emerald-50 border border-emerald-100 text-[#059669] rounded-lg text-xs font-bold transition-colors shadow-sm"
                                 >
                                    <Eye size={14} /> Detail
                                 </button>
                                 
                                 {item.status === 'Terverifikasi' ? (
                                    <button 
                                      onClick={() => handleToggleStatus(item, 'Nonaktif')}
                                      className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50/50 hover:bg-red-50 border border-red-100 text-red-500 rounded-lg text-xs font-bold transition-colors shadow-sm"
                                    >
                                       <Ban size={14} strokeWidth={2.5}/> Nonaktifkan
                                    </button>
                                 ) : item.status === 'Menunggu' || item.status === 'Nonaktif' ? (
                                    <button 
                                      onClick={() => handleToggleStatus(item, 'Terverifikasi')}
                                      className="flex items-center gap-1.5 px-[18px] py-1.5 bg-blue-50/50 hover:bg-blue-50 border border-blue-200 text-blue-600 rounded-lg text-xs font-bold transition-colors shadow-sm"
                                    >
                                       <CheckCircle2 size={14} strokeWidth={2.5}/> Verifikasi
                                    </button>
                                 ) : null}
                              </div>
                           </td>
                        </tr>
                     ))
                  )}
               </tbody>
            </table>
         </div>

         {/* Pagination Footer */}
         <div className="bg-[#fafafa] border-t border-slate-100 p-4 mt-auto flex items-center justify-between">
            <div className="text-sm font-bold text-slate-400 tracking-wide">
               Menampilkan <span className="font-extrabold text-[#059669]">1-{filteredData.length}</span> dari {filteredData.length} data
            </div>
            <div className="flex items-center gap-2 text-slate-400 font-bold">
               <button className="w-8 h-8 flex justify-center items-center rounded-lg hover:bg-slate-200 transition-colors">&lt;</button>
               <button className="w-8 h-8 flex justify-center items-center rounded-lg bg-[#059669] text-white shadow-sm ring-2 ring-emerald-100">1</button>
               <button className="w-8 h-8 flex justify-center items-center rounded-lg hover:bg-slate-200 transition-colors">&gt;</button>
            </div>
         </div>
      </div>
    </div>
  );
}
