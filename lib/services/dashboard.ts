import { prisma } from "@/app/lib/prisma";
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
export async function getDashboardData(userId: string): Promise<DashboardData> {
  // Promise.all kullanarak sorguları eşzamanlı başlatırız, böylece biri bitmeden diğeri beklenmez.
  const [analyses, interviews, analysisCount, interviewCount] = await Promise.all([
    
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

  // Sonuçları tek bir obje olarak döndür
  return {
    stats: {
      totalAnalyses: analysisCount,
      totalInterviews: interviewCount,
    },
    recentAnalyses,
    recentInterviews,
  };
}
