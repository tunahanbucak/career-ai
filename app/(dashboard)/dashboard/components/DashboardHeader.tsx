"use client";

import { useSession } from "next-auth/react";
import { AlertCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  onSupport: () => void;
  onScrollToUpload: () => void;
};

export default function DashboardHeader({ onSupport, onScrollToUpload }: Props) {
  const { data: session } = useSession();

  return (
    <header className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Kontrol Paneli</h1>
        <p className="text-slate-400 mt-1 text-sm">
          Hoş geldin,{" "}
          <span className="text-indigo-400 font-semibold">
            {session?.user?.name || "Kullanıcı"}
          </span>
          . Kariyer hedeflerine ulaşmak için bugün ne yapıyoruz?
        </p>
      </div>

      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          onClick={onSupport}
          className="border-slate-800 bg-slate-950 hover:bg-slate-900 text-slate-300"
        >
          <AlertCircle className="mr-2 h-4 w-4" /> Destek Al
        </Button>
        <Button
          onClick={onScrollToUpload}
          className="bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20 transition-all hover:scale-105"
        >
          <Sparkles className="mr-2 h-4 w-4" /> Yeni Analiz
        </Button>
      </div>
    </header>
  );
}
