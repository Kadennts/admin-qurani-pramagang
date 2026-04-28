"use client";

import { useTheme } from "next-themes";
import { Settings } from "lucide-react";

import { useAppPreferences } from "@/components/providers/app-preferences-provider";
import { AppearanceSettings } from "@/features/settings/ui/appearance-settings";
import { LanguageSettings } from "@/features/settings/ui/language-settings";
import { QuranSettings } from "@/features/settings/ui/quran-settings";
import { ActionButtons } from "@/features/settings/ui/action-buttons";
import { useSettings } from "@/features/settings/hooks/use-settings";

export default function SettingsPage() {
  // Mengambil preferensi bahasa dan fungsi terjemahan dari context aplikasi
  const { language, setLanguage, t } = useAppPreferences();
  
  // Mengambil status tema dan fungsi set tema dari next-themes
  const { resolvedTheme, setTheme } = useTheme();
  
  // Menggunakan custom hook yang memisahkan logika (state & actions) pengaturan
  const { settings, setSettings, handleReset, handleSave } = useSettings(language);

  // Menentukan apakah mode saat ini adalah mode gelap
  const isDarkMode = resolvedTheme === "dark";

  return (
    <div className="mx-auto max-w-[1400px] animate-in fade-in pb-12 duration-200">
      <div className="mt-2 mb-10 flex flex-col gap-4">
        {/* Header Halaman Pengaturan */}
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-slate-100 p-3 dark:bg-slate-800">
            <Settings size={24} className="text-slate-800 dark:text-slate-100" strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
              {t("settings.title")}
            </h1>
          </div>
        </div>

        {/* Baris pertama: Pengaturan Tampilan dan Bahasa */}
        <div className="grid gap-4 lg:grid-cols-2">
          <AppearanceSettings
            isDarkMode={isDarkMode}
            setTheme={setTheme}
            t={t}
          />

          <LanguageSettings
            language={language}
            setLanguage={setLanguage}
            t={t}
          />
        </div>
      </div>

      {/* Bagian pengaturan khusus fitur/layar bacaan Quran */}
      <QuranSettings settings={settings} setSettings={setSettings} />

      {/* Tombol Aksi (Reset & Save) di bagian bawah */}
      <ActionButtons onReset={handleReset} onSave={handleSave} />
    </div>
  );
}
