export interface Question {
  id: number
  questionText: string
  options: string[]
  correctAnswer: number
}

export interface QuestionCollection {
  collectionID: string
  org_id?: string | null
  display_name?: string | null
  title: string
  description: string
  search_tags: string[]
  access_type: CollectionAccessType
  access_tag?: string | null
  can_access: boolean
}

export type CollectionAccessType = 'public' | 'premium' | 'public_org' | 'grant_org'

export interface CollectionListItemDto {
  collectionid: string
  org_id?: string | null
  display_name?: string | null
  description: string
  title: string
  search_tags: string[]
  access_type: CollectionAccessType
  access_tag?: string | null
  can_access: boolean
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
  SearchTags?: string[]
  search_tags?: string[]
  Question?: QuestionDto[]
  question?: QuestionDto[]
}

export interface CollectionAccessResponse {
  collection_id: string
  can_access: boolean
  access_tag: string
  attempts_used: number
  max_attempts: number | null
  remaining_attempts: number | null
  message?: string
}

export interface CollectionEntitlement {
  entitlement_id: string
  collection_id: string
  source: string
  purchased_at: string
  expires_at?: string | null
  status: 'active' | 'revoked' | 'expired'
}

export interface CollectionState {
  collectionID: string
  questionList: Question[]
  setCollectionID: (collectionID: string) => void
  setQuestionList: (questionList: Question[]) => void
  reset: () => void
}
