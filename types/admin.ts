export interface AdminUserEmail {
  email: string | null;
}

export interface AdminCV {
  id: string;
  title: string;
  uploadDate: Date;
  user: AdminUserEmail;
}

export interface AdminCVAnalysis {
  id: string;
  title: string | null;
  createdAt: Date;
  keywords: string[];
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
  }[];
}

export interface AdminStatsData {
  users: number;
  cvs: number;
  analyses: number;
  interviews: number;
  messages: number;
}
