import { FileText, Eye } from "lucide-react";
import { AdminCV } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface CVTableProps {
  data: AdminCV[];
}

export default function CVTable({ data }: CVTableProps) {
  return (
    <table className="w-full text-sm text-left">
      <thead className="text-[10px] text-slate-500 uppercase bg-slate-950/80 border-b border-slate-800 tracking-wider">
        <tr>
          <th className="px-6 py-3 font-semibold text-slate-500 uppercase tracking-wider text-[10px]">Başlık</th>
          <th className="px-6 py-3 font-semibold text-slate-500 uppercase tracking-wider text-[10px]">Kullanıcı</th>
          <th className="px-6 py-3 font-semibold text-slate-500 uppercase tracking-wider text-[10px]">Zaman</th>
          <th className="px-6 py-3 font-semibold text-right text-slate-500 uppercase tracking-wider text-[10px]">İşlem</th>
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
            <td className="px-6 py-3.5 text-right">
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-slate-500 hover:text-emerald-400 hover:bg-emerald-500/10 transition-colors"
                  >
                    <Eye size={14} />
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl bg-slate-900 border-slate-800 text-slate-100">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-emerald-400">
                      <FileText size={18} />
                      {cv.title || "İsimsiz Belge"}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="mt-4 p-4 rounded-lg bg-slate-950 border border-slate-800 max-h-[60vh] overflow-y-auto custom-scrollbar">
                    <pre className="whitespace-pre-wrap text-[13px] font-sans leading-relaxed text-slate-300">
                      {cv.rawText || "İçerik çekilemedi."}
                    </pre>
                  </div>
                </DialogContent>
              </Dialog>
            </td>
          </tr>
        ))}
        {data.length === 0 && (
          <tr>
            <td
              colSpan={4}
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
