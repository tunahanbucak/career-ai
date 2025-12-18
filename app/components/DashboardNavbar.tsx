"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Bell, ChevronDown, Search, Slash, Home } from "lucide-react";
import { signOut } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useLayout } from "@/app/context/LayoutContext";
import { cn } from "@/lib/utils";
import SettingsDialog from "@/components/SettingsDialog";

// DashboardNavbar: Üst tarafta bulunan navigasyon çubuğu.
// Breadcrumbs (sayfa yolu), arama çubuğu ve kullanıcı profil menüsünü içerir.
export default function DashboardNavbar({
  user,
}: {
  user?: { name?: string | null; email?: string | null; image?: string | null };
}) {
  const pathname = usePathname();
  const { isSidebarCollapsed } = useLayout();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const getBreadcrumbs = () => {
    const paths = pathname?.split("/").filter(Boolean) || [];
    const items: { href: string; label: string; icon?: React.ElementType }[] = [
      { href: "/dashboard", label: "Dashboard", icon: Home },
    ];

    paths.forEach((path, index) => {
      if (path === "dashboard") return;
      const href = `/${paths.slice(0, index + 1).join("/")}`;
      let label = path.charAt(0).toUpperCase() + path.slice(1);

      // Custom labels mapping
      if (path === "cv-analysis") label = "CV Analizi";
      if (path === "interview") label = "Mülakat";
      if (path === "me") label = "Hesabım";
      if (path === "cvs") label = "CV Geçmişi";
      if (path === "interviews") label = "Mülakat Geçmişi";
      if (path === "admin") label = "Yönetim";

      items.push({ href, label, icon: undefined });
    });

    return items;
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <nav
      className={cn(
        "fixed top-0 right-0 z-30 h-20 px-6 lg:px-10 flex items-center justify-between bg-background/80 backdrop-blur-xl border-b border-border/60 shadow-sm transition-all duration-300 ease-in-out",
        isSidebarCollapsed ? "left-0 lg:left-[80px]" : "left-0 lg:left-72"
      )}
    >
      <div className="flex items-center gap-8 flex-1">
        <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
          {breadcrumbs.map((item, index) => {
            const Icon = item.icon;
            const isLast = index === breadcrumbs.length - 1;
            return (
              <div key={item.href} className="flex items-center gap-2">
                {index > 0 && (
                  <Slash size={14} className="text-muted-foreground/60" />
                )}
                <Link
                  href={item.href}
                  className={`flex items-center gap-2 transition-colors ${
                    isLast
                      ? "text-foreground font-medium pointer-events-none"
                      : "hover:text-primary"
                  }`}
                >
                  {Icon && <Icon size={16} />}
                  <span>{item.label}</span>
                </Link>
              </div>
            );
          })}
        </div>
        <div className="hidden lg:flex items-center max-w-md w-full relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <input
            type="text"
            placeholder="Ara (örn: Java Developer CV)..."
            className="w-full h-10 pl-10 pr-4 bg-secondary/50 border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all font-medium"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1">
            <kbd className="hidden sm:inline-flex h-5 items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
              <span className="text-xs">⌘</span>K
            </kbd>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3 sm:gap-4 pl-4">
        <Button
          variant="ghost"
          size="icon"
          className="relative h-10 w-10 text-muted-foreground hover:text-foreground hover:bg-secondary/80 rounded-xl transition-all"
        >
          <Bell size={20} />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-primary border-2 border-background shadow-[0_0_8px_rgba(99,102,241,0.5)]" />
        </Button>
        <div className="h-6 w-px bg-border mx-1 hidden sm:block" />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-3 pl-2 pr-1.5 py-1.5 rounded-full bg-secondary/50 border border-border/80 hover:border-primary/30 hover:bg-secondary transition-all group outline-none focus:ring-2 focus:ring-primary/20">
              <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 p-[2px] shadow-lg shadow-indigo-500/10">
                <div className="h-full w-full rounded-full bg-background flex items-center justify-center text-xs font-bold text-foreground uppercase">
                  {user?.name?.charAt(0) || "U"}
                </div>
              </div>
              <div className="hidden md:block text-left mr-2">
                <div className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                  {user?.name?.split(" ")[0]}
                </div>
              </div>
              <ChevronDown
                size={14}
                className="text-muted-foreground group-hover:text-foreground hidden md:block"
              />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-56 bg-background/95 backdrop-blur-xl border-border text-foreground mt-2 px-1 py-1.5 shadow-2xl"
          >
            <DropdownMenuItem asChild className="focus:bg-primary/10 focus:text-primary cursor-pointer rounded-lg py-2.5">
              <Link href="/me" className="flex w-full font-medium">
                Hesabım
              </Link>
            </DropdownMenuItem>
            {/* <DropdownMenuItem 
                        className="focus:bg-primary/10 focus:text-primary cursor-pointer rounded-lg py-2.5"
                        onSelect={(e) => {
                            e.preventDefault();
                            setIsSettingsOpen(true);
                        }}
                    >
                        <div className="flex w-full font-medium">Ayarlar</div>
                    </DropdownMenuItem> */}
            <DropdownMenuItem asChild className="focus:bg-primary/10 focus:text-primary cursor-pointer rounded-lg py-2.5">
              <Link href="/admin" className="flex w-full font-medium">
                Yönetim Paneli
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-border/50 my-1" />
            <DropdownMenuItem
              className="text-red-400 focus:text-red-300 focus:bg-red-500/10 cursor-pointer rounded-lg py-2.5 group"
              onSelect={() => signOut({ callbackUrl: "/" })}
            >
              <span className="flex-1 font-medium">Çıkış Yap</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <SettingsDialog
        open={isSettingsOpen}
        onOpenChange={setIsSettingsOpen}
        user={user}
      />
    </nav>
  );
}
