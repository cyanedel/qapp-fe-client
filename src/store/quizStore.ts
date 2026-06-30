import { create } from 'zustand';

interface QuizState {
  score: number;
  answers: Record<number, number>;
  selectAnswer: (questionId: number, answerIndex: number) => void;
}

export const useQuizStore = create<QuizState>((set) => ({
  score: 0,
  answers: {},
    
  selectAnswer: (questionId, answerIndex) => 
    set((state) => ({
      answers: { ...state.answers, [questionId]: answerIndex }
    })),
}));