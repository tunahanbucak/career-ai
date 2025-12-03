"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  MessageSquare,
  Zap,
  Sparkles,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function Sidebar({
  user,
}: {
  user?: { name?: string | null; email?: string | null };
}) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false); // Sidebar kapalı mı durumu

  // Sayfa değişince mobil menüyü kapat
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const isActive = (path: string) =>
    pathname === path || pathname?.startsWith(path + "/");

  return (
    <>
      {/* MOBİL MENÜ BUTONU (Sadece mobilde görünür) */}
      <div className="fixed top-4 left-4 z-50 lg:hidden">
        <Button
          variant="outline"
          size="icon"
          className="bg-slate-950 border-slate-800 text-slate-200"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X /> : <Menu />}
        </Button>
      </div>

      {/* MOBİL MENÜ OVERLAY */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-slate-950/95 p-6 lg:hidden animate-in slide-in-from-left-10 flex flex-col h-full">
          <div className="flex items-center gap-3 mb-8 px-2">
            <div className="h-10 w-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Zap className="h-6 w-6 text-white" fill="currentColor" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">
              CareerAI
            </span>
          </div>
          <NavContent isActive={isActive} isCollapsed={false} />
          {/* Mobil Alt Kısım (User) */}
          <div className="mt-auto pt-6 border-t border-slate-800">
            <UserProfile user={user} isCollapsed={false} />
          </div>
        </div>
      )}

      {/* DESKTOP SIDEBAR */}
      <aside
        className={`hidden lg:flex fixed top-0 left-0 z-40 h-screen flex-col justify-between border-r border-slate-800 bg-slate-950 transition-all duration-300 ease-in-out shadow-2xl ${
          isCollapsed ? "w-[80px]" : "w-72"
        }`}
      >
        {/* Toggle Button (Sidebar'ı Aç/Kapa) */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-10 z-50 flex h-6 w-6 items-center justify-center rounded-full border border-slate-700 bg-slate-800 text-slate-400 hover:bg-indigo-600 hover:text-white transition-all shadow-md"
        >
          {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>

        <div className="flex flex-col h-full p-4">
          {/* Logo Alanı */}
          <div
            className={`flex items-center ${
              isCollapsed ? "justify-center" : "gap-3 px-2"
            } mb-8 h-12 transition-all`}
          >
            <div className="h-10 w-10 min-w-[40px] rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <Zap className="h-5 w-5 text-white" fill="currentColor" />
            </div>
            {!isCollapsed && (
              <div className="flex flex-col leading-tight animate-in fade-in duration-300">
                <span className="text-lg font-bold tracking-tight text-white">
                  CareerAI
                </span>
                <span className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">
                  Dashboard
                </span>
              </div>
            )}
          </div>

          {/* Navigasyon */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-slate-800">
            <NavContent isActive={isActive} isCollapsed={isCollapsed} />
          </div>

          {/* User Profile Footer */}
          <div className="mt-4 pt-4 border-t border-slate-800/50">
            <UserProfile user={user} isCollapsed={isCollapsed} />
          </div>
        </div>
      </aside>
    </>
  );
}

// Navigasyon İçeriği
function NavContent({
  isActive,
  isCollapsed,
}: {
  isActive: (path: string) => boolean;
  isCollapsed: boolean;
}) {
  return (
    <nav className="space-y-2">
      {!isCollapsed && (
        <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500 px-4 mb-2 mt-2 animate-in fade-in">
          Menü
        </div>
      )}

      <TooltipProvider delayDuration={0}>
        <div className="space-y-1">
          <NavItem
            href="/dashboard"
            icon={<LayoutDashboard size={20} />}
            label="Genel Bakış"
            active={isActive("/dashboard")}
            isCollapsed={isCollapsed}
          />
          <NavItem
            href="/cv-analysis"
            icon={<FileText size={20} />}
            label="CV Analizi"
            active={isActive("/cv-analysis")}
            isCollapsed={isCollapsed}
          />
          <NavItem
            href="/interview"
            icon={<Sparkles size={20} />}
            label="Mülakat Simülasyonu"
            active={isActive("/interview")}
            isCollapsed={isCollapsed}
          />
          <NavItem
            href="/me/cvs"
            icon={<FileText size={20} />}
            label="Geçmiş CV'ler"
            active={isActive("/me/cvs")}
            isCollapsed={isCollapsed}
          />
          <NavItem
            href="/me/interviews"
            icon={<MessageSquare size={20} />}
            label="Geçmiş Mülakatlar"
            active={isActive("/me/interviews")}
            isCollapsed={isCollapsed}
          />
        </div>
      </TooltipProvider>
    </nav>
  );
}

// Tekil Navigasyon Öğesi
const NavItem = ({
  href,
  icon,
  label,
  active = false,
  isCollapsed = false,
  onClick,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  isCollapsed: boolean;
  onClick?: () => void;
}) => {
  const content = (
    <Link
      href={href}
      onClick={onClick}
      className={`group flex items-center rounded-xl transition-all duration-200 relative overflow-hidden
      ${isCollapsed ? "justify-center p-3" : "gap-3 px-4 py-3"}
      ${
        active
          ? "bg-indigo-600 text-white shadow-lg shadow-indigo-900/20"
          : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-100"
      }`}
    >
      {/* Aktif İndikatörü (Sadece Açıkken) */}
      {!isCollapsed && active && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-indigo-300 rounded-r-full opacity-50" />
      )}

      <span
        className={`${
          active
            ? "text-indigo-100"
            : "text-slate-500 group-hover:text-indigo-400"
        } transition-colors`}
      >
        {icon}
      </span>

      {!isCollapsed && (
        <span className="font-medium truncate animate-in fade-in slide-in-from-left-2 duration-300">
          {label}
        </span>
      )}
    </Link>
  );

  if (isCollapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{content}</TooltipTrigger>
        <TooltipContent
          side="right"
          className="bg-slate-800 text-slate-200 border-slate-700 ml-2 font-medium"
        >
          {label}
        </TooltipContent>
      </Tooltip>
    );
  }

  return content;
};

// Kullanıcı Profili Bileşeni
function UserProfile({
  user,
  isCollapsed,
}: {
  user?: { name?: string | null; email?: string | null };
  isCollapsed: boolean;
}) {
  if (!user) return null;

  return (
    <div
      className={`flex items-center ${
        isCollapsed ? "justify-center" : "gap-3"
      } p-2 rounded-xl bg-slate-900/50 border border-slate-800/50 hover:border-indigo-500/30 transition-all group`}
    >
      <div className="relative">
        <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 p-[2px]">
          <div className="h-full w-full rounded-full bg-slate-950 flex items-center justify-center text-xs font-bold text-white">
            {user.name?.charAt(0) || "U"}
          </div>
        </div>
        <div className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 border-2 border-slate-950"></div>
      </div>

      {!isCollapsed && (
        <div className="flex-1 overflow-hidden animate-in fade-in duration-300">
          <div className="flex items-center justify-between">
            <div className="truncate text-sm font-semibold text-slate-200">
              {user.name?.split(" ")[0] || "Kullanıcı"}
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-slate-500 hover:text-red-400 hover:bg-red-500/10 -mr-1"
              onClick={() => signOut({ callbackUrl: "/" })}
              title="Çıkış Yap"
            >
              <LogOut size={14} />
            </Button>
          </div>
          <div className="truncate text-[10px] text-slate-500">
            {user.email}
          </div>
        </div>
      )}
    </div>
  );
}
