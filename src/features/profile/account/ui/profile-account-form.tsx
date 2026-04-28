import { SearchableSelect } from "@/components/ui/searchable-select";
import { formatTimezoneLabel } from "@/utils/timezone-helper";

import type { useProfileAccount } from "../hooks/use-profile-account";

// Komponen kecil untuk menampilkan pesan status auto-save lokasi
function AutoSaveHint({ state }: { state: ReturnType<typeof useProfileAccount> }) {
  if (!state.isEditing) return null;

  if (state.autoSaveStatus === "saving") {
    return <p className="text-[11px] text-amber-500">Perubahan lokasi sedang disimpan otomatis...</p>;
  }
  if (state.autoSaveStatus === "saved") {
    return <p className="text-[11px] text-emerald-600">Perubahan lokasi tersimpan otomatis.</p>;
  }
  if (state.autoSaveStatus === "error") {
    return <p className="text-[11px] text-rose-500">Sinkron database gagal, tapi perubahan masih disimpan di browser.</p>;
  }
  return null;
}

// Helper: class input yang konsisten
function inputClass(readOnly: boolean) {
  return `w-full rounded-xl border px-4 py-3 text-sm outline-none transition-colors ${
    readOnly
      ? "border-slate-200 bg-slate-50 text-slate-500 cursor-default dark:border-slate-700 dark:bg-slate-900/50 dark:text-slate-400"
      : "border-slate-200 bg-white text-slate-900 focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:border-emerald-400"
  }`;
}

/**
 * ProfileAccountForm
 * Form edit profil dengan layout 3 kolom mengikuti referensi gambar:
 * Row 1: Full Name | Nickname | Username
 * Row 2: Email     | Phone    | Job
 * Row 3: Gender    | Date of Birth | Timezone
 * Row 4: Country   | States   | City
 * Row 5: About Me (full width)
 */
export function ProfileAccountForm({
  state,
}: {
  state: ReturnType<typeof useProfileAccount>;
}) {
  const ro = !state.isEditing; // readOnly shorthand

  return (
    <div className="space-y-5">

      {/* ── Row 1: Full Name | Nickname | Username ────────────────────── */}
      <div className="grid gap-4 md:grid-cols-3">
        <label className="space-y-1.5">
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Full Name</span>
          <input
            value={state.draftProfile.fullName}
            onChange={state.handleDraftChange("fullName")}
            readOnly={ro}
            placeholder="Full name"
            className={inputClass(ro)}
            suppressHydrationWarning
          />
        </label>

        <label className="space-y-1.5">
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Nickname</span>
          <input
            value={state.draftProfile.nickname}
            onChange={state.handleDraftChange("nickname")}
            readOnly={ro}
            placeholder="Nickname"
            className={inputClass(ro)}
            suppressHydrationWarning
          />
        </label>

        <label className="space-y-1.5">
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Username</span>
          {/* Username tidak bisa diubah */}
          <div className={inputClass(true)} suppressHydrationWarning>
            @{state.displayProfile.username}
          </div>
        </label>
      </div>

      {/* ── Row 2: Email | Phone Number | Job ────────────────────────── */}
      <div className="grid gap-4 md:grid-cols-3">
        <label className="space-y-1.5">
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Email</span>
          {/* Email tidak bisa diubah */}
          <div className={inputClass(true)} suppressHydrationWarning>
            {state.displayProfile.email}
          </div>
        </label>

        <label className="space-y-1.5">
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Phone Number</span>
          <input
            type="tel"
            value={state.draftProfile.phone}
            onChange={state.handleDraftChange("phone")}
            readOnly={ro}
            placeholder="+12 345 6789 1234"
            className={inputClass(ro)}
            suppressHydrationWarning
          />
        </label>

        <label className="space-y-1.5">
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Job</span>
          <input
            value={state.draftProfile.job}
            onChange={state.handleDraftChange("job")}
            readOnly={ro}
            placeholder="Your job title"
            className={inputClass(ro)}
            suppressHydrationWarning
          />
        </label>
      </div>

      {/* ── Row 3: Gender | Date of Birth | Timezone ─────────────────── */}
      <div className="grid gap-4 md:grid-cols-3">
        <label className="space-y-1.5">
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Gender</span>
          {ro ? (
            <div className={inputClass(true)} suppressHydrationWarning>
              {state.draftProfile.gender || "—"}
            </div>
          ) : (
            <select
              value={state.draftProfile.gender}
              onChange={state.handleDraftChange("gender")}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-colors focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            >
              <option value="">Select gender...</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
              <option value="Prefer not to say">Prefer not to say</option>
            </select>
          )}
        </label>

        <label className="space-y-1.5">
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Date of Birth</span>
          <input
            type={ro ? "text" : "date"}
            value={state.draftProfile.dateOfBirth}
            onChange={state.handleDraftChange("dateOfBirth")}
            readOnly={ro}
            placeholder="dd/mm/yyyy"
            className={inputClass(ro)}
            suppressHydrationWarning
          />
        </label>

        <label className="space-y-1.5">
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Timezone</span>
          {/* Timezone otomatis dari kota yang dipilih */}
          <input
            value={formatTimezoneLabel(state.draftProfile.timezone) || ""}
            readOnly
            placeholder="Automatically filled based on city"
            className={inputClass(true)}
          />
          <p className="text-[11px] text-slate-400">Timezone is automatically filled based on your city selection.</p>
        </label>
      </div>

      {/* ── Row 4: Country | States | City ───────────────────────────── */}
      <div className="grid gap-4 md:grid-cols-3">
        <label className="space-y-1.5">
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Country</span>
          <SearchableSelect
            value={state.draftProfile.country || ""}
            options={state.countryOptions}
            placeholder="Select Country"
            disabled={ro}
            onChange={state.handleCountryChange}
          />
        </label>

        <label className="space-y-1.5">
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">States</span>
          <SearchableSelect
            value={state.draftProfile.state || ""}
            options={state.stateOptions}
            placeholder={state.draftProfile.country ? "Select Province" : "Select Country first"}
            disabled={ro || !state.draftProfile.country}
            onChange={state.handleStateChange}
          />
        </label>

        <label className="space-y-1.5">
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">City</span>
          <SearchableSelect
            value={state.draftProfile.city || ""}
            options={state.cityOptions}
            placeholder={state.draftProfile.state ? "Select City" : "Select Province first"}
            disabled={ro || !state.draftProfile.state}
            onChange={state.handleCityChange}
          />
          <AutoSaveHint state={state} />
        </label>
      </div>

      {/* ── Row 5: About Me ───────────────────────────────────────────── */}
      <label className="space-y-1.5">
        <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
          About Me
        </span>
        <textarea
          rows={4}
          value={state.draftProfile.bio}
          onChange={state.handleDraftChange("bio")}
          readOnly={ro}
          placeholder="Tell us a little about yourself..."
          className={`w-full resize-none rounded-xl border px-4 py-3 text-sm outline-none transition-colors ${
            ro
              ? "border-slate-200 bg-slate-50 text-slate-500 dark:border-slate-700 dark:bg-slate-900/50 dark:text-slate-400"
              : "border-slate-200 bg-white text-slate-900 focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
          }`}
        />
        <p className="text-[11px] text-slate-400">
          {state.draftProfile.bio.length}/400 characters
        </p>
      </label>
    </div>
  );
}
