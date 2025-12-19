import { prisma } from "@/lib/prisma";
import { DashboardData } from "@/types";

/**
 * Dashboard için gerekli verileri veritabanından çeker.
 *
 * Bu fonksiyon, dashboard sayfasının yüklenme performansını artırmak için
 * tüm veritabanı sorgularını paralel olarak (Promise.all) çalıştırır.
 *
 * Çekilen Veriler:
 * 1. Son 5 CV analizi
 * 2. Son 5 Mülakat kaydı
 * 3. Toplam analiz sayısı
 * 4. Toplam mülakat sayısı
 *
 * @param userId - İlgili kullanıcının veritabanı ID'si
 * @returns DashboardData - İstatistikler ve liste verilerini içeren obje
 */
// ... imports
import { subDays, format, startOfDay } from "date-fns";
import { tr } from "date-fns/locale";

/**
 * Dashboard için gerekli verileri veritabanından çeker.
 *
 * Bu fonksiyon, dashboard sayfasının yüklenme performansını artırmak için
 * tüm veritabanı sorgularını paralel olarak (Promise.all) çalıştırır.
 *
 * Çekilen Veriler:
 * 1. Son 5 CV analizi
 * 2. Son 5 Mülakat kaydı
 * 3. Toplam analiz sayısı
 * 4. Toplam mülakat sayısı
 * 5. Aktivite verileri (Son 7 gün)
 * 6. Yetkinlik analizi verileri (Son analizlerden çıkarılan)
 *
 * @param userId - İlgili kullanıcının veritabanı ID'si
 * @returns DashboardData - İstatistikler ve liste verilerini içeren obje
 */
export async function getDashboardData(userId: string): Promise<DashboardData> {
  const today = new Date();
  const sevenDaysAgo = subDays(today, 6); // Son 7 günü kapsayacak şekilde

  // Promise.all kullanarak sorguları eşzamanlı başlatırız
  const [
    analyses,
    interviews,
    analysisCount,
    interviewCount,
    weekAnalyses,
    weekInterviews,
    keywordAnalyses,
  ] = await Promise.all([
    // 1. Son Eklenen CV Analizlerini Getir
    prisma.cVAnalysis.findMany({
      where: {
        cv: {
          userId: userId, // Sadece bu kullanıcıya ait CV'ler
        },
      },
      orderBy: {
        createdAt: "desc", // En yeniden eskiye sırala
      },
      take: 5, // Sadece son 5 kaydı al
      select: {
        id: true,
        title: true,
        keywords: true,
        createdAt: true,
        cvId: true,
      },
    }),

    // 2. Son Mülakatları Getir
    prisma.interview.findMany({
      where: {
        userId: userId, // Sadece bu kullanıcıya ait mülakatlar
      },
      orderBy: {
        date: "desc", // Mülakat tarihine göre sırala
      },
      take: 5, // Sadece son 5 kaydı al
      select: {
        id: true,
        position: true,
        date: true,
        _count: {
          select: { messages: true }, // Mülakattaki toplam mesaj sayısını say
        },
      },
    }),

    // 3. İstatistikler: Toplam Analiz Sayısı
    prisma.cVAnalysis.count({ where: { cv: { userId } } }),

    // 4. İstatistikler: Toplam Mülakat Sayısı
    prisma.interview.count({ where: { userId } }),

    // 5. Aktivite Grafiği için Son 7 Günün Analizleri
    prisma.cVAnalysis.findMany({
      where: {
        cv: { userId },
        createdAt: {
          gte: startOfDay(sevenDaysAgo),
        },
      },
      select: { createdAt: true },
    }),

    // 6. Aktivite Grafiği için Son 7 Günün Mülakatları
    prisma.interview.findMany({
      where: {
        userId,
        date: {
          gte: startOfDay(sevenDaysAgo),
        },
      },
      select: { date: true },
    }),

    // 7. Yetkinlik Analizi için son 10 analizin keywordleri
    prisma.cVAnalysis.findMany({
      where: { cv: { userId } },
      orderBy: { createdAt: "desc" },
      take: 10,
      select: { keywords: true },
    }),
  ]);

  // Backend verisi ile Frontend'in beklediği formatı eşleştiriyoruz (Mapping)
  const recentAnalyses = analyses.map((a) => ({
    id: a.id,
    title: a.title,
    keywords: a.keywords,
    createdAt: a.createdAt,
    cvId: a.cvId,
  }));

  const recentInterviews = interviews.map((i) => ({
    id: i.id,
    position: i.position,
    date: i.date.toISOString(), // Tarihi string formatına çevir
    count: i._count.messages,
  }));

  // Aktivite Verisini İşle
  const activityMap = new Map<string, { cv: number; interview: number }>();

  // Son 7 günü 0 olarak başlat
  for (let i = 0; i < 7; i++) {
    const dateStr = format(subDays(today, i), "dd MMM", { locale: tr });
    activityMap.set(dateStr, { cv: 0, interview: 0 });
  }

  // Analizleri ekle
  weekAnalyses.forEach((a) => {
    const dateStr = format(a.createdAt, "dd MMM", { locale: tr });
    if (activityMap.has(dateStr)) {
      const current = activityMap.get(dateStr)!;
      current.cv += 1;
    }
  });

  // Mülakatları ekle
  weekInterviews.forEach((i) => {
    const dateStr = format(i.date, "dd MMM", { locale: tr });
    if (activityMap.has(dateStr)) {
      const current = activityMap.get(dateStr)!;
      current.interview += 1;
    }
  });

  // Map'i arraye çevirip tarihe göre sırala (eskiden yeniye)
  const activityData = Array.from(activityMap.entries())
    .map(([date, counts]) => ({
      date,
      cv: counts.cv,
      interview: counts.interview,
    }))
    .reverse();

  // Yetkinlik Verisini İşle
  const skillCounts: Record<string, number> = {};
  keywordAnalyses.forEach((analysis) => {
    analysis.keywords.forEach((keyword) => {
      // Keyword temizleme ve normalizasyon yapılabilir
      const k = keyword.trim();
      skillCounts[k] = (skillCounts[k] || 0) + 1;
    });
  });

  // En çok geçen 6 yetkinliği al ve RadarChart formatına çevir
  const skillsData = Object.entries(skillCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 6)
    .map(([subject, count]) => ({
      subject: subject.length > 10 ? subject.substring(0, 10) + "..." : subject, // Çok uzun isimleri kısalt
      A: Math.min(count * 20, 100), // Basit bir skorlama mantığı: her tekrar 20 puan, max 100
      fullMark: 100,
    }));

  // Eğer hiç yetkinlik yoksa boş placeholder dönmeyelim, boş array dönsün UI halleder

  // Basit bir aktivite skoru hesapla
  const activityScore = Math.min(analysisCount * 10 + interviewCount * 15, 100);

  return {
    stats: {
      totalAnalyses: analysisCount,
      totalInterviews: interviewCount,
      activityScore,
    },
    recentAnalyses,
    recentInterviews,
    activityData,
    skillsData,
  };
}
