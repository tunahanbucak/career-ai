"use client";

import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  isCollapsed: boolean;
  onClick?: () => void;
}

export default function NavItem({
  href,
  icon,
  label,
  active = false,
  isCollapsed = false,
  onClick,
}: NavItemProps) {
  const content = (
    <Link
      href={href}
      onClick={onClick}
      className={`group flex items-center rounded-xl transition-all duration-200 relative overflow-hidden
      ${
        isCollapsed ? "justify-center p-3 w-12 h-12 mx-auto" : "gap-3 px-4 py-3"
      }
      ${
        active
          ? "bg-sidebar-accent text-sidebar-accent-foreground border border-sidebar-border shadow-[0_0_20px_rgba(99,102,241,0.1)]"
          : "text-sidebar-foreground/60 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground border border-transparent"
      }`}
    >
      {!isCollapsed && active && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full shadow-[0_0_10px_#6366f1]" />
      )}
      <span
        className={`${
          active
            ? "text-primary"
            : "text-sidebar-foreground group-hover:text-primary"
        } transition-colors duration-200`}
      >
        {icon}
      </span>
      {!isCollapsed && (
        <span className="font-medium text-sm truncate animate-in fade-in slide-in-from-left-2 duration-300">
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
          className="bg-sidebar text-sidebar-foreground border-sidebar-border ml-2 font-medium px-4 py-2 shadow-xl"
        >
          {label}
        </TooltipContent>
      </Tooltip>
    );
  }

  return content;
}
