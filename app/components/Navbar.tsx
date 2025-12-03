"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { Zap } from "lucide-react";

const Navbar = () => {
  const { data: session } = useSession();

  return (
    <nav className="fixed top-0 inset-x-0 z-30 border-b border-slate-800 bg-slate-950/80 backdrop-blur-xl">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-10">
        <div className="flex items-center gap-3 py-8 ">
          <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-indigo-500 via-sky-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/40 border border-indigo-400/40">
            <Zap className="h-5 w-5 text-white" fill="currentColor" />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-semibold tracking-tight text-slate-50">
              CareerAI
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          {session ? (
            <>
              <span className="hidden sm:inline-flex items-center rounded-full border border-slate-700/80 bg-slate-900/60 px-3 py-1 text-xs font-medium text-slate-300/90 shadow-sm">
                <span className="mr-1 h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                {session.user?.name || session.user?.email || "Kullanıcı"}
              </span>
              <Link
                href="/dashboard"
                className="hidden xs:inline-flex items-center rounded-full border border-slate-700/80 bg-slate-900/70 px-3 py-1.5 text-xs font-medium text-slate-100 hover:border-indigo-500/60 hover:text-indigo-200 hover:bg-slate-900 transition-colors"
              >
                Kontrol Paneli
              </Link>
              <button
                onClick={() => signOut()}
                className="inline-flex items-center rounded-full bg-gradient-to-r from-rose-500 to-red-500 px-3 py-1.5 text-xs font-semibold text-white shadow-md shadow-rose-500/40 hover:shadow-lg hover:brightness-110 transition-all"
              >
                Çıkış Yap
              </button>
            </>
          ) : (
            <>
              <Link
                href="/auth/signin"
                className="inline-flex items-center rounded-full bg-gradient-to-r from-indigo-500 via-sky-500 to-violet-500 px-4 py-1.5 text-xs font-semibold text-white shadow-md shadow-indigo-500/40 hover:shadow-lg hover:translate-y-[0.5px] transition-all"
              >
                Giriş Yap
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
