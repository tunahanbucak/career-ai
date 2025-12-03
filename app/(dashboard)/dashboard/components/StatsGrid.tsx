import { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";

type StatCardProps = {
  title: string;
  value: string | number;
  icon: ReactNode;
  suffix?: string;
};

function StatCard({ title, value, icon, suffix }: StatCardProps) {
  return (
    <Card className="border-slate-800 bg-slate-900/60 backdrop-blur-sm">
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
            {title}
          </span>
          <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 shadow-sm">
            {icon}
          </div>
        </div>
        <div className="flex items-end gap-1">
          <h3 className="text-2xl font-bold text-white">{value}</h3>
          {suffix && (
            <span className="text-sm text-slate-500 mb-1">{suffix}</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

type Props = {
  totalAnalyses: number;
  totalInterviews: number;
};

export default function StatsGrid({ totalAnalyses, totalInterviews }: Props) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
      <StatCard
        title="Toplam CV Analizi"
        value={totalAnalyses}
        icon={<span className="text-blue-400 text-lg">CV</span>}
      />
      <StatCard
        title="Mülakat Pratiği"
        value={totalInterviews}
        icon={<span className="text-emerald-400 text-lg">QA</span>}
      />
      <StatCard
        title="Başarı Puanı"
        value="85"
        suffix="/100"
        icon={<span className="text-amber-400 text-lg">★</span>}
      />
      <StatCard
        title="Üyelik Tipi"
        value="PRO"
        icon={<span className="text-purple-400 text-lg">PRO</span>}
      />
    </div>
  );
}
