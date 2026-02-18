import type { Metadata } from "next";
import { Geist, Geist_Mono, Noto_Sans_Khmer } from "next/font/google";
import "./globals.css";
import GameLayout from "@/app/components/GameLayout";
import ThemeProvider from "@/app/components/ThemeProvider";
import { LocaleProvider } from "@/app/lib/i18n/LocaleProvider";
import { getLocaleFromCookies } from "@/app/lib/i18n/server";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const notoSansKhmer = Noto_Sans_Khmer({
  variable: "--font-khmer",
  subsets: ["khmer"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Legend of Warlords",
  description: "Rise from the ashes. Build your empire. Command armies across ancient lands.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocaleFromCookies();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${notoSansKhmer.variable} antialiased text-body`}
      >
        <ThemeProvider>
          <LocaleProvider initialLocale={locale}>
            <GameLayout>{children}</GameLayout>
          </LocaleProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
