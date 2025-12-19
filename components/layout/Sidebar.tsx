"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  MessageSquare,
  Zap,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  Target,
  Sparkles,
} from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  TooltipProvider,
} from "@/components/ui/tooltip";
import { useLayout } from "@/app/context/LayoutContext";
import Logo from "@/components/shared/Logo";

// Components
import NavItem from "./Sidebar/NavItem";
import UserProfile from "./Sidebar/UserProfile";

export default function Sidebar({
  user,
}: {
  user?: { name?: string | null; email?: string | null };
}) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isSidebarCollapsed, toggleSidebar } = useLayout();

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const isActive = (path: string) =>
    pathname === path || pathname?.startsWith(path + "/");

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="fixed top-4 left-4 z-50 lg:hidden">
        <Button
          variant="outline"
          size="icon"
          className="bg-sidebar/80 backdrop-blur-md border-sidebar-border text-sidebar-foreground"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X /> : <Menu />}
        </Button>
      </div>

      {/* Mobile Sidebar */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-sidebar/95 p-6 lg:hidden animate-in slide-in-from-left-10 flex flex-col h-full backdrop-blur-xl">
          <div className="flex items-center gap-3 mb-10 px-2 pt-4">
            <Logo textSize="xl" lightMode={false} />
          </div>
          <NavContent isActive={isActive} isCollapsed={false} />
          <div className="mt-auto pt-6 border-t border-sidebar-border/50">
            <UserProfile user={user} isCollapsed={false} />
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:flex fixed top-0 left-0 z-40 h-screen flex-col justify-between border-r border-sidebar-border/50 bg-sidebar/60 backdrop-blur-2xl transition-all duration-300 ease-out shadow-2xl ${
          isSidebarCollapsed ? "w-[80px]" : "w-72"
        }`}
      >
        <button
          onClick={toggleSidebar}
          className="absolute -right-3 top-10 z-50 flex h-6 w-6 items-center justify-center rounded-full border border-sidebar-border bg-sidebar text-sidebar-foreground hover:bg-primary hover:text-primary-foreground transition-all shadow-md group"
        >
          {isSidebarCollapsed ? (
            <ChevronRight
              size={14}
              className="group-hover:translate-x-0.5 transition-transform"
            />
          ) : (
            <ChevronLeft
              size={14}
              className="group-hover:-translate-x-0.5 transition-transform"
            />
          )}
        </button>

        <div className="flex flex-col h-full p-4">
          <div
            className={`flex items-center ${
              isSidebarCollapsed ? "justify-center" : "gap-3 px-2"
            } mb-10 mt-2 h-12 transition-all`}
          >
            <Link href="/dashboard" className="flex items-center gap-3">
              {isSidebarCollapsed ? (
                <div className="h-10 w-10 min-w-[40px] rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.3)]">
                  <Zap className="h-5 w-5 text-white" fill="currentColor" />
                </div>
              ) : (
                <Logo textSize="lg" />
              )}
            </Link>
          </div>

          <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-sidebar-border/50 scrollbar-track-transparent">
            <NavContent isActive={isActive} isCollapsed={isSidebarCollapsed} />
          </div>

          <div className="mt-4 pt-4 border-t border-sidebar-border/50">
            <UserProfile user={user} isCollapsed={isSidebarCollapsed} />
          </div>
        </div>
      </aside>
    </>
  );
}

function NavContent({
  isActive,
  isCollapsed,
}: {
  isActive: (path: string) => boolean;
  isCollapsed: boolean;
}) {
  return (
    <nav className="space-y-2">
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

          {!isCollapsed && (
            <div className="pt-6 pb-2 px-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground animate-in fade-in">
              Arşiv
            </div>
          )}
          {isCollapsed && <div className="h-4" />}

          <NavItem
            href="/me/cvs"
            icon={<Target size={20} />}
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
