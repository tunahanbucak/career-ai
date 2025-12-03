import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { prisma } from "@/app/lib/prisma";
import { redirect } from "next/navigation";
import { 
  Users, 
  FileText, 
  Activity, 
  MessageSquare, 
  Search, 
  Download, 
  ShieldAlert, 
  ChevronLeft, 
  ChevronRight,
  LayoutGrid
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminPage({ searchParams }: { searchParams?: { q?: string; page?: string } }) {
  const session = await getServerSession(authOptions);
  
  // 1. Yetki Kontrolü
  if (!session || !session.user?.email) {
    redirect("/");
  }
  const admins = (process.env.ADMIN_EMAILS || "").split(",").map((s) => s.trim().toLowerCase()).filter(Boolean);
  const isAdmin = admins.length === 0 ? false : admins.includes(session.user.email.toLowerCase());
  
  if (!isAdmin) {
    redirect("/");
  }

  // 2. İstatistikleri Çek
  const [usersCount, cvsCount, analysesCount, interviewsCount, messagesCount] = await Promise.all([
    prisma.user.count(),
    prisma.cV.count(),
    prisma.cVAnalysis.count(),
    prisma.interview.count(),
    prisma.interviewMessage.count(),
  ]);

  // 3. Filtreleme Parametreleri
  const q = (searchParams?.q || "").trim();
  const pageIndex = Math.max(1, Number(searchParams?.page || 1));
  const pageSize = 10;
  const skip = (pageIndex - 1) * pageSize;

  // Filtre Sorguları
  const cvWhere = q
    ? {
        OR: [
          { title: { contains: q, mode: "insensitive" as const } },
          { user: { email: { contains: q, mode: "insensitive" as const } } },
        ],
      }
    : {};
  const analysisWhere = q
    ? {
        OR: [
          { title: { contains: q, mode: "insensitive" as const } },
          { cv: { title: { contains: q, mode: "insensitive" as const } } },
          { cv: { user: { email: { contains: q, mode: "insensitive" as const } } } },
        ],
      }
    : {};
  const interviewWhere = q
    ? {
        OR: [
          { position: { contains: q, mode: "insensitive" as const } },
          { user: { email: { contains: q, mode: "insensitive" as const } } },
        ],
      }
    : {};

  // 4. Verileri ve Toplam Sayıları Çek
  const [cvTotal, analysisTotal, interviewTotal] = await Promise.all([
    prisma.cV.count({ where: cvWhere }),
    prisma.cVAnalysis.count({ where: analysisWhere }),
    prisma.interview.count({ where: interviewWhere }),
  ]);

  const [recentCVs, recentAnalyses, recentInterviews] = await Promise.all([
    prisma.cV.findMany({
      where: cvWhere,
      orderBy: { uploadDate: "desc" },
      skip,
      take: pageSize,
      include: { user: { select: { email: true } } },
    }),
    prisma.cVAnalysis.findMany({
      where: analysisWhere,
      orderBy: { createdAt: "desc" },
      skip,
      take: pageSize,
      include: { cv: { select: { title: true, user: { select: { email: true } } } } },
    }),
    prisma.interview.findMany({
      where: interviewWhere,
      orderBy: { date: "desc" },
      skip,
      take: pageSize,
      include: { user: { select: { email: true } }, messages: { select: { id: true } } },
    }),
  ]);

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 font-sans selection:bg-indigo-500/30 pb-20">
      {/* Arka Plan Efekti */}
      <div className="fixed inset-0 z-0 pointer-events-none">
         <div className="absolute top-0 left-1/4 h-[500px] w-[500px] rounded-full bg-indigo-900/10 blur-[120px]" />
         <div className="absolute bottom-0 right-1/4 h-[500px] w-[500px] rounded-full bg-blue-900/10 blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto flex max-w-[1600px] flex-col gap-8 px-6 py-10">
        
        {/* HEADER */}
        <header className="flex flex-col justify-between gap-4 md:flex-row md:items-center border-b border-slate-800 pb-6">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-500/10 rounded-lg border border-indigo-500/20">
                <ShieldAlert className="h-6 w-6 text-indigo-400" />
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-white">Yönetim Paneli</h1>
            </div>
            <p className="mt-2 text-sm text-slate-400">
              Hoş geldin, <span className="text-slate-200 font-medium">{session.user.email}</span>. Platform istatistiklerini izle ve yönet.
            </p>
          </div>
          <div className="flex items-center gap-3">
             <div className="hidden md:flex flex-col items-end">
                <span className="text-xs text-slate-500 uppercase tracking-wider font-bold">Sistem Durumu</span>
                <span className="text-sm text-emerald-400 flex items-center gap-1">● Aktif ve Çalışıyor</span>
             </div>
          </div>
        </header>

        {/* METRİKLER */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <MetricCard title="Kullanıcılar" value={usersCount} icon={<Users size={20} />} color="text-sky-400" bg="bg-sky-500/10" border="border-sky-500/20" />
          <MetricCard title="CV Sayısı" value={cvsCount} icon={<FileText size={20} />} color="text-emerald-400" bg="bg-emerald-500/10" border="border-emerald-500/20" />
          <MetricCard title="Analizler" value={analysesCount} icon={<Activity size={20} />} color="text-purple-400" bg="bg-purple-500/10" border="border-purple-500/20" />
          <MetricCard title="Mülakatlar" value={interviewsCount} icon={<LayoutGrid size={20} />} color="text-amber-400" bg="bg-amber-500/10" border="border-amber-500/20" />
          <MetricCard title="Mesajlar" value={messagesCount} icon={<MessageSquare size={20} />} color="text-rose-400" bg="bg-rose-500/10" border="border-rose-500/20" />
        </section>

        {/* FİLTRE VE AKSİYON ALANI */}
        <section className="rounded-2xl border border-slate-800 bg-slate-900/40 backdrop-blur-sm p-5 shadow-xl">
          <div className="flex flex-col lg:flex-row gap-6 justify-between items-end lg:items-center">
            
            {/* Arama Formu */}
            <form action="/admin" method="get" className="flex-1 w-full lg:w-auto flex flex-col md:flex-row gap-3 items-end">
               <div className="relative w-full md:max-w-md">
                  <label className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-1 block ml-1">Hızlı Arama</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                    <input
                      name="q"
                      defaultValue={q}
                      placeholder="E-posta, başlık veya pozisyon ara..."
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 pl-10 pr-4 py-2.5 text-sm text-slate-200 placeholder:text-slate-600 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
                    />
                  </div>
               </div>
               <input type="hidden" name="page" value="1" /> {/* Yeni aramada sayfa 1'e dön */}
               <button type="submit" className="w-full md:w-auto rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-500 shadow-lg shadow-indigo-500/20 transition-all">
                 Filtrele
               </button>
               {q && (
                 <a href="/admin" className="text-xs text-slate-500 hover:text-slate-300 underline underline-offset-4 pb-2">Temizle</a>
               )}
            </form>

            {/* Export Formu */}
            <form action="/api/admin/export" method="get" className="w-full lg:w-auto flex flex-col md:flex-row gap-3 items-end bg-slate-950/50 p-3 rounded-xl border border-slate-800/50">
               <div className="grid grid-cols-2 md:grid-cols-3 gap-2 w-full">
                  <div>
                    <label className="text-[10px] text-slate-500 block mb-1">Veri Tipi</label>
                    <select name="type" className="w-full rounded-lg border border-slate-700 bg-slate-900 px-2 py-1.5 text-xs text-slate-300 focus:border-indigo-500 outline-none">
                      <option value="analyses">Analizler</option>
                      <option value="cvs">CV&apos;ler</option>
                      <option value="interviews">Mülakatlar</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500 block mb-1">Başlangıç</label>
                    <input type="date" name="from" className="w-full rounded-lg border border-slate-700 bg-slate-900 px-2 py-1.5 text-xs text-slate-300 focus:border-indigo-500 outline-none" />
                  </div>
                  <div className="col-span-2 md:col-span-1">
                    <label className="text-[10px] text-slate-500 block mb-1">Bitiş</label>
                    <input type="date" name="to" className="w-full rounded-lg border border-slate-700 bg-slate-900 px-2 py-1.5 text-xs text-slate-300 focus:border-indigo-500 outline-none" />
                  </div>
               </div>
               <button type="submit" className="w-full md:w-auto flex items-center justify-center gap-2 rounded-lg bg-slate-800 px-4 py-2 text-xs font-medium text-slate-200 hover:bg-slate-700 border border-slate-700">
                 <Download size={14} /> CSV İndir
               </button>
            </form>

          </div>
        </section>

        {/* TABLOLAR ALANI */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          
          {/* 1. TABLO: SON CV'LER */}
          <DataCard title="Son Yüklenen CV'ler" total={cvTotal} page={pageIndex} pageSize={pageSize} query={q}>
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 uppercase bg-slate-950/50 border-b border-slate-800">
                <tr>
                  <th className="px-4 py-3 font-medium">Başlık</th>
                  <th className="px-4 py-3 font-medium">Kullanıcı</th>
                  <th className="px-4 py-3 font-medium text-right">Tarih</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {recentCVs.map((cv) => (
                  <tr key={cv.id} className="hover:bg-slate-800/30 transition-colors group">
                    <td className="px-4 py-3 font-medium text-slate-200 group-hover:text-indigo-300 transition-colors">
                      {cv.title || "Başlıksız Belge"}
                    </td>
                    <td className="px-4 py-3">
                       <span className="inline-flex items-center rounded-full bg-slate-900 border border-slate-800 px-2 py-0.5 text-xs text-slate-400">
                          {cv.user?.email || "Anonim"}
                       </span>
                    </td>
                    <td className="px-4 py-3 text-right text-xs text-slate-500 tabular-nums">
                      {new Date(cv.uploadDate).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </td>
                  </tr>
                ))}
                {recentCVs.length === 0 && (
                   <tr><td colSpan={3} className="px-4 py-8 text-center text-slate-500">Kayıt bulunamadı.</td></tr>
                )}
              </tbody>
            </table>
          </DataCard>

          {/* 2. TABLO: SON ANALİZLER */}
          <DataCard title="Son Yapılan Analizler" total={analysisTotal} page={pageIndex} pageSize={pageSize} query={q}>
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 uppercase bg-slate-950/50 border-b border-slate-800">
                <tr>
                  <th className="px-4 py-3 font-medium">CV Başlığı</th>
                  <th className="px-4 py-3 font-medium">Kullanıcı</th>
                  <th className="px-4 py-3 font-medium text-right">Tarih</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {recentAnalyses.map((a) => (
                  <tr key={a.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-4 py-3">
                       <div className="font-medium text-slate-200">{a.cv?.title || "-"}</div>
                       <div className="text-[10px] text-slate-500 truncate max-w-[150px] mt-0.5">
                          {Array.isArray(a.keywords) ? a.keywords.slice(0, 3).join(", ") : ""}
                       </div>
                    </td>
                    <td className="px-4 py-3">
                       <span className="inline-flex items-center rounded-full bg-slate-900 border border-slate-800 px-2 py-0.5 text-xs text-slate-400">
                          {a.cv?.user?.email || "Anonim"}
                       </span>
                    </td>
                    <td className="px-4 py-3 text-right text-xs text-slate-500 tabular-nums">
                      {new Date(a.createdAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </td>
                  </tr>
                ))}
                 {recentAnalyses.length === 0 && (
                   <tr><td colSpan={3} className="px-4 py-8 text-center text-slate-500">Kayıt bulunamadı.</td></tr>
                )}
              </tbody>
            </table>
          </DataCard>
        </div>

        {/* 3. BÖLÜM: MÜLAKATLAR (GENİŞ TABLO) */}
        <section>
          <DataCard title="Son Mülakat Oturumları" total={interviewTotal} page={pageIndex} pageSize={pageSize} query={q}>
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 uppercase bg-slate-950/50 border-b border-slate-800">
                <tr>
                  <th className="px-4 py-3 font-medium">Pozisyon</th>
                  <th className="px-4 py-3 font-medium">Kullanıcı</th>
                  <th className="px-4 py-3 font-medium text-center">Mesaj Sayısı</th>
                  <th className="px-4 py-3 font-medium text-right">Oluşturulma</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {recentInterviews.map((i) => (
                  <tr key={i.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-4 py-3 font-medium text-indigo-300">
                      {i.position}
                    </td>
                    <td className="px-4 py-3">
                       <span className="inline-flex items-center rounded-full bg-slate-900 border border-slate-800 px-2 py-0.5 text-xs text-slate-400">
                         {i.user?.email || "-"}
                       </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                       <span className="inline-flex h-6 min-w-[1.5rem] items-center justify-center rounded-md bg-slate-800 text-xs font-medium text-slate-300">
                          {i.messages?.length ?? 0}
                       </span>
                    </td>
                    <td className="px-4 py-3 text-right text-xs text-slate-500 tabular-nums">
                      {new Date(i.date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}
                    </td>
                  </tr>
                ))}
                 {recentInterviews.length === 0 && (
                   <tr><td colSpan={4} className="px-4 py-8 text-center text-slate-500">Kayıt bulunamadı.</td></tr>
                )}
              </tbody>
            </table>
          </DataCard>
        </section>

      </div>
    </div>
  );
}

// --- BİLEŞENLER ---

function MetricCard({ title, value, icon, color, bg, border }: { title: string; value: number; icon: React.ReactNode, color: string, bg: string, border: string }) {
  return (
    <div className={`group relative overflow-hidden rounded-2xl border ${border} ${bg} backdrop-blur-sm p-5 transition-all hover:scale-[1.02]`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">{title}</p>
          <h3 className="mt-2 text-3xl font-bold text-white tabular-nums tracking-tight">{value}</h3>
        </div>
        <div className={`rounded-xl bg-slate-950/40 p-2 ${color}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

function DataCard({ title, children, total, page, pageSize, query }: { title: string; children: React.ReactNode; total: number; page: number; pageSize: number, query: string }) {
  const totalPages = Math.ceil(total / pageSize);
  
  return (
    <div className="flex flex-col rounded-2xl border border-slate-800 bg-slate-900/40 backdrop-blur-sm shadow-sm overflow-hidden">
      <div className="flex items-center justify-between border-b border-slate-800 px-5 py-4 bg-slate-900/50">
        <h3 className="font-semibold text-slate-200 flex items-center gap-2">
            <LayoutGrid size={16} className="text-slate-500" />
            {title}
        </h3>
        <span className="text-xs text-slate-500 bg-slate-950 px-2 py-1 rounded border border-slate-800">Toplam: {total}</span>
      </div>
      
      <div className="overflow-x-auto">
        {children}
      </div>

      {/* Pagination Footer */}
      <div className="flex items-center justify-between border-t border-slate-800 bg-slate-950/30 px-4 py-3">
         <div className="text-xs text-slate-500">
            Sayfa {page} / {totalPages || 1}
         </div>
         <div className="flex gap-2">
            {page > 1 && (
               <a
               href={`/admin?q=${query}&page=${page - 1}`}
               className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-800 bg-slate-900 text-slate-400 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-colors"
               >
               <ChevronLeft size={14} />
               </a>
            )}
            {page < totalPages && (
               <a
               href={`/admin?q=${query}&page=${page + 1}`}
               className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-800 bg-slate-900 text-slate-400 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-colors"
               >
               <ChevronRight size={14} />
               </a>
            )}
         </div>
      </div>
    </div>
  );
}