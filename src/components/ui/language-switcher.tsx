"use client";

import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";

import { AppLanguage, useAppPreferences } from "@/components/providers/app-preferences-provider";

type LanguageSwitcherProps = {
  value: AppLanguage;
  onChange: (language: AppLanguage) => void;
  className?: string;
};

const LANGUAGE_OPTIONS: Array<{
  value: AppLanguage;
  flag: string;
  badgeClassName: string;
}> = [
  { value: "id", flag: "ID", badgeClassName: "bg-red-600 text-white" },
  { value: "en", flag: "US", badgeClassName: "bg-blue-600 text-white" },
  { value: "ar", flag: "SA", badgeClassName: "bg-emerald-700 text-white" },
];

function getFlagEmoji(code: string) {
  return code
    .toUpperCase()
    .split("")
    .map((char) => String.fromCodePoint(127397 + char.charCodeAt(0)))
    .join("");
}

export function LanguageSwitcher({
  value,
  onChange,
  className = "",
}: LanguageSwitcherProps) {
  const { t } = useAppPreferences();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const labels: Record<AppLanguage, string> = {
    en: t("common.english"),
    id: t("common.indonesian"),
    ar: t("common.arabic"),
  };

  const activeOption =
    LANGUAGE_OPTIONS.find((option) => option.value === value) ?? LANGUAGE_OPTIONS[0];

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        className="flex min-w-[152px] items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
      >
        <span className="flex items-center gap-3">
          <span
            className={`flex h-7 w-7 items-center justify-center rounded-full text-[15px] shadow-sm ${activeOption.badgeClassName}`}
          >
            {getFlagEmoji(activeOption.flag)}
          </span>
          <span>{labels[activeOption.value]}</span>
        </span>
        <ChevronDown
          size={16}
          className={`text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen ? (
        <div className="absolute right-0 z-50 mt-2 w-full min-w-[180px] overflow-hidden rounded-2xl border border-slate-200 bg-white p-1.5 shadow-[0_20px_45px_rgba(15,23,42,0.16)] dark:border-slate-700 dark:bg-slate-900">
          {LANGUAGE_OPTIONS.map((option) => {
            const isActive = option.value === value;

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors ${
                  isActive
                    ? "bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-white"
                    : "text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800/70"
                }`}
              >
                <span className="flex items-center gap-3">
                  <span
                    className={`flex h-7 w-7 items-center justify-center rounded-full text-[15px] shadow-sm ${option.badgeClassName}`}
                  >
                    {getFlagEmoji(option.flag)}
                  </span>
                  <span>{labels[option.value]}</span>
                </span>
                {isActive ? <Check size={16} className="text-slate-500 dark:text-slate-300" /> : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
