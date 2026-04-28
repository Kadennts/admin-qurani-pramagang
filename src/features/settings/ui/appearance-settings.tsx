import { Moon, Sun } from "lucide-react";
import { AppearanceSettingsProps } from "../model/types";

/**
 * Komponen AppearanceSettings
 * Menampilkan bagian pengaturan tampilan antarmuka aplikasi (Mode Terang / Gelap).
 */
export function AppearanceSettings({ isDarkMode, setTheme, t }: AppearanceSettingsProps) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900">
      {/* Header bagian pengaturan tampilan yang berisi ikon, judul, dan deskripsi */}
      <div className="mb-4 flex items-start gap-3">
        {/* Ikon matahari dengan latar belakang berwarna kuning keemasan (amber) */}
        <div className="rounded-2xl bg-amber-50 p-3 text-amber-500 dark:bg-amber-500/10 dark:text-amber-300">
          <Sun size={18} />
        </div>
        <div>
          {/* Judul dan deskripsi yang diterjemahkan menggunakan fungsi t() */}
          <h2 className="font-bold text-slate-900 dark:text-white">
            {t("settings.appearance")}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {t("settings.appearanceDescription")}
          </p>
        </div>
      </div>

      {/* Tombol saklar (toggle) untuk mengubah tema antara terang dan gelap */}
      <button
        type="button"
        onClick={() => setTheme(isDarkMode ? "light" : "dark")} // Mengganti tema saat diklik
        className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 transition-colors dark:border-slate-700 dark:bg-slate-950"
      >
        <div className="flex items-center gap-3">
          {/* Menampilkan ikon bulan atau matahari berdasarkan mode yang sedang aktif */}
          {isDarkMode ? (
            <Moon size={18} className="text-slate-600 dark:text-slate-300" />
          ) : (
            <Sun size={18} className="text-amber-500" />
          )}
          {/* Teks penanda mode terang atau gelap */}
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
            {isDarkMode ? t("settings.dark") : t("settings.light")}
          </span>
        </div>
        
        {/* Visualisasi saklar (toggle switch) */}
        <div
          className={`relative h-7 w-14 rounded-full transition-colors ${
            isDarkMode ? "bg-emerald-600" : "bg-slate-300 dark:bg-slate-700"
          }`}
        >
          {/* Lingkaran putih yang bergeser ke kiri atau kanan sebagai penanda */}
          <span
            className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm transition-all ${
              isDarkMode ? "left-8" : "left-1"
            }`}
          />
        </div>
      </button>
    </div>
  );
}
