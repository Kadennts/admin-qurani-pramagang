import { ChevronDown } from "lucide-react";

import { QuraniLogo } from "@/components/branding/qurani-logo";

import { getLandingSocialIcon } from "../model/landing-home.utils";
import type { LandingFooterContent } from "../model/landing-home.types";

export function LandingFooter({
  footer,
}: {
  footer: LandingFooterContent;
}) {
  return (
    <footer className="border-t border-slate-100 bg-white pt-12 pb-8 shadow-[0_-15px_40px_-15px_rgba(0,0,0,0.05)] md:pt-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <div className="mb-12 grid grid-cols-2 gap-8 md:mb-20 md:grid-cols-5 lg:gap-8">
          <div className="col-span-2 space-y-6">
            <QuraniLogo className="h-8" />
            <div className="flex flex-wrap gap-3">
              {footer.socialLinks.map((item) => {
                const Icon = getLandingSocialIcon(item.icon);

                return (
                  <a
                    key={item.label}
                    href={item.href}
                    aria-label={item.label}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition-colors hover:bg-emerald-100 hover:text-emerald-700"
                  >
                    <Icon size={16} />
                  </a>
                );
              })}
            </div>
          </div>

          {footer.columns.map((column) => (
            <div key={column.title}>
              <h4 className="mb-4 text-xs font-bold tracking-wider text-slate-900 uppercase">
                {column.title}
              </h4>
              <ul className="space-y-3 text-sm font-medium text-slate-500">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="transition-colors hover:text-emerald-600"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-slate-100 pt-6 sm:flex-row">
          <p className="text-center text-xs font-medium text-slate-400 sm:text-left">
            {footer.copyright}
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-xs font-medium text-slate-400">
            {footer.legalLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="transition-colors hover:text-slate-600"
              >
                {link.label}
              </a>
            ))}
            <span className="flex items-center gap-1 rounded-md bg-slate-100 px-2.5 py-1 text-slate-600">
              {footer.languageLabel}
              <ChevronDown size={12} />
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
