"use client";

import { motion } from "framer-motion";

interface SkeletonProps {
  className?: string;
  variant?: "card" | "text" | "circle" | "avatar";
  count?: number;
}

/**
 * Skeleton loader component - profesyonel yükleme animasyonu
 */
export function Skeleton({ className = "", variant = "text", count = 1 }: SkeletonProps) {
  const baseClasses = "animate-pulse bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 bg-[length:200%_100%]";
  
  const variantClasses = {
    card: "h-32 rounded-xl",
    text: "h-4 rounded",
    circle: "h-12 w-12 rounded-full",
    avatar: "h-10 w-10 rounded-full",
  };

  const items = Array.from({ length: count }, (_, i) => i);

  return (
    <>
      {items.map((i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`${baseClasses} ${variantClasses[variant]} ${className}`}
          style={{
            animation: "shimmer 2s infinite",
          }}
        />
      ))}
      <style jsx>{`
        @keyframes shimmer {
          0% {
            background-position: 200% 0;
          }
          100% {
            background-position: -200% 0;
          }
        }
      `}</style>
    </>
  );
}

/**
 * Card skeleton - kart yüklenirken
 */
export function CardSkeleton() {
  return (
    <div className="p-6 rounded-xl border border-slate-800 bg-slate-900/60 space-y-4">
      <Skeleton variant="text" className="w-1/3" />
      <Skeleton variant="text" className="w-full" count={3} />
      <div className="flex gap-2 mt-4">
        <Skeleton variant="circle" className="h-8 w-8" />
        <Skeleton variant="text" className="w-24" />
      </div>
    </div>
  );
}

/**
 * Table skeleton - tablo yüklenirken
 */
export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-4 rounded-lg bg-slate-900/40">
          <Skeleton variant="avatar" />
          <div className="flex-1 space-y-2">
            <Skeleton variant="text" className="w-1/4" />
            <Skeleton variant="text" className="w-1/2" />
          </div>
          <Skeleton variant="text" className="w-20" />
        </div>
      ))}
    </div>
  );
}

/**
 * Dashboard skeleton - dashboard yüklenirken
 */
export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Skeleton variant="card" className="h-64" />
        <Skeleton variant="card" className="h-64" />
      </div>
    </div>
  );
}
