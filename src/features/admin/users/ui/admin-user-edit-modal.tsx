"use client";

import { Mail, Save, User, X } from "lucide-react";

import { ADMIN_USER_ROLE_OPTIONS } from "../model/admin-users.constants";
import type { useAdminUsers } from "../hooks/use-admin-users";

export function AdminUserEditModal({ state }: { state: ReturnType<typeof useAdminUsers> }) {
  if (!state.isModalOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
      <div className="relative flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white px-6 py-4">
          <h3 className="text-lg font-extrabold tracking-wide text-slate-900">Edit User</h3>
          <button
            onClick={state.closeEditModal}
            className="rounded-xl bg-slate-50 p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto px-6 py-5">
          <div className="space-y-1.5">
            <label className="text-sm font-bold tracking-wide text-slate-700">
              Username <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute top-1/2 left-3 -translate-y-1/2 text-slate-400"><User size={18} /></div>
              <input
                type="text"
                value={state.formData.username}
                onChange={(event) => state.updateFormField("username", event.target.value)}
                className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3 text-sm font-semibold text-slate-800 transition-all focus:border-[#059669] focus:ring-2 focus:ring-[#059669]/20 focus:outline-none"
              />
            </div>
            <p className="mt-1 text-xs font-semibold text-slate-400">3-20 karakter, huruf, angka, dan underscore saja</p>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-bold tracking-wide text-slate-700">Full Name</label>
            <div className="relative">
              <div className="absolute top-1/2 left-3 -translate-y-1/2 text-slate-400"><User size={18} /></div>
              <input
                type="text"
                value={state.formData.full_name}
                onChange={(event) => state.updateFormField("full_name", event.target.value)}
                className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3 text-sm font-semibold text-slate-800 transition-all focus:border-[#059669] focus:ring-2 focus:ring-[#059669]/20 focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-bold tracking-wide text-slate-700">Email</label>
            <div className="relative">
              <div className="absolute top-1/2 left-3 -translate-y-1/2 text-slate-400"><Mail size={18} /></div>
              <input
                type="email"
                value={state.formData.email}
                onChange={(event) => state.updateFormField("email", event.target.value)}
                className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3 text-sm font-semibold text-slate-800 transition-all focus:border-[#059669] focus:ring-2 focus:ring-[#059669]/20 focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-bold tracking-wide text-slate-700">Country</label>
            <select
              value={state.formData.country}
              onChange={(event) => state.handleCountryChange(event.target.value)}
              className="h-11 w-full cursor-pointer rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-800 transition-all focus:border-[#059669] focus:ring-2 focus:ring-[#059669]/20 focus:outline-none"
            >
              <option value="">Select Country</option>
              {state.countries.map((country) => (
                <option key={country.id} value={country.name}>
                  {country.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-bold tracking-wide text-slate-700">Province</label>
            <select
              value={state.formData.province}
              onChange={(event) => state.handleProvinceChange(event.target.value)}
              disabled={!state.formData.country}
              className="h-11 w-full cursor-pointer rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-800 transition-all disabled:cursor-not-allowed disabled:bg-slate-50 focus:border-[#059669] focus:ring-2 focus:ring-[#059669]/20 focus:outline-none"
            >
              <option value="">Select Province</option>
              {state.states.map((item) => (
                <option key={item.id} value={item.name}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-bold tracking-wide text-slate-700">City</label>
            <select
              value={state.formData.city}
              onChange={(event) => state.updateFormField("city", event.target.value)}
              disabled={!state.formData.province}
              className="h-11 w-full cursor-pointer rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-800 transition-all disabled:cursor-not-allowed disabled:bg-slate-50 focus:border-[#059669] focus:ring-2 focus:ring-[#059669]/20 focus:outline-none"
            >
              <option value="">Select City</option>
              {state.cities.map((city) => (
                <option key={city.id} value={city.name}>
                  {city.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-bold tracking-wide text-slate-700">Role</label>
            <select
              value={state.formData.role}
              onChange={(event) => state.updateFormField("role", event.target.value)}
              className="h-11 w-full cursor-pointer rounded-xl border border-slate-200 bg-white px-3 text-sm font-bold text-slate-800 transition-all focus:border-[#059669] focus:ring-2 focus:ring-[#059669]/20 focus:outline-none"
            >
              {ADMIN_USER_ROLE_OPTIONS.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5 pb-2">
            <label className="text-sm font-bold tracking-wide text-slate-700">Active Status</label>
            <div
              className="relative flex h-11 cursor-pointer items-center rounded-xl border border-slate-200 bg-white px-4 transition-all hover:border-slate-300 focus-within:ring-2 focus-within:ring-[#059669]/20"
              onClick={state.toggleStatus}
            >
              <div
                className={`mr-3 h-2.5 w-2.5 rounded-full ${state.formData.status === "Active" ? "bg-[#059669] shadow-[0_0_8px_rgba(5,150,105,0.6)]" : "bg-slate-300"}`}
              />
              <span className={`text-sm font-bold ${state.formData.status === "Active" ? "text-slate-800" : "text-slate-500"}`}>
                {state.formData.status}
              </span>
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 flex items-center justify-end gap-3 border-t border-slate-100 bg-slate-50/80 px-6 py-4">
          <button
            onClick={state.closeEditModal}
            className="rounded-xl border border-slate-200 bg-white px-6 py-2.5 text-sm font-bold text-slate-600 shadow-sm transition-colors hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            onClick={() => void state.saveUser()}
            className="flex items-center gap-2 rounded-xl bg-[#059669] px-8 py-2.5 text-sm font-bold text-white shadow-md transition-all hover:bg-[#047857] hover:shadow-lg"
          >
            <Save size={16} />
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
