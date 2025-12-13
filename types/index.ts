export interface DashboardStats {
  totalAnalyses: number;
  totalInterviews: number;
  activityScore: number;
}

export interface AnalysisResult {
  summary: string;
  keywords: string[];
  suggestion: string;
  score?: number;
  details?: {
    impact: number;
    brevity: number;
    ats: number;
    style: number;
  };
}

export interface RecentAnalysis {
  id: string;
  title: string | null;
  keywords: string[];
  createdAt: Date | string;
  cvId: string;
}

export interface DashboardInterview {
  id: string;
  position: string;
  date: string;
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
    date: string;
    _count?: { messages?: number };
  }>;
}
