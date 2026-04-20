"use client";

import Link from "next/link";
import { LogIn, Loader2 } from "lucide-react";
import { type FormEvent, useState } from "react";

import { QuraniLogo } from "@/components/branding/qurani-logo";
import { useAppPreferences } from "@/components/providers/app-preferences-provider";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { t } = useAppPreferences();

  const handleLogin = (event: FormEvent) => {
    event.preventDefault();

    if (username === "admin" && password === "admin123") {
      setError("");
      setIsLoading(true);

      document.cookie =
        "myqurani_access_token=dummy_token_admin; path=/; max-age=86400;";
      document.cookie =
        "myqurani_user=" +
        JSON.stringify({
          id: 1,
          name: "Admin Qurani",
          username: "admin",
          email: "admin@qurani.com",
          role: "admin",
        }) +
        "; path=/; max-age=86400;";

      window.setTimeout(() => {
        window.location.href = "/dashboard";
      }, 1200);
      return;
    }

    setError("Username atau password salah.");
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-slate-50 p-4 transition-colors dark:bg-slate-950">
      {isLoading ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/60 backdrop-blur-sm dark:bg-slate-950/70">
          <div className="flex flex-col items-center gap-4 rounded-3xl border border-slate-100 bg-white px-8 py-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
            <Loader2 className="h-8 w-8 animate-spin text-slate-800 dark:text-slate-100" />
            <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
              {t("auth.loginSubtitle")}
            </p>
          </div>
        </div>
      ) : null}

      <div className="mb-8">
        <QuraniLogo priority className="h-10" />
      </div>

      <div className="w-full max-w-md rounded-3xl border border-slate-100 bg-white p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-colors dark:border-slate-800 dark:bg-slate-900">
        <h1 className="mb-2 text-center text-2xl font-bold text-slate-900 dark:text-white">
          {t("auth.loginTitle")}
        </h1>

        <button className="mb-6 flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-slate-200 text-sm font-semibold text-emerald-600 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-emerald-300 dark:hover:bg-slate-800">
          <svg className="h-5 w-5" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          {t("auth.login")} with Google
        </button>

        <div className="relative mb-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200 dark:border-slate-800" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-2 text-xs uppercase tracking-wider text-slate-400 dark:bg-slate-900">
              Or
            </span>
          </div>
        </div>

        <form className="space-y-5" onSubmit={handleLogin}>
          {error ? (
            <div className="rounded-xl border border-red-100 bg-red-50 p-3 text-sm font-medium text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">
              {error}
            </div>
          ) : null}

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              {t("auth.username")}
            </label>
            <input
              type="text"
              placeholder={t("auth.username")}
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm transition-all placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                {t("auth.password")}
              </label>
              <a
                href="#"
                className="text-xs font-medium text-slate-600 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-300"
              >
                {t("auth.forgotPassword")}
              </a>
            </div>
            <input
              type="password"
              placeholder={t("auth.password")}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm transition-all placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500"
            />
          </div>

          <button
            type="submit"
            className="mt-6 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 text-sm font-bold text-white shadow-md transition-all hover:bg-emerald-700"
          >
            <LogIn size={18} className="rotate-180" />
            {t("auth.login")}
          </button>
        </form>

        <div className="mt-8 text-center text-sm">
          <span className="text-slate-500 dark:text-slate-400">{t("auth.noAccount")} </span>
          <Link
            href="/register"
            className="font-semibold text-slate-700 underline underline-offset-2 hover:text-emerald-600 dark:text-slate-200 dark:hover:text-emerald-300"
          >
            {t("auth.signUp")}
          </Link>
        </div>
      </div>
    </div>
  );
}
