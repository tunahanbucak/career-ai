"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Zap, Menu, X, ArrowRight } from "lucide-react";

export default function LandingNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "h-20 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/50 shadow-lg"
          : "h-24 bg-transparent"
      }`}
    >
      <div className="container mx-auto px-6 h-full flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30 group-hover:scale-105 transition-transform duration-300">
            <Zap className="h-6 w-6 text-white" fill="currentColor" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white group-hover:text-indigo-200 transition-colors">
            CareerAI
          </span>
        </Link>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-4">
          <Button variant="ghost" className="text-slate-300 hover:text-white hover:bg-white/5" asChild>
            <Link href="/auth/signin">Giriş Yap</Link>
          </Button>
          <Button className="bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/25 rounded-xl px-6" asChild>
            <Link href="/auth/signin?mode=signup">
              Ücretsiz Başla
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        {/* Mobile Toggle */}
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

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-slate-950/95 backdrop-blur-xl border-b border-slate-800 p-6 md:hidden animate-in slide-in-from-top-2">
            <div className="flex flex-col gap-4">
                 <Button variant="outline" className="w-full justify-center border-slate-700 text-slate-200 hover:bg-slate-800" asChild>
                    <Link href="/auth/signin">Giriş Yap</Link>
                 </Button>
                 <Button className="w-full justify-center bg-indigo-600 hover:bg-indigo-500" asChild>
                    <Link href="/auth/signin?mode=signup">Ücretsiz Başla</Link>
                 </Button>
            </div>
        </div>
      )}
    </nav>
  );
}
