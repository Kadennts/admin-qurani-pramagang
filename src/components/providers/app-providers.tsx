"use client";

import { type ReactNode } from "react";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";
import { AppPreferencesProvider } from "./app-preferences-provider";
import { SuppressNextThemesWarning } from "./suppress-warning";

export function AppProviders({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      disableTransitionOnChange
      storageKey="qurani-theme"
    >
      <SuppressNextThemesWarning />
      <AppPreferencesProvider>
        {children}
        <Toaster position="top-right" richColors closeButton />
      </AppPreferencesProvider>
    </ThemeProvider>
  );
}
