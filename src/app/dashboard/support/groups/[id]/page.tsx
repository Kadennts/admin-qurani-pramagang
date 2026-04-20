"use client";

import { useEffect, useState, use } from "react";
import { createClient } from "@/utils/supabase/client";
import { Search, Users, Globe, Settings, MoreVertical } from "lucide-react";
import Link from "next/link";

export default function GroupDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const { id } = unwrappedParams;

  const [group, setGroup] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const supabase = createClient();

  // Mock members data (seperti pesan User: "isi terserah saja seperti member di gambar 5 itu jadikan dummy data saja")
  const allMembers = [
    { id: 1, name: "Lisandro Hegmann", role: "Member", initial: "L" },
    { id: 2, name: "Bernhard O'Reilly", role: "Member", initial: "B" },
    { id: 3, name: "Fanny Lakin", role: "Member", initial: "F" },
    { id: 4, name: "Fatkul Amri", role: "Admin", initial: "F" },
  ];

  useEffect(() => {
    async function fetchGroup() {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('support_groups')
        .select('*')
        .eq('id', id)
        .single();
      
      if (data) setGroup(data);
      setIsLoading(false);
    }
    fetchGroup();
  }, [id, supabase]);

  if (isLoading) {
    return <div className="text-center py-20 font-bold text-slate-500 animate-pulse">Memuat details grup...</div>;
  }

  if (!group) {
    return <div className="text-center py-20 font-bold text-slate-500">Grup tidak ditemukan.</div>;
  }

  // Format date to "04 Okt 2025" style
  const formatDate = (dateStr: string) => {
    if (!dateStr) return "01 Jan 1";
    const date = new Date(dateStr);
    const dd = String(date.getDate()).padStart(2, '0');
    const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agt", "Sep", "Okt", "Nov", "Des"];
    const mmm = months[date.getMonth()];
    const yyyy = date.getFullYear();
    if (yyyy < 2024) return `01 Jan 1`;
    return `${dd} ${mmm} ${yyyy}`;
  };

  const groupMembersCount = group.member_count === 0 ? 0 : group.member_count;
  const dummyMembersToDisplay = groupMembersCount === 0 ? [] : allMembers.slice(0, groupMembersCount);

  const filteredMembers = searchQuery.trim() !== ""
    ? dummyMembersToDisplay.filter(m => m.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : dummyMembersToDisplay;

  return (
    <div className="max-w-[1000px] mx-auto space-y-6 pb-12">
      
      {/* Hero Banner Area */}
      <div className="bg-[#f0fdf4] border border-[#dcfce7] rounded-3xl p-8 relative flex items-start gap-6 shadow-sm">
        <button className="absolute top-6 right-6 text-slate-400 hover:text-slate-600">
           <MoreVertical size={20} />
        </button>
        
         <div className="w-24 h-24 rounded-full bg-[#059669] shrink-0 flex items-center justify-center text-white text-3xl font-bold tracking-wider shadow-sm border-4 border-white">
           {group.initials}
         </div>
         
         <div className="flex flex-col pt-1">
           <h1 className="text-2xl font-extrabold text-[#064e3b] mb-2">{group.name}</h1>
           <p className="text-[#059669] font-medium text-[15px] mb-4">{group.description}</p>
           
           <div className="flex items-center gap-3">
             <div className="flex -space-x-2">
               {dummyMembersToDisplay.slice(0,3).map((m, i) => (
                 <div key={i} className="w-6 h-6 rounded-full bg-[#d1fae5] border-2 border-white flex justify-center items-center text-[8px] font-bold text-[#059669] z-10 relative">{m.initial}</div>
               ))}
             </div>
             <span className="text-xs font-bold text-[#059669] bg-white border border-[#34d399] px-3 py-1 rounded-full">{group.member_count} Members</span>
           </div>
         </div>
      </div>

      {/* 3 Stats Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex items-center justify-between">
           <div>
             <p className="text-sm font-bold text-slate-500 mb-1">Members</p>
             <h2 className="text-xl font-extrabold text-slate-800">{group.member_count}</h2>
           </div>
           <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center">
             <Users size={20} strokeWidth={2.5} />
           </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex items-center justify-between">
           <div>
             <p className="text-sm font-bold text-slate-500 mb-1">Type</p>
             <h2 className="text-xl font-extrabold text-slate-800 capitalize">{group.type.toLowerCase()}</h2>
           </div>
           <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center">
             <Globe size={20} strokeWidth={2.5} />
           </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex items-center justify-between">
           <div>
             <p className="text-sm font-bold text-slate-500 mb-1">Created</p>
             <h2 className="text-xl font-extrabold text-slate-800">{formatDate(group.created_at)}</h2>
           </div>
           <div className="w-10 h-10 rounded-full bg-purple-50 text-purple-500 flex items-center justify-center">
             <Settings size={20} strokeWidth={2.5} />
           </div>
        </div>
      </div>

      {/* Group Members Section */}
      <div className="pt-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-slate-800">Group Members</h2>
          <span className="text-sm font-semibold text-slate-500">{group.member_count} members</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 border-b border-slate-100 bg-slate-50/50">
            <div className="relative">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search members..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#059669]/50 shadow-sm text-slate-700 font-medium"
              />
            </div>
          </div>
          
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
            <h4 className="text-[13px] font-bold text-slate-500">Members ({dummyMembersToDisplay.length})</h4>
          </div>

          <div className="flex flex-col bg-white">
             {filteredMembers.length === 0 ? (
                <div className="text-center py-12 text-sm font-medium text-slate-400">
                   {groupMembersCount === 0 ? "This group currently has no members." : "No members found."}
                </div>
             ) : (
                filteredMembers.map((member, idx) => (
                  <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between px-6 py-4 border-b border-slate-50 hover:bg-slate-50 transition-colors last:border-none">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-[#334155] text-white flex justify-center items-center font-bold shrink-0">
                        {member.initial}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-800 text-sm">{member.name}</span>
                        <span className="text-xs font-semibold text-slate-400">{member.name}</span>
                      </div>
                    </div>
                  </div>
                ))
             )}
          </div>
        </div>
      </div>

    </div>
  );
}
