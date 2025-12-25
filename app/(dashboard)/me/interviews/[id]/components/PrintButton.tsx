"use client";

import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PrintButton() {
  return (
    <Button
      variant="outline"
      className="border-slate-800 bg-slate-900/60 text-slate-300 hover:text-white transition-colors gap-2 print:hidden"
      onClick={() => window.print()}
    >
      <Download size={16} />
      PDF Olarak Kaydet
    </Button>
  );
}
