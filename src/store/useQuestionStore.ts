import { create } from 'zustand';

interface QuestionState {
  collectionID: string
  score: number;
  answers: Record<number, number>;
  setCollectionID: (setID: string) => void,
  selectAnswer: (questionId: number, answerIndex: number) => void;
  reset: () => void;
}

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