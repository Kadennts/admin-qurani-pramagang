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

export type AppLanguage = "en" | "id" | "ar";

export type AppProfile = {
  name: string;
  username: string;
  email: string;
  role: string;
  bio: string;
  avatar: string;
  country: string;
  state: string;
  city: string;
  timezone: string;
  // Field baru untuk Edit Profile
  fullName: string;
  nickname: string;
  phone: string;
  gender: string;
  job: string;
  dateOfBirth: string;
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
  | "tickets.all"
  | "tickets.open"
  | "tickets.inProgress"
  | "tickets.answered"
  | "tickets.onHold"
  | "tickets.closed"
  | "tickets.newTicket"
  | "tickets.bulkActions"
  | "tickets.update"
  | "tickets.delete"
  | "tickets.searchPlaceholder"
  | "tickets.dateRange"
  | "tickets.subject"
  | "tickets.status"
  | "tickets.priority"
  | "tickets.department"
  | "tickets.contact"
  | "common.english"
  | "common.indonesian"
  | "common.arabic";

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
    "tickets.all": "All",
    "tickets.open": "Open",
    "tickets.inProgress": "In Progress",
    "tickets.answered": "Answered",
    "tickets.onHold": "On Hold",
    "tickets.closed": "Closed",
    "tickets.newTicket": "New Ticket",
    "tickets.bulkActions": "Bulk Actions",
    "tickets.update": "Update",
    "tickets.delete": "Delete",
    "tickets.searchPlaceholder": "Search tickets...",
    "tickets.dateRange": "Date Range",
    "tickets.subject": "Subject",
    "tickets.status": "Status",
    "tickets.priority": "Priority",
    "tickets.department": "Department",
    "tickets.contact": "Contact",
    "common.english": "English",
    "common.indonesian": "Bahasa Indonesia",
    "common.arabic": "Arabic",
  },
  id: {
    "sidebar.dashboard": "Dashboard",
    "sidebar.support": "Support",
    "sidebar.billing": "Billing",
    "sidebar.administrator": "Administrator",
    "sidebar.masterData": "Master Data",
    "sidebar.supportTickets": "Tiket Support",
    "sidebar.groups": "Grup",
    "sidebar.recitation": "Setoran",
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
    "profile.noRecipientsDescription": "Tambahkan orang untuk menerima notifikasi tentang setoran Anda",
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
    "tickets.all": "Semua",
    "tickets.open": "Open",
    "tickets.inProgress": "Sedang Diproses",
    "tickets.answered": "Dijawab",
    "tickets.onHold": "Ditunda",
    "tickets.closed": "Ditutup",
    "tickets.newTicket": "Tiket Baru",
    "tickets.bulkActions": "Aksi Massal",
    "tickets.update": "Perbarui",
    "tickets.delete": "Hapus",
    "tickets.searchPlaceholder": "Cari tiket...",
    "tickets.dateRange": "Rentang Tanggal",
    "tickets.subject": "Subjek",
    "tickets.status": "Status",
    "tickets.priority": "Prioritas",
    "tickets.department": "Departemen",
    "tickets.contact": "Kontak",
    "common.english": "English",
    "common.indonesian": "Bahasa Indonesia",
    "common.arabic": "Bahasa Arab",
  },
  ar: {
    "sidebar.dashboard": "لوحة القيادة",
    "sidebar.support": "الدعم",
    "sidebar.billing": "الفواتير",
    "sidebar.administrator": "المدير",
    "sidebar.masterData": "البيانات الأساسية",
    "sidebar.supportTickets": "تذاكر الدعم",
    "sidebar.groups": "المجموعات",
    "sidebar.recitation": "التلاوة",
    "sidebar.kycMember": "عضو KYC",
    "sidebar.kycOrganization": "منظمة KYC",
    "sidebar.orders": "الطلبات",
    "sidebar.promo": "الترويج والكوبونات",
    "sidebar.wallet": "المحفظة",
    "sidebar.users": "المستخدمين",
    "sidebar.countries": "الدول",
    "sidebar.states": "الولايات/المقاطعات",
    "sidebar.cities": "المدن",
    "sidebar.currencies": "العملات",
    "sidebar.languages": "اللغات",
    "sidebar.groupCategories": "فئات المجموعات",
    "sidebar.taxRates": "معدلات الضرائب",
    "sidebar.teacher": "المعلم",
    "sidebar.package": "الحزمة",
    "sidebar.payout": "الدفع",
    "sidebar.notifications": "الإشعارات",
    "sidebar.settings": "الإعدادات",
    "sidebar.profile": "الملف الشخصي",
    "sidebar.logout": "تسجيل الخروج",
    "sidebar.closeSidebar": "إغلاق الشريط الجانبي",
    "sidebar.expandSidebar": "توسيع الشريط الجانبي",
    "profile.title": "الملف الشخصي",
    "profile.settingsButton": "إعدادات قرآني",
    "profile.edit": "تعديل الملف الشخصي",
    "profile.save": "حفظ",
    "profile.cancel": "إلغاء",
    "profile.name": "الاسم",
    "profile.email": "البريد الإلكتروني",
    "profile.role": "الدور",
    "profile.description": "الوصف",
    "profile.photoHint": "استخدم صورة واضحة حتى يتمكن فريقك من التعرف عليك بسهولة.",
    "profile.changePhoto": "تغيير الصورة",
    "profile.theme": "المظهر",
    "profile.language": "اللغة",
    "profile.notificationRecipients": "مستلمو الإشعارات",
    "profile.addRecipient": "إضافة مستلم",
    "profile.noRecipients": "لم يتم اختيار مستلمي إشعارات",
    "profile.noRecipientsDescription": "أضف أشخاصًا لتلقي إشعارات حول تلاواتك",
    "profile.toastSaved": "تم تحديث الملف الشخصي بنجاح!",
    "settings.title": "إعدادات قرآني",
    "settings.subtitle": "اضبط تجربة القراءة والمظهر وتفضيلات اللغة.",
    "settings.appearance": "المظهر",
    "settings.appearanceDescription": "بدل بين الوضع الفاتح والداكن لرؤية أكثر راحة.",
    "settings.languagePreference": "اللغة",
    "settings.languageDescription": "اختر لغتك المفضلة لواجهة لوحة القيادة.",
    "settings.light": "فاتح",
    "settings.dark": "داكن",
    "auth.loginTitle": "تسجيل الدخول إلى حسابك",
    "auth.loginSubtitle": "سجل الدخول للمتابعة إلى لوحة قيادة قرآني الخاصة بك.",
    "auth.username": "اسم المستخدم",
    "auth.password": "كلمة المرور",
    "auth.forgotPassword": "نسيت كلمة المرور؟",
    "auth.login": "تسجيل الدخول",
    "auth.signUp": "تسجيل",
    "auth.noAccount": "ليس لديك حساب؟",
    "auth.createAccount": "إنشاء حساب",
    "auth.registerTitle": "إنشاء حسابك",
    "auth.registerGoogle": "التسجيل عبر جوجل",
    "auth.email": "البريد الإلكتروني",
    "auth.fullName": "الاسم الكامل",
    "auth.country": "الدولة",
    "auth.province": "المقاطعة",
    "auth.city": "المدينة",
    "auth.processing": "جاري المعالجة...",
    "auth.alreadyHaveAccount": "لديك حساب بالفعل؟",
    "auth.selectCountry": "اختر الدولة",
    "auth.selectProvince": "اختر المقاطعة",
    "auth.selectCity": "اختر المدينة",
    "tickets.all": "كل التذاكر",
    "tickets.open": "مفتوح",
    "tickets.inProgress": "جارٍ المعالجة",
    "tickets.answered": "تمت الإجابة",
    "tickets.onHold": "معلق",
    "tickets.closed": "مغلق",
    "tickets.newTicket": "تذكرة جديدة",
    "tickets.bulkActions": "إجراءات جماعية",
    "tickets.update": "تحديث",
    "tickets.delete": "حذف",
    "tickets.searchPlaceholder": "ابحث في التذاكر...",
    "tickets.dateRange": "نطاق التاريخ",
    "tickets.subject": "الموضوع",
    "tickets.status": "الحالة",
    "tickets.priority": "الأولوية",
    "tickets.department": "القسم",
    "tickets.contact": "جهة الاتصال",
    "common.english": "الإنجليزية",
    "common.indonesian": "الإندونيسية",
    "common.arabic": "العربية",
  },
};

