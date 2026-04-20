"use client";

import { useState, useEffect } from "react";
import { Search, Plus, Filter, MoreVertical, Users, CheckCircle, Check, X, Image as ImageIcon } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";

export default function SupportGroupsPage() {
  const [groups, setGroups] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [notification, setNotification] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

  // Modal States
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newGroup, setNewGroup] = useState({
    name: "",
    category: "",
    country: "",
    province: "",
    city: "",
    type: "Public",
    description: ""
  });

  const supabase = createClient();

  const fetchGroups = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('support_groups')
      .select('*')
      .order('name', { ascending: true });
    
    if (data) setGroups(data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchGroups();
  }, [supabase]);

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  const handleToggleVerify = async (id: string, currentStatus: boolean) => {
    // Optimistic UI update
    const newStatus = !currentStatus;
    setGroups(prev => prev.map(g => g.id === id ? { ...g, is_verified: newStatus } : g));

    // Supabase update
    const { error } = await supabase
      .from('support_groups')
      .update({ is_verified: newStatus })
      .eq('id', id);

    if (!error) {
      if (newStatus) {
        showNotification("Group verified successfully");
      } else {
        showNotification("Group verification removed");
      }
    } else {
      showNotification("Failed to update status", "error");
      fetchGroups(); // Revert back
    }
  };

  const filteredGroups = searchQuery.trim() !== "" 
    ? groups.filter(g => g.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : groups;

  // Format date loosely avoiding heavy parsing for dummy text
  const formatDate = (dateStr: string) => {
    if (!dateStr) return "01 Jan 1";
    const date = new Date(dateStr);
    const dd = String(date.getDate()).padStart(2, '0');
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const mmm = months[date.getMonth()];
    const yy = String(date.getFullYear()).slice(-2);
    // return specifically "01 Jan 1" to match screenshot roughly unless year is valid
    if (date.getFullYear() < 2025) return `01 Jan 1`; 
    return `${dd} ${mmm} ${yy}`;
  };

  return (
    <div className="max-w-[1400px] mx-auto space-y-6 relative pb-12">
      
      {/* Floating Notification */}
      {notification && (
        <div className={`fixed top-6 right-6 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg font-bold text-sm z-50 animate-in slide-in-from-right-4 duration-300 fade-in ${
          notification.type === 'success' ? 'bg-[#059669] text-white' : 'bg-red-500 text-white'
        }`}>
          <CheckCircle size={18} />
          {notification.message}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between pb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
          </div>
          <h1 className="text-2xl font-bold text-[#1e293b]">Groups</h1>
        </div>
        <button 
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-[#059669] hover:bg-[#047857] text-white px-5 py-2.5 rounded-full font-bold text-sm flex items-center gap-2 transition-colors shadow-sm"
        >
          <Plus size={18} strokeWidth={2.5} />
          Create
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        
        {/* Search Bar Row */}
        <div className="flex gap-3 mb-8">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search groups..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669] shadow-sm font-medium text-slate-700"
            />
          </div>
          <button className="bg-[#059669] text-white p-3 rounded-xl hover:bg-[#047857] transition-colors shadow-sm flex items-center justify-center">
            <Filter size={18} />
          </button>
        </div>

        {/* Groups Count */}
        <div className="flex items-center gap-2 mb-6 text-slate-800 font-bold">
           <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
           Groups ({filteredGroups.length})
        </div>

        {/* Grid Area */}
        {isLoading ? (
          <div className="text-center py-10 text-slate-500 font-medium animate-pulse">Memuat groups dari Supabase...</div>
        ) : filteredGroups.length === 0 ? (
          <div className="text-center py-10 text-slate-500 font-medium">Tidak ada grup ditemukan.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredGroups.map(group => (
              <div key={group.id} className="border border-slate-200 rounded-2xl overflow-hidden flex flex-col bg-white shadow-sm hover:shadow-md transition-shadow">
                {/* Card Top / Header (Dark Blue) */}
                <div className="bg-[#243447] text-white p-6 relative">
                   <div className="flex justify-between items-start mb-2">
                     {/* Badge PUBLIC / PRIVATE */}
                     <div className="absolute top-4 right-10">
                        <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded border flex items-center gap-1 ${group.type === 'PUBLIC' ? 'bg-[#2d4b73] text-[#60a5fa] border-[#3b82f6]/50' : 'bg-[#452b2b] text-[#f97316] border-[#ea580c]/50'}`}>
                          0 {group.type}
                        </span>
                     </div>
                     <button className="absolute top-4 right-4 text-slate-400 hover:text-white">
                        <MoreVertical size={16} />
                     </button>
                   </div>
                   
                   <div className="flex items-center gap-4 mt-2">
                     <div className="w-14 h-14 rounded-full border border-white/20 flex flex-col items-center justify-center shrink-0">
                       <span className="font-bold text-white tracking-widest text-lg">{group.initials}</span>
                     </div>
                     <h3 className="font-bold text-lg leading-tight truncate pr-16">{group.name}</h3>
                   </div>
                </div>

                {/* Card Body */}
                <div className="p-6 flex-1 flex flex-col">
                  <p className="text-sm font-medium text-slate-500 mb-6 flex-1">
                    {group.description}
                  </p>
                  
                  <div className="flex items-center justify-between text-[13px] font-bold text-slate-400 mb-6">
                    <span>{formatDate(group.created_at)}</span>
                    <span className="flex items-center gap-1.5"><Users size={14}/> {group.member_count} Members</span>
                  </div>

                  {/* Buttons Row */}
                  <div className="flex gap-3 mt-auto">
                    <Link href={`/dashboard/support/groups/${group.id}`} className="flex-1">
                      <button className="w-full py-2.5 bg-[#059669] hover:bg-[#047857] text-white text-sm font-bold rounded-lg flex justify-center items-center gap-2 transition-colors">
                        <span className="text-white fill-current"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><path d="M9 12l2 2 4-4"></path></svg></span>
                        Details
                      </button>
                    </Link>
                    <button 
                      onClick={() => handleToggleVerify(group.id, group.is_verified)}
                      className={`w-[42px] shrink-0 border border-slate-200 rounded-lg flex items-center justify-center transition-colors shadow-sm ${group.is_verified ? 'bg-slate-100 text-[#059669]' : 'bg-white hover:bg-slate-50 text-slate-300'}`}
                    >
                      <Check size={20} strokeWidth={group.is_verified ? 3 : 2} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* Create Group Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in-95">
            <div className="flex justify-between items-center p-5 border-b border-slate-100">
               <h3 className="font-bold text-lg text-slate-800">Create New Group</h3>
               <button onClick={() => setIsCreateModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <X size={20} />
               </button>
            </div>
            
            <div className="p-6 overflow-y-auto space-y-5 custom-scrollbar">
               {/* Forms (Mocks) */}
               <div className="space-y-1">
                 <div className="flex justify-between">
                   <label className="text-xs font-bold text-slate-800">Group Name</label>
                   <span className="text-[10px] font-bold text-slate-400">0/50 characters</span>
                 </div>
                 <input type="text" placeholder="Group name..." className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669] outline-none" />
               </div>

               <div className="space-y-1">
                 <label className="text-xs font-bold text-slate-800">Category</label>
                 <select className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669] outline-none appearance-none bg-white font-medium text-slate-600">
                   <option value="">Select Category...</option>
                   <option>Kantor</option><option>Keluarga</option><option>Komunitas</option>
                   <option>Lainnya</option><option>Masjid</option><option>Pesantren</option>
                   <option>Sekolah</option><option>Umum</option>
                 </select>
               </div>

               <div className="space-y-1">
                 <label className="text-xs font-bold text-slate-800">Country</label>
                 <select className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm font-medium text-slate-500 outline-none text-center bg-white"><option>Select Country</option></select>
               </div>
               
               <div className="space-y-1">
                 <label className="text-xs font-bold text-slate-800">Province</label>
                 <select className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm font-medium text-slate-500 outline-none text-center bg-white"><option>Select Province</option></select>
               </div>
               
               <div className="space-y-1">
                 <label className="text-xs font-bold text-slate-800">City</label>
                 <select className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm font-medium text-slate-500 outline-none text-center bg-white"><option>Select City</option></select>
               </div>

               <div className="space-y-2 pt-2">
                 <label className="text-xs font-bold text-slate-800">Type</label>
                 <div className="flex gap-4">
                   <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 cursor-pointer">
                     <input type="radio" name="g_type" className="w-4 h-4 text-[#059669] focus:ring-[#059669]" defaultChecked /> Public
                   </label>
                   <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 cursor-pointer">
                     <input type="radio" name="g_type" className="w-4 h-4 text-[#059669] focus:ring-[#059669]" /> Private
                   </label>
                   <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 cursor-pointer">
                     <input type="radio" name="g_type" className="w-4 h-4 text-[#059669] focus:ring-[#059669]" /> Secret
                   </label>
                 </div>
               </div>

               <div className="space-y-1 pt-2">
                 <div className="flex justify-between">
                   <label className="text-xs font-bold text-slate-800">Description (Optional)</label>
                   <span className="text-[10px] font-bold text-slate-400">0/500 characters</span>
                 </div>
                 <textarea placeholder="Group description..." className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm min-h-[80px] focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669] outline-none font-medium"></textarea>
               </div>

               <div className="space-y-1 pt-2">
                 <label className="text-xs font-bold text-slate-800">Profile Photo (Optional)</label>
                 <div className="border border-slate-200 rounded-xl px-4 py-2 flex items-center gap-3 bg-white">
                   <button className="bg-slate-100 text-slate-400 text-xs font-bold px-3 py-1.5 rounded-lg border border-slate-200">Choose File</button>
                   <span className="text-sm font-medium text-slate-400">No file chosen</span>
                 </div>
               </div>
            </div>

            <div className="p-5 border-t border-slate-100 flex gap-3 bg-slate-50">
               <button onClick={() => setIsCreateModalOpen(false)} className="flex-1 py-2.5 rounded-full text-sm font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-100 transition-colors shadow-sm">
                 Cancel
               </button>
               <button onClick={() => setIsCreateModalOpen(false)} className="flex-1 py-2.5 rounded-full text-sm font-bold text-white bg-[#059669] hover:bg-[#047857] transition-colors shadow-sm">
                 Create Group
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
