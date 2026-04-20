"use client";

import { useEffect, useState } from "react";
import { Users, Shield, Activity, UserX } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    admins: 0,
    active: 0,
    blocked: 0,
  });

  const [genderData, setGenderData] = useState({ male: 0, unknown: 0 });
  
  // Dummy location arrays based on actual total users to show "Unknown" naturally
  const [countriesData, setCountriesData] = useState<any[]>([]);
  const [statesData, setStatesData] = useState<any[]>([]);
  const [citiesData, setCitiesData] = useState<any[]>([]);
  
  const [isLoading, setIsLoading] = useState(true);

  const supabase = createClient();

  useEffect(() => {
    async function fetchStats() {
      setIsLoading(true);
      // Mengambil data murni dari database Anda
      const { data: users, error } = await supabase.from('user_profiles').select('*');
      
      if (!error && users) {
        const total = users.length;
        const admins = users.filter(u => u.role === 'admin').length;
        // Jika kolom status ada, kita hitung. Jika tak ada, asumsikan semua Active untuk sementara
        const active = users.filter(u => u.status === 'Active').length || total;
        const blocked = users.filter(u => u.status === 'Blocked').length;

        setStats({ totalUsers: total, admins, active, blocked });

        // Chart Data (Karena saat ini tabel user_profiles Anda tidak punya kolom gender/country, maka semuanya masuk ke Unknown)
        // Jika nanti Anda menambahkan kolom location/gender, logic ini akan otomatis menghitung yang punya data!
        const maleCount = users.filter(u => u.gender === 'Male').length;
        const unknownGender = total - maleCount;
        setGenderData({ male: maleCount, unknown: unknownGender });

        // Location Mocks berdasarkan total actual users
        setCountriesData([
          { name: 'Unknown', count: total },
          { name: 'Indonesia', count: 0 },
          { name: 'United Kingdom', count: 0 },
          { name: 'United States', count: 0 },
        ].sort((a,b) => b.count - a.count));

        setStatesData([
          { name: 'Unknown', count: total },
          { name: 'Jawa Timur', count: 0 },
          { name: 'DI Yogyakarta', count: 0 },
          { name: 'Jawa Tengah', count: 0 },
          { name: 'Gorontalo', count: 0 },
        ].sort((a,b) => b.count - a.count));

        setCitiesData([
          { name: 'Unknown', count: total },
          { name: 'Malang', count: 0 },
          { name: 'Banyuwangi', count: 0 },
          { name: 'Surakarta', count: 0 },
        ].sort((a,b) => b.count - a.count));
      }
      
      setIsLoading(false);
    }
    
    fetchStats();
  }, [supabase]);

  // SVG Donut Chart Logic
  const totalGender = genderData.male + genderData.unknown;
  const malePercent = totalGender === 0 ? 0 : (genderData.male / totalGender) * 100;
  const unknownPercent = totalGender === 0 ? 100 : (genderData.unknown / totalGender) * 100;
  
  // R = 15.91549430918954 turns circumference into exactly 100, so stroke-dasharray maps 1:1 with percentage
  const radius = 15.91549430918954; 

  // Helper function for horizontal bar charts
  const BarChart = ({ title, subtitle, data, showScroll = false }: { title: string, subtitle: string, data: any[], showScroll?: boolean }) => {
    const maxCount = Math.max(...data.map(d => d.count), 1); // prevent division by zero

    return (
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col h-[400px]">
        <div className="mb-6">
          <h3 className="text-lg font-bold text-slate-800">{title}</h3>
          <p className="text-sm text-slate-500">{subtitle}</p>
        </div>
        <div className={`flex-1 pr-2 ${showScroll ? 'overflow-y-auto custom-scrollbar' : ''}`}>
          <div className="space-y-4">
            {data.map((item, idx) => (
              <div key={idx} className="flex items-center gap-4">
                <div className="w-24 text-right text-xs font-semibold text-slate-500 truncate shrink-0">
                  {item.name}
                </div>
                <div className="flex-1 h-3.5 bg-transparent rounded-full flex items-center">
                  <div 
                    className="h-full bg-[#059669] rounded-sm transition-all duration-1000 ease-out"
                    style={{ width: `${(item.count / maxCount) * 100}%`, minWidth: item.count > 0 ? '4px' : '0' }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Simplified axis mock (0, 6, 12, 18...) */}
        <div className="mt-4 pt-2 border-t border-slate-100 flex justify-between ml-28 text-xs font-medium text-slate-400">
          <span>0</span>
          <span>{Math.ceil(maxCount / 4)}</span>
          <span>{Math.ceil(maxCount / 2)}</span>
          <span>{Math.ceil((maxCount / 4) * 3)}</span>
          <span>{maxCount}</span>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="h-[80vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      
      {/* CSS Injection via style tag for custom scrollbar (mac-like) in cities chart */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #cbd5e1; border-radius: 20px; }
      `}} />

      {/* KPI Cards Layer */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-500 mb-1">Users</p>
            <h2 className="text-3xl font-bold text-[#059669]">{stats.totalUsers}</h2>
          </div>
          <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-[#059669]">
            <Users size={20} strokeWidth={2} />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-500 mb-1">Admins</p>
            <h2 className="text-3xl font-bold text-[#059669]">{stats.admins}</h2>
          </div>
          <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-[#059669]">
            <Shield size={20} strokeWidth={2} />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-500 mb-1">Active Users</p>
            <h2 className="text-3xl font-bold text-[#059669]">{stats.active}</h2>
          </div>
          <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-[#059669]">
            <Activity size={20} strokeWidth={2} />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-500 mb-1">Blocked Users</p>
            <h2 className="text-3xl font-bold text-[#059669]">{stats.blocked}</h2>
          </div>
          <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-[#059669]">
            <UserX size={20} strokeWidth={2} />
          </div>
        </div>

      </div>

      {/* Grid Charts Server */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Gender Donut Chart */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col items-center justify-between h-[400px]">
          <div className="w-full text-left mb-4">
            <h3 className="text-lg font-bold text-slate-800">Gender</h3>
            <p className="text-sm text-slate-500">User distribution</p>
          </div>
          
          <div className="relative flex-1 w-full max-h-[220px] flex justify-center items-center">
             <svg viewBox="0 0 42 42" className="w-[200px] h-[200px] -rotate-90 drop-shadow-sm">
                {/* Unknown Arc (Base grey) */}
                <circle
                  cx="21" cy="21" r={radius}
                  fill="transparent"
                  stroke="#8ca0b1"
                  strokeWidth="8"
                  strokeDasharray={`${unknownPercent} ${100 - unknownPercent}`}
                  strokeDashoffset="25"
                />
                
                {/* Male Arc (Green) */}
                {malePercent > 0 && (
                  <circle
                    cx="21" cy="21" r={radius}
                    fill="transparent"
                    stroke="#059669"
                    strokeWidth="8"
                    strokeDasharray={`${malePercent} ${100 - malePercent}`}
                    strokeDashoffset="100" 
                  />
                )}
             </svg>
          </div>
          
          <div className="flex items-center gap-6 mt-6">
             <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#059669]"></span>
                <span className="text-xs font-bold text-slate-600">Male</span>
             </div>
             <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#8ca0b1]"></span>
                <span className="text-xs font-bold text-slate-600">Unknown</span>
             </div>
          </div>
        </div>

        {/* Top Countries */}
        <BarChart title="Top Countries" subtitle="Top locations by users" data={countriesData} />

        {/* Top States */}
        <BarChart title="Top States" subtitle="Top locations by users" data={statesData} />

        {/* Top Cities */}
        <BarChart title="Top Cities" subtitle="Top locations by users" data={citiesData} showScroll={true} />

      </div>

    </div>
  );
}
