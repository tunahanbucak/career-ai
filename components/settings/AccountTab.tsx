"use client";

import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

export default function AccountTab() {
  return (
    <div className="space-y-6 mt-0">
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-1">
          Hesap Ayarları
        </h2>
        <p className="text-sm text-muted-foreground">
          Hesap tercihlerinizi ve planınızı yönetin.
        </p>
      </div>

      <div className="p-4 rounded-xl bg-secondary/50 border border-border space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-medium text-foreground">
              Kariyer Plan Görünürlüğü
            </div>
            <div className="text-xs text-muted-foreground">
              Profiliniz işverenler tarafından görüntülenebilir olsun.
            </div>
          </div>
          <Switch />
        </div>
        <div className="flex items-center justify-between border-t border-border/50 pt-4">
          <div>
            <div className="text-sm font-medium text-foreground">
              İki Faktörlü Doğrulama
            </div>
            <div className="text-xs text-muted-foreground">
              Hesap güvenliğini artırın.
            </div>
          </div>
          <Switch disabled />
        </div>
      </div>

      <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-indigo-400">Pro Plan</h3>
          <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-medium tracking-wide">
            AKTİF
          </span>
        </div>
        <p className="text-xs text-muted-foreground mb-4">
          Bir sonraki yenileme tarihi:{" "}
          <span className="text-foreground">12 Ocak 2026</span>
        </p>
        <Button
          size="sm"
          variant="outline"
          className="border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/10 hover:text-indigo-300"
        >
          Planı Yönet
        </Button>
      </div>
    </div>
  );
}
