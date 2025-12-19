import { FileText } from "lucide-react";
import { AdminCV } from "@/types";

interface CVTableProps {
  data: AdminCV[];
}

export default function CVTable({ data }: CVTableProps) {
  return (
    <table className="w-full text-sm text-left">
      <thead className="text-[10px] text-slate-500 uppercase bg-slate-950/80 border-b border-slate-800 tracking-wider">
        <tr>
          <th className="px-6 py-3 font-semibold">Başlık</th>
          <th className="px-6 py-3 font-semibold">Kullanıcı</th>
          <th className="px-6 py-3 font-semibold text-right">Zaman</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-800/50">
        {data.map((cv) => (
          <tr
            key={cv.id}
            className="hover:bg-emerald-500/5 transition-colors group"
          >
            <td className="px-6 py-3.5">
              <div className="font-medium text-slate-200 group-hover:text-emerald-300 transition-colors flex items-center gap-2">
                <FileText
                  size={14}
                  className="text-slate-600 group-hover:text-emerald-500"
                />
                {cv.title || "İsimsiz Belge"}
              </div>
            </td>
            <td className="px-6 py-3.5">
              <span className="font-mono text-xs text-slate-400 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">
                {cv.user?.email?.split("@")[0]}
              </span>
            </td>
            <td className="px-6 py-3.5 text-right text-xs text-slate-500 tabular-nums font-mono">
              {new Date(cv.uploadDate).toLocaleDateString("tr-TR")}
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
