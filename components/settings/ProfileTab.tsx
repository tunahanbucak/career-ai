"use client";

import { useState } from "react";
import { User, Mail } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { updateProfile } from "@/app/actions/user";
import { useRouter } from "next/navigation";

interface ProfileTabProps {
  user?: { name?: string | null; email?: string | null; image?: string | null };
}

export default function ProfileTab({ user }: ProfileTabProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const router = useRouter();

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
    } catch (_error) {
      toast.error("Bir hata oluştu");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 mt-0">
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
    </div>
  );
}
