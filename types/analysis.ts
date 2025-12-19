export type Step = "idle" | "uploading" | "analyzing" | "done";

export interface AnalysisApiItem {
  id: string;
  title: string | null;
  keywords: string[];
  createdAt: Date | string;
  cvId: string;
}

export interface HistoryApiResponse {
  analyses: AnalysisApiItem[];
}

export type RecentAnalysis = AnalysisApiItem;

export interface AnalysisDetails {
  impact: number;
  brevity: number;
  ats: number;
  style: number;
}

export interface AnalysisData {
  summary: string;
  keywords: string[];
  suggestion: string;
  score?: number;
  details?: AnalysisDetails;
}

export interface AnalysisResult {
  success: boolean;
  title?: string;
  analysis?: AnalysisData;
  error?: string;
}
