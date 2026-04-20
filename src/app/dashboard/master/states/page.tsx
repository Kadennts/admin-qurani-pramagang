"use client";

import { useState } from "react";
import { Plus, Search, Filter, Pencil, Trash2, Building, X } from "lucide-react";

const MOCK_STATES = [
  { id: 1, name: "DKI Jakarta", country: "Indonesia", cities: 5, iso: "JK", type: "province" },
  { id: 2, name: "Selangor", country: "Malaysia", cities: 12, iso: "SGR", type: "state" },
  { id: 3, name: "Makkah Region", country: "Saudi Arabia", cities: 17, iso: "02", type: "region" },
  { id: 4, name: "Cairo Governorate", country: "Egypt", cities: 16, iso: "C", type: "governorate" },
  { id: 5, name: "Punjab", country: "Pakistan", cities: 36, iso: "PB", type: "province" },
  { id: 6, name: "Dhaka Division", country: "Bangladesh", cities: 13, iso: "C", type: "division" },
  { id: 7, name: "Istanbul", country: "Turkey", cities: 39, iso: "34", type: "province" },
  { id: 8, name: "Dubai", country: "United Arab Emirates", cities: 1, iso: "DU", type: "emirate" },
  { id: 9, name: "Doha Municipality", country: "Qatar", cities: 1, iso: "DA", type: "municipality" },
  { id: 10, name: "England", country: "United Kingdom", cities: 51, iso: "ENG", type: "country" },
];

const COUNTRY_OPTIONS = [
  "Indonesia",
  "Malaysia",
  "Saudi Arabia",
  "Egypt",
  "Pakistan",
  "Bangladesh",
  "Turkey",
  "United Arab Emirates",
  "Qatar",
  "United Kingdom",
];

export default function StatesPage() {
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
        <h1 className="text-4xl font-bold text-slate-900">States</h1>
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
            placeholder="Search by name..." 
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
                <th className="px-6 py-4">State Name</th>
                <th className="px-6 py-4">Country</th>
                <th className="px-6 py-4">Cities</th>
                <th className="px-6 py-4">ISO Code</th>
                <th className="px-6 py-4 rounded-tr-xl">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {MOCK_STATES.map((item, i) => (
                <tr key={i} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 text-slate-500 font-medium">#{item.id}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 font-bold flex items-center justify-center text-xs shrink-0">
                        {item.name.substring(0, 2).toUpperCase()}
                      </div>
                      <span className="font-semibold text-slate-800">{item.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-600 font-medium flex items-center gap-2">
                     <span className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded text-xs">{item.country.substring(0,2).toUpperCase()}</span>
                     {item.country}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-blue-600 font-semibold">
                      <Building size={14} /> {item.cities}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-600 font-medium">{item.iso}</td>
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

        {/* Pagination mock */}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-6 py-4 flex items-center justify-between border-b border-slate-100">
              <div>
                <h3 className="text-lg font-bold text-slate-900">{modalMode === 'create' ? 'Create New State' : 'Edit State'}</h3>
                <p className="text-xs text-slate-500 font-medium">Add a new state or province to the system.</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            
            {/* Modal Body / Form */}
            <div className="px-6 py-5 space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-800">State Name <span className="text-red-500">*</span></label>
                <input type="text" placeholder="e.g. California" className="w-full h-11 px-3 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669] transition-all" />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-800">Country <span className="text-red-500">*</span></label>
                <select className="w-full h-11 px-3 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669] transition-all text-slate-500 appearance-none">
                   <option>Select Country</option>
                   {COUNTRY_OPTIONS.map((country) => (
                     <option key={country}>{country}</option>
                   ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-800">ISO2 Code</label>
                  <input type="text" placeholder="e.g. CA" className="w-full h-11 px-3 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669] transition-all" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-800">Type</label>
                  <select className="w-full h-11 px-3 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669] transition-all text-slate-500 appearance-none">
                     <option>Select type</option>
                     <option>province</option>
                     <option>state</option>
                     <option>region</option>
                     <option>governorate</option>
                     <option>division</option>
                     <option>emirate</option>
                     <option>municipality</option>
                     <option>country</option>
                  </select>
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 flex items-center justify-end gap-3 mt-4 border-t border-slate-50">
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
