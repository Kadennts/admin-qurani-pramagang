"use client";

import { ChevronLeft, ChevronRight, Filter, Loader2, PencilIcon, Search, User } from "lucide-react";

import { ADMIN_USERS_PAGE_SIZE } from "../model/admin-users.constants";
import { getAdminUserInitial } from "../model/admin-users.utils";
import type { useAdminUsers } from "../hooks/use-admin-users";
import { AdminUserEditModal } from "./admin-user-edit-modal";

export function AdminUsersView({ state }: { state: ReturnType<typeof useAdminUsers> }) {
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3 text-slate-800">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-emerald-100 bg-emerald-50 text-[#059669] shadow-sm">
            <User size={24} strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">User List</h1>
          </div>
        </div>
      </div>

      <div className="mb-6 flex gap-4">
        <div className="flex w-full max-w-sm items-center overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all focus-within:border-[#059669] focus-within:ring-2 focus-within:ring-[#059669]/20">
          <input
            type="text"
            placeholder="Search by username, name, or email..."
            value={state.search}
            onChange={(event) => state.handleSearch(event.target.value)}
            className="w-full bg-transparent px-4 py-2.5 text-sm font-medium text-slate-700 placeholder:text-slate-400 focus:outline-none"
          />
          <button className="bg-[#059669] px-4 py-3 text-white transition-colors hover:bg-[#047857]">
            <Search size={18} />
          </button>
        </div>
        <button className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 shadow-sm transition-colors hover:bg-slate-50">
          <Filter size={16} />
          Filter
        </button>
      </div>

      <div className="flex min-h-[400px] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full whitespace-nowrap">
            <thead>
              <tr className="bg-[#059669] text-left text-sm font-bold text-white">
                <th className="w-20 rounded-tl-xl px-6 py-4">Photo</th>
                <th className="px-6 py-4">Username</th>
                <th className="px-6 py-4">Full Name</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Join Date</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Status</th>
                <th className="w-24 rounded-tr-xl px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm font-medium">
              {state.isLoading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-slate-500">
                    <Loader2 className="mx-auto mb-2 animate-spin text-emerald-600" size={24} />
                    Loading users from Supabase...
                  </td>
                </tr>
              ) : state.paginatedUsers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center font-medium text-slate-500">
                    Tidak ada data pengguna ditemukan.
                  </td>
                </tr>
              ) : (
                state.paginatedUsers.map((user) => (
                  <tr key={user.id} className="transition-colors hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full border border-blue-200/50 bg-blue-100/50 text-sm font-bold text-blue-600 uppercase">
                        {getAdminUserInitial(user)}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-bold text-[#059669]">{user.username}</td>
                    <td className="px-6 py-4 text-slate-700">{user.full_name || "-"}</td>
                    <td className="px-6 py-4 text-slate-500">{user.email || "-"}</td>
                    <td className="px-6 py-4 text-slate-500">
                      {new Date(user.created_at).toLocaleDateString("id-ID", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-4 text-slate-600 capitalize">{user.role || "Member"}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full border px-3 py-1 text-xs font-bold ${
                          user.status === "Active"
                            ? "border-emerald-200 bg-emerald-50 text-emerald-600"
                            : "border-slate-200 bg-slate-100 text-slate-500"
                        }`}
                      >
                        {user.status || "Active"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => state.openEditModal(user)}
                        className="group rounded-md bg-slate-50 p-1 text-slate-400 transition-colors hover:bg-emerald-50 hover:text-emerald-600"
                      >
                        <PencilIcon size={16} className="transition-transform group-hover:scale-110" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-auto flex items-center justify-between border-t border-slate-100 bg-white px-6 py-4">
          <span className="text-sm font-bold text-slate-400">
            Menampilkan{" "}
            <span className="font-extrabold text-emerald-600">
              {state.filteredUsers.length === 0
                ? 0
                : Math.min(
                    (state.currentPage - 1) * ADMIN_USERS_PAGE_SIZE + 1,
                    state.filteredUsers.length,
                  )}
              -
              {Math.min(state.currentPage * ADMIN_USERS_PAGE_SIZE, state.filteredUsers.length)}
            </span>{" "}
            dari {state.filteredUsers.length} users
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => state.setCurrentPage((page) => Math.max(1, page - 1))}
              disabled={state.currentPage === 1}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft size={16} />
            </button>
            {state.pageNumbers.map((pageNumber) => (
              <button
                key={pageNumber}
                onClick={() => state.setCurrentPage(pageNumber)}
                className={`flex h-9 w-9 items-center justify-center rounded-lg text-sm font-bold transition-colors ${
                  pageNumber === state.currentPage
                    ? "bg-[#059669] text-white"
                    : "border border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                {pageNumber}
              </button>
            ))}
            <button
              onClick={() => state.setCurrentPage((page) => Math.min(state.totalPages, page + 1))}
              disabled={state.currentPage === state.totalPages}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      <AdminUserEditModal state={state} />
    </div>
  );
}
