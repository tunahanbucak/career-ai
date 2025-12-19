"use client";

import { Mail, Smartphone } from "lucide-react";
import { Switch } from "@/components/ui/switch";

export default function NotificationTab() {
  return (
    <div className="space-y-6 mt-0">
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-1">
          Bildirim Tercihleri
        </h2>
        <p className="text-sm text-muted-foreground">
          Hangi konularda bildirim almak istediğinizi seçin.
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/50 border border-border">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400">
              <Mail size={18} />
            </div>
            <div>
              <div className="text-sm font-medium text-foreground">
                E-posta Bildirimleri
              </div>
              <div className="text-xs text-muted-foreground">
                Güncellemeler ve haberler için.
              </div>
            </div>
          </div>
          <Switch defaultChecked />
        </div>

        <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/50 border border-border">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-400">
              <Smartphone size={18} />
            </div>
            <div>
              <div className="text-sm font-medium text-foreground">
                Push Bildirimleri
              </div>
              <div className="text-xs text-muted-foreground">
                Anlık bildirimler mobil cihazınızda.
              </div>
            </div>
          </div>
          <Switch defaultChecked />
        </div>
      </div>
    </div>
  );
}
