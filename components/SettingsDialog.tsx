"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { User, Settings, Bell, Shield, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

// Components
import ProfileTab from "./settings/ProfileTab";
import AccountTab from "./settings/AccountTab";
import NotificationTab from "./settings/NotificationTab";
import SecurityTab from "./settings/SecurityTab";

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user?: { name?: string | null; email?: string | null; image?: string | null };
}

export default function SettingsDialog({
  open,
  onOpenChange,
  user,
}: SettingsDialogProps) {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] p-0 overflow-hidden bg-background/95 backdrop-blur-xl border-border text-foreground">
        <DialogTitle className="sr-only">Ayarlar</DialogTitle>
        <div className="flex h-[500px]">
          {/* Sidebar */}
          <div className="w-[200px] bg-secondary/50 border-r border-border p-4 flex flex-col gap-2">
            <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 px-2">
              Ayarlar
            </div>
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              orientation="vertical"
              className="flex-1 flex flex-col gap-1"
            >
              <TabsList className="flex flex-col h-auto bg-transparent gap-1 p-0 justify-start w-full">
                <TabsTrigger
                  value="profile"
                  className="w-full justify-start gap-2 px-3 py-2 h-9 text-sm font-medium data-[state=active]:bg-primary/10 data-[state=active]:text-primary text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all rounded-lg"
                >
                  <User size={16} />
                  Profil
                </TabsTrigger>
                <TabsTrigger
                  value="account"
                  className="w-full justify-start gap-2 px-3 py-2 h-9 text-sm font-medium data-[state=active]:bg-primary/10 data-[state=active]:text-primary text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all rounded-lg"
                >
                  <Settings size={16} />
                  Hesap
                </TabsTrigger>
                <TabsTrigger
                  value="notifications"
                  className="w-full justify-start gap-2 px-3 py-2 h-9 text-sm font-medium data-[state=active]:bg-primary/10 data-[state=active]:text-primary text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all rounded-lg"
                >
                  <Bell size={16} />
                  Bildirimler
                </TabsTrigger>
                <TabsTrigger
                  value="security"
                  className="w-full justify-start gap-2 px-3 py-2 h-9 text-sm font-medium data-[state=active]:bg-primary/10 data-[state=active]:text-primary text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all rounded-lg"
                >
                  <Shield size={16} />
                  Güvenlik
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="mt-auto border-t border-border pt-4">
              <Button
                variant="ghost"
                className="w-full justify-start gap-2 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                onClick={() => signOut({ callbackUrl: "/" })}
              >
                <LogOut size={16} />
                Çıkış Yap
              </Button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 p-6 overflow-y-auto custom-scrollbar">
            <Tabs value={activeTab} className="space-y-6">
              <TabsContent value="profile" className="mt-0">
                <ProfileTab user={user} />
              </TabsContent>
              <TabsContent value="account" className="mt-0">
                <AccountTab />
              </TabsContent>
              <TabsContent value="notifications" className="mt-0">
                <NotificationTab />
              </TabsContent>
              <TabsContent value="security" className="mt-0">
                <SecurityTab />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
