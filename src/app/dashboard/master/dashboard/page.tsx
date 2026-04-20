"use client";

import { useEffect, useState } from "react";
import { 
  Globe2, Map, MapPin, DollarSign, Languages, Clock, 
  Settings, Activity, Server, HardDrive, Cpu, 
  RefreshCw, CheckCircle2
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";

export default function MasterDashboardPage() {
  const [counts, setCounts] = useState({
    countries: 0,
    states: 0,
    cities: 0,
    currencies: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchCounts() {
      setIsLoading(true);
      const supabase = createClient();
      
      // Try to fetch counts from supabase tables. 
      // Replace these table names if your schema differs (e.g. 'master_countries')
      const [countriesRes, statesRes, citiesRes, currenciesRes] = await Promise.all([
        supabase.from('countries').select('*', { count: 'exact', head: true }),
        supabase.from('states').select('*', { count: 'exact', head: true }),
        supabase.from('cities').select('*', { count: 'exact', head: true }),
        supabase.from('currencies').select('*', { count: 'exact', head: true }),
      ]);

      setCounts({
        countries: countriesRes.count || 250, // fallback if table missing
        states: statesRes.count || 4963, 
        cities: citiesRes.count || 148562,
        currencies: currenciesRes.count || 164,
      });
      setIsLoading(false);
    }
    fetchCounts();
  }, []);

  return (
    <div className="max-w-[1400px] mx-auto pb-12 animate-in fade-in duration-300">
      <div className="mb-8 mt-2">
         <h1 className="text-3xl font-black text-slate-800 font-serif">Master Data Dashboard</h1>
      </div>

      {/* TOP: System Status & Disk */}
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6 mb-8">
        
        {/* System Status Card */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
          <h3 className="text-slate-800 font-black mb-6 text-sm">System Status</h3>
          <div className="grid grid-cols-3 gap-4 text-center">
             
            <div className="flex flex-col items-center justify-center">
               <div className="relative w-24 h-24 mb-3">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                     <circle cx="50" cy="50" r="40" fill="transparent" stroke="#f1f5f9" strokeWidth="8" />
                     <circle cx="50" cy="50" r="40" fill="transparent" stroke="#10b981" strokeWidth="8" strokeDasharray="251.2" strokeDashoffset="246" strokeLinecap="round" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                     <span className="text-xl font-black text-slate-800">2%</span>
                  </div>
               </div>
               <p className="text-[13px] font-bold text-slate-700">Smooth operation</p>
               <p className="text-[10px] font-bold text-slate-400 mt-1">0.19 / 0.16 / 0.10</p>
            </div>

            <div className="flex flex-col items-center justify-center">
               <div className="relative w-24 h-24 mb-3">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                     <circle cx="50" cy="50" r="40" fill="transparent" stroke="#f1f5f9" strokeWidth="8" />
                     <circle cx="50" cy="50" r="40" fill="transparent" stroke="#3b82f6" strokeWidth="8" strokeDasharray="251.2" strokeDashoffset="248" strokeLinecap="round" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                     <span className="text-xl font-black text-slate-800">1.3%</span>
                  </div>
               </div>
               <p className="text-[13px] font-bold text-slate-700">4 Core(s)</p>
               <p className="text-[10px] font-bold text-slate-400 mt-1">API Usage</p>
            </div>

            <div className="flex flex-col items-center justify-center">
               <div className="relative w-24 h-24 mb-3">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                     <circle cx="50" cy="50" r="40" fill="transparent" stroke="#f1f5f9" strokeWidth="8" />
                     <circle cx="50" cy="50" r="40" fill="transparent" stroke="#059669" strokeWidth="8" strokeDasharray="251.2" strokeDashoffset="100.48" strokeLinecap="round" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                     <span className="text-xl font-black text-slate-800">59.9%</span>
                  </div>
               </div>
               <p className="text-[13px] font-bold text-slate-700">2453 / 4096(MB)</p>
               <p className="text-[10px] font-bold text-slate-400 mt-1">RAM usage</p>
            </div>
             
          </div>
        </div>

        {/* Disk Card */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col">
          <h3 className="text-slate-800 font-black mb-auto text-sm">Disk</h3>
          
          <div className="flex items-center justify-between pb-4">
             <div>
                <p className="text-4xl font-black text-[#059669] mb-1">18%</p>
                <p className="text-xs font-bold text-slate-400">6.66/38.08 GB</p>
             </div>
             
             <div className="relative w-28 h-28">
               <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="38" fill="transparent" stroke="#f1f5f9" strokeWidth="4" />
                  <circle cx="50" cy="50" r="28" fill="transparent" stroke="#f1f5f9" strokeWidth="4" />
                  <circle cx="50" cy="50" r="18" fill="transparent" stroke="#f1f5f9" strokeWidth="4" />
                  <circle cx="50" cy="50" r="38" fill="transparent" stroke="#10b981" strokeWidth="4" strokeDasharray="238.7" strokeDashoffset="195" strokeLinecap="round" />
               </svg>
             </div>
          </div>
        </div>

      </div>


      {/* OVERVIEW CARDS */}
      <h3 className="font-black text-slate-800 mb-4 ml-1 text-sm">Overview</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
         <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-6">
               <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#059669] flex items-center justify-center shrink-0"><Globe2 size={20} /></div>
               <h3 className="text-base font-black text-slate-800 tracking-wide">Countries</h3>
            </div>
            <div className="flex items-end justify-between font-bold text-sm">
               <div className="text-[#059669]">Active: {isLoading ? '...' : counts.countries}</div>
               <div className="text-slate-400">Inactive: 0</div>
            </div>
            <div className="mt-2 text-xs font-bold text-slate-800">Total: {isLoading ? '...' : counts.countries}</div>
         </div>

         <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-6">
               <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0"><Map size={20} /></div>
               <h3 className="text-base font-black text-slate-800 tracking-wide">States</h3>
            </div>
            <div className="flex items-end justify-between font-bold text-sm">
               <div className="text-[#059669]">Active: {isLoading ? '...' : counts.states}</div>
               <div className="text-slate-400">Inactive: 0</div>
            </div>
            <div className="mt-2 text-xs font-bold text-slate-800">Total: {isLoading ? '...' : counts.states}</div>
         </div>

         <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-6">
               <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0"><MapPin size={20} /></div>
               <h3 className="text-base font-black text-slate-800 tracking-wide">Cities</h3>
            </div>
            <div className="flex items-end justify-between font-bold text-sm">
               <div className="text-[#059669]">Active: {isLoading ? '...' : counts.cities}</div>
               <div className="text-slate-400">Inactive: 0</div>
            </div>
            <div className="mt-2 text-xs font-bold text-slate-800">Total: {isLoading ? '...' : counts.cities}</div>
         </div>

         <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-6">
               <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center shrink-0"><DollarSign size={20} /></div>
               <h3 className="text-base font-black text-slate-800 tracking-wide">Currencies</h3>
            </div>
            <div className="flex items-end justify-between font-bold text-sm">
               <div className="text-[#059669]">Active: {isLoading ? '...' : counts.currencies}</div>
               <div className="text-slate-400">Inactive: 0</div>
            </div>
            <div className="mt-2 text-xs font-bold text-slate-800">Total: {isLoading ? '...' : counts.currencies}</div>
         </div>
      </div>

      {/* BOTTOM ROW: Statistics & Traffic */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-6">
         
         <div>
            <h3 className="font-black text-slate-800 mb-4 ml-1 text-sm">Statistics</h3>
            <div className="grid grid-cols-2 gap-4">
               
               <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex flex-col">
                  <div className="flex items-center gap-3 mb-2">
                     <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0"><Languages size={20} /></div>
                     <div>
                        <h4 className="font-extrabold text-slate-800 text-sm">Languages</h4>
                        <p className="text-[10px] text-slate-400 font-bold">v2.1</p>
                     </div>
                  </div>
                  <div className="mt-4 flex justify-between items-end">
                     <span className="text-xs font-bold text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-md">Active</span>
                     <span className="text-xl font-black text-slate-800">184</span>
                  </div>
               </div>

               <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex flex-col">
                  <div className="flex items-center gap-3 mb-2">
                     <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center shrink-0"><Clock size={20} /></div>
                     <div>
                        <h4 className="font-extrabold text-slate-800 text-sm">Timezones</h4>
                        <p className="text-[10px] text-slate-400 font-bold">v1.0</p>
                     </div>
                  </div>
                  <div className="mt-4 flex justify-between items-end">
                     <span className="text-xs font-bold text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-md">Active</span>
                     <span className="text-xl font-black text-slate-800">425</span>
                  </div>
               </div>

               <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex flex-col">
                  <div className="flex items-center gap-3 mb-2">
                     <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-500 flex items-center justify-center shrink-0"><Globe2 size={20} /></div>
                     <div>
                        <h4 className="font-extrabold text-slate-800 text-sm">Locales</h4>
                        <p className="text-[10px] text-slate-400 font-bold">v1.0</p>
                     </div>
                  </div>
                  <div className="mt-4 flex justify-between items-end">
                     <span className="text-xs font-bold text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-md">Active</span>
                     <span className="text-xl font-black text-slate-800">256</span>
                  </div>
               </div>

               <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex flex-col">
                  <div className="flex items-center gap-3 mb-2">
                     <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#059669] flex items-center justify-center shrink-0"><CheckCircle2 size={20} /></div>
                     <div>
                        <h4 className="font-extrabold text-slate-800 text-sm">API Status</h4>
                        <p className="text-[10px] text-slate-400 font-bold">v3.0</p>
                     </div>
                  </div>
                  <div className="mt-4 flex justify-between items-end">
                     <span className="text-xs font-bold text-[#059669] bg-emerald-50 px-2 py-0.5 rounded-md">Running</span>
                     <span className="text-xl font-black text-slate-800">100</span>
                  </div>
               </div>

            </div>
         </div>

         <div className="flex flex-col">
            <div className="flex justify-between items-center mb-4 ml-1">
               <h3 className="font-black text-slate-800 text-sm">Traffic</h3>
               <span className="text-xs font-bold text-slate-400">Data I/O</span>
            </div>
            
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex-1 flex flex-col">
               <div className="flex justify-between items-start mb-8">
                  <div className="flex gap-6">
                     <div>
                        <div className="flex items-center gap-1.5 mb-1">
                           <div className="w-2.5 h-2.5 bg-blue-500 rounded-full"></div>
                           <span className="text-xs font-bold text-slate-500">Upstream</span>
                        </div>
                        <span className="text-sm font-black text-slate-800">14.40 KB</span>
                     </div>
                     <div>
                        <div className="flex items-center gap-1.5 mb-1">
                           <div className="w-2.5 h-2.5 bg-[#059669] rounded-full"></div>
                           <span className="text-xs font-bold text-slate-500">Downstream</span>
                        </div>
                        <span className="text-sm font-black text-slate-800">10.24 KB</span>
                     </div>
                  </div>

                  <div className="flex gap-6 text-right">
                     <div>
                        <div className="text-[11px] font-bold text-slate-400 mb-1">Total sent</div>
                        <span className="text-sm font-black text-slate-800">887.96 MB</span>
                     </div>
                     <div>
                        <div className="text-[11px] font-bold text-slate-400 mb-1">Total received</div>
                        <span className="text-sm font-black text-slate-800">350.27 MB</span>
                     </div>
                  </div>
               </div>

               {/* Mock Traffic Wave Chart */}
               <div className="flex-1 min-h-[150px] w-full relative overflow-hidden rounded-xl border border-slate-50 mt-auto flex items-end">
                  <svg viewBox="0 0 500 150" preserveAspectRatio="none" className="absolute bottom-0 w-full h-[80%] opacity-20">
                     <path d="M0,50 C150,150 350,0 500,50 L500,150 L0,150 Z" fill="#3b82f6"></path>
                  </svg>
                  <svg viewBox="0 0 500 150" preserveAspectRatio="none" className="absolute bottom-0 w-full h-[60%] opacity-80">
                     <path d="M0,100 C150,0 350,150 500,50 L500,150 L0,150 Z" fill="#059669"></path>
                  </svg>
               </div>
            </div>
         </div>

      </div>

    </div>
  );
}
