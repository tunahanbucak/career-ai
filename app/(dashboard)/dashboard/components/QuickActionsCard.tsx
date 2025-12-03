"use client";

import { ThumbsUp, Mail, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  onFeedback: () => void;
  onSupport: () => void;
  onLogout: () => void;
};

export default function QuickActionsCard({ onFeedback, onSupport, onLogout }: Props) {
  return (
    <div className="space-y-6">
      <div className="border-slate-800 bg-slate-900/60 backdrop-blur-sm rounded-2xl border">
        <div className="pb-2 px-6 pt-4">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Hızlı İşlemler
          </p>
        </div>
        <div className="px-6 pb-4 space-y-2">
          <Button
            variant="ghost"
            onClick={onFeedback}
            className="w-full justify-start h-9 px-2 text-slate-300 hover:bg-slate-800 hover:text-white text-sm"
          >
            <ThumbsUp size={16} className="mr-2 text-slate-500" /> Geri Bildirim
          </Button>
          <Button
            variant="ghost"
            onClick={onSupport}
            className="w-full justify-start h-9 px-2 text-slate-300 hover:bg-slate-800 hover:text-white text-sm"
          >
            <Mail size={16} className="mr-2 text-slate-500" /> Destek
          </Button>
          <div className="pt-2 mt-2 border-t border-slate-800">
            <Button
              variant="ghost"
              onClick={onLogout}
              className="w-full justify-start h-9 px-2 text-red-400 hover:bg-red-900/20 hover:text-red-300 text-sm"
            >
              <LogOut size={16} className="mr-2" /> Güvenli Çıkış
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
