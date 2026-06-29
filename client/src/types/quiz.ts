export interface AnswerOption {
  id: string;
  content: string;
  isCorrect: boolean;
}

export interface Question {
  id: string;
  content: string;
  type: 'multiple_choice'; // MVP supports single-correct multiple choice questions
  options: AnswerOption[];
  timeLimit: number; // time limit in seconds (e.g. 10, 20, 30)
  points: number; // max points for this question (e.g. 1000)
}

export interface Quiz {
  id: string;
  title: string;
  description?: string;
  creatorId: string; // references User.uid
  questions: Question[];
  createdAt: string; // ISO Date string
  updatedAt: string; // ISO Date string
  isPublished: boolean;
}
