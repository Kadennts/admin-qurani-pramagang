"use client";

import { useState, useEffect } from "react";
import { Plus, Search, Filter, Pencil, Trash2, ChevronLeft, ChevronRight, X, Loader2 } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

export default function LanguagesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [languages, setLanguages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const supabase = createClient();

  useEffect(() => {
    async function fetchLanguages() {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('languages')
        .select('*')
        .order('id', { ascending: true });
      
      if (data) {
        setLanguages(data);
      }
      setIsLoading(false);
    }
    
    fetchLanguages();
  }, [supabase]);

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
        <h1 className="text-4xl font-bold text-slate-900">Languages</h1>
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
            placeholder="Search by name, code, or language family..." 
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
                <th className="px-6 py-4 rounded-tl-xl">Name</th>
                <th className="px-6 py-4">Native Name</th>
                <th className="px-6 py-4">Code</th>
                <th className="px-6 py-4">Direction</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 rounded-tr-xl w-32">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    <Loader2 className="animate-spin mx-auto mb-2 text-emerald-600" size={24} />
                    Loading languages from Supabase...
                  </td>
                </tr>
              ) : languages.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500 font-medium">
                    No languages found.
                  </td>
                </tr>
              ) : (
                languages.map((lang) => (
                  <tr key={lang.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 font-bold flex items-center justify-center text-xs shrink-0 uppercase">
                          {lang.code.substring(0, 2)}
                        </div>
                        <span className="font-bold text-slate-800">{lang.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-400 font-medium">{lang.native_name || '—'}</td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-[#059669] uppercase">{lang.code}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded text-xs font-bold uppercase">{lang.direction || 'LTR'}</span>
                    </td>
                    <td className="px-6 py-4">
                      {lang.status === 'Active' ? (
                        <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-xs font-bold">Active</span>
                      ) : (
                        <span className="font-semibold text-slate-400">Inactive</span>
                      )}
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
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination mock */}
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

      {/* Modal Dialog Form */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="px-6 py-4 flex items-center justify-between border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">
                {modalMode === 'create' ? 'Create New Language' : 'Edit Language'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            {/* Form */}
            <div className="px-6 py-5 space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-800">Language Name <span className="text-red-500">*</span></label>
                <input type="text" placeholder="e.g. English" className="w-full h-11 px-3 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669] transition-all" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-800">Native Name</label>
                  <input type="text" placeholder="e.g. English" className="w-full h-11 px-3 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669] transition-all" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-800">Code <span className="text-red-500">*</span></label>
                  <input type="text" placeholder="e.g. EN" className="w-full h-11 px-3 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669] transition-all uppercase" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-800">Direction</label>
                  <select className="w-full h-11 px-3 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669] transition-all bg-slate-50 text-slate-700">
                     <option>LTR</option>
                     <option>RTL</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-800">Status</label>
                  <select className="w-full h-11 px-3 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669] transition-all bg-slate-50 text-slate-700">
                     <option>Active</option>
                     <option>Inactive</option>
                  </select>
                </div>
              </div>
            </div>
            {/* Footer */}
            <div className="px-6 py-4 flex items-center justify-end gap-3 border-t border-slate-100 bg-slate-50">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-lg text-sm font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 transition-colors">
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
