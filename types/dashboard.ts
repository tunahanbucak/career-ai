import { RecentAnalysis } from "./analysis";

export interface DashboardStats {
  totalAnalyses: number;
  totalInterviews: number;
  activityScore: number;
}

export interface DashboardInterview {
  id: string;
  position: string;
  date: Date | string;
  count: number;
}

export interface ActivityData {
  date: string;
  cv: number;
  interview: number;
}

export interface SkillData {
  subject: string;
  A: number;
  fullMark: number;
}

export interface DashboardData {
  stats: DashboardStats;
  recentAnalyses: RecentAnalysis[];
  recentInterviews: DashboardInterview[];
  activityData: ActivityData[];
  skillsData: SkillData[];
}

export interface HistoryResponse {
  analyses: Array<RecentAnalysis>;
  interviews: Array<{
    id: string;
    position: string;
    date: Date | string;
    _count?: { messages?: number };
  }>;
}
