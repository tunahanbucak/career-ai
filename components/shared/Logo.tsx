import { Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  iconSize?: number;
  textSize?: "sm" | "base" | "lg" | "xl" | "2xl";
  lightMode?: boolean;
  showText?: boolean;
}

export default function Logo({
  className,
  iconSize = 20,
  textSize = "xl",
  lightMode = false,
  showText = true,
}: LogoProps) {
  return (
    <div className={cn("flex items-center gap-3 select-none", className)}>
      <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30 flex-shrink-0">
        <Zap size={iconSize} className="text-white" fill="currentColor" />
      </div>
      {showText && (
        <span
          className={cn(
            "font-bold tracking-tight",
            lightMode ? "text-slate-900" : "text-white",
            textSize === "sm" && "text-sm",
            textSize === "base" && "text-base",
            textSize === "lg" && "text-lg",
            textSize === "xl" && "text-xl",
            textSize === "2xl" && "text-2xl"
          )}
        >
          CareerAI
        </span>
      )}
    </div>
  );
}
