"use client";

import { useEffect } from "react";
import { AlertOctagon, RefreshCcw } from "lucide-react";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global Error:", error);
  }, [error]);

  return (
    <html lang="tr" className="dark h-full">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-full bg-[#020617] text-slate-100 flex items-center justify-center`}
      >
        <div className="max-w-md w-full p-8 text-center space-y-6">
          <div className="inline-flex justify-center items-center w-20 h-20 rounded-full bg-red-500/10 mb-4">
            <AlertOctagon className="w-10 h-10 text-red-500" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
            Kritik Sistem Hatası
          </h1>
          <p className="text-slate-400">
            Beklenmedik bir sorun oluştu ve uygulama yanıt veremiyor. Lütfen
            sayfayı yenilemeyi deneyin.
          </p>
          <button
            onClick={() => reset()}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-100 text-slate-900 font-bold hover:bg-white transition-colors"
          >
            <RefreshCcw className="w-4 h-4" />
            Uygulamayı Yenile
          </button>
        </div>
      </body>
    </html>
  );
}
