"use client";

import { useState } from "react";
import { useTheme } from "next-themes";
import {
  ChevronDown,
  Globe,
  Minus,
  Moon,
  Plus,
  Settings,
  Sun,
} from "lucide-react";
import { toast } from "sonner";

import { useAppPreferences } from "@/components/providers/app-preferences-provider";

export default function SettingsPage() {
  const DEFAULT_SETTINGS = {
    layoutType: "Flexible",
    fontType: "IndoPak",
    fontSize: 3,
    pageMode: "Show",
  };

  const { language, setLanguage, t } = useAppPreferences();
  const { resolvedTheme, setTheme } = useTheme();
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);

  const isDarkMode = resolvedTheme === "dark";

  const handleReset = () => {
    setSettings(DEFAULT_SETTINGS);
    toast(language === "id" ? "Pengaturan telah di-reset ke nilai bawaan." : "Settings have been reset to default values.", {
      icon: "🔄",
    });
  };

  const handleSave = () => {
    toast.success(language === "id" ? "Pengaturan berhasil disimpan." : "Settings saved successfully.");
  };

  return (
    <div className="mx-auto max-w-[1400px] animate-in fade-in pb-12 duration-200">
      <div className="mt-2 mb-10 flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-slate-100 p-3 dark:bg-slate-800">
            <Settings size={24} className="text-slate-800 dark:text-slate-100" strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
              {t("settings.title")}
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">{t("settings.subtitle")}</p>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-4 flex items-start gap-3">
              <div className="rounded-2xl bg-amber-50 p-3 text-amber-500 dark:bg-amber-500/10 dark:text-amber-300">
                <Sun size={18} />
              </div>
              <div>
                <h2 className="font-bold text-slate-900 dark:text-white">{t("settings.appearance")}</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {t("settings.appearanceDescription")}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setTheme(isDarkMode ? "light" : "dark")}
              className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 transition-colors dark:border-slate-700 dark:bg-slate-950"
            >
              <div className="flex items-center gap-3">
                {isDarkMode ? (
                  <Moon size={18} className="text-slate-600 dark:text-slate-300" />
                ) : (
                  <Sun size={18} className="text-amber-500" />
                )}
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                  {isDarkMode ? t("settings.dark") : t("settings.light")}
                </span>
              </div>
              <div className={`relative h-7 w-14 rounded-full transition-colors ${isDarkMode ? "bg-emerald-600" : "bg-slate-300 dark:bg-slate-700"}`}>
                <span
                  className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm transition-all ${isDarkMode ? "left-8" : "left-1"}`}
                />
              </div>
            </button>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-4 flex items-start gap-3">
              <div className="rounded-2xl bg-sky-50 p-3 text-sky-500 dark:bg-sky-500/10 dark:text-sky-300">
                <Globe size={18} />
              </div>
              <div>
                <h2 className="font-bold text-slate-900 dark:text-white">
                  {t("settings.languagePreference")}
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {t("settings.languageDescription")}
                </p>
              </div>
            </div>

            <select
              value={language}
              onChange={(event) => setLanguage(event.target.value as "en" | "id")}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 outline-none transition-colors focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:focus:border-emerald-400"
            >
              <option value="en">{t("common.english")}</option>
              <option value="id">{t("common.indonesian")}</option>
            </select>
          </div>
        </div>
      </div>

      <div className="max-w-4xl space-y-8 rounded-none md:pr-10">
        <div className="space-y-4">
          <h3 className="text-sm font-extrabold uppercase tracking-widest text-slate-700 dark:text-slate-300">
            Layout Type
          </h3>
          <div className="flex items-center gap-6">
            <label className="group flex cursor-pointer items-center gap-2">
              <div
                className={`flex h-5 w-5 items-center justify-center rounded-full border-2 transition-colors ${settings.layoutType === "Flexible" ? "border-blue-500" : "border-slate-300 group-hover:border-slate-400 dark:border-slate-700 dark:group-hover:border-slate-500"}`}
              >
                {settings.layoutType === "Flexible" ? (
                  <div className="h-2.5 w-2.5 rounded-full bg-blue-500" />
                ) : null}
              </div>
              <input
                type="radio"
                className="hidden"
                checked={settings.layoutType === "Flexible"}
                onChange={() => setSettings({ ...settings, layoutType: "Flexible" })}
              />
              <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                Flexible
              </span>
            </label>

            <label className="group flex cursor-pointer items-center gap-2">
              <div
                className={`flex h-5 w-5 items-center justify-center rounded-full border-2 transition-colors ${settings.layoutType === "Mushaf Uthmani" ? "border-blue-500" : "border-slate-300 group-hover:border-slate-400 dark:border-slate-700 dark:group-hover:border-slate-500"}`}
              >
                {settings.layoutType === "Mushaf Uthmani" ? (
                  <div className="h-2.5 w-2.5 rounded-full bg-blue-500" />
                ) : null}
              </div>
              <input
                type="radio"
                className="hidden"
                checked={settings.layoutType === "Mushaf Uthmani"}
                onChange={() => setSettings({ ...settings, layoutType: "Mushaf Uthmani" })}
              />
              <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                Mushaf Uthmani
              </span>
            </label>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-extrabold uppercase tracking-widest text-slate-700 dark:text-slate-300">
            Font Type
          </h3>
          <div className="relative w-full max-w-[240px]">
            <select
              value={settings.fontType}
              onChange={(event) => setSettings({ ...settings, fontType: event.target.value })}
              className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-2.5 pl-4 pr-10 text-sm font-semibold text-slate-600 shadow-sm outline-none transition-colors focus:border-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-slate-500"
            >
              <option value="IndoPak">IndoPak</option>
              <option value="Uthmani">Uthmani</option>
              <option value="KFGQPC">KFGQPC Uthmanic Script</option>
            </select>
            <ChevronDown size={16} className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-extrabold uppercase tracking-widest text-slate-700 dark:text-slate-300">
            Font Size
          </h3>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSettings({ ...settings, fontSize: Math.max(1, settings.fontSize - 1) })}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              <Minus size={18} />
            </button>

            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white font-extrabold text-slate-800 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-white">
              {settings.fontSize}
            </div>

            <button
              type="button"
              onClick={() => setSettings({ ...settings, fontSize: Math.min(10, settings.fontSize + 1) })}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              <Plus size={18} />
            </button>
          </div>
        </div>

        <div className="relative flex w-full items-center justify-center overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900 md:p-8">
          <p
            className="text-center font-bold leading-relaxed text-slate-800 transition-all dark:text-white"
            style={{ fontSize: `${1.5 + settings.fontSize * 0.25}rem` }}
          >
            بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-extrabold uppercase tracking-widest text-slate-700 dark:text-slate-300">
            Page Mode
          </h3>
          <div className="flex items-center gap-6">
            <label className="group flex cursor-pointer items-center gap-2">
              <div
                className={`flex h-5 w-5 items-center justify-center rounded-full border-2 transition-colors ${settings.pageMode === "Show" ? "border-blue-500" : "border-slate-300 group-hover:border-slate-400 dark:border-slate-700 dark:group-hover:border-slate-500"}`}
              >
                {settings.pageMode === "Show" ? <div className="h-2.5 w-2.5 rounded-full bg-blue-500" /> : null}
              </div>
              <input
                type="radio"
                className="hidden"
                checked={settings.pageMode === "Show"}
                onChange={() => setSettings({ ...settings, pageMode: "Show" })}
              />
              <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">Show</span>
            </label>

            <label className="group flex cursor-pointer items-center gap-2">
              <div
                className={`flex h-5 w-5 items-center justify-center rounded-full border-2 transition-colors ${settings.pageMode === "Hide" ? "border-blue-500" : "border-slate-300 group-hover:border-slate-400 dark:border-slate-700 dark:group-hover:border-slate-500"}`}
              >
                {settings.pageMode === "Hide" ? <div className="h-2.5 w-2.5 rounded-full bg-blue-500" /> : null}
              </div>
              <input
                type="radio"
                className="hidden"
                checked={settings.pageMode === "Hide"}
                onChange={() => setSettings({ ...settings, pageMode: "Hide" })}
              />
              <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">Hide</span>
            </label>
          </div>
        </div>

        <div className="space-y-6 pt-2">
          <h3 className="text-sm font-extrabold uppercase tracking-widest text-slate-700 dark:text-slate-300">
            Verse Errors
          </h3>
          <h3 className="pb-10 text-sm font-extrabold uppercase tracking-widest text-slate-700 dark:text-slate-300">
            Word Errors
          </h3>
        </div>
      </div>

      <div
        className="fixed right-0 bottom-0 left-0 z-40 flex items-center justify-end gap-3 border-t border-slate-200 bg-white/85 px-6 py-4 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/85"
        style={{ marginLeft: "var(--sidebar-width, 280px)" }}
      >
        <button
          type="button"
          onClick={handleReset}
          className="rounded-full border border-slate-200 bg-white px-6 py-2.5 text-sm font-bold text-slate-500 shadow-sm transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          Reset
        </button>
        <button
          type="button"
          onClick={handleSave}
          className="rounded-full bg-emerald-600 px-8 py-2.5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-emerald-700"
        >
          Save
        </button>
      </div>
    </div>
  );
}
