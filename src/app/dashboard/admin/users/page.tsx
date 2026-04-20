"use client";

import { useState, useEffect } from "react";
import { Search, Filter, PencilIcon, User, Mail, ChevronLeft, ChevronRight, X, Loader2 } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

export default function UsersPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const supabase = createClient();

  // Koneksi Berkesinambungan: Tarik data asli dari "user_profiles"
  useEffect(() => {
    async function fetchUsers() {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (data) {
        setUsers(data);
      }
      setIsLoading(false);
    }
    
    fetchUsers();
  }, []);

  const openEditModal = () => {
    setIsModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3 text-slate-800">
          <User size={28} className="text-slate-500" strokeWidth={2.5}/>
          <h1 className="text-3xl font-bold tracking-tight">User List</h1>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex gap-4 mb-6">
        <div className="flex items-center rounded-lg border border-slate-200 bg-white overflow-hidden max-w-sm w-full">
          <input 
            type="text" 
            placeholder="Search by username..." 
            className="w-full px-4 py-2.5 text-sm focus:outline-none placeholder:text-slate-400"
          />
          <button className="bg-[#059669] text-white px-4 py-3 hover:bg-[#047857] transition-colors">
            <Search size={18} />
          </button>
        </div>
        <button className="bg-white border border-slate-200 px-4 py-2 rounded-lg text-sm font-medium text-slate-700 flex items-center gap-2 hover:bg-slate-50">
          <Filter size={16} />
          Filter
        </button>
      </div>

      {/* Table Container */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
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
            <tbody className="divide-y divide-slate-100 text-sm">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-slate-500">
                    <Loader2 className="animate-spin mx-auto mb-2 text-emerald-600" size={24} />
                    Loading users from Supabase...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-slate-500 font-medium">
                    No users found in database. Data automatically appears when someone signs up!
                  </td>
                </tr>
              ) : (
                users.map((user) => {
                  const initialName = user.username ? user.username.substring(0, 1) : "U";
                  return (
                    <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-500 font-bold flex items-center justify-center text-sm uppercase">
                          {initialName}
                        </div>
                      </td>
                      <td className="px-6 py-4 font-semibold text-slate-800">{user.username}</td>
                      <td className="px-6 py-4 text-slate-600">{user.full_name || '-'}</td>
                      <td className="px-6 py-4 text-slate-400">{user.email || '-'}</td>
                      <td className="px-6 py-4 text-slate-400">
                         {new Date(user.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' })}
                      </td>
                      <td className="px-6 py-4 text-slate-400 capitalize">{user.role || 'member'}</td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-full text-xs font-bold">
                          {user.status || 'Active'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button onClick={openEditModal} className="text-slate-400 hover:text-emerald-600 p-1 rounded transition-colors group">
                           <PencilIcon size={18} className="group-hover:scale-110 transition-transform" />
                        </button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination mock */}
        <div className="p-4 border-t border-slate-100 flex flex-col gap-2 items-center justify-center text-sm font-medium">
          <div className="flex items-center gap-1">
             <button className="text-slate-400 flex items-center gap-1 hover:text-slate-600 px-2 cursor-not-allowed">
               <ChevronLeft size={16} /> 
             </button>
             <button className="w-8 h-8 rounded bg-[#059669] text-white flex items-center justify-center">1</button>
             <button className="text-slate-600 flex items-center gap-1 hover:text-slate-900 px-2">
               <ChevronRight size={16} />
             </button>
          </div>
          <span className="text-slate-500 font-normal">Showing Top Users</span>
        </div>
      </div>

      {/* Edit Modal (Sama seperti sebelumnya) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200 relative">
            
            {/* Modal Header */}
            <div className="px-6 py-5 flex items-center justify-between border-b border-slate-100 bg-white sticky top-0 z-10">
              <h3 className="text-xl font-bold text-slate-900">Edit User</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 bg-slate-50 p-1.5 rounded-md">
                <X size={20} />
              </button>
            </div>
            
            {/* Modal Body / Scrollable Form */}
            <div className="px-6 py-5 overflow-y-auto hide-scrollbar space-y-5 flex-1">
              {/* Form Input kosmetik untuk mendemonstrasikan Visual... */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-800">Username <span className="text-red-500">*</span></label>
                <div className="relative">
                   <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><User size={18} /></div>
                   <input type="text" defaultValue="ardian78" className="w-full h-11 pl-10 pr-3 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669] transition-all font-medium text-slate-700" />
                </div>
              </div>

              <div className="space-y-1.5 pb-2">
                <label className="text-sm font-semibold text-slate-800">Active Status</label>
                <div className="relative flex items-center h-11 px-3 bg-white border border-slate-200 rounded-lg">
                   <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2" />
                   <span className="text-sm font-semibold text-slate-700">Active</span>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 flex items-center justify-end gap-3 border-t border-slate-100 bg-white sticky bottom-0">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-lg text-sm font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-colors">
                Cancel
              </button>
              <button className="px-5 py-2 rounded-lg text-sm font-bold text-white bg-[#059669] hover:bg-[#047857] transition-colors shadow-sm">
                Save
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
