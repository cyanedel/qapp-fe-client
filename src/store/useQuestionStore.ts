import type { QuestionState } from '@/types/quiz';
import { create } from 'zustand';

export const useQuestionStore = create<QuestionState>((set) => ({
  collectionID: "",
  score: 0,
  answers: {},

  setCollectionID: (collectionID: string) => {
    set(()=> ({
      collectionID: collectionID
    }))
  },

  selectAnswer: (questionId, answerIndex) => {
    set((state) => ({
      answers: { ...state.answers, [questionId]: answerIndex }
    }))
  },

  reset: () => {
    set(()=>({
      collectionID : "",
      score: 0,
      answers: {}
    }))
  }
}));
