"use client";

import { useState } from "react";
import { Download, FileSpreadsheet, Loader2 } from "lucide-react";
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

      toast.success(`${type.toUpperCase()} verileri başarıyla indirildi.`);
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
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-medium transition-colors shadow-lg shadow-indigo-500/25 disabled:opacity-70 disabled:cursor-not-allowed outline-none"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Download className="w-4 h-4" />
          )}
          <span>Dışa Aktar</span>
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="min-w-[180px] bg-slate-900 border border-slate-800 rounded-xl p-1.5 shadow-xl z-50 animate-in fade-in zoom-in-95 duration-200"
          sideOffset={5}
        >
          <DropdownMenu.Label className="px-2 py-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Veri Seçin
          </DropdownMenu.Label>

          <DropdownMenu.Item
            className="flex items-center gap-2 px-2 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg cursor-pointer outline-none transition-colors"
            onSelect={() => handleExport("cvs")}
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-500" />
            Tüm CV&apos;ler
          </DropdownMenu.Item>

          <DropdownMenu.Item
            className="flex items-center gap-2 px-2 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg cursor-pointer outline-none transition-colors"
            onSelect={() => handleExport("analyses")}
          >
            <FileSpreadsheet className="w-4 h-4 text-blue-500" />
            Analiz Raporları
          </DropdownMenu.Item>

          <DropdownMenu.Item
            className="flex items-center gap-2 px-2 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg cursor-pointer outline-none transition-colors"
            onSelect={() => handleExport("interviews")}
          >
            <FileSpreadsheet className="w-4 h-4 text-amber-500" />
            Mülakat Kayıtları
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
