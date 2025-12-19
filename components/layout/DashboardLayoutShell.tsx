"use client";

import { useLayout } from "@/app/context/LayoutContext";
import { cn } from "@/lib/utils";
import PageTransition from "@/components/shared/PageTransition";

export default function DashboardLayoutShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isSidebarCollapsed } = useLayout();

  return (
    <main 
        className={cn(
            "pt-24 min-h-screen relative z-10 transition-all duration-300 ease-in-out",
            isSidebarCollapsed ? "lg:pl-[80px]" : "lg:pl-72"
        )}
    >
      <div className="container mx-auto p-4 lg:p-8 max-w-[1600px]">
        <PageTransition>
            {children}
        </PageTransition>
      </div>
    </main>
  );
}
