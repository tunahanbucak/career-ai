"use client";

import { deleteUser } from "@/app/actions/delete";
import { Trash2, AlertTriangle } from "lucide-react";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useState } from "react";

export default function DeleteAccountSection() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setLoading(true);
    try {
      const res = await deleteUser();
      if (res.error) {
        toast.error(res.error);
        setLoading(false);
      } else {
        toast.success("Hesabınız silindi.");
        await signOut({ redirect: false });
        router.push("/");
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error("Bir hata oluştu.");
      setLoading(false);
    }
  };

  return (
    <div className="bg-red-950/20 border border-red-900/40 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
      <div className="space-y-2 text-center md:text-left">
        <h3 className="text-xl font-bold text-red-500 flex items-center justify-center md:justify-start gap-2">
          <AlertTriangle className="w-5 h-5" />
          Tehlikeli Bölge
        </h3>
        <p className="text-slate-400 max-w-xl">
          Hesabınızı sildiğinizde, yüklediğiniz tüm CV&apos;ler, analiz
          raporları ve mülakat geçmişiniz <strong>kalıcı olarak</strong>{" "}
          silinecektir. Bu işlem geri alınamaz. KVKK kapsamında tüm verileriniz
          sunucularımızdan temizlenir.
        </p>
      </div>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant="destructive"
            className="bg-red-600 hover:bg-red-700 font-semibold"
            disabled={loading}
          >
            {loading ? (
              "Siliniyor..."
            ) : (
              <>
                <Trash2 className="w-4 h-4 mr-2" />
                Hesabımı Sil
              </>
            )}
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent className="bg-slate-900 border-slate-800 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Emin misiniz?</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-400">
              Bu işlem geri alınamaz. Hesabınız ve tüm verileriniz kalıcı olarak
              silinecek.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-slate-800 text-white hover:bg-slate-700 hover:text-white border-slate-700">
              İptal
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Evet, Hesabımı Sil
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
