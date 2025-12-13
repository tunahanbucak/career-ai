"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, ArrowRight } from "lucide-react";
import Logo from "./Logo";

// LandingNavbar: Karşılama sayfası için navigasyon barı bileşeni.
export default function LandingNavbar() {
  const [isScrolled, setIsScrolled] = useState(false); // Sayfa kaydırma durumu state'i
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // Mobil menü açık/kapalı durumu

  // useEffect Hook: Sayfa kaydırıldığında navbar stilini değiştirmek için event listener ekler.
  useEffect(() => {
    const handleScroll = () => {
      // Eğer sayfa 20px'den fazla aşağı kaydırıldıysa isScrolled true olur.
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);

    // Temizlik fonksiyonu: Component unmount olduğunda listener'ı kaldırır.
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "h-20 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/50 shadow-lg" // Kaydırılınca aktif olan stiller
          : "h-24 bg-transparent" // İlk yüklemede şeffaf
      }`}
    >
      <div className="container mx-auto px-6 h-full flex items-center justify-between">
        {/* Logo Alanı */}
        <Link href="/" className="group">
          <Logo textSize="xl" />
        </Link>

        {/* Masaüstü Aksiyon Butonları (Giriş / Kayıt) */}
        <div className="hidden md:flex items-center gap-4">
          <Button
            className="bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/25 rounded-xl px-6"
            asChild
          >
            <Link href="/auth/signin">
              Giriş Yap
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          {/* <Button
            className="bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/25 rounded-xl px-6"
            asChild
          >
            <Link href="/auth/signin?mode=signup">
              Ücretsiz Başla
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button> */}
        </div>

        {/* Mobil Menü Açma/Kapama Butonu */}
        <div className="md:hidden">
          <Button
            variant="ghost"
            size="icon"
            className="text-slate-200"
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </Button>
        </div>
      </div>

      {/* Mobil Menü İçeriği */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-slate-950/95 backdrop-blur-xl border-b border-slate-800 p-6 md:hidden animate-in slide-in-from-top-2">
          <div className="flex flex-col gap-4">
            <Button
              variant="outline"
              className="w-full justify-center border-slate-700 text-slate-200 hover:bg-slate-800"
              asChild
            >
              <Link href="/auth/signin">Giriş Yap</Link>
            </Button>
            <Button
              className="w-full justify-center bg-indigo-600 hover:bg-indigo-500"
              asChild
            >
              <Link href="/auth/signin?mode=signup">Ücretsiz Başla</Link>
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
}
