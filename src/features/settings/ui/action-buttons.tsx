/**
 * Komponen ActionButtons
 * Menampilkan tombol Reset dan Save pada bagian bawah halaman pengaturan.
 */
type ActionButtonsProps = {
  onReset: () => void;
  onSave: () => void;
};

export function ActionButtons({ onReset, onSave }: ActionButtonsProps) {
  return (
    <div
      className="fixed right-0 bottom-0 left-0 z-40 flex items-center justify-end gap-3 border-t border-slate-200 bg-white/85 px-6 py-4 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/85"
      style={{ marginLeft: "var(--sidebar-width, 280px)" }}
    >
      <button
        type="button"
        onClick={onReset}
        className="rounded-full border border-slate-200 bg-white px-6 py-2.5 text-sm font-bold text-slate-500 shadow-sm transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
      >
        Reset
      </button>
      <button
        type="button"
        onClick={onSave}
        className="rounded-full bg-emerald-600 px-8 py-2.5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-emerald-700"
      >
        Save
      </button>
    </div>
  );
}
