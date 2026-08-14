export type UserRole = 'end_user' | 'question_maker' | 'admin';

export interface User {
  user_id: string;
  username: string;
  email: string;
  display_name?: string | null;
  real_name?: string | null;
  phone_country_code?: string | null;
  phone_number?: string | null;
  ktp_address?: string | null;
  domicile_address?: string | null;
  domicile_same_as_ktp?: boolean | null;
  date_of_birth?: string | null;
  place_of_birth?: string | null;
  gender?: string | null;
  profession?: string | null;
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
