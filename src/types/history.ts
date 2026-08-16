export interface ScoreHistory {
  attempt_id: string
  collection_id: string
  collection_title: string
  completed_at: string
  percentage: number
  score: number
  total_questions: number
}

export interface ScoreHistoryStore {
  scoreHistory: ScoreHistory[]
  setScoreHistory: (scoreHistory: ScoreHistory[]) => void
  reset: () => void
}
