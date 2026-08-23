import { env } from '@/config/env';
import { handleAuthResponse } from '@/api/auth';
import type { CollectionDetailDto, CollectionListItemDto } from '@/types/collection';
import type { EndQuizRequest, StartQuizResponse, SubmitQuizAnswerRequest } from '@/types/quiz';
import { type ApiResponse, readApiResponse } from '@/api/response';

type CollectionListResponse = ApiResponse<{ data: CollectionListItemDto[] }>
type CollectionDetailResponse = ApiResponse<{ data: CollectionDetailDto }>

export const getCollectionList = async (): Promise<CollectionListItemDto[] | null> => {
  try {
    const response = await fetch(env.API_URL + '/collection/list', { credentials: 'include' })
    handleAuthResponse(response)
    const data = await readApiResponse<CollectionListResponse>(response, 'Failed to fetch collections')
    return data.data
  } catch (err) {
    console.error('Fetch error:', err)
    return null
  }
}

export const getCollectionByCollectionID = async (collection_id: string): Promise<CollectionDetailDto | null> => {
  try {
    const response = await fetch(`${env.API_URL}/collection/${collection_id}`, { credentials: 'include' })
    handleAuthResponse(response)
    const data = await readApiResponse<CollectionDetailResponse>(response, 'Failed to fetch collection details')
    return data.data
  } catch (err) {
    console.error('Fetch error:', err)
    return null
  }
}

export const startQuiz = async (collection_id: string, user_id: string) => {
  const response = await fetch(`${env.API_URL}/quiz/start`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({
      collection_id: collection_id,
      user_id: user_id,
    }),
  })

  handleAuthResponse(response)
  const data = await readApiResponse<StartQuizResponse>(response, 'Failed to start quiz')
  return (data as StartQuizResponse).attempt_id
}

export const submitQuizAnswer = async (payload: SubmitQuizAnswerRequest) => {
  const response = await fetch(`${env.API_URL}/quiz/answer`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(payload),
  })

  handleAuthResponse(response)
  return readApiResponse<ApiResponse>(response, 'Failed to submit quiz answer')
}

export const endQuiz = async (payload: EndQuizRequest) => {
  const response = await fetch(`${env.API_URL}/quiz/end`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(payload),
  })

  handleAuthResponse(response)
  return readApiResponse<ApiResponse>(response, 'Failed to end quiz')
}
