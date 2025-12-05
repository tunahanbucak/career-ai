import Link from "next/link";
import { RecentAnalysis } from "@/types";
import { FileText, ArrowRight } from "lucide-react";

type Props = {
  analyses: RecentAnalysis[];
};

export default function RecentUploadsCard({ analyses }: Props) {
  return (
    <div className="rounded-2xl border border-white/5 bg-slate-900/40 p-6 backdrop-blur-xl">
      <div className="flex items-center justify-between mb-6">
        <div>
           <h3 className="text-lg font-semibold text-white tracking-tight">Son Yüklemeler</h3>
           <p className="text-xs text-slate-400 mt-1">Sisteme yüklediğin son CV&apos;ler.</p>
        </div>
       
        <Link href="/me/cvs" className="text-xs font-medium text-indigo-400 flex items-center gap-1 hover:text-indigo-300 transition-colors">
            Tümünü Gör <ArrowRight size={14} />
        </Link>
      </div>
      
      <div className="space-y-3">
        {analyses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-slate-500 border border-dashed border-slate-800 rounded-xl">
             <FileText size={40} className="mb-3 opacity-20" />
             <p className="text-sm">Henüz kayıt bulunmuyor.</p>
          </div>
        ) : (
          analyses.slice(0, 5).map((a) => (
            <div
              key={a.id}
              className="group flex items-center justify-between rounded-xl border border-transparent bg-white/5 p-3 hover:border-indigo-500/20 hover:bg-white/10 transition-all duration-300"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400 group-hover:scale-110 transition-transform">
                  <FileText size={18} />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-slate-200 group-hover:text-white transition-colors">
                    {a.title || "İsimsiz CV Analizi"}
                  </span>
                  <span className="text-xs text-slate-500">
                    {new Date(a.createdAt).toLocaleDateString("tr-TR", { month: 'long', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
              </div>
              <Link
                href={`/me/cvs/${a.cvId}`}
                className="rounded-lg bg-slate-950/50 px-3 py-1.5 text-xs font-medium text-slate-400 hover:bg-indigo-500 hover:text-white transition-all"
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
