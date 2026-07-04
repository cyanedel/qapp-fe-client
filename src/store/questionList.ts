import type { Question } from '@/types';
import { create } from 'zustand';

interface StateQuestionList {
  collectionID: string
  questionList: Array<Question>
  setCollectionID: (collectionID: string) => void,
  setQuestionList: (questionList: Array<Question>) => void,
  reset: () => void;
}

export const useQuestionListStore = create<StateQuestionList>((set) => ({
  collectionID: "",
  questionList: [],

  setCollectionID: (collectionID: string) => {
    set(()=> ({
      collectionID: collectionID
    }))
  },

  setQuestionList(questionList: Array<Question>) {
    set(()=>({
      questionList: questionList
    }))
  },

  reset: () => {
    set(()=>({
      collectionID : "",
      questionList: []
    }))
  }
}));