const defaultProfile: AppProfile = {
  name: "Admin Utama",
  username: "admin",
  email: "admin@qurani.com",
  role: "Admin",
  bio: "Admin",
  avatar: "",
  country: "Indonesia",
  state: "Jawa Timur",
  city: "Malang",
  timezone: "Asia/Jakarta",
  // Data Admin Utama
  fullName: "Admin Utama",
  nickname: "Admin",
  phone: "+62 812 3456 7890",
  gender: "Male",
  job: "System Administrator",
  dateOfBirth: "1990-01-01",
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
    country: value?.country || defaultProfile.country,
    state: value?.state || defaultProfile.state,
    city: value?.city || defaultProfile.city,
    timezone: value?.timezone || defaultProfile.timezone,
    // Field baru — gunakan nilai dari value jika ada, fallback ke default
    fullName: value?.fullName?.trim() || value?.name?.trim() || defaultProfile.fullName,
    nickname: value?.nickname?.trim() || defaultProfile.nickname,
    phone: value?.phone?.trim() || defaultProfile.phone,
    gender: value?.gender?.trim() || defaultProfile.gender,
    job: value?.job?.trim() || defaultProfile.job,
    dateOfBirth: value?.dateOfBirth?.trim() || defaultProfile.dateOfBirth,
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
      bio: parsed.bio || parsed.role,
      avatar: parsed.avatar || "",
      country: parsed.country,
      state: parsed.state,
      city: parsed.city,
      timezone: parsed.timezone,
    });
  } catch {
    return null;
  }
}

