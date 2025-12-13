import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { prisma } from "@/app/lib/prisma";
import { redirect } from "next/navigation";
import {
  User,
  Phone,
  Mail,
  Calendar,
  FileText,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) redirect("/");

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      cvs: { select: { id: true } },
      interviews: { select: { id: true } },
    },
  });

  if (!user) redirect("/");

  return (
    <div className="max-w-5xl mx-auto p-6 lg:p-10 space-y-8 pb-20">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-slate-800 pb-8">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Profil bilgileriniz
          </h1>
        </div>
        <Link href="/settings">
          <Button
            variant="outline"
            className="border-indigo-500/20 bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 hover:text-indigo-300"
          >
            Profili Düzenle
          </Button>
        </Link>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-8 text-center backdrop-blur-sm relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500" />
            <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-4xl font-bold text-white mb-6 shadow-xl shadow-indigo-500/20 relative z-10 group-hover:scale-105 transition-transform duration-500">
              {user.name?.charAt(0).toUpperCase() || "U"}
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              {user.name || "İsimsiz Kullanıcı"}
            </h2>
            <p className="text-indigo-400 font-medium mb-1">
              {user.title || "Unvan Belirtilmemiş"}
            </p>
            <div className="mt-6 space-y-3 text-sm text-slate-400 text-left bg-slate-950/30 p-4 rounded-2xl border border-slate-800/50">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-slate-500" />
                <span className="truncate">{user.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-slate-500" />
                <span>{user.phone || "Telefon eklenmemiş"}</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4 backdrop-blur-sm text-center hover:border-indigo-500/30 transition-colors">
              <div className="text-3xl font-bold text-white mb-1">
                {user.cvs.length}
              </div>
              <div className="text-xs text-slate-400 font-medium flex items-center justify-center gap-1">
                <FileText className="h-3 w-3" /> CV Analizi
              </div>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4 backdrop-blur-sm text-center hover:border-purple-500/30 transition-colors">
              <div className="text-3xl font-bold text-white mb-1">
                {user.interviews.length}
              </div>
              <div className="text-xs text-slate-400 font-medium flex items-center justify-center gap-1">
                <MessageSquare className="h-3 w-3" /> Mülakat
              </div>
            </div>
          </div>
        </div>
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-8 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                <User className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-white">Hakkımda</h3>
            </div>
            <div className="prose prose-invert prose-sm max-w-none text-slate-300 leading-relaxed">
              {user.about ? (
                <p className="whitespace-pre-wrap">{user.about}</p>
              ) : (
                <div className="text-slate-500 italic bg-slate-950/30 p-6 rounded-xl border border-dashed border-slate-800 text-center">
                  Henüz kendinizden bahsetmediniz. <br />
                  <Link
                    href="/settings"
                    className="text-indigo-400 hover:text-indigo-300 not-italic mt-2 inline-block"
                  >
                    Profili Düzenle
                  </Link>{" "}
                  diyerek ekleyin.
                </div>
              )}
            </div>
          </div>
          <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-8 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                <Calendar className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-white">Hesap Bilgileri</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Kullanıcı ID
                </div>
                <div className="font-mono text-sm text-slate-300 bg-slate-950/50 p-2 rounded-lg border border-slate-800/50 truncate">
                  {user.id}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
