export interface Question {
  id: number;
  questionText: string;
  options: string[];
  correctAnswer: number;
}

export interface QuestionCollection {
  collectionID: string;
  title: string;
  tags: string[];
}