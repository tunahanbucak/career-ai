export interface DashboardStats {
  totalAnalyses: number;
  totalInterviews: number;
}

export interface AnalysisResult {
  summary: string;
  keywords: string[];
  suggestion: string;
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

export interface DashboardData {
  stats: DashboardStats;
  recentAnalyses: RecentAnalysis[];
  recentInterviews: DashboardInterview[];
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
