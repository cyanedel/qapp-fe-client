import type { Question } from '@/types';
import { create } from 'zustand';

interface CollectionState {
  collectionID: string
  questionList: Array<Question>
  setCollectionID: (collectionID: string) => void,
  setQuestionList: (questionList: Array<Question>) => void,
  reset: () => void;
}

export const useCollectionStore = create<CollectionState>((set) => ({
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