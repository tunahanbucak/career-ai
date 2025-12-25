"use client";

import Link from "next/link";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";

interface UserProfileProps {
  user?: { name?: string | null; email?: string | null };
  isCollapsed: boolean;
}

export default function UserProfile({ user, isCollapsed }: UserProfileProps) {
  if (!user) return null;

  return (
    <Link href="/me">
      <div
        className={`flex items-center ${
          isCollapsed ? "justify-center" : "gap-3"
        } p-3 rounded-2xl bg-gradient-to-b from-sidebar to-sidebar/95 border border-sidebar-border hover:border-sidebar-accent transition-all group shadow-lg cursor-pointer`}
      >
        <div className="relative flex-shrink-0">
          <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 p-[2px] shadow-lg shadow-indigo-500/20">
            <div className="h-full w-full rounded-full bg-sidebar flex items-center justify-center text-xs font-bold text-sidebar-foreground group-hover:bg-sidebar-accent/50 transition-colors">
              {user.name?.charAt(0) || "U"}
            </div>
          </div>
          <div className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 border-2 border-sidebar shadow-[0_0_8px_#10b981]"></div>
        </div>
        {!isCollapsed && (
          <div className="flex-1 overflow-hidden animate-in fade-in duration-300">
            <div className="flex items-center justify-between">
              <div className="truncate text-sm font-semibold text-sidebar-foreground group-hover:text-foreground transition-colors">
                {user.name?.split(" ")[0] || "Kullanıcı"}
              </div>
            </div>
            <div className="flex items-center justify-between mt-0.5">
              <div className="truncate text-[10px] text-muted-foreground group-hover:text-sidebar-foreground/80 transition-colors">
                {user.email}
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-muted-foreground hover:text-destructive hover:bg-destructive/10 -mr-2"
                onClick={(e) => {
                  e.preventDefault();
                  signOut({ callbackUrl: "/" });
                }}
                title="Çıkış Yap"
              >
                <LogOut size={13} />
              </Button>
            </div>
          </div>
        )}
      </div>
    </Link>
  );
}
