export interface AdminUserEmail {
  email: string | null;
}

export interface AdminCV {
  id: string;
  title: string;
  uploadDate: Date;
  user: AdminUserEmail;
  rawText: string | null;
}

export interface AdminCVAnalysis {
  id: string;
  title: string | null;
  createdAt: Date;
  keywords: string[];
  summary: string;
  suggestion: string;
  score: number;
  impact: number;
  brevity: number;
  ats: number;
  style: number;
  cv: {
    title: string;
    user: AdminUserEmail;
  };
}

export interface AdminInterview {
  id: string;
  position: string;
  date: Date;
  user: AdminUserEmail;
  messages: {
    id: string;
    content: string;
    role: "ASSISTANT" | "USER";
    createdAt: Date;
  }[];
}

export interface AdminStatsData {
  users: number;
  cvs: number;
  analyses: number;
  interviews: number;
  messages: number;
}
