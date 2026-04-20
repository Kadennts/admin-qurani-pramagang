"use client";

import { useState } from "react";
import { Plus, Search, Filter, Pencil, Trash2, MapPin, Building, ChevronLeft, ChevronRight, X } from "lucide-react";

const MOCK_COUNTRIES = [
  { id: 1, name: "Indonesia", iso2: "ID", iso3: "IDN", phone: "+62", region: "Asia", states: 38, cities: 514 },
  { id: 2, name: "Malaysia", iso2: "MY", iso3: "MYS", phone: "+60", region: "Asia", states: 13, cities: 157 },
  { id: 3, name: "Saudi Arabia", iso2: "SA", iso3: "SAU", phone: "+966", region: "Asia", states: 13, cities: 118 },
  { id: 4, name: "Egypt", iso2: "EG", iso3: "EGY", phone: "+20", region: "Africa", states: 27, cities: 200 },
  { id: 5, name: "Pakistan", iso2: "PK", iso3: "PAK", phone: "+92", region: "Asia", states: 8, cities: 170 },
  { id: 6, name: "Bangladesh", iso2: "BD", iso3: "BGD", phone: "+880", region: "Asia", states: 8, cities: 64 },
  { id: 7, name: "Turkey", iso2: "TR", iso3: "TUR", phone: "+90", region: "Asia", states: 81, cities: 922 },
  { id: 8, name: "United Arab Emirates", iso2: "AE", iso3: "ARE", phone: "+971", region: "Asia", states: 7, cities: 35 },
  { id: 9, name: "Qatar", iso2: "QA", iso3: "QAT", phone: "+974", region: "Asia", states: 8, cities: 20 },
  { id: 10, name: "United Kingdom", iso2: "GB", iso3: "GBR", phone: "+44", region: "Europe", states: 4, cities: 69 },
];

export default function CountriesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');

  const openCreateModal = () => {
    setModalMode('create');
    setIsModalOpen(true);
  };

  const openEditModal = () => {
    setModalMode('edit');
    setIsModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold text-slate-900">Countries</h1>
        <button onClick={openCreateModal} className="bg-[#059669] hover:bg-[#047857] text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors">
          <Plus size={18} />
          Create
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search by name, ISO code..." 
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669]"
          />
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
                <th className="px-6 py-4 rounded-tl-xl">ID</th>
                <th className="px-6 py-4">Country</th>
                <th className="px-6 py-4">Phone</th>
                <th className="px-6 py-4">Region</th>
                <th className="px-6 py-4">States</th>
                <th className="px-6 py-4">Cities</th>
                <th className="px-6 py-4">ISO2</th>
                <th className="px-6 py-4">ISO3</th>
                <th className="px-6 py-4 rounded-tr-xl">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {MOCK_COUNTRIES.map((item, i) => (
                <tr key={i} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 text-slate-500 font-medium">#{item.id}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 font-bold flex items-center justify-center text-xs shrink-0">
                        {item.iso2}
                      </div>
                      <span className="font-semibold text-slate-800">{item.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-600 font-medium">{item.phone}</td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-slate-100 text-slate-500 rounded-full text-xs font-semibold">
                      {item.region}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-emerald-600 font-semibold">
                      <MapPin size={14} /> {item.states}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-blue-600 font-semibold">
                      <Building size={14} /> {item.cities}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{item.iso2}</td>
                  <td className="px-6 py-4 text-slate-600 font-medium">{item.iso3}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                       <button onClick={openEditModal} className="bg-[#059669] hover:bg-[#047857] text-white px-2.5 py-1.5 rounded text-xs font-medium flex items-center gap-1 transition-colors">
                          <Pencil size={12} /> Edit
                       </button>
                       <button className="bg-[#059669] hover:bg-emerald-800 text-white px-2.5 py-1.5 rounded text-xs font-medium flex items-center gap-1 transition-colors">
                          <Trash2 size={12} /> Delete
                       </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-center gap-2 text-sm font-medium">
          <button className="text-slate-400 flex items-center gap-1 hover:text-slate-600 px-2 cursor-not-allowed">
            <ChevronLeft size={16} /> Previous
          </button>
          <button className="w-8 h-8 rounded bg-[#059669] text-white flex items-center justify-center">1</button>
          <button className="w-8 h-8 rounded text-slate-600 hover:bg-slate-100 flex items-center justify-center">2</button>
          <button className="w-8 h-8 rounded text-slate-600 hover:bg-slate-100 flex items-center justify-center">3</button>
          <button className="w-8 h-8 rounded text-slate-600 hover:bg-slate-100 flex items-center justify-center">4</button>
          <button className="w-8 h-8 rounded text-slate-600 hover:bg-slate-100 flex items-center justify-center">5</button>
          <button className="text-slate-600 flex items-center gap-1 hover:text-slate-900 px-2">
            Next <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-6 py-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">
                {modalMode === 'create' ? 'Create New Country' : 'Edit Country'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            
            {/* Modal Body / Form */}
            <div className="px-6 py-4 space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-800">Country Name <span className="text-red-500">*</span></label>
                <input type="text" placeholder="e.g. Indonesia" className="w-full h-11 px-3 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669] transition-all" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-800">ISO2 Code <span className="text-red-500">*</span></label>
                  <input type="text" placeholder="e.g. ID" className="w-full h-11 px-3 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669] transition-all" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-800">ISO3 Code <span className="text-red-500">*</span></label>
                  <input type="text" placeholder="e.g. IDN" className="w-full h-11 px-3 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669] transition-all" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-800">Phone Code <span className="text-red-500">*</span></label>
                  <input type="text" placeholder="e.g. +62" className="w-full h-11 px-3 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669] transition-all" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-800">Currency <span className="text-red-500">*</span></label>
                  <input type="text" placeholder="e.g. IDR" className="w-full h-11 px-3 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669] transition-all" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-800">Capital <span className="text-red-500">*</span></label>
                  <input type="text" placeholder="e.g. Jakarta" className="w-full h-11 px-3 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669] transition-all" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-800">Region <span className="text-red-500">*</span></label>
                  <select className="w-full h-11 px-3 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669] transition-all text-slate-500 appearance-none">
                     <option>Select region</option>
                     <option>Asia</option>
                     <option>Africa</option>
                     <option>Europe</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-800">Subregion</label>
                <input type="text" placeholder="e.g. South-Eastern Asia" className="w-full h-11 px-3 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669] transition-all" />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 flex items-center justify-end gap-3 mt-4">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded-lg text-sm font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button className="px-4 py-2 rounded-lg text-sm font-bold text-white bg-[#059669] hover:bg-[#047857] transition-colors shadow-sm">
                Save
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
