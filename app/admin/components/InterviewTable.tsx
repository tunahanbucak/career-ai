import { AdminInterview } from "@/types";

interface InterviewTableProps {
  data: AdminInterview[];
}

export default function InterviewTable({ data }: InterviewTableProps) {
  return (
    <table className="w-full text-sm text-left">
      <thead className="text-[10px] text-slate-500 uppercase bg-slate-950/80 border-b border-slate-800 tracking-wider">
        <tr>
          <th className="px-6 py-3 font-semibold">Pozisyon</th>
          <th className="px-6 py-3 font-semibold">Kullanıcı</th>
          <th className="px-6 py-3 font-semibold text-center">Etkileşim</th>
          <th className="px-6 py-3 font-semibold text-center">Durum</th>
          <th className="px-6 py-3 font-semibold text-right">Tarih</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-800/50">
        {data.map((i) => (
          <tr
            key={i.id}
            className="hover:bg-amber-500/5 transition-colors group"
          >
            <td className="px-6 py-3.5">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded bg-slate-900 border border-slate-800 flex items-center justify-center text-amber-500 font-bold text-xs uppercase">
                  {i.position.substring(0, 2)}
                </div>
                <span className="font-medium text-slate-200 group-hover:text-amber-300 transition-colors">
                  {i.position}
                </span>
              </div>
            </td>
            <td className="px-6 py-3.5">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-slate-700" />
                <span className="text-sm text-slate-400">{i.user?.email}</span>
              </div>
            </td>
            <td className="px-6 py-3.5 text-center">
              <span className="font-mono text-xs font-bold text-slate-300">
                {i.messages?.length ?? 0} mesaj
              </span>
            </td>
            <td className="px-6 py-3.5 text-center">
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-400 border border-emerald-500/20">
                TAMAMLANDI
              </span>
            </td>
            <td className="px-6 py-3.5 text-right text-xs text-slate-500 tabular-nums font-mono">
              {new Date(i.date).toLocaleString("tr-TR")}
            </td>
          </tr>
        ))}
        {data.length === 0 && (
          <tr>
            <td
              colSpan={5}
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
