import { Globe } from "lucide-react";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { LanguageSettingsProps } from "../model/types";

/**
 * Komponen LanguageSettings
 * Menampilkan bagian pengaturan preferensi bahasa aplikasi.
 */
export function LanguageSettings({ language, setLanguage, t }: LanguageSettingsProps) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900">
      {/* Header bagian pengaturan bahasa yang berisi ikon, judul, dan deskripsi */}
      <div className="mb-4 flex items-start gap-3">
        {/* Ikon globe dengan latar belakang berwarna biru muda (sky) */}
        <div className="rounded-2xl bg-sky-50 p-3 text-sky-500 dark:bg-sky-500/10 dark:text-sky-300">
          <Globe size={18} />
        </div>
        <div>
          {/* Judul dan deskripsi yang diterjemahkan menggunakan fungsi t() */}
          <h2 className="font-bold text-slate-900 dark:text-white">
            {t("settings.languagePreference")}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {t("settings.languageDescription")}
          </p>
        </div>
      </div>

      {/* Memanggil komponen LanguageSwitcher untuk menampilkan pilihan bahasa */}
      <LanguageSwitcher value={language} onChange={setLanguage} />
    </div>
  );
}
