"use client";

import { useState } from "react";
import {
  Download,
  FileText,
  FileSpreadsheet,
  MessageSquare,
  Loader2,
} from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { toast } from "sonner";

export default function ExportDropdown() {
  const [loading, setLoading] = useState(false);

  const handleExport = async (type: "cvs" | "analyses" | "interviews") => {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/export?type=${type}`);

      if (!res.ok) throw new Error("Export failed");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `career-ai-${type}-${
        new Date().toISOString().split("T")[0]
      }.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success(
        `${
          type === "cvs" ? "CV" : type === "analyses" ? "Analiz" : "Mülakat"
        } verileri indirildi`
      );
    } catch (error) {
      console.error(error);
      toast.error("İndirme sırasında bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          disabled={loading}
          className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold transition-all shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 disabled:opacity-50 disabled:cursor-not-allowed outline-none hover:scale-105 active:scale-95 border border-indigo-500/50"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Download className="w-4 h-4" />
          )}
          <span className="text-sm">Dışa Aktar</span>
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="min-w-[220px] bg-slate-900/95 backdrop-blur-xl border border-slate-800 rounded-xl p-2 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-200"
          sideOffset={8}
        >
          <DropdownMenu.Label className="px-3 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <Download className="w-3 h-3" />
            Veri Türü Seçin
          </DropdownMenu.Label>
          <DropdownMenu.Separator className="my-1 h-px bg-slate-800" />
          <DropdownMenu.Item
            className="flex items-center gap-3 px-3 py-2.5 text-sm text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg cursor-pointer outline-none transition-all group"
            onSelect={() => handleExport("cvs")}
            disabled={loading}
          >
            <div className="p-1.5 bg-emerald-500/10 rounded-lg group-hover:bg-emerald-500/20 transition-colors">
              <FileText className="w-4 h-4 text-emerald-500 group-hover:scale-110 transition-transform" />
            </div>
            <span className="flex-1 font-medium">Tüm CV&apos;ler</span>
          </DropdownMenu.Item>
          <DropdownMenu.Item
            className="flex items-center gap-3 px-3 py-2.5 text-sm text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg cursor-pointer outline-none transition-all group"
            onSelect={() => handleExport("analyses")}
            disabled={loading}
          >
            <div className="p-1.5 bg-purple-500/10 rounded-lg group-hover:bg-purple-500/20 transition-colors">
              <FileSpreadsheet className="w-4 h-4 text-purple-500 group-hover:scale-110 transition-transform" />
            </div>
            <span className="flex-1 font-medium">Analiz Raporları</span>
          </DropdownMenu.Item>
          <DropdownMenu.Item
            className="flex items-center gap-3 px-3 py-2.5 text-sm text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg cursor-pointer outline-none transition-all group"
            onSelect={() => handleExport("interviews")}
            disabled={loading}
          >
            <div className="p-1.5 bg-amber-500/10 rounded-lg group-hover:bg-amber-500/20 transition-colors">
              <MessageSquare className="w-4 h-4 text-amber-500 group-hover:scale-110 transition-transform" />
            </div>
            <span className="flex-1 font-medium">Mülakat Kayıtları</span>
          </DropdownMenu.Item>
          <DropdownMenu.Separator className="my-1 h-px bg-slate-800" />
          <div className="px-3 py-2 text-[10px] text-slate-600 text-center flex items-center justify-center gap-1">
            <FileSpreadsheet className="w-3 h-3" />
            CSV formatında indirilir
          </div>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
