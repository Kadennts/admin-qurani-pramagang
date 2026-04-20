"use client";

import Link from "next/link";
import { type FormEvent, useEffect, useState } from "react";

import { QuraniLogo } from "@/components/branding/qurani-logo";
import { useAppPreferences } from "@/components/providers/app-preferences-provider";
import { createClient } from "@/utils/supabase/client";

type CountryOption = {
  id: number;
  name: string;
};

type StateOption = {
  id: number;
  name: string;
};

type CityOption = {
  id: number;
  name: string;
};

export default function RegisterPage() {
  const supabase = createClient();
  const { t } = useAppPreferences();

  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [countries, setCountries] = useState<CountryOption[]>([]);
  const [states, setStates] = useState<StateOption[]>([]);
  const [cities, setCities] = useState<CityOption[]>([]);

  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  useEffect(() => {
    async function fetchCountries() {
      const { data } = await supabase.from("countries").select("*").order("id");
      if (data) {
        setCountries(data);
      }
    }

    fetchCountries();
  }, [supabase]);

  useEffect(() => {
    if (!selectedCountry) {
      setStates([]);
      setSelectedState("");
      return;
    }

    async function fetchStates() {
      const { data } = await supabase
        .from("states")
        .select("*")
        .eq("country_id", selectedCountry)
        .order("id");

      if (data) {
        setStates(data);
      }
    }

    fetchStates();
  }, [selectedCountry, supabase]);

  useEffect(() => {
    if (!selectedState) {
      setCities([]);
      setSelectedCity("");
      return;
    }

    async function fetchCities() {
      const { data } = await supabase
        .from("cities")
        .select("*")
        .eq("state_id", selectedState)
        .order("id");

      if (data) {
        setCities(data);
      }
    }

    fetchCities();
  }, [selectedState, supabase]);

  const handleRegister = async (event: FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.from("user_profiles").insert({
        username,
        role: "member",
      });

      if (error) {
        alert(`Gagal membuat akun: ${error.message}`);
      } else {
        setShowSuccessPopup(true);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 py-12 font-sans transition-colors dark:bg-slate-950 sm:px-6 lg:px-8">
      {showSuccessPopup ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-3xl bg-white p-8 text-center shadow-2xl dark:bg-slate-900">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
              <svg className="h-8 w-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="mb-2 text-2xl font-bold text-slate-900 dark:text-white">Akun berhasil dibuat!</h2>
            <div className="flex flex-col gap-3">
              <Link
                href="/login"
                className="inline-flex w-full justify-center rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-emerald-700"
              >
                {t("auth.login")}
              </Link>
              <button
                type="button"
                onClick={() => setShowSuccessPopup(false)}
                className="text-sm font-semibold text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <div className="mb-8 text-center">
        <QuraniLogo priority className="mx-auto h-10" />
      </div>

      <div className="w-full max-w-md rounded-3xl border border-slate-100 bg-white px-6 py-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-colors dark:border-slate-800 dark:bg-slate-900 sm:px-10">
        <h1 className="mb-8 text-center text-2xl font-bold text-slate-900 dark:text-white">
          {t("auth.registerTitle")}
        </h1>

        <button className="mb-6 flex w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-800">
          <svg className="h-5 w-5" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          {t("auth.registerGoogle")}
        </button>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200 dark:border-slate-800" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-4 font-medium tracking-wide text-slate-400 dark:bg-slate-900">
              OR
            </span>
          </div>
        </div>

        <form onSubmit={handleRegister} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-slate-900 dark:text-white">{t("auth.email")}</label>
            <input
              required
              type="email"
              placeholder="m@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm transition-all placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-bold text-slate-900 dark:text-white">{t("auth.fullName")}</label>
            <input
              required
              type="text"
              placeholder="John Doe"
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm transition-all placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-bold text-slate-900 dark:text-white">{t("auth.username")}</label>
            <input
              required
              type="text"
              placeholder="john_doe"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm transition-all placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-bold text-slate-900 dark:text-white">{t("auth.country")}</label>
            <select
              value={selectedCountry}
              onChange={(event) => setSelectedCountry(event.target.value)}
              className="w-full appearance-none rounded-xl border border-slate-200 bg-white bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2214%22%20height%3D%2214%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2394a3b8%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[length:14px_14px] bg-[position:right_16px_center] bg-no-repeat px-4 py-3 text-sm text-slate-700 transition-all focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
            >
              <option value="">{t("auth.selectCountry")}</option>
              {countries.map((country) => (
                <option key={country.id} value={country.id}>
                  {country.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-bold text-slate-900 dark:text-white">{t("auth.province")}</label>
            <select
              disabled={!selectedCountry}
              value={selectedState}
              onChange={(event) => setSelectedState(event.target.value)}
              className="w-full appearance-none rounded-xl border border-slate-200 bg-white bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2214%22%20height%3D%2214%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2394a3b8%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[length:14px_14px] bg-[position:right_16px_center] bg-no-repeat px-4 py-3 text-sm text-slate-700 transition-all focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
            >
              <option value="">{t("auth.selectProvince")}</option>
              {states.map((state) => (
                <option key={state.id} value={state.id}>
                  {state.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-bold text-slate-900 dark:text-white">{t("auth.city")}</label>
            <select
              disabled={!selectedState}
              value={selectedCity}
              onChange={(event) => setSelectedCity(event.target.value)}
              className="w-full appearance-none rounded-xl border border-slate-200 bg-white bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2214%22%20height%3D%2214%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2394a3b8%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[length:14px_14px] bg-[position:right_16px_center] bg-no-repeat px-4 py-3 text-sm text-slate-700 transition-all focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
            >
              <option value="">{t("auth.selectCity")}</option>
              {cities.map((city) => (
                <option key={city.id} value={city.id}>
                  {city.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-bold text-slate-900 dark:text-white">{t("auth.password")}</label>
            <input
              required
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm tracking-wider text-slate-900 transition-all placeholder:tracking-normal focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            />
          </div>

          <button
            disabled={isLoading}
            className={`mt-2 flex w-full items-center justify-center rounded-xl bg-emerald-600 px-4 py-3.5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-emerald-700 ${isLoading ? "cursor-not-allowed opacity-70" : ""}`}
          >
            {isLoading ? t("auth.processing") : t("auth.createAccount")}
          </button>
        </form>

        <p className="mt-8 text-center text-sm font-medium text-slate-500 dark:text-slate-400">
          {t("auth.alreadyHaveAccount")}{" "}
          <Link
            href="/login"
            className="font-bold text-slate-900 transition-colors hover:text-emerald-600 dark:text-white dark:hover:text-emerald-300"
          >
            {t("auth.login")}
          </Link>
        </p>
      </div>
    </div>
  );
}
