import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { prisma } from "@/app/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { FileText, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import CvAnalytics from "./CvAnalytics";
import CvHistoryList from "./components/CvHistoryList";

export const dynamic = "force-dynamic";

export default async function MyCVsPage() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) redirect("/");
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });
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
          <h1 className="text-3xl font-bold text-white tracking-tight">
            CV’lerim
          </h1>
          <p className="text-slate-400 mt-1 text-sm">
            Yüklediğin ve analiz edilen tüm özgeçmişlerin.
          </p>
        </div>
        <Button
          asChild
          className="bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20"
        >
          <Link href="/cv-analysis">
            <Plus className="mr-2 h-4 w-4" /> Yeni CV Yükle
          </Link>
        </Button>
      </div>

      {cvs.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-800 bg-slate-950/50 py-20 text-center">
          <div className="rounded-full bg-slate-900 p-6 mb-4 shadow-lg shadow-indigo-500/10">
            <FileText className="h-10 w-10 text-slate-500" />
          </div>
          <h3 className="text-xl font-bold text-slate-300">
            Henüz CV yüklemediniz
          </h3>
          <p className="mt-2 text-sm text-slate-500 max-w-xs mx-auto">
            Analiz için ilk CV nizi dashboard üzerinden yükleyin.
          </p>
        </div>
      ) : (
        <>
          <CvAnalytics cvs={cvs} />
          
          <div className="pt-4">
             <div className="flex items-center gap-2 mb-6">
                <div className="h-8 w-1 bg-indigo-500 rounded-full" />
                <h2 className="text-xl font-bold text-white">Geçmiş Dosyalar</h2>
             </div>
             <CvHistoryList cvs={cvs.map(c => ({
                id: c.id, 
                title: c.title, 
                uploadDate: c.uploadDate instanceof Date ? c.uploadDate.toISOString() : c.uploadDate
             }))} />
          </div>
        </>
      )}
    </div>
  );
}
