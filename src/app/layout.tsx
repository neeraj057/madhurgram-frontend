import type { Metadata } from "next";
import { Geist, Geist_Mono, Cormorant_Garamond } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "MadhurGram | 100% Pure Desi Ghee & Artisanal Village Goods",
  description: "Experience handcrafted traditional slow-cooked Desi Ghee, organic jaggery, solar-cured pickles, and cold-pressed oils direct from the trusted farmers of Gopiganj, Bhadohi.",
  keywords: ["Desi Ghee", "Slow Cooked Ghee", "Organic Jaggery", "Bhadohi Farmers", "Gopiganj Food", "Pure Mustard Oil"],
  openGraph: {
    title: "MadhurGram | 100% Pure Desi Ghee & Artisanal Village Goods",
    description: "Handcrafted purity direct from Gopiganj farmers to your home.",
    url: "https://madhurgram.com",
    siteName: "MadhurGram",
    type: "website",
  },
};

import { ToastContainer } from "@/components/ui/Toast";
import HeartbeatTracker from "@/components/features/analytics/HeartbeatTracker";
import MaintenanceProvider from "@/components/common/MaintenanceProvider";
import CookieConsent from "@/components/common/CookieConsent";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${cormorant.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <MaintenanceProvider>
          {children}
        </MaintenanceProvider>
        <HeartbeatTracker />
        <ToastContainer />
        <CookieConsent />
      </body>
    </html>
  );
}
