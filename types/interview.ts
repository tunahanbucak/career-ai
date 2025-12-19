export interface InterviewItem {
  id: string;
  position: string;
  date: string | Date;
  _count: {
    messages: number;
  };
}

export interface InterviewStats {
  totalInterviews: number;
  totalMessages: number;
  avgMessages: number;
  byDate: {
    date: string;
    count: number;
  }[];
  byInterviewMessages: {
    label: string;
    messages: number;
  }[];
  byPosition: {
    name: string;
    value: number;
  }[];
}
