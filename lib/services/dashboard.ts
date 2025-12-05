import { prisma } from "@/app/lib/prisma";
import { DashboardData } from "@/types";

export async function getDashboardData(userId: string): Promise<DashboardData> {
  const [analyses, interviews, analysisCount, interviewCount] = await Promise.all([
    prisma.cVAnalysis.findMany({
      where: {
        cv: {
          userId: userId,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 5,
      select: {
        id: true,
        title: true,
        keywords: true,
        createdAt: true,
        cvId: true,
      },
    }),
    prisma.interview.findMany({
      where: {
        userId: userId,
      },
      orderBy: {
        date: "desc", // Corrected from createdAt to date
      },
      take: 5,
      select: {
        id: true,
        position: true,
        date: true,
        _count: {
          select: { messages: true },
        },
      },
    }),
    prisma.cVAnalysis.count({ where: { cv: { userId } } }),
    prisma.interview.count({ where: { userId } }),
  ]);

  const recentAnalyses = analyses.map((a) => ({
    id: a.id,
    title: a.title,
    keywords: a.keywords,
    createdAt: a.createdAt, // Keeping it as Date object or string? Interface says Date | string.
    cvId: a.cvId,
  }));

  const recentInterviews = interviews.map((i) => ({
    id: i.id,
    position: i.position,
    date: i.date.toISOString(),
    count: i._count.messages,
  }));

  return {
    stats: {
      totalAnalyses: analysisCount,
      totalInterviews: interviewCount,
    },
    recentAnalyses,
    recentInterviews,
  };
}
