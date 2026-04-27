"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, Filter, Pencil, Trash2, ChevronLeft, ChevronRight, X, Loader2, Plus } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

const PAGE_SIZE = 10;

export default function CurrenciesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [currencies, setCurrencies] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const supabase = createClient();

  const fetchCurrencies = useCallback(async () => {
    setIsLoading(true);
    const { data } = await supabase
      .from('currencies')
      .select('*')
      .order('id', { ascending: true });
    
    if (data) {
      setCurrencies(data);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchCurrencies();
  }, [fetchCurrencies]);

  const filtered = currencies.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.code.toLowerCase().includes(search.toLowerCase()) ||
    (c.symbol ?? "").toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const handleSearch = (v: string) => { setSearch(v); setCurrentPage(1); };

  const openCreateModal = () => {
    setModalMode('create');
    setIsModalOpen(true);
  };

  const openEditModal = () => {
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const pageNumbers = () => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (currentPage <= 3) return [1, 2, 3, 4, 5];
    if (currentPage >= totalPages - 2) return [totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    return [currentPage - 2, currentPage - 1, currentPage, currentPage + 1, currentPage + 2];
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold text-slate-900">Currencies</h1>
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
            placeholder="Search by name, code, or symbol..." 
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
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
                <th className="px-6 py-4 rounded-tl-xl w-20">ID</th>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Symbol</th>
                <th className="px-6 py-4">Code</th>
                <th className="px-6 py-4">Decimals</th>
                <th className="px-6 py-4 rounded-tr-xl w-32">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    <Loader2 className="animate-spin mx-auto mb-2 text-emerald-600" size={24} />
                    Loading currencies from Supabase...
                  </td>
                </tr>
              ) : paginated.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500 font-medium">
                    Tidak ada data ditemukan.
                  </td>
                </tr>
              ) : (
                paginated.map((item, i) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 text-slate-500 font-medium">#{(currentPage - 1) * PAGE_SIZE + i + 1}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 font-bold flex items-center justify-center text-xs shrink-0 uppercase">
                          {item.symbol && item.symbol.length > 3 ? item.symbol.substring(0,2) : item.symbol}
                        </div>
                        <span className="font-semibold text-slate-800">{item.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600 font-medium">{item.symbol || '-'}</td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-[#059669]">{item.code}</span>
                    </td>
                    <td className="px-6 py-4 text-slate-600 font-medium">{item.decimals}</td>
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

        {/* Pagination Footer */}
        <div className="border-t border-slate-100 px-6 py-4 flex items-center justify-between bg-white">
          <span className="text-sm font-bold text-slate-400">
            Menampilkan <span className="text-emerald-600 font-extrabold">{filtered.length === 0 ? 0 : Math.min((currentPage - 1) * PAGE_SIZE + 1, filtered.length)}–{Math.min(currentPage * PAGE_SIZE, filtered.length)}</span> dari {filtered.length} currencies
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="h-9 w-9 flex items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            {pageNumbers().map((n) => (
              <button
                key={n}
                onClick={() => setCurrentPage(n)}
                className={`h-9 w-9 flex items-center justify-center rounded-lg text-sm font-bold transition-colors ${
                  n === currentPage ? "bg-[#059669] text-white" : "border border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                {n}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="h-9 w-9 flex items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Modal Dialog Form Kosmetik */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="px-6 py-4 flex items-center justify-between border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">
                {modalMode === 'create' ? 'Create New Currency' : 'Edit Currency'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            {/* Form */}
            <div className="px-6 py-5 space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-800">Currency Name <span className="text-red-500">*</span></label>
                <input type="text" placeholder="e.g. Euro" className="w-full h-11 px-3 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669] transition-all" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-800">Currency Code <span className="text-red-500">*</span></label>
                  <input type="text" placeholder="e.g. EUR" className="w-full h-11 px-3 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669] transition-all uppercase" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-800">Symbol</label>
                  <input type="text" placeholder="e.g. €" className="w-full h-11 px-3 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669] transition-all" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-800">Decimals <span className="text-red-500">*</span></label>
                <input type="number" defaultValue={2} className="w-full h-11 px-3 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669] transition-all" />
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
