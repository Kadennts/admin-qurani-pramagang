"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Plus,
  Search,
  Filter,
  Pencil,
  Trash2,
  MapPin,
  Building,
  ChevronLeft,
  ChevronRight,
  X,
  Loader2,
} from "lucide-react";

import { useAppPreferences } from "@/components/providers/app-preferences-provider";
import { createClient } from "@/utils/supabase/client";

const PAGE_SIZE = 10;

export default function CountriesPage() {
  const { language } = useAppPreferences();
  const supabase = createClient();

  const copy =
    language === "id"
      ? {
          title: "Negara",
          create: "Tambah",
          search: "Cari nama atau kode ISO...",
          filter: "Filter",
          id: "ID",
          country: "Negara",
          phone: "Telepon",
          region: "Wilayah",
          states: "Provinsi",
          cities: "Kota",
          actions: "Aksi",
          loading: "Memuat data dari Supabase...",
          empty: "Tidak ada data ditemukan.",
          showing: "Menampilkan",
          of: "dari",
          records: "negara",
          createTitle: "Tambah Negara Baru",
          editTitle: "Edit Negara",
          countryName: "Nama Negara",
          iso2: "Kode ISO2",
          iso3: "Kode ISO3",
          phoneCode: "Kode Telepon",
          currency: "Mata Uang",
          capital: "Ibu Kota",
          subregion: "Subwilayah",
          selectRegion: "Pilih wilayah",
          cancel: "Batal",
          save: "Simpan",
          edit: "Edit",
          delete: "Hapus",
          confirmDelete: "Yakin ingin menghapus negara ini?",
        }
      : language === "ar"
        ? {
            title: "الدول",
            create: "إضافة",
            search: "ابحث بالاسم أو رمز ISO...",
            filter: "تصفية",
            id: "المعرف",
            country: "الدولة",
            phone: "الهاتف",
            region: "المنطقة",
            states: "الولايات",
            cities: "المدن",
            actions: "الإجراءات",
            loading: "جار تحميل البيانات من Supabase...",
            empty: "لا توجد بيانات.",
            showing: "عرض",
            of: "من",
            records: "دولة",
            createTitle: "إضافة دولة جديدة",
            editTitle: "تعديل الدولة",
            countryName: "اسم الدولة",
            iso2: "رمز ISO2",
            iso3: "رمز ISO3",
            phoneCode: "رمز الهاتف",
            currency: "العملة",
            capital: "العاصمة",
            subregion: "المنطقة الفرعية",
            selectRegion: "اختر المنطقة",
            cancel: "إلغاء",
            save: "حفظ",
            edit: "تعديل",
            delete: "حذف",
            confirmDelete: "هل أنت متأكد من حذف هذه الدولة؟",
          }
        : {
            title: "Countries",
            create: "Create",
            search: "Search by name or ISO code...",
            filter: "Filter",
            id: "ID",
            country: "Country",
            phone: "Phone",
            region: "Region",
            states: "States",
            cities: "Cities",
            actions: "Actions",
            loading: "Loading data from Supabase...",
            empty: "No data found.",
            showing: "Showing",
            of: "of",
            records: "countries",
            createTitle: "Create New Country",
            editTitle: "Edit Country",
            countryName: "Country Name",
            iso2: "ISO2 Code",
            iso3: "ISO3 Code",
            phoneCode: "Phone Code",
            currency: "Currency",
            capital: "Capital",
            subregion: "Subregion",
            selectRegion: "Select region",
            cancel: "Cancel",
            save: "Save",
            edit: "Edit",
            delete: "Delete",
            confirmDelete: "Are you sure you want to delete this country?",
          };

  const [allCountries, setAllCountries] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [editTarget, setEditTarget] = useState<any>(null);
  const [form, setForm] = useState({
    name: "",
    iso2: "",
    iso3: "",
    phone_code: "",
    currency: "",
    capital: "",
    region: "",
    subregion: "",
  });

  const fetchCountries = useCallback(async () => {
    setIsLoading(true);
    const { data } = await supabase.from("countries").select("*").order("name", { ascending: true });
    if (data) setAllCountries(data);
    setIsLoading(false);
  }, [supabase]);

  useEffect(() => {
    fetchCountries();
  }, [fetchCountries]);

  const filtered = allCountries.filter((country) =>
    country.name.toLowerCase().includes(search.toLowerCase()) ||
    (country.iso2 ?? "").toLowerCase().includes(search.toLowerCase()) ||
    (country.iso3 ?? "").toLowerCase().includes(search.toLowerCase()),
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const handleSearch = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const openCreateModal = () => {
    setModalMode("create");
    setForm({
      name: "",
      iso2: "",
      iso3: "",
      phone_code: "",
      currency: "",
      capital: "",
      region: "",
      subregion: "",
    });
    setEditTarget(null);
    setIsModalOpen(true);
  };

  const openEditModal = (item: any) => {
    setModalMode("edit");
    setEditTarget(item);
    setForm({
      name: item.name ?? "",
      iso2: item.iso2 ?? "",
      iso3: item.iso3 ?? "",
      phone_code: item.phone_code ?? item.phone ?? "",
      currency: item.currency ?? "",
      capital: item.capital ?? "",
      region: item.region ?? "",
      subregion: item.subregion ?? "",
    });
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.iso2) return;

    const payload = {
      name: form.name,
      iso2: form.iso2,
      iso3: form.iso3,
      phone_code: form.phone_code,
      currency: form.currency,
      capital: form.capital,
      region: form.region,
      subregion: form.subregion,
    };

    if (modalMode === "create") {
      const { data } = await supabase.from("countries").insert([payload]).select();
      if (data) {
        setAllCountries((prev) => [...prev, ...data].sort((a, b) => a.name.localeCompare(b.name)));
      }
    } else if (editTarget) {
      const { data } = await supabase.from("countries").update(payload).eq("id", editTarget.id).select();
      if (data) {
        setAllCountries((prev) => prev.map((country) => (country.id === editTarget.id ? data[0] : country)));
      }
    }

    setIsModalOpen(false);
  };

  const handleDelete = async (id: number) => {
    if (!confirm(copy.confirmDelete)) return;
    await supabase.from("countries").delete().eq("id", id);
    setAllCountries((prev) => prev.filter((country) => country.id !== id));
  };

  const pageNumbers = () => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, index) => index + 1);
    if (currentPage <= 3) return [1, 2, 3, 4, 5];
    if (currentPage >= totalPages - 2) {
      return [totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    }
    return [currentPage - 2, currentPage - 1, currentPage, currentPage + 1, currentPage + 2];
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold text-slate-900">{copy.title}</h1>
        <button
          onClick={openCreateModal}
          className="bg-[#059669] hover:bg-[#047857] text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
        >
          <Plus size={18} /> {copy.create}
        </button>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder={copy.search}
            value={search}
            onChange={(event) => handleSearch(event.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669]"
          />
        </div>
        <button className="bg-white border border-slate-200 px-4 py-2 rounded-lg text-sm font-medium text-slate-700 flex items-center gap-2 hover:bg-slate-50">
          <Filter size={16} /> {copy.filter}
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full whitespace-nowrap">
            <thead>
              <tr className="bg-[#059669] text-white text-sm font-bold text-left">
                <th className="px-6 py-4 rounded-tl-xl">{copy.id}</th>
                <th className="px-6 py-4">{copy.country}</th>
                <th className="px-6 py-4">{copy.phone}</th>
                <th className="px-6 py-4">{copy.region}</th>
                <th className="px-6 py-4">{copy.states}</th>
                <th className="px-6 py-4">{copy.cities}</th>
                <th className="px-6 py-4">ISO2</th>
                <th className="px-6 py-4">ISO3</th>
                <th className="px-6 py-4 rounded-tr-xl">{copy.actions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {isLoading ? (
                <tr>
                  <td colSpan={9} className="px-6 py-12 text-center">
                    <div className="flex items-center justify-center gap-2 text-slate-400 font-medium">
                      <Loader2 size={18} className="animate-spin text-emerald-500" />
                      {copy.loading}
                    </div>
                  </td>
                </tr>
              ) : paginated.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-6 py-12 text-center text-slate-400 font-medium">
                    {copy.empty}
                  </td>
                </tr>
              ) : (
                paginated.map((item, index) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 text-slate-500 font-medium">
                      #{(currentPage - 1) * PAGE_SIZE + index + 1}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 font-bold flex items-center justify-center text-xs shrink-0">
                          {(item.iso2 ?? item.name?.substring(0, 2) ?? "??").toUpperCase()}
                        </div>
                        <span className="font-semibold text-slate-800">{item.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600 font-medium">{item.phone_code ?? item.phone ?? "-"}</td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-slate-100 text-slate-500 rounded-full text-xs font-semibold">
                        {item.region ?? "-"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-emerald-600 font-semibold">
                        <MapPin size={14} /> {item.states ?? "-"}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-blue-600 font-semibold">
                        <Building size={14} /> {item.cities ?? "-"}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{item.iso2 ?? "-"}</td>
                    <td className="px-6 py-4 text-slate-600 font-medium">{item.iso3 ?? "-"}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEditModal(item)}
                          className="bg-[#059669] hover:bg-[#047857] text-white px-2.5 py-1.5 rounded text-xs font-medium flex items-center gap-1 transition-colors"
                        >
                          <Pencil size={12} /> {copy.edit}
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="bg-[#059669] hover:bg-emerald-800 text-white px-2.5 py-1.5 rounded text-xs font-medium flex items-center gap-1 transition-colors"
                        >
                          <Trash2 size={12} /> {copy.delete}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="border-t border-slate-100 px-6 py-4 flex items-center justify-between bg-white">
          <span className="text-sm font-bold text-slate-400">
            {copy.showing}{" "}
            <span className="text-emerald-600 font-extrabold">
              {filtered.length === 0 ? 0 : Math.min((currentPage - 1) * PAGE_SIZE + 1, filtered.length)}-
              {Math.min(currentPage * PAGE_SIZE, filtered.length)}
            </span>{" "}
            {copy.of} {filtered.length} {copy.records}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
              disabled={currentPage === 1}
              className="h-9 w-9 flex items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            {pageNumbers().map((pageNumber) => (
              <button
                key={pageNumber}
                onClick={() => setCurrentPage(pageNumber)}
                className={`h-9 w-9 flex items-center justify-center rounded-lg text-sm font-bold transition-colors ${
                  pageNumber === currentPage
                    ? "bg-[#059669] text-white"
                    : "border border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                {pageNumber}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
              disabled={currentPage === totalPages}
              className="h-9 w-9 flex items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {isModalOpen ? (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 flex items-center justify-between border-b border-slate-100">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  {modalMode === "create" ? copy.createTitle : copy.editTitle}
                </h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>

            <div className="px-6 py-4 space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-800">
                  {copy.countryName} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                  placeholder="e.g. Indonesia"
                  className="w-full h-11 px-3 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669] transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-800">
                    {copy.iso2} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.iso2}
                    onChange={(event) => setForm((current) => ({ ...current, iso2: event.target.value }))}
                    placeholder="e.g. ID"
                    className="w-full h-11 px-3 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669] transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-800">{copy.iso3}</label>
                  <input
                    type="text"
                    value={form.iso3}
                    onChange={(event) => setForm((current) => ({ ...current, iso3: event.target.value }))}
                    placeholder="e.g. IDN"
                    className="w-full h-11 px-3 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669] transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-800">{copy.phoneCode}</label>
                  <input
                    type="text"
                    value={form.phone_code}
                    onChange={(event) => setForm((current) => ({ ...current, phone_code: event.target.value }))}
                    placeholder="e.g. +62"
                    className="w-full h-11 px-3 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669] transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-800">{copy.currency}</label>
                  <input
                    type="text"
                    value={form.currency}
                    onChange={(event) => setForm((current) => ({ ...current, currency: event.target.value }))}
                    placeholder="e.g. IDR"
                    className="w-full h-11 px-3 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669] transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-800">{copy.capital}</label>
                  <input
                    type="text"
                    value={form.capital}
                    onChange={(event) => setForm((current) => ({ ...current, capital: event.target.value }))}
                    placeholder="e.g. Jakarta"
                    className="w-full h-11 px-3 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669] transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-800">{copy.region}</label>
                  <select
                    value={form.region}
                    onChange={(event) => setForm((current) => ({ ...current, region: event.target.value }))}
                    className="w-full h-11 px-3 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669] transition-all text-slate-700 appearance-none"
                  >
                    <option value="">{copy.selectRegion}</option>
                    <option>Asia</option>
                    <option>Africa</option>
                    <option>Europe</option>
                    <option>Americas</option>
                    <option>Oceania</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-800">{copy.subregion}</label>
                <input
                  type="text"
                  value={form.subregion}
                  onChange={(event) => setForm((current) => ({ ...current, subregion: event.target.value }))}
                  placeholder="e.g. South-Eastern Asia"
                  className="w-full h-11 px-3 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669] transition-all"
                />
              </div>
            </div>

            <div className="px-6 py-4 flex items-center justify-end gap-3 border-t border-slate-50">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded-lg text-sm font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-colors"
              >
                {copy.cancel}
              </button>
              <button
                onClick={handleSave}
                disabled={!form.name || !form.iso2}
                className="px-4 py-2 rounded-lg text-sm font-bold text-white bg-[#059669] hover:bg-[#047857] transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {copy.save}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
