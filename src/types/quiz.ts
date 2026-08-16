export type QuestionAnswerMap = Record<number, number>

export interface QuestionState {
  collectionID: string
  score: number
  answers: QuestionAnswerMap
  setCollectionID: (collectionID: string) => void
  selectAnswer: (questionId: number, answerIndex: number) => void
  reset: () => void
}

export interface StartQuizRequest {
  collection_id: string
  user_id: string
}

export interface StartQuizResponse {
  message: string
  attempt_id: string
  attempt_number: number
  started_at: string
}

export interface SubmitQuizAnswerRequest {
  attempt_id: string
  user_id: string
  question_index: number
  selected_option: number
}

export interface EndQuizAnswer {
  question_index: number
  selected_option: number
}

export interface EndQuizRequest {
  attempt_id: string
  user_id: string
  answers: EndQuizAnswer[]
}
