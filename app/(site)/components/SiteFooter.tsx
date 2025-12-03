import { Zap } from "lucide-react";
export default function SiteFooter() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 py-12">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
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
        <p className="text-slate-500 text-sm">
          © 2025 CareerAI. Tüm hakları saklıdır. Bir Bitirme Projesidir.
        </p>
        <div className="flex gap-6">
          <a
            href="#"
            className="text-slate-500 hover:text-indigo-400 transition-colors"
          >
            Gizlilik
          </a>
          <a
            href="#"
            className="text-slate-500 hover:text-indigo-400 transition-colors"
          >
            Kullanım Şartları
          </a>
        </div>
      </div>
    </footer>
  );
}
