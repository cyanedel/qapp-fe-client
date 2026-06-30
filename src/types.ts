export interface Question {
  id: number;
  questionText: string;
  options: string[];
  correctAnswer: number;
}

export interface QuestionSet {
  setID: string;
  title: string;
  tags: string[];
}