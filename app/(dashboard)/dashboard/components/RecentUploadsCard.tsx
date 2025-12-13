import Link from "next/link";
import { RecentAnalysis } from "@/types";
import { FileText, ArrowRight } from "lucide-react";

type Props = {
  analyses: RecentAnalysis[];
};

export default function RecentUploadsCard({ analyses }: Props) {
  return (
    <div className="rounded-2xl border border-white/5 bg-slate-900/40 p-6 backdrop-blur-xl relative overflow-hidden">
      {/* Decorative Glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-[60px] -z-10" />

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
           <div className="h-8 w-1 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-full" />
           <div>
              <h3 className="text-lg font-bold text-white tracking-tight">Son Yüklemeler</h3>
              <p className="text-xs text-slate-400">Sisteme yüklediğin son CV&apos;ler.</p>
           </div>
        </div>
       
        <Link href="/me/cvs" className="text-xs font-semibold text-indigo-400 flex items-center gap-1 hover:text-indigo-300 transition-colors px-3 py-1.5 rounded-lg hover:bg-indigo-500/10">
            Tümünü Gör <ArrowRight size={14} />
        </Link>
      </div>
      
      <div className="space-y-3">
        {analyses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-slate-500 border border-dashed border-slate-800 rounded-2xl bg-slate-900/20">
             <div className="p-3 bg-slate-800/50 rounded-full mb-3">
                <FileText size={24} className="opacity-50" />
             </div>
             <p className="text-sm font-medium">Henüz kayıt bulunmuyor.</p>
             <p className="text-xs opacity-60 mt-1">İlk CV analizini yaparak başla.</p>
          </div>
        ) : (
          analyses.slice(0, 5).map((a) => (
            <div
              key={a.id}
              className="group flex items-center justify-between rounded-xl border border-white/5 bg-white/5 p-3.5 hover:border-indigo-500/30 hover:bg-white/10 hover:shadow-lg hover:shadow-indigo-500/5 transition-all duration-300"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 text-indigo-400 group-hover:scale-110 group-hover:from-indigo-500/20 group-hover:to-purple-500/20 transition-all shadow-inner shadow-indigo-500/5">
                  <FileText size={20} />
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-bold text-slate-200 group-hover:text-white transition-colors">
                    {a.title || "İsimsiz CV Analizi"}
                  </span>
                  <span className="text-xs font-medium text-slate-500 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/50"></span>
                    {new Date(a.createdAt).toLocaleDateString("tr-TR", { month: 'long', day: 'numeric' })}
                  </span>
                </div>
              </div>
              <Link
                href={`/me/cvs/${a.cvId}`}
                className="opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-indigo-500/25 hover:bg-indigo-500 hover:shadow-indigo-500/40 transition-all duration-300"
              >
                İncele
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
