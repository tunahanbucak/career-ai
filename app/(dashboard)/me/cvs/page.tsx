import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { prisma } from "@/app/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { FileText, Calendar, ChevronRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import CvAnalytics from "./CvAnalytics";

export const dynamic = "force-dynamic";

export default async function MyCVsPage() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) redirect("/");
  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) redirect("/");

  const cvs = await prisma.cV.findMany({
    where: { userId: user.id },
    orderBy: { uploadDate: "desc" },
    select: { id: true, title: true, uploadDate: true },
  });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">CV’lerim</h1>
          <p className="text-slate-400 mt-1 text-sm">Yüklediğin ve analiz edilen tüm özgeçmişlerin.</p>
        </div>
        <Button asChild className="bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20">
          <Link href="/dashboard"><Plus className="mr-2 h-4 w-4" /> Yeni Ekle</Link>
        </Button>
      </div>

      {cvs.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-800 bg-slate-950/50 py-20 text-center">
          <div className="rounded-full bg-slate-900 p-4">
             <FileText className="h-8 w-8 text-slate-500" />
          </div>
          <h3 className="mt-4 text-lg font-medium text-slate-300">Henüz CV yüklemediniz</h3>
          <p className="mt-1 text-sm text-slate-500 max-w-xs mx-auto">Analiz için ilk CV nizi dashboard üzerinden yükleyin.</p>
        </div>
      ) : (
        <>
          <CvAnalytics cvs={cvs} />

          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 backdrop-blur-sm overflow-hidden shadow-xl">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 uppercase bg-slate-950/50 border-b border-slate-800">
                <tr>
                  <th className="px-6 py-4 font-medium">Dosya Başlığı</th>
                  <th className="px-6 py-4 font-medium">Yükleme Tarihi</th>
                  <th className="px-6 py-4 font-medium text-right">İşlem</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {cvs.map((cv) => (
                  <tr key={cv.id} className="group hover:bg-indigo-500/5 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-200 flex items-center gap-3">
                      <div className="p-2 rounded bg-indigo-500/10 text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white transition-colors">
                         <FileText size={18} />
                      </div>
                      {cv.title || "İsimsiz Doküman"}
                    </td>
                    <td className="px-6 py-4 text-slate-400">
                      <div className="flex items-center gap-2">
                         <Calendar size={14} />
                         {new Date(cv.uploadDate).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link href={`/me/cvs/${cv.id}`} className="inline-flex items-center text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-colors">
                        Detayları Gör <ChevronRight size={14} className="ml-1" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}