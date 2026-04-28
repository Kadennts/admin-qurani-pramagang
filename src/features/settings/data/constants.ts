import { QuranSettings } from "../model/types";

// Nilai bawaan (default) untuk pengaturan Quran
export const DEFAULT_QURAN_SETTINGS: QuranSettings = {
  layoutType: "Flexible",
  fontType: "IndoPak",
  fontSize: 3,
  pageMode: "Show",
};

// Pilihan font yang tersedia
export const FONT_OPTIONS = [
  { value: "IndoPak", label: "IndoPak" },
  { value: "Uthmani", label: "Uthmani" },
  { value: "KFGQPC", label: "KFGQPC Uthmanic Script" },
];
