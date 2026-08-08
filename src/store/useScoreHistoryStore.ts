import type { ScoreHistory } from '@/types';
import { create } from 'zustand';

interface ScoreHistoryStore {
  scoreHistory: Array<ScoreHistory>,
  setScoreHistory: (setScoreHistory: Array<ScoreHistory>) => void,
  reset: () => void;
}

export const useScoreHistoryStore = create<ScoreHistoryStore>((set) => ({
  scoreHistory:[],
  setScoreHistory: (scoreHistory: Array<ScoreHistory>) => {
    set(()=> ({
      scoreHistory: scoreHistory
    }))
  },

  reset: () => {
    set(()=>({
      scoreHistory : []
    }))
  }
}));