"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Search, Filter, Pencil, Trash2, Building, X, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

const PAGE_SIZE = 10;

export default function StatesPage() {
  const supabase = createClient();

  const [allStates, setAllStates] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [editTarget, setEditTarget] = useState<any>(null);
  const [countries, setCountries] = useState<any[]>([]);
  const [form, setForm] = useState({ name: "", country_id: "", iso2: "", type: "province" });

  const fetchStates = useCallback(async () => {
    setIsLoading(true);
    const { data } = await supabase
      .from("states")
      .select("*, countries(name)")
      .order("name", { ascending: true });
    if (data) setAllStates(data);
    setIsLoading(false);
  }, []);

  const fetchCountries = useCallback(async () => {
    const { data } = await supabase.from("countries").select("id, name").order("name");
    if (data) setCountries(data);
  }, []);

  useEffect(() => {
    fetchStates();
    fetchCountries();
  }, [fetchStates, fetchCountries]);

  const filtered = allStates.filter((s) => {
    const countryName = s.countries?.name ?? s.country_name ?? "";
    return (
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      countryName.toLowerCase().includes(search.toLowerCase())
    );
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const handleSearch = (v: string) => { setSearch(v); setCurrentPage(1); };

  const openCreateModal = () => {
    setModalMode("create");
    setForm({ name: "", country_id: "", iso2: "", type: "province" });
    setEditTarget(null);
    setIsModalOpen(true);
  };

  const openEditModal = (item: any) => {
    setModalMode("edit");
    setEditTarget(item);
    setForm({
      name: item.name,
      country_id: item.country_id ?? "",
      iso2: item.iso2 ?? item.iso ?? "",
      type: item.type ?? "province",
    });
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.country_id) return;
    if (modalMode === "create") {
      const { data } = await supabase.from("states").insert([{
        name: form.name,
        country_id: parseInt(form.country_id),
        iso2: form.iso2,
        type: form.type,
      }]).select("*, countries(name)");
      if (data) setAllStates((prev) => [...prev, ...data]);
    } else if (editTarget) {
      const { data } = await supabase.from("states")
        .update({ name: form.name, country_id: parseInt(form.country_id), iso2: form.iso2, type: form.type })
        .eq("id", editTarget.id)
        .select("*, countries(name)");
      if (data) setAllStates((prev) => prev.map((s) => s.id === editTarget.id ? data[0] : s));
    }
    setIsModalOpen(false);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Yakin ingin menghapus state ini?")) return;
    await supabase.from("states").delete().eq("id", id);
    setAllStates((prev) => prev.filter((s) => s.id !== id));
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
        <h1 className="text-4xl font-bold text-slate-900">States</h1>
        <button onClick={openCreateModal} className="bg-[#059669] hover:bg-[#047857] text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors">
          <Plus size={18} /> Create
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name or country..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669]"
          />
        </div>
        <button className="bg-white border border-slate-200 px-4 py-2 rounded-lg text-sm font-medium text-slate-700 flex items-center gap-2 hover:bg-slate-50">
          <Filter size={16} /> Filter
        </button>
      </div>

      {/* Table */}
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
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="flex items-center justify-center gap-2 text-slate-400 font-medium">
                      <Loader2 size={18} className="animate-spin text-emerald-500" />
                      Memuat data dari Supabase...
                    </div>
                  </td>
                </tr>
              ) : paginated.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-12 text-center text-slate-400 font-medium">Tidak ada data ditemukan.</td></tr>
              ) : paginated.map((item, i) => {
                const countryName = item.countries?.name ?? item.country_name ?? "—";
                const citiesCount = item.cities_count ?? item.cities ?? "—";
                const isoCode = item.iso2 ?? item.iso ?? "—";
                return (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 text-slate-500 font-medium">#{(currentPage - 1) * PAGE_SIZE + i + 1}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 font-bold flex items-center justify-center text-xs shrink-0">
                          {item.name.substring(0, 2).toUpperCase()}
                        </div>
                        <span className="font-semibold text-slate-800">{item.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600 font-medium">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded text-xs">{countryName.substring(0, 2).toUpperCase()}</span>
                        {countryName}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-blue-600 font-semibold">
                        <Building size={14} /> {citiesCount}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600 font-medium">{isoCode}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => openEditModal(item)} className="bg-[#059669] hover:bg-[#047857] text-white px-2.5 py-1.5 rounded text-xs font-medium flex items-center gap-1 transition-colors">
                          <Pencil size={12} /> Edit
                        </button>
                        <button onClick={() => handleDelete(item.id)} className="bg-[#059669] hover:bg-emerald-800 text-white px-2.5 py-1.5 rounded text-xs font-medium flex items-center gap-1 transition-colors">
                          <Trash2 size={12} /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="border-t border-slate-100 px-6 py-4 flex items-center justify-between bg-white">
          <span className="text-sm font-bold text-slate-400">
            Menampilkan <span className="text-emerald-600 font-extrabold">{filtered.length === 0 ? 0 : Math.min((currentPage - 1) * PAGE_SIZE + 1, filtered.length)}–{Math.min(currentPage * PAGE_SIZE, filtered.length)}</span> dari {filtered.length} states
          </span>
          <div className="flex items-center gap-1">
            <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1}
              className="h-9 w-9 flex items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
              <ChevronLeft size={16} />
            </button>
            {pageNumbers().map((n) => (
              <button key={n} onClick={() => setCurrentPage(n)}
                className={`h-9 w-9 flex items-center justify-center rounded-lg text-sm font-bold transition-colors ${n === currentPage ? "bg-[#059669] text-white" : "border border-slate-200 text-slate-600 hover:bg-slate-50"}`}>
                {n}
              </button>
            ))}
            <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
              className="h-9 w-9 flex items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 flex items-center justify-between border-b border-slate-100">
              <div>
                <h3 className="text-lg font-bold text-slate-900">{modalMode === "create" ? "Create New State" : "Edit State"}</h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-800">State Name <span className="text-red-500">*</span></label>
                <input type="text" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="e.g. California"
                  className="w-full h-11 px-3 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669] transition-all" />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-800">Country <span className="text-red-500">*</span></label>
                <select value={form.country_id} onChange={(e) => setForm((f) => ({ ...f, country_id: e.target.value }))}
                  className="w-full h-11 px-3 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669] transition-all text-slate-700 appearance-none">
                  <option value="">Select Country</option>
                  {countries.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-800">ISO2 Code</label>
                  <input type="text" value={form.iso2} onChange={(e) => setForm((f) => ({ ...f, iso2: e.target.value }))} placeholder="e.g. CA"
                    className="w-full h-11 px-3 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669] transition-all" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-800">Type</label>
                  <select value={form.type} onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
                    className="w-full h-11 px-3 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669] transition-all text-slate-700 appearance-none">
                    <option>province</option><option>state</option><option>region</option>
                    <option>governorate</option><option>division</option><option>emirate</option>
                    <option>municipality</option><option>territory</option><option>country</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 flex items-center justify-end gap-3 border-t border-slate-50">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-lg text-sm font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-colors">Cancel</button>
              <button onClick={handleSave} disabled={!form.name || !form.country_id}
                className="px-4 py-2 rounded-lg text-sm font-bold text-white bg-[#059669] hover:bg-[#047857] transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed">
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
