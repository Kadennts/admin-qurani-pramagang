"use client";

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type AppLanguage = "en" | "id";

export type AppProfile = {
  name: string;
  username: string;
  email: string;
  role: string;
  bio: string;
  avatar: string;
};

type TranslationKey =
  | "sidebar.dashboard"
  | "sidebar.support"
  | "sidebar.billing"
  | "sidebar.administrator"
  | "sidebar.masterData"
  | "sidebar.supportTickets"
  | "sidebar.groups"
  | "sidebar.recitation"
  | "sidebar.kycMember"
  | "sidebar.kycOrganization"
  | "sidebar.orders"
  | "sidebar.promo"
  | "sidebar.wallet"
  | "sidebar.users"
  | "sidebar.countries"
  | "sidebar.states"
  | "sidebar.cities"
  | "sidebar.currencies"
  | "sidebar.languages"
  | "sidebar.groupCategories"
  | "sidebar.taxRates"
  | "sidebar.teacher"
  | "sidebar.package"
  | "sidebar.payout"
  | "sidebar.notifications"
  | "sidebar.settings"
  | "sidebar.profile"
  | "sidebar.logout"
  | "sidebar.closeSidebar"
  | "sidebar.expandSidebar"
  | "profile.title"
  | "profile.settingsButton"
  | "profile.edit"
  | "profile.save"
  | "profile.cancel"
  | "profile.name"
  | "profile.email"
  | "profile.role"
  | "profile.description"
  | "profile.photoHint"
  | "profile.changePhoto"
  | "profile.theme"
  | "profile.language"
  | "profile.notificationRecipients"
  | "profile.addRecipient"
  | "profile.noRecipients"
  | "profile.noRecipientsDescription"
  | "profile.toastSaved"
  | "settings.title"
  | "settings.subtitle"
  | "settings.appearance"
  | "settings.appearanceDescription"
  | "settings.languagePreference"
  | "settings.languageDescription"
  | "settings.light"
  | "settings.dark"
  | "auth.loginTitle"
  | "auth.loginSubtitle"
  | "auth.username"
  | "auth.password"
  | "auth.forgotPassword"
  | "auth.login"
  | "auth.signUp"
  | "auth.noAccount"
  | "auth.createAccount"
  | "auth.registerTitle"
  | "auth.registerGoogle"
  | "auth.email"
  | "auth.fullName"
  | "auth.country"
  | "auth.province"
  | "auth.city"
  | "auth.processing"
  | "auth.alreadyHaveAccount"
  | "auth.selectCountry"
  | "auth.selectProvince"
  | "auth.selectCity"
  | "common.english"
  | "common.indonesian";

type PreferencesContextValue = {
  language: AppLanguage;
  setLanguage: (language: AppLanguage) => void;
  profile: AppProfile;
  updateProfile: (profile: AppProfile) => void;
  t: (key: TranslationKey) => string;
};

const STORAGE_LANGUAGE_KEY = "qurani-language";
const STORAGE_PROFILE_KEY = "qurani-profile";

