"use client";

import { useState } from "react";
import { Plus, Search, Filter, Pencil, Trash2, MapPin, X } from "lucide-react";

const MOCK_CITIES = [
  { id: 1, name: "Jakarta Selatan", state: "DKI Jakarta", country: "Indonesia", lat: "-6.2615", lng: "106.8106" },
  { id: 2, name: "Shah Alam", state: "Selangor", country: "Malaysia", lat: "3.0738", lng: "101.5183" },
  { id: 3, name: "Jeddah", state: "Makkah Region", country: "Saudi Arabia", lat: "21.5433", lng: "39.1728" },
  { id: 4, name: "Cairo", state: "Cairo Governorate", country: "Egypt", lat: "30.0444", lng: "31.2357" },
  { id: 5, name: "Lahore", state: "Punjab", country: "Pakistan", lat: "31.5204", lng: "74.3587" },
  { id: 6, name: "Dhaka", state: "Dhaka Division", country: "Bangladesh", lat: "23.8103", lng: "90.4125" },
  { id: 7, name: "Istanbul", state: "Istanbul", country: "Turkey", lat: "41.0082", lng: "28.9784" },
  { id: 8, name: "Dubai", state: "Dubai", country: "United Arab Emirates", lat: "25.2048", lng: "55.2708" },
  { id: 9, name: "Doha", state: "Doha Municipality", country: "Qatar", lat: "25.2854", lng: "51.5310" },
  { id: 10, name: "London", state: "England", country: "United Kingdom", lat: "51.5074", lng: "-0.1278" },
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

const STATE_OPTIONS = [
  "DKI Jakarta",
  "Selangor",
  "Makkah Region",
  "Cairo Governorate",
  "Punjab",
  "Dhaka Division",
  "Istanbul",
  "Dubai",
  "Doha Municipality",
  "England",
];

export default function CitiesPage() {
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
        <h1 className="text-4xl font-bold text-slate-900">Cities</h1>
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
            placeholder="Search by city name..." 
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
                <th className="px-6 py-4">City Name</th>
                <th className="px-6 py-4">State</th>
                <th className="px-6 py-4">Country</th>
                <th className="px-6 py-4">Coordinates</th>
                <th className="px-6 py-4 rounded-tr-xl">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {MOCK_CITIES.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 text-slate-500 font-medium">#{item.id}</td>
                  <td className="px-6 py-4">
                    <span className="font-semibold text-slate-800">{item.name}</span>
                  </td>
                  <td className="px-6 py-4 text-slate-600 font-medium">{item.state}</td>
                  <td className="px-6 py-4 text-slate-600 font-medium">{item.country}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col text-xs text-slate-500 bg-slate-100 px-2.5 py-1.5 rounded w-fit gap-1">
                      <div className="flex items-center gap-1"><MapPin size={10} /> {item.lat}, {item.lng}</div>
                    </div>
                  </td>
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
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-6 py-4 flex items-center justify-between border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">{modalMode === 'create' ? 'Create New City' : 'Edit City'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            
            {/* Modal Body / Form */}
            <div className="px-6 py-5 space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-800">City Name <span className="text-red-500">*</span></label>
                <input type="text" placeholder="e.g. Jakarta" className="w-full h-11 px-3 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669] transition-all" />
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

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-800">State/Province <span className="text-red-500">*</span></label>
                <select className="w-full h-11 px-3 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669] transition-all text-slate-500 appearance-none">
                   <option>Select State/Province</option>
                   {STATE_OPTIONS.map((state) => (
                     <option key={state}>{state}</option>
                   ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-800">Latitude</label>
                  <input type="text" placeholder="e.g. -7.1128" className="w-full h-11 px-3 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669] transition-all" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-800">Longitude</label>
                  <input type="text" placeholder="e.g. 112.1635" className="w-full h-11 px-3 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669] transition-all" />
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