function mergeStoredProfileWithCookieProfile(
  cookieProfile: AppProfile | null,
  storedProfile: AppProfile | null,
) {
  if (!cookieProfile) {
    return storedProfile;
  }

  if (!storedProfile || storedProfile.username !== cookieProfile.username) {
    return cookieProfile;
  }

  // Only borrow client-only fields from the same account. This avoids
  // showing the previous user's avatar/bio after switching accounts.
  return normalizeProfile({
    ...cookieProfile,
    avatar: storedProfile.avatar || "",
    bio: storedProfile.bio || cookieProfile.bio,
  });
}

export function AppPreferencesProvider({
  children,
}: {
  children: ReactNode;
}) {
  // Always start with stable SSR defaults — localStorage is client-only.
  // Real values are applied after mount to prevent hydration mismatch.
  const [language, setLanguageState] = useState<AppLanguage>("en");
  const [profile, setProfile] = useState<AppProfile>(defaultProfile);

  // Hydrate from cookie first (captures fresh login), then fall back to localStorage
  useEffect(() => {
    const savedLang = window.localStorage.getItem(STORAGE_LANGUAGE_KEY);
    if (savedLang === "id" || savedLang === "en" || savedLang === "ar") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLanguageState(savedLang as AppLanguage);
    }

    // Cookie always wins → guarantees fresh profile after switching accounts
    const cookieProfile = readUserCookie();
    let storedProfile: AppProfile | null = null;
    const rawStoredProfile = window.localStorage.getItem(STORAGE_PROFILE_KEY);

    if (rawStoredProfile) {
      try {
        storedProfile = normalizeProfile(JSON.parse(rawStoredProfile));
      } catch {
        window.localStorage.removeItem("qurani-profile");
      }
    }

    const hydratedProfile = mergeStoredProfileWithCookieProfile(
      cookieProfile,
      storedProfile,
    );

    if (hydratedProfile) {
      setProfile(hydratedProfile);
      window.localStorage.setItem(STORAGE_PROFILE_KEY, JSON.stringify(hydratedProfile));
    }
  }, []);

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
