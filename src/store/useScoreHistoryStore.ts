import type { ScoreHistory, ScoreHistoryStore } from '@/types/history';
import { create } from 'zustand';

export const useScoreHistoryStore = create<ScoreHistoryStore>((set) => ({
  scoreHistory:[],
  setScoreHistory: (scoreHistory: ScoreHistory[]) => {
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
