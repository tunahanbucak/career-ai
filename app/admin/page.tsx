import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { prisma } from "@/app/lib/prisma";
import { redirect } from "next/navigation";
import { Search, Download, ShieldAlert, FileText } from "lucide-react";
import AdminStats from "./components/AdminStats";
import { DataCard } from "./components/AdminTables";
import GlobalActivityChart from "./components/GlobalActivityChart";

// Hata ayıklama ve dinamik render için gerekli ayar
export const dynamic = "force-dynamic";

// Admin sayfası bileşeni (Asenkron Server Component)
export default async function AdminPage({
  searchParams,
}: {
  searchParams?: { q?: string; page?: string };
}) {
  // 1. Oturum Kontrolü: Kullanıcının giriş yapıp yapmadığını kontrol et.
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    redirect("/"); // Giriş yapmamışsa anasayfaya yönlendir.
  }

  // 1.1 Yetki Kontrolü: Kullanıcının admin listesinde olup olmadığını kontrol et.
  const admins = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
  const isAdmin =
    admins.length === 0
      ? false
      : admins.includes(session.user.email.toLowerCase());

  // Eğer admin değilse anasayfaya at.
  if (!isAdmin) {
    redirect("/");
  }

  // 2. İstatistikleri Veritabanından Çek (Paralel Sorgu ile Performans Artışı)
  const [usersCount, cvsCount, analysesCount, interviewsCount, messagesCount] =
    await Promise.all([
      prisma.user.count(), // Toplam Kullanıcı
      prisma.cV.count(), // Toplam CV
      prisma.cVAnalysis.count(), // Yapılan Analizler
      prisma.interview.count(), // Mülakat Sayısı
      prisma.interviewMessage.count(), // Toplam Mesaj
    ]);

  // Grafik Verisi Hazırlığı: Son 100 kaydı çekip istemci tarafında işlemek üzere hazırla.
  const [chartCvs, chartInterviews] = await Promise.all([
    prisma.cV.findMany({
      select: { uploadDate: true },
      orderBy: { uploadDate: "desc" },
      take: 100,
    }),
    prisma.interview.findMany({
      select: { date: true },
      orderBy: { date: "desc" },
      take: 100,
    }),
  ]);

  // Veriyi Gün Bazında Grupla: Tarih bazlı istatistik haritası oluştur.
  const activityMap = new Map<
    string,
    { date: string; cvs: number; interviews: number }
  >();

  // Son 30 günü sıfır değerleriyle doldur (Boş günler grafikde görünsün diye)
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10); // Format: YYYY-MM-DD
    activityMap.set(key, {
      date: d.toLocaleDateString("tr-TR", { day: "numeric", month: "short" }),
      cvs: 0,
      interviews: 0,
    });
  }

  // CV yüklemelerini tarihe göre eşle
  chartCvs.forEach((c) => {
    const key = new Date(c.uploadDate).toISOString().slice(0, 10);
    if (activityMap.has(key)) {
      activityMap.get(key)!.cvs += 1;
    }
  });

  // Mülakatları tarihe göre eşle
  chartInterviews.forEach((i) => {
    const key = new Date(i.date).toISOString().slice(0, 10);
    if (activityMap.has(key)) {
      activityMap.get(key)!.interviews += 1;
    }
  });

  const activityData = Array.from(activityMap.values());

  // 3. Filtreleme ve Arama Parametrelerini Hazırla
  const q = (searchParams?.q || "").trim(); // Arama sorgusu
  const pageIndex = Math.max(1, Number(searchParams?.page || 1)); // Sayfa numarası
  const pageSize = 10; // Sayfa başına kayıt
  const skip = (pageIndex - 1) * pageSize; // Atlanacak kayıt sayısı

  // Dinamik "Where" sorguları oluştur (Eğer arama varsa filtrele, yoksa boş obje)
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
          {
            cv: {
              user: { email: { contains: q, mode: "insensitive" as const } },
            },
          },
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

  // 4. Tablo Verilerini ve Toplam Sayıları Çek
  const [cvTotal, analysisTotal, interviewTotal] = await Promise.all([
    prisma.cV.count({ where: cvWhere }),
    prisma.cVAnalysis.count({ where: analysisWhere }),
    prisma.interview.count({ where: interviewWhere }),
  ]);

  // Sayfalanmış verileri getir
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
      include: {
        cv: { select: { title: true, user: { select: { email: true } } } },
      },
    }),
    prisma.interview.findMany({
      where: interviewWhere,
      orderBy: { date: "desc" },
      skip,
      take: pageSize,
      include: {
        user: { select: { email: true } },
        messages: { select: { id: true } },
      },
    }),
  ]);

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 font-sans selection:bg-indigo-500/30 pb-20">
      <div className="fixed inset-0 z-0 pointer-events-none opacity-20">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black via-transparent to-black"></div>
      </div>
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 h-[500px] w-[500px] rounded-full bg-indigo-900/10 blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 h-[500px] w-[500px] rounded-full bg-blue-900/10 blur-[120px]" />
      </div>
      <div className="relative z-10 mx-auto flex max-w-[1600px] flex-col gap-8 px-6 py-10">
        <header className="relative overflow-hidden bg-gradient-to-br from-slate-900/90 to-slate-950/90 border border-slate-800 rounded-2xl p-8 backdrop-blur-xl shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl shadow-lg shadow-indigo-500/30">
                <ShieldAlert className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-black text-white mb-1">
                  Yönetim Paneli
                </h1>
                <p className="text-sm text-slate-400 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  {session.user.email}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 px-4 py-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                    Status
                  </span>
                  <span className="text-sm text-emerald-400 font-bold">
                    ONLINE
                  </span>
                </div>
              </div>
              <div className="flex flex-col px-4 py-2.5 bg-slate-800/50 border border-slate-700 rounded-xl">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                  Version
                </span>
                <span className="text-sm text-white font-mono">v3.0.0</span>
              </div>
            </div>
          </div>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-3">
            <AdminStats
              counts={{
                users: usersCount,
                cvs: cvsCount,
                analyses: analysesCount,
                interviews: interviewsCount,
                messages: messagesCount,
              }}
            />
          </div>
        </div>
        <GlobalActivityChart data={activityData} />
        <section className="rounded-2xl border border-slate-800 bg-slate-900/40 backdrop-blur-sm p-1">
          <div className="flex flex-col lg:flex-row justify-between items-center bg-slate-950/50 rounded-xl p-4 gap-4">
            <form
              action="/admin"
              method="get"
              className="flex-1 w-full flex flex-col md:flex-row gap-3"
            >
              <div className="relative flex-1 group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                <input
                  name="q"
                  defaultValue={q}
                  placeholder="Veritabanında ara (Email, ID, Başlık)..."
                  className="w-full h-11 rounded-lg border border-slate-700 bg-slate-900 pl-11 pr-4 text-sm text-slate-200 placeholder:text-slate-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-mono"
                />
              </div>
              <input type="hidden" name="page" value="1" />
              <button
                type="submit"
                className="h-11 px-6 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-500/20"
              >
                ARA
              </button>
              {q && (
                <a
                  href="/admin"
                  className="flex items-center justify-center px-4 h-11 text-xs text-slate-400 hover:text-white border border-slate-700 rounded-lg hover:bg-slate-800 transition-colors"
                >
                  Reset
                </a>
              )}
            </form>
            <div className="w-full lg:w-auto flex items-center gap-3 border-t lg:border-t-0 lg:border-l border-slate-800 pt-4 lg:pt-0 lg:pl-4">
              <form
                action="/api/admin/export"
                method="get"
                className="flex items-center gap-2"
              >
                <select
                  name="type"
                  className="h-9 rounded-lg border border-slate-700 bg-slate-900 px-3 text-xs text-slate-300 outline-none focus:border-indigo-500"
                >
                  <option value="analyses">Analizler</option>
                  <option value="cvs">CV&apos;ler</option>
                </select>
                <button
                  type="submit"
                  className="h-9 px-3 flex items-center gap-2 rounded-lg bg-slate-800 text-xs font-medium text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700 transition-colors"
                >
                  <Download size={14} /> CSV
                </button>
              </form>
            </div>
          </div>
        </section>
        <div className="grid gap-8 grid-cols-1 lg:grid-cols-2">
          <DataCard
            title="Son Yüklenen CV'ler"
            total={cvTotal}
            page={pageIndex}
            pageSize={pageSize}
            query={q}
            accentColor="emerald"
          >
            <table className="w-full text-sm text-left">
              <thead className="text-[10px] text-slate-500 uppercase bg-slate-950/80 border-b border-slate-800 tracking-wider">
                <tr>
                  <th className="px-6 py-3 font-semibold">Başlık</th>
                  <th className="px-6 py-3 font-semibold">Kullanıcı</th>
                  <th className="px-6 py-3 font-semibold text-right">Zaman</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {recentCVs.map((cv) => (
                  <tr
                    key={cv.id}
                    className="hover:bg-emerald-500/5 transition-colors group"
                  >
                    <td className="px-6 py-3.5">
                      <div className="font-medium text-slate-200 group-hover:text-emerald-300 transition-colors flex items-center gap-2">
                        <FileText
                          size={14}
                          className="text-slate-600 group-hover:text-emerald-500"
                        />
                        {cv.title || "İsimsiz Belge"}
                      </div>
                    </td>
                    <td className="px-6 py-3.5">
                      <span className="font-mono text-xs text-slate-400 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">
                        {cv.user?.email?.split("@")[0]}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-right text-xs text-slate-500 tabular-nums font-mono">
                      {new Date(cv.uploadDate).toLocaleDateString("tr-TR")}
                    </td>
                  </tr>
                ))}
                {recentCVs.length === 0 && (
                  <tr>
                    <td
                      colSpan={3}
                      className="px-6 py-12 text-center text-slate-500 italic"
                    >
                      Veri bulunamadı.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </DataCard>
          <DataCard
            title="Son Analizler"
            total={analysisTotal}
            page={pageIndex}
            pageSize={pageSize}
            query={q}
            accentColor="purple"
          >
            <table className="w-full text-sm text-left">
              <thead className="text-[10px] text-slate-500 uppercase bg-slate-950/80 border-b border-slate-800 tracking-wider">
                <tr>
                  <th className="px-6 py-3 font-semibold">İçerik</th>
                  <th className="px-6 py-3 font-semibold">User</th>
                  <th className="px-6 py-3 font-semibold text-right">Zaman</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {recentAnalyses.map((a) => (
                  <tr
                    key={a.id}
                    className="hover:bg-purple-500/5 transition-colors group"
                  >
                    <td className="px-6 py-3.5">
                      <div className="font-medium text-slate-200 group-hover:text-purple-300 transition-colors">
                        {a.cv?.title || "Bilinmiyor"}
                      </div>
                      <div className="flex gap-1 mt-1">
                        {Array.isArray(a.keywords) &&
                          a.keywords.slice(0, 2).map((k: string, i: number) => (
                            <span
                              key={i}
                              className="text-[9px] uppercase px-1 rounded bg-slate-900 text-slate-500 border border-slate-800"
                            >
                              {k}
                            </span>
                          ))}
                      </div>
                    </td>
                    <td className="px-6 py-3.5">
                      <span className="font-mono text-xs text-slate-400 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">
                        {a.cv?.user?.email?.split("@")[0]}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-right text-xs text-slate-500 tabular-nums font-mono">
                      {new Date(a.createdAt).toLocaleDateString("tr-TR")}
                    </td>
                  </tr>
                ))}
                {recentAnalyses.length === 0 && (
                  <tr>
                    <td
                      colSpan={3}
                      className="px-6 py-12 text-center text-slate-500 italic"
                    >
                      Veri bulunamadı.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </DataCard>
        </div>
        <section>
          <DataCard
            title="Mülakat Oturumları"
            total={interviewTotal}
            page={pageIndex}
            pageSize={pageSize}
            query={q}
            accentColor="amber"
          >
            <table className="w-full text-sm text-left">
              <thead className="text-[10px] text-slate-500 uppercase bg-slate-950/80 border-b border-slate-800 tracking-wider">
                <tr>
                  <th className="px-6 py-3 font-semibold">Pozisyon</th>
                  <th className="px-6 py-3 font-semibold">Kullanıcı</th>
                  <th className="px-6 py-3 font-semibold text-center">
                    Etkileşim
                  </th>
                  <th className="px-6 py-3 font-semibold text-center">Durum</th>
                  <th className="px-6 py-3 font-semibold text-right">Tarih</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {recentInterviews.map((i) => (
                  <tr
                    key={i.id}
                    className="hover:bg-amber-500/5 transition-colors group"
                  >
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded bg-slate-900 border border-slate-800 flex items-center justify-center text-amber-500 font-bold text-xs uppercase">
                          {i.position.substring(0, 2)}
                        </div>
                        <span className="font-medium text-slate-200 group-hover:text-amber-300 transition-colors">
                          {i.position}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-slate-700" />
                        <span className="text-sm text-slate-400">
                          {i.user?.email}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-3.5 text-center">
                      <span className="font-mono text-xs font-bold text-slate-300">
                        {i.messages?.length ?? 0} msgs
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-center">
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-400 border border-emerald-500/20">
                        COMPLETED
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-right text-xs text-slate-500 tabular-nums font-mono">
                      {new Date(i.date).toLocaleString("tr-TR")}
                    </td>
                  </tr>
                ))}
                {recentInterviews.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-12 text-center text-slate-500 italic"
                    >
                      Veri bulunamadı.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </DataCard>
        </section>
      </div>
    </div>
  );
}
