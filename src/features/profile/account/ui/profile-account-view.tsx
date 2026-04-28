"use client";

import Link from "next/link";
import { User, Mail, Briefcase, MapPin, Camera } from "lucide-react";

import type { useProfileAccount } from "../hooks/use-profile-account";
import { ProfileAccountForm } from "./profile-account-form";
import { ProfileAccountSettingsSection } from "./profile-account-settings-section";

/**
 * ProfileAccountView
 * - View mode: ringkasan profil (foto, nama, info, about me) + Settings section
 * - Edit mode: form lengkap saja, Settings disembunyikan, Cancel & Save di kanan bawah
 */
export function ProfileAccountView({
  state,
}: {
  state: ReturnType<typeof useProfileAccount>;
}) {
  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900 p-6 md:p-8">

        {/* ── Header: judul + tombol aksi (view mode only) ─────────────── */}
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3 text-slate-900 dark:text-white">
            <div className="rounded-2xl bg-slate-100 p-3 dark:bg-slate-800">
              <User size={22} className="text-slate-700 dark:text-slate-200" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">
              {state.isEditing ? "Edit Profile" : state.t("profile.title")}
            </h1>
          </div>

          {/* Hanya tampilkan tombol di header saat VIEW mode */}
          {!state.isEditing && (
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/dashboard/settings"
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                {state.t("profile.settingsButton")}
              </Link>

              <button
                type="button"
                onClick={state.startEditing}
                className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-5 py-2 text-sm font-bold text-white transition-colors hover:bg-emerald-700"
              >
                {state.t("profile.edit")}
              </button>
            </div>
          )}
        </div>

        {/* ════════════════════════════════════════════════════════════════
            VIEW MODE — Ringkasan profil + Settings
        ════════════════════════════════════════════════════════════════ */}
        {!state.isEditing && (
          <>
            <div className="mb-8 flex flex-col gap-6 sm:flex-row sm:items-start">
              {/* Avatar */}
              <div className="relative shrink-0">
                {state.displayProfile.avatar ? (
                  <img
                    src={state.displayProfile.avatar}
                    alt={state.displayProfile.name}
                    className="h-20 w-20 rounded-full border-4 border-white object-cover shadow-md"
                    suppressHydrationWarning
                  />
                ) : (
                  <div
                    className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-700 text-2xl font-bold text-white shadow-md"
                    suppressHydrationWarning
                  >
                    {state.displayProfile.name.slice(0, 2).toUpperCase()}
                  </div>
                )}
              </div>

              {/* Info profil — spacing lebih lapang antar baris */}
              <div className="flex flex-col gap-2.5">
                {/* Nama — Nickname - Full Name */}
                <h2 className="text-xl font-bold text-slate-900 dark:text-white" suppressHydrationWarning>
                  {state.displayProfile.nickname && state.displayProfile.fullName
                    ? `${state.displayProfile.nickname} - ${state.displayProfile.fullName}`
                    : state.displayProfile.name}
                </h2>

                {/* Username */}
                <p className="text-sm font-semibold text-emerald-600 leading-none" suppressHydrationWarning>
                  {state.displayProfile.username}
                </p>

                {/* Email */}
                {state.displayProfile.email && (
                  <div className="flex items-center gap-2.5 text-sm text-slate-600 dark:text-slate-400">
                    <Mail size={14} className="shrink-0 text-slate-400" />
                    <span suppressHydrationWarning>{state.displayProfile.email}</span>
                  </div>
                )}

                {/* Job */}
                {state.displayProfile.job && (
                  <div className="flex items-center gap-2.5 text-sm text-slate-600 dark:text-slate-400">
                    <Briefcase size={14} className="shrink-0 text-slate-400" />
                    <span suppressHydrationWarning>{state.displayProfile.job}</span>
                  </div>
                )}

                {/* Lokasi */}
                {(state.displayProfile.country || state.displayProfile.city) && (
                  <div className="flex items-center gap-2.5 text-sm text-slate-600 dark:text-slate-400">
                    <MapPin size={14} className="shrink-0 text-slate-400" />
                    <span suppressHydrationWarning>
                      {[state.displayProfile.country, state.displayProfile.state, state.displayProfile.city]
                        .filter(Boolean)
                        .join(", ")}
                    </span>
                  </div>
                )}

                {/* About Me — sedikit margin atas agar terpisah dari detail lainnya */}
                {state.displayProfile.bio && (
                  <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-400" suppressHydrationWarning>
                    {state.displayProfile.bio}
                  </p>
                )}
              </div>
            </div>

            {/* Settings section — hanya tampil di view mode */}
            <div className="border-t border-slate-100 pt-6 dark:border-slate-800">
              <ProfileAccountSettingsSection state={state} />
            </div>
          </>
        )}

        {/* ════════════════════════════════════════════════════════════════
            EDIT MODE — Form lengkap, Settings disembunyikan
            Cancel & Save ada di kanan bawah (bukan di header)
        ════════════════════════════════════════════════════════════════ */}
        {state.isEditing && (
          <>
            {/* Avatar + tombol ganti foto — di tengah */}
            <div className="mb-8 flex justify-center">
              <div className="relative">
                {state.displayProfile.avatar ? (
                  <img
                    src={state.displayProfile.avatar}
                    alt={state.displayProfile.name}
                    className="h-28 w-28 rounded-full border-4 border-white object-cover shadow-lg"
                    suppressHydrationWarning
                  />
                ) : (
                  <div
                    className="flex h-28 w-28 items-center justify-center rounded-full bg-emerald-700 text-3xl font-bold text-white shadow-lg"
                    suppressHydrationWarning
                  >
                    {state.displayProfile.name.slice(0, 2).toUpperCase()}
                  </div>
                )}
                {/* Tombol kamera */}
                <button
                  type="button"
                  onClick={() => state.fileInputRef.current?.click()}
                  className="absolute bottom-1 right-1 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-slate-700 text-white shadow transition-colors hover:bg-slate-800"
                >
                  <Camera size={14} />
                </button>
                <input
                  ref={state.fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={state.handlePhotoChange}
                />
              </div>
            </div>

            {/* Form field */}
            <ProfileAccountForm state={state} />

            {/* Cancel & Save — di kanan bawah setelah form */}
            <div className="mt-8 flex items-center justify-end gap-3 border-t border-slate-100 pt-6 dark:border-slate-800">
              <button
                type="button"
                onClick={state.handleCancel}
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
              >
                {state.t("profile.cancel")}
              </button>
              <button
                type="button"
                onClick={() => void state.handleSave()}
                disabled={state.isSaving}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-2.5 text-sm font-bold text-white transition-colors hover:bg-emerald-700 disabled:opacity-70"
              >
                {state.isSaving ? "Saving..." : state.t("profile.save")}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
