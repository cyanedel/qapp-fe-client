import type { CollectionState, Question } from '@/types/collection';
import { create } from 'zustand';

export const useCollectionStore = create<CollectionState>((set) => ({
  collectionID: "",
  questionList: [],

  setCollectionID: (collectionID: string) => {
    set(()=> ({
      collectionID: collectionID
    }))
  },

  setQuestionList(questionList: Question[]) {
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
