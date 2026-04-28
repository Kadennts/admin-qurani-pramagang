import { AppLanguage, useAppPreferences } from "@/components/providers/app-preferences-provider";

// Mendefinisikan tipe data untuk state pengaturan Quran
export type QuranSettings = {
  layoutType: string;
  fontType: string;
  fontSize: number;
  pageMode: string;
};

type TFunction = ReturnType<typeof useAppPreferences>["t"];

// Mendefinisikan tipe props untuk komponen AppearanceSettings
export type AppearanceSettingsProps = {
  isDarkMode: boolean;
  setTheme: (theme: string) => void;
  t: TFunction;
};

// Mendefinisikan tipe props untuk komponen LanguageSettings
export type LanguageSettingsProps = {
  language: AppLanguage;
  setLanguage: (lang: AppLanguage) => void;
  t: TFunction;
};

// Mendefinisikan tipe props untuk komponen QuranSettings
export type QuranSettingsProps = {
  settings: QuranSettings;
  setSettings: (settings: QuranSettings) => void;
};
