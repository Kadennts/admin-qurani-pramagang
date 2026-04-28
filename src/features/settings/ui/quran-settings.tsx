import { ChevronDown, Minus, Plus } from "lucide-react";
import { QuranSettingsProps } from "../model/types";
import { FONT_OPTIONS } from "../data/constants";

/**
 * Komponen QuranSettings
 * Menampilkan bagian pengaturan tata letak, font, dan mode halaman untuk tampilan Al-Quran.
 */
export function QuranSettings({ settings, setSettings }: QuranSettingsProps) {
  return (
    <div className="max-w-4xl space-y-8 rounded-none md:pr-10">
      {/* Pengaturan Layout Type */}
      <div className="space-y-4">
        <h3 className="text-sm font-extrabold uppercase tracking-widest text-slate-700 dark:text-slate-300">
          Layout Type
        </h3>
        <div className="flex items-center gap-6">
          <label className="group flex cursor-pointer items-center gap-2">
            <div
              className={`flex h-5 w-5 items-center justify-center rounded-full border-2 transition-colors ${
                settings.layoutType === "Flexible"
                  ? "border-blue-500"
                  : "border-slate-300 group-hover:border-slate-400 dark:border-slate-700 dark:group-hover:border-slate-500"
              }`}
            >
              {settings.layoutType === "Flexible" && (
                <div className="h-2.5 w-2.5 rounded-full bg-blue-500" />
              )}
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
              className={`flex h-5 w-5 items-center justify-center rounded-full border-2 transition-colors ${
                settings.layoutType === "Mushaf Uthmani"
                  ? "border-blue-500"
                  : "border-slate-300 group-hover:border-slate-400 dark:border-slate-700 dark:group-hover:border-slate-500"
              }`}
            >
              {settings.layoutType === "Mushaf Uthmani" && (
                <div className="h-2.5 w-2.5 rounded-full bg-blue-500" />
              )}
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

      {/* Pengaturan Font Type */}
      <div className="space-y-4">
        <h3 className="text-sm font-extrabold uppercase tracking-widest text-slate-700 dark:text-slate-300">
          Font Type
        </h3>
        <div className="relative w-full max-w-[240px]">
          <select
            value={settings.fontType}
            onChange={(event) =>
              setSettings({ ...settings, fontType: event.target.value })
            }
            className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-2.5 pl-4 pr-10 text-sm font-semibold text-slate-600 shadow-sm outline-none transition-colors focus:border-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-slate-500"
          >
            {FONT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown
            size={16}
            className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-slate-400 dark:text-slate-500"
          />
        </div>
      </div>

      {/* Pengaturan Font Size */}
      <div className="space-y-4">
        <h3 className="text-sm font-extrabold uppercase tracking-widest text-slate-700 dark:text-slate-300">
          Font Size
        </h3>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() =>
              setSettings({
                ...settings,
                fontSize: Math.max(1, settings.fontSize - 1),
              })
            }
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            <Minus size={18} />
          </button>

          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white font-extrabold text-slate-800 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-white">
            {settings.fontSize}
          </div>

          <button
            type="button"
            onClick={() =>
              setSettings({
                ...settings,
                fontSize: Math.min(10, settings.fontSize + 1),
              })
            }
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            <Plus size={18} />
          </button>
        </div>
      </div>

      {/* Preview Teks Quran */}
      <div className="relative flex w-full items-center justify-center overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900 md:p-8">
        <p
          className="text-center font-bold leading-relaxed text-slate-800 transition-all dark:text-white"
          style={{ fontSize: `${1.5 + settings.fontSize * 0.25}rem` }}
        >
          بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
        </p>
      </div>

      {/* Pengaturan Page Mode */}
      <div className="space-y-4">
        <h3 className="text-sm font-extrabold uppercase tracking-widest text-slate-700 dark:text-slate-300">
          Page Mode
        </h3>
        <div className="flex items-center gap-6">
          <label className="group flex cursor-pointer items-center gap-2">
            <div
              className={`flex h-5 w-5 items-center justify-center rounded-full border-2 transition-colors ${
                settings.pageMode === "Show"
                  ? "border-blue-500"
                  : "border-slate-300 group-hover:border-slate-400 dark:border-slate-700 dark:group-hover:border-slate-500"
              }`}
            >
              {settings.pageMode === "Show" && (
                <div className="h-2.5 w-2.5 rounded-full bg-blue-500" />
              )}
            </div>
            <input
              type="radio"
              className="hidden"
              checked={settings.pageMode === "Show"}
              onChange={() => setSettings({ ...settings, pageMode: "Show" })}
            />
            <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">
              Show
            </span>
          </label>

          <label className="group flex cursor-pointer items-center gap-2">
            <div
              className={`flex h-5 w-5 items-center justify-center rounded-full border-2 transition-colors ${
                settings.pageMode === "Hide"
                  ? "border-blue-500"
                  : "border-slate-300 group-hover:border-slate-400 dark:border-slate-700 dark:group-hover:border-slate-500"
              }`}
            >
              {settings.pageMode === "Hide" && (
                <div className="h-2.5 w-2.5 rounded-full bg-blue-500" />
              )}
            </div>
            <input
              type="radio"
              className="hidden"
              checked={settings.pageMode === "Hide"}
              onChange={() => setSettings({ ...settings, pageMode: "Hide" })}
            />
            <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">
              Hide
            </span>
          </label>
        </div>
      </div>

      {/* Pengaturan lainnya */}
      <div className="space-y-6 pt-2">
        <h3 className="text-sm font-extrabold uppercase tracking-widest text-slate-700 dark:text-slate-300">
          Verse Errors
        </h3>
        <h3 className="pb-10 text-sm font-extrabold uppercase tracking-widest text-slate-700 dark:text-slate-300">
          Word Errors
        </h3>
      </div>
    </div>
  );
}
