import { ShieldAlert } from "lucide-react";

interface AdminHeaderProps {
  email: string | null | undefined;
}

export default function AdminHeader({ email }: AdminHeaderProps) {
  return (
    <header className="relative overflow-hidden bg-gradient-to-br from-slate-900/90 to-slate-950/90 border border-slate-800 rounded-2xl p-8 backdrop-blur-xl shadow-2xl">
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl" />
      <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl shadow-lg shadow-indigo-500/30">
            <ShieldAlert className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-white mb-1">
              Yönetim Paneli
            </h1>
            <p className="text-sm text-slate-400 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              {email}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 px-4 py-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                Status
              </span>
              <span className="text-sm text-emerald-400 font-bold">ONLINE</span>
            </div>
          </div>
          <div className="flex flex-col px-4 py-2.5 bg-slate-800/50 border border-slate-700 rounded-xl">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
              Version
            </span>
            <span className="text-sm text-white font-mono">v3.0.0</span>
          </div>
        </div>
      </div>
    </header>
  );
}
