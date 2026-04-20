import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";

import { AppProviders } from "@/components/providers/app-providers";

import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Qurani Admin",
  description: "Qurani admin dashboard and learning platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <body
        className={`${plusJakartaSans.className} min-h-full flex flex-col bg-background text-foreground transition-colors`}
        suppressHydrationWarning
      >
      <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
