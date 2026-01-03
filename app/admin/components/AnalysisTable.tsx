import { AdminCVAnalysis } from "@/types";
import DownloadActionButton from "./DownloadActionButton";

interface AnalysisTableProps {
  data: AdminCVAnalysis[];
}

export default function AnalysisTable({ data }: AnalysisTableProps) {
  return (
    <table className="w-full text-sm text-left">
      <thead className="text-[10px] text-slate-500 uppercase bg-slate-950/80 border-b border-slate-800 tracking-wider">
        <tr>
          <th className="px-6 py-3 font-semibold">İçerik</th>
          <th className="px-6 py-3 font-semibold">User</th>
          <th className="px-6 py-3 font-semibold text-right">Zaman</th>
          <th className="px-6 py-3 font-semibold text-right w-10"></th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-800/50">
        {data.map((a) => (
          <tr
            key={a.id}
            className="hover:bg-purple-500/5 transition-colors group"
          >
            <td className="px-6 py-3.5">
              <div className="font-medium text-slate-200 group-hover:text-purple-300 transition-colors">
                {a.cv?.title || "Bilinmiyor"}
              </div>
              <div className="flex gap-1 mt-1">
                {Array.isArray(a.keywords) &&
                  a.keywords.slice(0, 2).map((k: string, i: number) => (
                    <span
                      key={i}
                      className="text-[9px] uppercase px-1 rounded bg-slate-900 text-slate-500 border border-slate-800"
                    >
                      {k}
                    </span>
                  ))}
              </div>
            </td>
            <td className="px-6 py-3.5">
              <span className="font-mono text-xs text-slate-400 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">
                {a.cv?.user?.email?.split("@")[0]}
              </span>
            </td>
            <td className="px-6 py-3.5 text-right text-xs text-slate-500 tabular-nums font-mono">
              {new Date(a.createdAt).toLocaleDateString("tr-TR")}
            </td>
            <td className="px-6 py-3.5 text-right w-10">
              <DownloadActionButton type="analysis" data={a} />
            </td>
          </tr>
        ))}
        {data.length === 0 && (
          <tr>
            <td
              colSpan={3}
              className="px-6 py-12 text-center text-slate-500 italic"
            >
              Veri bulunamadı.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}
