import { useState } from "react";
import { toast } from "sonner";
import { QuranSettings } from "../model/types";
import { DEFAULT_QURAN_SETTINGS } from "../data/constants";
import { AppLanguage } from "@/components/providers/app-preferences-provider";

export function useSettings(currentLanguage: AppLanguage) {
  // State untuk menyimpan pengaturan
  const [settings, setSettings] = useState<QuranSettings>(DEFAULT_QURAN_SETTINGS);

  // Fungsi untuk mengembalikan pengaturan ke nilai awal (default)
  const handleReset = () => {
    setSettings(DEFAULT_QURAN_SETTINGS);
    toast(
      currentLanguage === "id"
        ? "Pengaturan telah di-reset ke nilai bawaan."
        : "Settings have been reset to default values.",
      {
        icon: "🔄",
      }
    );
  };

  // Fungsi untuk menyimpan pengaturan
  const handleSave = () => {
    toast.success(
      currentLanguage === "id"
        ? "Pengaturan berhasil disimpan."
        : "Settings saved successfully."
    );
    // TODO: Implement API call or local storage save here if needed
  };

  return {
    settings,
    setSettings,
    handleReset,
    handleSave,
  };
}
