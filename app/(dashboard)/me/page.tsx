import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { prisma } from "@/app/lib/prisma";
import { redirect } from "next/navigation";
import {
  User,
  Phone,
  Mail,
  FileText,
  MessageSquare,
  Edit,
  Sparkles,
  Award,
  TrendingUp,
  Shield,
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

  const profileCompletion =
    [user.name, user.title, user.phone, user.about].filter(Boolean).length * 25;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-2xl font-black text-white shadow-lg">
            {user.name?.charAt(0).toUpperCase() || "U"}
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-1">
              {user.name || "İsimsiz Kullanıcı"}
            </h1>
            <p className="text-indigo-400 font-semibold">
              {user.title || "Unvan belirtilmemiş"}
            </p>
          </div>
        </div>
        <Link href="/settings">
          <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold px-6 h-11 rounded-xl shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/50 transition-all flex items-center gap-2">
            <Edit className="w-4 h-4" />
            Profili Düzenle
          </Button>
        </Link>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-slate-900/90 to-slate-950/90 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-amber-500/10 rounded-lg">
                <Award className="w-5 h-5 text-amber-400" />
              </div>
              <h3 className="text-lg font-bold text-white">Profil Durumu</h3>
            </div>
            <div className="text-center py-4">
              <div className="text-5xl font-black text-white mb-2">
                {profileCompletion}%
              </div>
              <p className="text-sm text-slate-400 mb-4">Tamamlanma oranı</p>
              <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-1000"
                  style={{ width: `${profileCompletion}%` }}
                />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-slate-900/90 to-slate-950/90 border border-blue-500/20 rounded-2xl p-5 text-center hover:border-blue-500/40 transition-all shadow-xl">
              <div className="inline-flex p-3 bg-blue-500/10 rounded-xl mb-3">
                <FileText className="w-6 h-6 text-blue-400" />
              </div>
              <div className="text-3xl font-black text-white mb-1">
                {user.cvs.length}
              </div>
              <div className="text-xs text-slate-400 font-semibold">
                CV Analizi
              </div>
            </div>
            <div className="bg-gradient-to-br from-slate-900/90 to-slate-950/90 border border-purple-500/20 rounded-2xl p-5 text-center hover:border-purple-500/40 transition-all shadow-xl">
              <div className="inline-flex p-3 bg-purple-500/10 rounded-xl mb-3">
                <MessageSquare className="w-6 h-6 text-purple-400" />
              </div>
              <div className="text-3xl font-black text-white mb-1">
                {user.interviews.length}
              </div>
              <div className="text-xs text-slate-400 font-semibold">
                Mülakat
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-slate-900/90 to-slate-950/90 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-emerald-500/10 rounded-lg">
                <Shield className="w-5 h-5 text-emerald-400" />
              </div>
              <h3 className="text-lg font-bold text-white">İletişim</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-950/50 border border-slate-800">
                <Mail className="w-4 h-4 text-slate-500 flex-shrink-0" />
                <span className="text-sm text-slate-300 truncate">
                  {user.email}
                </span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-950/50 border border-slate-800">
                <Phone className="w-4 h-4 text-slate-500 flex-shrink-0" />
                <span className="text-sm text-slate-300">
                  {user.phone || "Telefon eklenmemiş"}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-gradient-to-br from-slate-900/90 to-slate-950/90 border border-slate-800 rounded-2xl p-8 backdrop-blur-xl shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 bg-indigo-500/10 rounded-xl">
                <User className="w-5 h-5 text-indigo-400" />
              </div>
              <h3 className="text-xl font-bold text-white">Hakkımda</h3>
            </div>
            {user.about ? (
              <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">
                {user.about}
              </p>
            ) : (
              <div className="text-center py-12 border-2 border-dashed border-slate-800 rounded-xl bg-slate-950/30">
                <User className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                <p className="text-slate-500 mb-4">
                  Henüz kendinizden bahsetmediniz
                </p>
                <Link href="/settings">
                  <Button
                    variant="outline"
                    className="border-indigo-500/20 bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20"
                  >
                    Profili Tamamla
                  </Button>
                </Link>
              </div>
            )}
          </div>
          <div className="bg-gradient-to-br from-slate-900/90 to-slate-950/90 border border-slate-800 rounded-2xl p-8 backdrop-blur-xl shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 bg-purple-500/10 rounded-xl">
                <TrendingUp className="w-5 h-5 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold text-white">Hesap Detayları</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Kullanıcı ID
                </div>
                <div className="font-mono text-sm text-slate-300 bg-slate-950/50 p-3 rounded-xl border border-slate-800 truncate">
                  {user.id}
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Üyelik Tipi
                </div>
                <div className="flex items-center gap-2 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 p-3 rounded-xl">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span className="text-sm font-bold text-amber-400">
                    Premium
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
