export type UserRole = 'end_user' | 'question_maker' | 'admin';

export interface User {
  user_id: string;
  username: string;
  email: string;
  display_name?: string | null;
  avatar_url?: string | null;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface Question {
  id: number;
  questionText: string;
  options: string[];
  correctAnswer: number;
}

export interface QuestionCollection {
  collectionID: string;
  title: string;
  description: string;
  tags: string[];
}

export interface ScoreHistory {
  attempt_id: string,
  collection_id: string,
  collection_title: string,
  completed_at: string,
  percentage: number,
  score: number
  total_questions: number
}