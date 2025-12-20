"use client";

import { ShieldAlert, TrendingUp, Users, Activity, Clock } from "lucide-react";
import ExportDropdown from "./ExportDropdown";
import { useEffect, useState } from "react";

interface AdminHeaderProps {
  email: string | null | undefined;
  stats?: {
    users: number;
    cvs: number;
    analyses: number;
  };
}

export default function AdminHeader({ email, stats }: AdminHeaderProps) {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="relative overflow-hidden bg-gradient-to-br from-slate-900/90 via-slate-900/95 to-slate-950/90 border border-slate-800 rounded-2xl p-6 md:p-8 backdrop-blur-xl shadow-2xl">
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-700" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />

      <div className="relative z-10 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl blur opacity-75 animate-pulse"></div>
              <div className="relative p-3 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl shadow-lg shadow-indigo-500/30">
                <ShieldAlert className="h-8 w-8 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl md:text-4xl font-black text-white mb-1 bg-gradient-to-r from-white to-slate-300 bg-clip-text ">
                Admin Paneli
              </h1>
              <p className="text-sm text-slate-400 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                {email}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <ExportDropdown />

            <div className="flex items-center gap-2 px-4 py-2.5 bg-slate-800/50 border border-slate-700 rounded-xl backdrop-blur-sm">
              <Clock className="h-4 w-4 text-indigo-400" />
              <span className="text-sm text-slate-300 font-mono">
                {currentTime.toLocaleTimeString("tr-TR", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>

            <div className="flex items-center gap-2 px-4 py-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl backdrop-blur-sm">
              <Activity className="h-4 w-4 text-emerald-400 animate-pulse" />
              <span className="text-sm text-emerald-400 font-semibold">
                Aktif
              </span>
            </div>
          </div>
        </div>

        {stats && (
          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-800/50">
            <div className="flex items-center gap-3 p-3 bg-slate-800/30 rounded-xl border border-slate-700/50 hover:bg-slate-800/50 transition-all group">
              <div className="p-2 bg-sky-500/10 rounded-lg">
                <Users className="h-5 w-5 text-sky-400 group-hover:scale-110 transition-transform" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">
                  Kullanıcılar
                </p>
                <p className="text-lg font-bold text-white">{stats.users}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-slate-800/30 rounded-xl border border-slate-700/50 hover:bg-slate-800/50 transition-all group">
              <div className="p-2 bg-emerald-500/10 rounded-lg">
                <TrendingUp className="h-5 w-5 text-emerald-400 group-hover:scale-110 transition-transform" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">
                  CV Analizleri
                </p>
                <p className="text-lg font-bold text-white">{stats.analyses}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-slate-800/30 rounded-xl border border-slate-700/50 hover:bg-slate-800/50 transition-all group">
              <div className="p-2 bg-purple-500/10 rounded-lg">
                <Activity className="h-5 w-5 text-purple-400 group-hover:scale-110 transition-transform" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">Toplam CV</p>
                <p className="text-lg font-bold text-white">{stats.cvs}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
