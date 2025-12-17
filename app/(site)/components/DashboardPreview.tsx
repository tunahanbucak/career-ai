import { Bot, FileText, LineChart, MessageSquare } from "lucide-react";

export default function DashboardPreview() {
  return (
    <section className="max-w-6xl mx-auto px-6 mb-32 animate-in fade-in zoom-in duration-1000 delay-500">
      <div className="relative rounded-3xl border border-slate-800 bg-slate-900/50 p-2 md:p-4 backdrop-blur-sm shadow-2xl group">
        <div className="absolute -top-24 left-1/2 -z-10 h-96 w-96 -translate-x-1/2 rounded-full bg-indigo-500/20 blur-[80px] opacity-50 group-hover:opacity-75 transition-opacity duration-1000" />
        <div className="overflow-hidden rounded-2xl border border-slate-700/50 bg-slate-950 shadow-inner">
          <div className="flex items-center gap-2 border-b border-slate-800 bg-slate-900/80 px-4 py-3">
            <div className="flex gap-1.5">
              <div className="h-3 w-3 rounded-full bg-red-500/20 border border-red-500/50" />
              <div className="h-3 w-3 rounded-full bg-amber-500/20 border border-amber-500/50" />
              <div className="h-3 w-3 rounded-full bg-emerald-500/20 border border-emerald-500/50" />
            </div>
            <div className="ml-4 h-6 w-64 rounded-md bg-slate-800/50 text-[10px] flex items-center px-3 text-slate-500 font-mono border border-slate-700/30">
              https://careerai.app/dashboard
            </div>
          </div>
          <div className="grid grid-cols-12 min-h-[450px] bg-slate-950/50">
            <div className="col-span-2 hidden md:block border-r border-slate-800 p-4 space-y-4 bg-slate-900/20">
              <div className="h-8 w-8 rounded-lg bg-indigo-500/20 mb-6 flex items-center justify-center">
                <Bot className="w-5 h-5 text-indigo-400" />
              </div>
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-2 w-full rounded-full bg-slate-800/40"
                />
              ))}
              <div className="mt-auto pt-12">
                <div className="h-12 w-full rounded-lg bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20" />
              </div>
            </div>
            <div className="col-span-12 md:col-span-10 p-6 md:p-8 relative overflow-hidden">
              {/* Üst Kısım */}
              <div className="flex justify-between mb-8 items-center">
                <div>
                  <div className="h-2 w-24 bg-slate-800 rounded-full mb-2" />
                  <div className="h-6 w-48 bg-slate-700/30 rounded-lg" />
                </div>
                <div className="flex gap-2">
                  <div className="h-8 w-8 rounded-full bg-slate-800" />
                  <div className="h-8 w-8 rounded-full bg-indigo-600" />
                </div>
              </div>

              {/* Kartlar */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                {[
                  { color: "bg-indigo-500", icon: FileText },
                  { color: "bg-purple-500", icon: MessageSquare },
                  { color: "bg-emerald-500", icon: LineChart },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="h-32 rounded-xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-900/50 p-4 relative overflow-hidden group hover:border-slate-700 transition-colors"
                  >
                    <div
                      className={`w-8 h-8 rounded-lg ${item.color}/20 flex items-center justify-center mb-3`}
                    >
                      <item.icon className="w-4 h-4 text-slate-300" />
                    </div>
                    <div className="h-2 w-12 bg-slate-800 rounded-full mb-2" />
                    <div className="h-4 w-24 bg-slate-700/50 rounded-md" />
                  </div>
                ))}
              </div>

              {/* Grafik Alanı */}
              <div className="h-64 rounded-xl border border-slate-800 bg-slate-900/30 w-full p-6 flex items-end gap-4 relative">
                <div className="absolute top-4 left-4 text-xs text-slate-500 font-mono">
                  Mülakat Performansı
                </div>
                {/* Chart Bars */}
                {[40, 70, 50, 90, 60, 80, 45, 95, 55, 85, 65, 75].map(
                  (h, i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-t-sm bg-indigo-500/20 hover:bg-indigo-500/50 transition-all relative group"
                      style={{ height: `${h}%` }}
                    ></div>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