const translations: Record<AppLanguage, Record<TranslationKey, string>> = {
  en: {
    "sidebar.dashboard": "Dashboard",
    "sidebar.support": "Support",
    "sidebar.billing": "Billing",
    "sidebar.administrator": "Administrator",
    "sidebar.masterData": "Master Data",
    "sidebar.supportTickets": "Support Tickets",
    "sidebar.groups": "Groups",
    "sidebar.recitation": "Recitation",
    "sidebar.kycMember": "KYC Member",
    "sidebar.kycOrganization": "KYC Organization",
    "sidebar.orders": "Orders",
    "sidebar.promo": "Promo & Coupon",
    "sidebar.wallet": "Wallet",
    "sidebar.users": "Users",
    "sidebar.countries": "Countries",
    "sidebar.states": "States",
    "sidebar.cities": "Cities",
    "sidebar.currencies": "Currencies",
    "sidebar.languages": "Languages",
    "sidebar.groupCategories": "Group Categories",
    "sidebar.taxRates": "Tax Rates",
    "sidebar.teacher": "Teacher",
    "sidebar.package": "Package",
    "sidebar.payout": "Payout",
    "sidebar.notifications": "Notifications",
    "sidebar.settings": "Settings",
    "sidebar.profile": "Profile",
    "sidebar.logout": "Logout",
    "sidebar.closeSidebar": "Close sidebar",
    "sidebar.expandSidebar": "Expand sidebar",
    "profile.title": "Profile",
    "profile.settingsButton": "Qurani Settings",
    "profile.edit": "Edit Profile",
    "profile.save": "Save",
    "profile.cancel": "Cancel",
    "profile.name": "Name",
    "profile.email": "Email",
    "profile.role": "Role",
    "profile.description": "Description",
    "profile.photoHint": "Use a clear photo so your team can recognize you easily.",
    "profile.changePhoto": "Change photo",
    "profile.theme": "Theme",
    "profile.language": "Language",
    "profile.notificationRecipients": "Notification Recipients",
    "profile.addRecipient": "Add Recipient",
    "profile.noRecipients": "No notification recipients selected",
    "profile.noRecipientsDescription": "Add people to receive notifications about your recitations",
    "profile.toastSaved": "Profile updated successfully!",
    "settings.title": "Qurani Settings",
    "settings.subtitle": "Adjust your reading experience, appearance, and language preferences.",
    "settings.appearance": "Appearance",
    "settings.appearanceDescription": "Switch between light and dark mode for a more comfortable view.",
    "settings.languagePreference": "Language",
    "settings.languageDescription": "Choose your preferred language for the dashboard interface.",
    "settings.light": "Light",
    "settings.dark": "Dark",
    "auth.loginTitle": "Login to your account",
    "auth.loginSubtitle": "Sign in to continue to your Qurani dashboard.",
    "auth.username": "Username",
    "auth.password": "Password",
    "auth.forgotPassword": "Forgot your password?",
    "auth.login": "Login",
    "auth.signUp": "Sign up",
    "auth.noAccount": "Don't have an account?",
    "auth.createAccount": "Create account",
    "auth.registerTitle": "Create your account",
    "auth.registerGoogle": "Sign up with Google",
    "auth.email": "Email",
    "auth.fullName": "Full Name",
    "auth.country": "Country",
    "auth.province": "Province",
    "auth.city": "City",
    "auth.processing": "Processing...",
    "auth.alreadyHaveAccount": "Already have an account?",
    "auth.selectCountry": "Select Country",
    "auth.selectProvince": "Select Province",
    "auth.selectCity": "Select City",
    "common.english": "English",
    "common.indonesian": "Bahasa Indonesia",
  },
  id: {
    "sidebar.dashboard": "Dashboard",
    "sidebar.support": "Support",
    "sidebar.billing": "Billing",
    "sidebar.administrator": "Administrator",
    "sidebar.masterData": "Master Data",
    "sidebar.supportTickets": "Tiket Support",
    "sidebar.groups": "Grup",
    "sidebar.recitation": "Tilawah",
    "sidebar.kycMember": "KYC Member",
    "sidebar.kycOrganization": "KYC Organisasi",
    "sidebar.orders": "Pesanan",
    "sidebar.promo": "Promo & Kupon",
    "sidebar.wallet": "Wallet",
    "sidebar.users": "Pengguna",
    "sidebar.countries": "Negara",
    "sidebar.states": "Provinsi",
    "sidebar.cities": "Kota",
    "sidebar.currencies": "Mata Uang",
    "sidebar.languages": "Bahasa",
    "sidebar.groupCategories": "Kategori Grup",
    "sidebar.taxRates": "Tarif Pajak",
    "sidebar.teacher": "Guru",
    "sidebar.package": "Paket",
    "sidebar.payout": "Payout",
    "sidebar.notifications": "Notifikasi",
    "sidebar.settings": "Pengaturan",
    "sidebar.profile": "Profil",
    "sidebar.logout": "Keluar",
    "sidebar.closeSidebar": "Tutup sidebar",
    "sidebar.expandSidebar": "Buka sidebar",
    "profile.title": "Profil",
    "profile.settingsButton": "Pengaturan Qurani",
    "profile.edit": "Edit Profil",
    "profile.save": "Simpan",
    "profile.cancel": "Batal",
    "profile.name": "Nama",
    "profile.email": "Email",
    "profile.role": "Peran",
    "profile.description": "Penjelasan",
    "profile.photoHint": "Gunakan foto yang jelas agar tim mudah mengenali Anda.",
    "profile.changePhoto": "Ubah foto",
    "profile.theme": "Tema",
    "profile.language": "Bahasa",
    "profile.notificationRecipients": "Penerima Notifikasi",
    "profile.addRecipient": "Tambah Penerima",
    "profile.noRecipients": "Belum ada penerima notifikasi",
    "profile.noRecipientsDescription": "Tambahkan orang untuk menerima notifikasi tentang tilawah Anda",
    "profile.toastSaved": "Profil Berhasil Diubah!",
    "settings.title": "Pengaturan Qurani",
    "settings.subtitle": "Atur pengalaman membaca, tampilan, dan preferensi bahasa Anda.",
    "settings.appearance": "Tampilan",
    "settings.appearanceDescription": "Ganti antara mode terang dan gelap agar lebih nyaman dilihat.",
    "settings.languagePreference": "Bahasa",
    "settings.languageDescription": "Pilih bahasa utama yang ingin dipakai di dashboard.",
    "settings.light": "Terang",
    "settings.dark": "Gelap",
    "auth.loginTitle": "Masuk ke akun Anda",
    "auth.loginSubtitle": "Masuk untuk melanjutkan ke dashboard Qurani Anda.",
    "auth.username": "Username",
    "auth.password": "Password",
    "auth.forgotPassword": "Lupa password?",
    "auth.login": "Masuk",
    "auth.signUp": "Daftar",
    "auth.noAccount": "Belum punya akun?",
    "auth.createAccount": "Buat akun",
    "auth.registerTitle": "Buat akun Anda",
    "auth.registerGoogle": "Daftar dengan Google",
    "auth.email": "Email",
    "auth.fullName": "Nama Lengkap",
    "auth.country": "Negara",
    "auth.province": "Provinsi",
    "auth.city": "Kota",
    "auth.processing": "Memproses...",
    "auth.alreadyHaveAccount": "Sudah punya akun?",
    "auth.selectCountry": "Pilih Negara",
    "auth.selectProvince": "Pilih Provinsi",
    "auth.selectCity": "Pilih Kota",
    "common.english": "English",
    "common.indonesian": "Bahasa Indonesia",
  },
};

