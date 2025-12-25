"use client";

import { motion } from "framer-motion";
import { ShieldAlert, Lock, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface RoleBasedGuardProps {
  title?: string;
  description?: string;
}

export default function RoleBasedGuard({
  title = "Yetki Reddedildi",
  description = "Bu sayfaya erişim yetkiniz bulunmamaktadır. Lütfen sistem yöneticinizle iletişime geçin.",
}: RoleBasedGuardProps) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-4 text-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative mb-8"
      >
        <div className="absolute inset-0 bg-red-500/20 blur-3xl rounded-full" />
        <div className="relative bg-slate-900/50 p-6 rounded-3xl border border-slate-800 shadow-2xl">
          <ShieldAlert className="w-24 h-24 text-red-500" strokeWidth={1.5} />
          <div className="absolute -bottom-2 -right-2 bg-slate-900 rounded-full p-2 border border-slate-800">
            <Lock className="w-8 h-8 text-amber-500" />
          </div>
        </div>
      </motion.div>
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="max-w-md space-y-4"
      >
        <h1 className="text-3xl font-bold bg-gradient-to-r from-red-400 to-amber-400 bg-clip-text text-transparent">
          {title}
        </h1>
        <p className="text-slate-400 text-lg leading-relaxed">{description}</p>
        <div className="pt-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Ana Sayfaya Dön
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
