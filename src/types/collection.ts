export interface Question {
  id: number
  questionText: string
  options: string[]
  correctAnswer: number
}

export interface QuestionCollection {
  collectionID: string
  title: string
  description: string
  tags: string[]
}

export interface CollectionListItemDto {
  collectionid: string
  description: string
  title: string
  tags: string[]
}

export interface QuestionDto {
  ID?: number
  id?: number
  QuestionText?: string
  questionText?: string
  Options?: string[]
  options?: string[]
  CorrectAnswer?: number
  correctAnswer?: number
}

export interface CollectionDetailDto {
  Title?: string
  title?: string
  Description?: string
  description?: string
  Tags?: string[]
  tags?: string[]
  Question?: QuestionDto[]
  question?: QuestionDto[]
}

export interface CollectionState {
  collectionID: string
  questionList: Question[]
  setCollectionID: (collectionID: string) => void
  setQuestionList: (questionList: Question[]) => void
  reset: () => void
}