const defaultProfile: AppProfile = {
  name: "Admin",
  username: "admin",
  email: "superadmin@gmail.com",
  role: "Admin",
  bio: "Admin",
  avatar: "",
};

const PreferencesContext = createContext<PreferencesContextValue | null>(null);

function slugifyName(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "") || "admin";
}

function normalizeProfile(value: Partial<AppProfile> | null | undefined): AppProfile {
  const name = value?.name?.trim() || defaultProfile.name;
  const role = value?.role?.trim() || defaultProfile.role;

  return {
    name,
    username: value?.username?.trim() || slugifyName(name),
    email: value?.email?.trim() || defaultProfile.email,
    role,
    bio: value?.bio?.trim() || role,
    avatar: value?.avatar?.trim() || "",
  };
}

function readUserCookie() {
  if (typeof document === "undefined") {
    return null;
  }

  const rawCookie = document.cookie
    .split("; ")
    .find((entry) => entry.startsWith("myqurani_user="));

  if (!rawCookie) {
    return null;
  }

  try {
    const parsed = JSON.parse(decodeURIComponent(rawCookie.split("=")[1]));

    return normalizeProfile({
      name: parsed.name,
      username: parsed.username,
      email: parsed.email,
      role: parsed.role,
      bio: parsed.role,
    });
  } catch {
    return null;
  }
}

function getInitialLanguage(): AppLanguage {
  if (typeof window === "undefined") {
    return "en";
  }

  return window.localStorage.getItem(STORAGE_LANGUAGE_KEY) === "id" ? "id" : "en";
}

function getInitialProfile(): AppProfile {
  if (typeof window === "undefined") {
    return defaultProfile;
  }

  const storedProfile = window.localStorage.getItem(STORAGE_PROFILE_KEY);
  if (storedProfile) {
    try {
      return normalizeProfile(JSON.parse(storedProfile));
    } catch {
      window.localStorage.removeItem(STORAGE_PROFILE_KEY);
    }
  }

  return readUserCookie() ?? defaultProfile;
}

export function AppPreferencesProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [language, setLanguageState] = useState<AppLanguage>(getInitialLanguage);
  const [profile, setProfile] = useState<AppProfile>(getInitialProfile);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_LANGUAGE_KEY, language);
    document.documentElement.lang = language;
  }, [language]);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_PROFILE_KEY, JSON.stringify(profile));
  }, [profile]);

  const setLanguage = useCallback((value: AppLanguage) => {
    setLanguageState(value);
  }, []);

  const updateProfile = useCallback((value: AppProfile) => {
    setProfile(normalizeProfile(value));
  }, []);

  const t = useCallback(
    (key: TranslationKey) => {
      return translations[language][key] ?? translations.en[key];
    },
    [language],
  );

  const contextValue = useMemo(
    () => ({
      language,
      setLanguage,
      profile,
      updateProfile,
      t,
    }),
    [language, profile, setLanguage, t, updateProfile],
  );

  return (
    <PreferencesContext.Provider value={contextValue}>
      {children}
    </PreferencesContext.Provider>
  );
}

export function useAppPreferences() {
  const context = useContext(PreferencesContext);

  if (!context) {
    throw new Error("useAppPreferences must be used within AppPreferencesProvider");
  }

  return context;
}
