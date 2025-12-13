"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  User,
  Settings,
  Bell,
  Shield,
  Smartphone,
  LogOut,
  Mail,
} from "lucide-react";
import { signOut } from "next-auth/react";
import { toast } from "sonner";
import { updateProfile } from "@/app/actions/user";
import { useRouter } from "next/navigation";

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
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState(user?.name || "");

  const handleSaveProfile = async () => {
    setIsLoading(true);
    try {
      const result = await updateProfile({ name });
      if (result.success) {
        toast.success("Profil başarıyla güncellendi");
        router.refresh();
      } else {
        toast.error(result.error || "Profil güncellenirken bir hata oluştu");
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error("Bir hata oluştu");
    } finally {
      setIsLoading(false);
    }
  };

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
              {/* Profile Tab */}
              <TabsContent value="profile" className="space-y-6 mt-0">
                <div>
                  <h2 className="text-xl font-semibold text-foreground mb-1">
                    Profil Bilgileri
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Kişisel bilgilerinizi buradan yönetin.
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <Avatar className="h-20 w-20 border-2 border-border">
                    <AvatarImage src={user?.image || ""} />
                    <AvatarFallback className="bg-gradient-to-tr from-indigo-500 to-purple-500 text-xl font-bold text-white">
                      {user?.name?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <Button
                      variant="outline"
                      className="h-9 border-border bg-secondary/50 text-foreground hover:bg-secondary hover:text-foreground"
                    >
                      Fotoğrafı Değiştir
                    </Button>
                  </div>
                </div>

                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label className="text-muted-foreground">Ad Soyad</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="pl-9 bg-secondary/50 border-border text-foreground focus:ring-primary/20 focus:border-primary/50"
                      />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label className="text-muted-foreground">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        defaultValue={user?.email || ""}
                        className="pl-9 bg-secondary/50 border-border text-foreground focus:ring-primary/20 focus:border-primary/50"
                        readOnly
                      />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label className="text-muted-foreground">Biyografi</Label>
                    <textarea
                      className="min-h-[100px] w-full rounded-md border border-border bg-secondary/50 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Kendinizden kısaca bahsedin..."
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button
                    className="bg-indigo-600 hover:bg-indigo-700 text-white"
                    onClick={handleSaveProfile}
                    disabled={isLoading}
                  >
                    {isLoading ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}
                  </Button>
                </div>
              </TabsContent>

              {/* Account Tab */}
              <TabsContent value="account" className="space-y-6 mt-0">
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
              </TabsContent>

              {/* Notifications Tab */}
              <TabsContent value="notifications" className="space-y-6 mt-0">
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
              </TabsContent>

              {/* Security Tab */}
              <TabsContent value="security" className="space-y-6 mt-0">
                <div>
                  <h2 className="text-xl font-semibold text-foreground mb-1">
                    Güvenlik
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Hesap güvenliği Google/Github hesabınız tarafından
                    sağlanmaktadır.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
                  <p className="text-sm">
                    Giriş yapmak için OAuth sağlayıcılarını (Google, Github)
                    kullandığınızdan dolayı şifre değiştirme işlemi
                    gerekmemektedir.
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
