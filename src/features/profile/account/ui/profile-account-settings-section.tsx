import { Bell, Globe, Plus, Settings, Sun, Moon } from "lucide-react";

import { LanguageSwitcher } from "@/components/ui/language-switcher";

import { PROFILE_NOTIFICATION_RECIPIENTS } from "../model/profile-account.constants";
import type { useProfileAccount } from "../hooks/use-profile-account";

export function ProfileAccountSettingsSection({
  state,
}: {
  state: ReturnType<typeof useProfileAccount>;
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 text-slate-900 dark:text-white">
        <div className="rounded-2xl bg-slate-100 p-3 dark:bg-slate-800">
          <Settings size={20} className="text-slate-700 dark:text-slate-200" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight">
          {state.t("sidebar.settings")}
        </h2>
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 transition-colors dark:border-slate-800 dark:bg-slate-950">
          <div className="flex items-center gap-3">
            <Sun
              size={20}
              className={state.isDarkMode ? "text-slate-500" : "text-amber-500"}
            />
            <div>
              <div className="font-semibold text-slate-900 dark:text-white">
                {state.t("profile.theme")}
              </div>
              <div className="text-sm text-slate-500 dark:text-slate-400">
                {state.isDarkMode
                  ? state.t("settings.dark")
                  : state.t("settings.light")}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => state.setTheme(state.isDarkMode ? "light" : "dark")}
            className={`relative h-7 w-14 rounded-full transition-colors ${
              state.isDarkMode
                ? "bg-emerald-600"
                : "bg-slate-300 dark:bg-slate-700"
            }`}
          >
            <span
              className={`absolute top-1 flex h-5 w-5 items-center justify-center rounded-full bg-white text-slate-700 shadow-sm transition-all ${
                state.isDarkMode ? "left-8" : "left-1"
              }`}
            >
              {state.isDarkMode ? <Moon size={12} /> : <Sun size={12} />}
            </span>
          </button>
        </div>

        <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 transition-colors dark:border-slate-800 dark:bg-slate-950">
          <div className="flex items-center gap-3">
            <Globe size={20} className="text-blue-500" />
            <div>
              <div className="font-semibold text-slate-900 dark:text-white">
                {state.t("profile.language")}
              </div>
              <div className="text-sm text-slate-500 dark:text-slate-400">
                {state.language === "id"
                  ? state.t("common.indonesian")
                  : state.language === "ar"
                    ? state.t("common.arabic")
                    : state.t("common.english")}
              </div>
            </div>
          </div>

          <LanguageSwitcher value={state.language} onChange={state.setLanguage} />
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 transition-colors dark:border-slate-800 dark:bg-slate-950">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Bell size={20} className="text-emerald-500" />
            <div>
              <div className="font-semibold text-slate-900 dark:text-white">
                {state.t("profile.notificationRecipients")}
              </div>
              <div className="text-sm text-slate-500 dark:text-slate-400">
                {state.language === "id"
                  ? "Pilih tim yang perlu menerima notifikasi penting."
                  : "Choose who should receive important updates."}
              </div>
            </div>
          </div>

          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
          >
            <Plus size={16} />
            {state.t("profile.addRecipient")}
          </button>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 transition-colors dark:border-slate-700 dark:bg-slate-900">
          {PROFILE_NOTIFICATION_RECIPIENTS.length > 0 ? (
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {PROFILE_NOTIFICATION_RECIPIENTS.map((recipient) => (
                <div
                  key={recipient}
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 transition-colors dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
                >
                  {recipient}
                </div>
              ))}
            </div>
          ) : (
            <div className="py-10 text-center">
              <Bell size={32} className="mx-auto mb-3 text-slate-300 dark:text-slate-600" />
              <h4 className="font-semibold text-slate-600 dark:text-slate-300">
                {state.t("profile.noRecipients")}
              </h4>
              <p className="mt-1 text-sm text-slate-400 dark:text-slate-500">
                {state.t("profile.noRecipientsDescription")}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
