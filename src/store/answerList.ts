import { create } from 'zustand';

interface StateAnswerList {
  collectionID: string
  score: number;
  answers: Record<number, number>;
  setCollectionID: (setID: string) => void,
  selectAnswer: (questionId: number, answerIndex: number) => void;
  resetState: () => void;
}

export const useAnswerListStore = create<StateAnswerList>((set) => ({
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

  resetState: () => {
    set(()=>({
      collectionID : "",
      score: 0,
      answers: {}
    }))
  }
}));