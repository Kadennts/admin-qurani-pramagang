"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, Filter, PencilIcon, User, Mail, ChevronLeft, ChevronRight, X, Loader2, Save } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

const PAGE_SIZE = 10;

/**
 * Komponen Halaman (View): UsersPage
 * Fungsi: Menampilkan halaman daftar pengguna dengan fungsionalitas pencarian, filter, dan fitur edit/update data profil.
 */
export default function UsersPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // States untuk data master geografi
  const [countries, setCountries] = useState<any[]>([]);
  const [states, setStates] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);

  // Form states
  const [editingUser, setEditingUser] = useState<any>(null);
  const [formData, setFormData] = useState({
    username: "",
    full_name: "",
    email: "",
    country: "",
    province: "",
    city: "",
    role: "Member",
    status: "Active"
  });

  // Inisialisasi client Supabase untuk berinteraksi dengan database dari sisi client/browser
  const supabase = createClient();

  /**
   * Fungsi: fetchUsers
   * Bagian menyambungkan Supabase: Melakukan query (SELECT) ke tabel `user_profiles` untuk mendapatkan seluruh data pengguna dan diurutkan berdasarkan pembuatan terbaru.
   */
  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    const { data } = await supabase
      .from('user_profiles')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (data) {
      setUsers(data);
    }
    setIsLoading(false);
  }, []);

  /**
   * Fungsi Effect: Pengambilan Data Awal (Init)
   * Bagian menyambungkan Supabase: Mengambil (SELECT) master data negara dari tabel `countries` pada saat komponen pertama kali dimuat.
   */
  useEffect(() => {
    const fetchMasterData = async () => {
      const { data } = await supabase.from('countries').select('*').order('name');
      if (data) setCountries(data);
    };
    fetchUsers();
    fetchMasterData();
  }, [fetchUsers]);

  /**
   * Fungsi Effect: Cascading Filter untuk States (Provinsi)
   * Bagian menyambungkan Supabase: Mengambil (SELECT) data dari tabel `states` dengan filter (EQ) berdasarkan `country_id` dari negara yang dipilih.
   */
  useEffect(() => {
    const fetchStates = async () => {
      if (formData.country) {
         // Temukan ID negara berdasarkan namanya
         const countryObj = countries.find(c => c.name === formData.country);
         if (countryObj) {
            const { data } = await supabase.from('states').select('*').eq('country_id', countryObj.id).order('name');
            setStates(data || []);
         }
      } else {
         setStates([]);
      }
    };
    fetchStates();
  }, [formData.country, countries]);

  /**
   * Fungsi Effect: Cascading Filter untuk Cities (Kota)
   * Bagian menyambungkan Supabase: Mengambil (SELECT) data dari tabel `cities` dengan filter (EQ) berdasarkan `state_id` dari provinsi yang dipilih.
   */
  useEffect(() => {
    const fetchCities = async () => {
      if (formData.province) {
         // Temukan ID state berdasarkan namanya
         const stateObj = states.find(s => s.name === formData.province);
         if (stateObj) {
            const { data } = await supabase.from('cities').select('*').eq('state_id', stateObj.id).order('name');
            setCities(data || []);
         }
      } else {
         setCities([]);
      }
    };
    fetchCities();
  }, [formData.province, states]);


  const filtered = users.filter((user) =>
    (user.username || "").toLowerCase().includes(search.toLowerCase()) ||
    (user.full_name || "").toLowerCase().includes(search.toLowerCase()) ||
    (user.email || "").toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const handleSearch = (v: string) => { setSearch(v); setCurrentPage(1); };

  const pageNumbers = () => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (currentPage <= 3) return [1, 2, 3, 4, 5];
    if (currentPage >= totalPages - 2) return [totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    return [currentPage - 2, currentPage - 1, currentPage, currentPage + 1, currentPage + 2];
  };

  /**
   * Fungsi: openEditModal
   * Menyiapkan form state (formData) dengan data dari user yang diklik, lalu menampilkan modal (view).
   */
  const openEditModal = (user: any) => {
    setEditingUser(user);
    setFormData({
      username: user.username || "",
      full_name: user.full_name || "",
      email: user.email || "",
      country: user.country || "",
      province: user.province || "",
      city: user.city || "",
      role: user.role || "Member",
      status: user.status || "Active"
    });
    setIsModalOpen(true);
  };

  /**
   * Fungsi: handleSave
   * Bagian menyambungkan Supabase: Menjalankan operasi UPDATE ke tabel `user_profiles` sesuai dengan id user yang sedang diedit.
   */
  const handleSave = async () => {
    if (!editingUser) return;
    
    // Update profil di Supabase
    const { data, error } = await supabase
      .from('user_profiles')
      .update({
         username: formData.username,
         full_name: formData.full_name,
         email: formData.email,
         country: formData.country,
         province: formData.province,
         city: formData.city,
         role: formData.role,
         status: formData.status
      })
      .eq('id', editingUser.id)
      .select();

    if (data) {
      setUsers((prev) => prev.map((u) => u.id === editingUser.id ? data[0] : u));
    }
    setIsModalOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3 text-slate-800">
          <div className="w-12 h-12 bg-emerald-50 text-[#059669] rounded-xl flex items-center justify-center border border-emerald-100 shadow-sm">
            <User size={24} strokeWidth={2.5}/>
          </div>
          <div>
             <h1 className="text-3xl font-bold tracking-tight">User List</h1>
             <p className="text-sm font-medium text-slate-500">Kelola informasi dan hak akses semua pengguna</p>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex gap-4 mb-6">
        <div className="flex items-center rounded-xl border border-slate-200 bg-white overflow-hidden max-w-sm w-full shadow-sm focus-within:ring-2 focus-within:ring-[#059669]/20 focus-within:border-[#059669] transition-all">
          <input 
            type="text" 
            placeholder="Search by username, name, or email..." 
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full px-4 py-2.5 text-sm font-medium text-slate-700 bg-transparent focus:outline-none placeholder:text-slate-400"
          />
          <button className="bg-[#059669] text-white px-4 py-3 hover:bg-[#047857] transition-colors">
            <Search size={18} />
          </button>
        </div>
        <button className="bg-white border border-slate-200 px-4 py-2 rounded-xl text-sm font-bold text-slate-700 flex items-center gap-2 hover:bg-slate-50 shadow-sm transition-colors">
          <Filter size={16} />
          Filter
        </button>
      </div>

      {/* Table Container */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col min-h-[400px]">
        <div className="overflow-x-auto">
          <table className="w-full whitespace-nowrap">
            <thead>
              <tr className="bg-[#059669] text-white text-sm font-bold text-left">
                <th className="px-6 py-4 rounded-tl-xl w-20">Photo</th>
                <th className="px-6 py-4">Username</th>
                <th className="px-6 py-4">Full Name</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Join Date</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 rounded-tr-xl w-24">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm font-medium">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-slate-500">
                    <Loader2 className="animate-spin mx-auto mb-2 text-emerald-600" size={24} />
                    Loading users from Supabase...
                  </td>
                </tr>
              ) : paginated.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-slate-500 font-medium">
                    Tidak ada data pengguna ditemukan.
                  </td>
                </tr>
              ) : (
                paginated.map((user) => {
                  const initialName = user.username ? user.username.substring(0, 1) : "U";
                  return (
                    <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="w-8 h-8 rounded-full bg-blue-100/50 text-blue-600 font-bold flex items-center justify-center text-sm uppercase border border-blue-200/50">
                          {initialName}
                        </div>
                      </td>
                      <td className="px-6 py-4 font-bold text-[#059669]">{user.username}</td>
                      <td className="px-6 py-4 text-slate-700">{user.full_name || '-'}</td>
                      <td className="px-6 py-4 text-slate-500">{user.email || '-'}</td>
                      <td className="px-6 py-4 text-slate-500">
                         {new Date(user.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' })}
                      </td>
                      <td className="px-6 py-4 text-slate-600 capitalize">{user.role || 'Member'}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${user.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>
                          {user.status || 'Active'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button onClick={() => openEditModal(user)} className="text-slate-400 hover:text-emerald-600 p-1 rounded-md transition-colors group bg-slate-50 hover:bg-emerald-50">
                           <PencilIcon size={16} className="group-hover:scale-110 transition-transform" />
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
        <div className="border-t border-slate-100 px-6 py-4 flex items-center justify-between bg-white mt-auto">
          <span className="text-sm font-bold text-slate-400">
            Menampilkan <span className="text-emerald-600 font-extrabold">{filtered.length === 0 ? 0 : Math.min((currentPage - 1) * PAGE_SIZE + 1, filtered.length)}–{Math.min(currentPage * PAGE_SIZE, filtered.length)}</span> dari {filtered.length} users
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="h-9 w-9 flex items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            {pageNumbers().map((n) => (
              <button
                key={n}
                onClick={() => setCurrentPage(n)}
                className={`h-9 w-9 flex items-center justify-center rounded-lg text-sm font-bold transition-colors ${
                  n === currentPage ? "bg-[#059669] text-white" : "border border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                {n}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="h-9 w-9 flex items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Edit Modal Refactored to match visual reference */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200 relative border border-slate-200">
            
            {/* Modal Header */}
            <div className="px-6 py-4 flex items-center justify-between border-b border-slate-100 bg-white sticky top-0 z-10">
              <h3 className="text-lg font-extrabold text-slate-900 tracking-wide">Edit User</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 bg-slate-50 hover:bg-slate-100 p-1.5 rounded-xl transition">
                <X size={20} />
              </button>
            </div>
            
            {/* Modal Body / Scrollable Form */}
            <div className="px-6 py-5 overflow-y-auto custom-scrollbar space-y-4 flex-1">
              
              {/* Username */}
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700 tracking-wide">Username <span className="text-red-500">*</span></label>
                <div className="relative">
                   <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><User size={18} /></div>
                   <input 
                     type="text" 
                     value={formData.username} 
                     onChange={(e) => setFormData({...formData, username: e.target.value})}
                     className="w-full h-11 pl-10 pr-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669] transition-all font-semibold text-slate-800"
                   />
                </div>
                <p className="text-xs font-semibold text-slate-400 mt-1">3-20 karakter, huruf, angka, dan underscore saja</p>
              </div>

              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700 tracking-wide">Full Name</label>
                <div className="relative">
                   <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><User size={18} /></div>
                   <input 
                     type="text" 
                     value={formData.full_name} 
                     onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                     className="w-full h-11 pl-10 pr-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669] transition-all font-semibold text-slate-800"
                   />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700 tracking-wide">Email</label>
                <div className="relative">
                   <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><Mail size={18} /></div>
                   <input 
                     type="email" 
                     value={formData.email} 
                     onChange={(e) => setFormData({...formData, email: e.target.value})}
                     className="w-full h-11 pl-10 pr-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669] transition-all font-semibold text-slate-800"
                   />
                </div>
              </div>

              {/* Country */}
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700 tracking-wide">Country</label>
                <select 
                  value={formData.country} 
                  onChange={(e) => setFormData({...formData, country: e.target.value, province: '', city: ''})}
                  className="w-full h-11 px-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669] transition-all font-semibold text-slate-800 cursor-pointer"
                >
                  <option value="">Select Country</option>
                  {countries.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                </select>
              </div>

              {/* Province */}
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700 tracking-wide">Province</label>
                <select 
                  value={formData.province} 
                  onChange={(e) => setFormData({...formData, province: e.target.value, city: ''})}
                  disabled={!formData.country}
                  className="w-full h-11 px-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669] transition-all font-semibold text-slate-800 cursor-pointer disabled:bg-slate-50 disabled:cursor-not-allowed"
                >
                  <option value="">Select Province</option>
                  {states.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                </select>
              </div>

              {/* City */}
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700 tracking-wide">City</label>
                <select 
                  value={formData.city} 
                  onChange={(e) => setFormData({...formData, city: e.target.value})}
                  disabled={!formData.province}
                  className="w-full h-11 px-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669] transition-all font-semibold text-slate-800 cursor-pointer disabled:bg-slate-50 disabled:cursor-not-allowed"
                >
                  <option value="">Select City</option>
                  {cities.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                </select>
              </div>

              {/* Role */}
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700 tracking-wide">Role</label>
                <select 
                  value={formData.role} 
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                  className="w-full h-11 px-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669] transition-all font-bold text-slate-800 cursor-pointer"
                >
                  <option value="Admin">Admin</option>
                  <option value="Support">Support</option>
                  <option value="Billing">Billing</option>
                  <option value="Member">Member</option>
                </select>
              </div>

              {/* Active Status */}
              <div className="space-y-1.5 pb-2">
                <label className="text-sm font-bold text-slate-700 tracking-wide">Active Status</label>
                <div 
                  className="relative flex items-center h-11 px-4 bg-white border border-slate-200 hover:border-slate-300 rounded-xl cursor-pointer transition-all focus-within:ring-2 focus-within:ring-[#059669]/20"
                  onClick={() => setFormData({...formData, status: formData.status === 'Active' ? 'Inactive' : 'Active'})}
                >
                   <div className={`w-2.5 h-2.5 rounded-full mr-3 ${formData.status === 'Active' ? 'bg-[#059669] shadow-[0_0_8px_rgba(5,150,105,0.6)]' : 'bg-slate-300'}`} />
                   <span className={`text-sm font-bold ${formData.status === 'Active' ? 'text-slate-800' : 'text-slate-500'}`}>
                     {formData.status === 'Active' ? 'Active' : 'Inactive'}
                   </span>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 flex items-center justify-end gap-3 border-t border-slate-100 bg-slate-50/80 sticky bottom-0">
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="px-6 py-2.5 rounded-xl text-sm font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 transition-colors shadow-sm"
              >
                Cancel
              </button>
              <button 
                onClick={handleSave}
                className="px-8 py-2.5 rounded-xl text-sm font-bold text-white bg-[#059669] hover:bg-[#047857] transition-all shadow-md hover:shadow-lg flex items-center gap-2"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
