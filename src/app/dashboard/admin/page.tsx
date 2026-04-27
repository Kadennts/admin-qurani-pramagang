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
  const [tooltip, setTooltip] = useState<{ visible: boolean, x: number, y: number, title: string, count: number, color: string } | null>(null);
  
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
      const { data: adminsData } = await supabase.from('admin_users').select('*');
      
      if (!error && users) {
        const total = users.length;
        const admins = users.filter(u => u.role?.toLowerCase() === 'admin').length + (adminsData ? adminsData.length : 0);
        // Jika kolom status ada, kita hitung. Jika tak ada, asumsikan semua Active untuk sementara
        const active = users.filter(u => u.status === 'Active').length || total;
        const blocked = users.filter(u => u.status === 'Blocked').length;

        setStats({ totalUsers: total, admins, active, blocked });

        // Chart Data (Karena saat ini tabel user_profiles Anda tidak punya kolom gender/country, maka semuanya masuk ke Unknown)
        // Jika nanti Anda menambahkan kolom location/gender, logic ini akan otomatis menghitung yang punya data!
        const maleCount = users.filter(u => u.gender === 'Male').length;
        const unknownGender = total - maleCount;
        setGenderData({ male: maleCount, unknown: unknownGender });

        // Dynamic Location Aggregation
        const countryTally: Record<string, number> = {};
        const stateTally: Record<string, number> = {};
        const cityTally: Record<string, number> = {};

        users.forEach(u => {
           const c = u.country || 'Unknown';
           const s = u.province || 'Unknown';
           const ci = u.city || 'Unknown';
           
           countryTally[c] = (countryTally[c] || 0) + 1;
           stateTally[s] = (stateTally[s] || 0) + 1;
           cityTally[ci] = (cityTally[ci] || 0) + 1;
        });

        const toArraySorted = (tally: Record<string, number>) => 
           Object.entries(tally).map(([name, count]) => ({name, count})).sort((a,b) => b.count - a.count);

        setCountriesData(toArraySorted(countryTally).slice(0, 6));
        setStatesData(toArraySorted(stateTally).slice(0, 6));
        setCitiesData(toArraySorted(cityTally).slice(0, 6));
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
        <div className="flex-1 pr-2 overflow-y-auto" style={showScroll ? { overflowY: 'auto', scrollbarWidth: 'thin', scrollbarColor: '#cbd5e1 transparent' } as React.CSSProperties : {}}>
          <div className="space-y-4">
            {data.map((item, idx) => (
              <div 
                key={idx} 
                className="flex items-center gap-4 cursor-pointer"
                onMouseMove={(e) => setTooltip({ visible: true, x: e.clientX, y: e.clientY, title: item.name, count: item.count, color: '#059669' })}
                onMouseLeave={() => setTooltip(null)}
              >
                <div className="w-24 text-right text-xs font-semibold text-slate-500 truncate shrink-0">
                  {item.name}
                </div>
                <div className="flex-1 h-3.5 bg-transparent rounded-full flex items-center">
                  <div 
                    className="group-hover:opacity-80 h-full bg-[#059669] rounded-sm transition-all duration-1000 ease-out"
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
                  className="cursor-pointer hover:opacity-80 transition-opacity"
                  onMouseMove={(e) => setTooltip({ visible: true, x: e.clientX, y: e.clientY, title: 'Unknown', count: genderData.unknown, color: '#8ca0b1' })}
                  onMouseLeave={() => setTooltip(null)}
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
                    className="cursor-pointer hover:opacity-80 transition-opacity"
                    onMouseMove={(e) => setTooltip({ visible: true, x: e.clientX, y: e.clientY, title: 'Male', count: genderData.male, color: '#059669' })}
                    onMouseLeave={() => setTooltip(null)}
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
      
      {/* Global Tooltip */}
      {tooltip?.visible && (
        <div 
          className="fixed z-50 pointer-events-none bg-white border border-slate-200 rounded-lg shadow-xl p-3 text-xs flex gap-3 transition-opacity"
          style={{ left: tooltip.x + 15, top: tooltip.y + 15 }}
        >
          <div className="w-1 rounded-full" style={{ backgroundColor: tooltip.color }} />
          <div className="flex flex-col min-w-[70px]">
             <span className="font-bold text-slate-700">{tooltip.title}</span>
             <div className="flex justify-between items-center gap-6 mt-1.5">
                <span className="text-slate-500 font-medium">Users</span>
                <span className="font-extrabold text-slate-800">{tooltip.count}</span>
             </div>
          </div>
        </div>
      )}

    </div>
  );
}
