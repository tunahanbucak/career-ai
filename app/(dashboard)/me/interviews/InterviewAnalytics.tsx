"use client";

import { useMemo } from "react";
import { InterviewItem, InterviewStats } from "@/types";

import StatCard from "./components/StatCard";
import ActivityChart from "./components/ActivityChart";
import PositionPieChart from "./components/PositionPieChart";
import MessageBarChart from "./components/MessageBarChart";

interface Props {
  interviews: InterviewItem[];
}

export default function InterviewAnalytics({ interviews }: Props) {
  const stats: InterviewStats = useMemo(() => {
    if (!interviews || interviews.length === 0) {
      return {
        totalInterviews: 0,
        totalMessages: 0,
        avgMessages: 0,
        byDate: [],
        byInterviewMessages: [],
        byPosition: [],
      };
    }

    let totalMessages = 0;
    const byDateMap = new Map<string, number>();
    const byPositionMap = new Map<string, number>();
    const byInterviewMessagesRaw: {
      id: string;
      label: string;
      messages: number;
      date: string;
    }[] = [];

    for (const it of interviews) {
      const messages = it._count?.messages ?? 0;
      totalMessages += messages;

      const d = new Date(it.date);
      const key = !Number.isNaN(d.getTime())
        ? d.toISOString().slice(0, 10)
        : "unknown";
      byDateMap.set(key, (byDateMap.get(key) ?? 0) + 1);

      const pos = it.position || "Diğer";
      byPositionMap.set(pos, (byPositionMap.get(pos) ?? 0) + 1);

      byInterviewMessagesRaw.push({
        id: it.id,
        label: it.position || "Mülakat",
        messages,
        date: key,
      });
    }

    const totalInterviews = interviews.length;
    const avgMessages =
      totalInterviews > 0
        ? Math.round((totalMessages / totalInterviews) * 10) / 10
        : 0;

    const byDate = Array.from(byDateMap.entries())
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => (a.date > b.date ? 1 : -1));

    const byInterviewMessages = byInterviewMessagesRaw
      .sort((a, b) => (a.date > b.date ? 1 : -1))
      .slice(-10)
      .map((it, index) => ({
        label: `${index + 1}.`,
        messages: it.messages,
      }));

    const byPosition = Array.from(byPositionMap.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);

    return {
      totalInterviews,
      totalMessages,
      avgMessages,
      byDate,
      byInterviewMessages,
      byPosition,
    };
  }, [interviews]);

  if (stats.totalInterviews === 0) return null;

  return (
    <section className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          label="Toplam Mülakat"
          value={stats.totalInterviews.toString()}
          description="AI ile gerçekleştirdiğin tüm simülasyonlar."
          accent="from-indigo-500/40 via-indigo-500/10 to-transparent"
        />
        <StatCard
          label="Toplam Mesaj"
          value={stats.totalMessages.toString()}
          description="Sorduğun ve cevapladığın tüm mesajlar."
          accent="from-emerald-500/40 via-emerald-500/10 to-transparent"
        />
        <StatCard
          label="Ortalama Mesaj / Mülakat"
          value={stats.avgMessages.toString()}
          description="Bir mülakattaki ortalama derinliğin."
          accent="from-fuchsia-500/40 via-fuchsia-500/10 to-transparent"
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <ActivityChart data={stats.byDate} />
        <PositionPieChart data={stats.byPosition} />
      </div>
      <MessageBarChart data={stats.byInterviewMessages} />
    </section>
  );
}
