"use client";

import Link from "next/link";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";
import {
  Bell,
  Briefcase,
  Camera,
  Globe,
  Mail,
  Moon,
  Plus,
  Settings,
  Sun,
  User,
  X,
} from "lucide-react";
import { toast } from "sonner";

import {
  AppProfile,
  useAppPreferences,
} from "@/components/providers/app-preferences-provider";

const recipients = [
  "Admin Dashboard",
  "Support Team",
  "Recitation Reviewer",
];

export default function ProfilePage() {
  const { language, profile, setLanguage, t, updateProfile } = useAppPreferences();
  const { resolvedTheme, setTheme } = useTheme();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [draftProfile, setDraftProfile] = useState<AppProfile>(profile);

  useEffect(() => {
    setDraftProfile(profile);
  }, [profile]);

  const avatarSrc =
    draftProfile.avatar ||
    `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(draftProfile.name)}`;

  const isDarkMode = resolvedTheme === "dark";

  const handleDraftChange =
    (field: keyof AppProfile) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setDraftProfile((current) => ({
        ...current,
        [field]: event.target.value,
      }));
    };

  const handlePhotoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;

      if (typeof result === "string") {
        setDraftProfile((current) => ({
          ...current,
          avatar: result,
        }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    updateProfile(draftProfile);
    setIsEditing(false);
    toast.success(language === "id" ? "Profil Berhasil Diubah!" : t("profile.toastSaved"));
  };

  const handleCancel = () => {
    setDraftProfile(profile);
    setIsEditing(false);
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900 md:p-8">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3 text-slate-900 dark:text-white">
            <div className="rounded-2xl bg-slate-100 p-3 dark:bg-slate-800">
              <User size={22} className="text-slate-700 dark:text-slate-200" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{t("profile.title")}</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {language === "id"
                  ? "Kelola informasi akun dan preferensi tampilan Anda."
                  : "Manage your account information and display preferences."}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/dashboard/settings"
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              {t("profile.settingsButton")}
            </Link>

            {isEditing ? (
              <>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  <X size={16} />
                  {t("profile.cancel")}
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-5 py-2 text-sm font-bold text-white transition-colors hover:bg-emerald-700"
                >
                  {t("profile.save")}
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-5 py-2 text-sm font-bold text-white transition-colors hover:bg-emerald-700"
              >
                {t("profile.edit")}
              </button>
            )}
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[280px_minmax(0,1fr)]">
          <div className="space-y-4">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 transition-colors dark:border-slate-800 dark:bg-slate-950">
              <div className="relative mx-auto h-32 w-32 overflow-hidden rounded-full border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
                <img src={avatarSrc} alt={draftProfile.name} className="h-full w-full object-cover" />
                {isEditing ? (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-2 right-2 inline-flex h-10 w-10 items-center justify-center rounded-full bg-emerald-600 text-white shadow-lg transition-colors hover:bg-emerald-700"
                  >
                    <Camera size={18} />
                  </button>
                ) : null}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handlePhotoChange}
              />

              <p className="mt-4 text-center text-sm text-slate-500 dark:text-slate-400">
                {t("profile.photoHint")}
              </p>
              {isEditing ? (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-4 w-full rounded-xl border border-dashed border-emerald-300 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 transition-colors hover:bg-emerald-100 dark:border-emerald-500/40 dark:bg-emerald-500/10 dark:text-emerald-300 dark:hover:bg-emerald-500/15"
                >
                  {t("profile.changePhoto")}
                </button>
              ) : null}
            </div>
          </div>

          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <label className="space-y-2">
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                  {t("profile.name")}
                </span>
                <input
                  value={draftProfile.name}
                  onChange={handleDraftChange("name")}
                  readOnly={!isEditing}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-colors focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:border-emerald-400"
                />
              </label>

              <label className="space-y-2">
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                  {t("profile.role")}
                </span>
                <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 transition-colors dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200">
                  <Briefcase size={16} className="text-slate-400 dark:text-slate-500" />
                  <span>{draftProfile.role}</span>
                </div>
              </label>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="space-y-2">
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                  {t("profile.email")}
                </span>
                <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 transition-colors dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200">
                  <Mail size={16} className="text-slate-400 dark:text-slate-500" />
                  <span>{draftProfile.email}</span>
                </div>
              </label>

              <label className="space-y-2">
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                  Username
                </span>
                <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 transition-colors dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200">
                  @{draftProfile.username}
                </div>
              </label>
            </div>

            <label className="space-y-2">
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                {t("profile.description")}
              </span>
              <textarea
                rows={5}
                value={draftProfile.bio}
                onChange={handleDraftChange("bio")}
                readOnly={!isEditing}
                className="w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-colors focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:border-emerald-400"
              />
            </label>
          </div>
        </div>

        <div className="my-8 border-t border-slate-100 dark:border-slate-800" />

        <div className="space-y-4">
          <div className="flex items-center gap-3 text-slate-900 dark:text-white">
            <div className="rounded-2xl bg-slate-100 p-3 dark:bg-slate-800">
              <Settings size={20} className="text-slate-700 dark:text-slate-200" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight">{t("sidebar.settings")}</h2>
          </div>

          <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 transition-colors dark:border-slate-800 dark:bg-slate-950">
              <div className="flex items-center gap-3">
                <Sun size={20} className={isDarkMode ? "text-slate-500" : "text-amber-500"} />
                <div>
                  <div className="font-semibold text-slate-900 dark:text-white">{t("profile.theme")}</div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">
                    {isDarkMode ? t("settings.dark") : t("settings.light")}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setTheme(isDarkMode ? "light" : "dark")}
                className={`relative h-7 w-14 rounded-full transition-colors ${isDarkMode ? "bg-emerald-600" : "bg-slate-300 dark:bg-slate-700"}`}
              >
                <span
                  className={`absolute top-1 flex h-5 w-5 items-center justify-center rounded-full bg-white text-slate-700 shadow-sm transition-all ${isDarkMode ? "left-8" : "left-1"}`}
                >
                  {isDarkMode ? <Moon size={12} /> : <Sun size={12} />}
                </span>
              </button>
            </div>

            <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 transition-colors dark:border-slate-800 dark:bg-slate-950">
              <div className="flex items-center gap-3">
                <Globe size={20} className="text-blue-500" />
                <div>
                  <div className="font-semibold text-slate-900 dark:text-white">{t("profile.language")}</div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">
                    {language === "id" ? t("common.indonesian") : t("common.english")}
                  </div>
                </div>
              </div>

              <select
                value={language}
                onChange={(event) => setLanguage(event.target.value as "en" | "id")}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 outline-none transition-colors focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-emerald-400"
              >
                <option value="en">{t("common.english")}</option>
                <option value="id">{t("common.indonesian")}</option>
              </select>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 transition-colors dark:border-slate-800 dark:bg-slate-950">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <Bell size={20} className="text-emerald-500" />
                <div>
                  <div className="font-semibold text-slate-900 dark:text-white">
                    {t("profile.notificationRecipients")}
                  </div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">
                    {language === "id"
                      ? "Pilih tim yang perlu menerima notifikasi penting."
                      : "Choose who should receive important updates."}
                  </div>
                </div>
              </div>

              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
              >
                <Plus size={16} />
                {t("profile.addRecipient")}
              </button>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 transition-colors dark:border-slate-700 dark:bg-slate-900">
              {recipients.length > 0 ? (
                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  {recipients.map((recipient) => (
                    <div
                      key={recipient}
                      className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 transition-colors dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
                    >
                      {recipient}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-10 text-center">
                  <Bell size={32} className="mx-auto mb-3 text-slate-300 dark:text-slate-600" />
                  <h4 className="font-semibold text-slate-600 dark:text-slate-300">
                    {t("profile.noRecipients")}
                  </h4>
                  <p className="mt-1 text-sm text-slate-400 dark:text-slate-500">
                    {t("profile.noRecipientsDescription")}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
