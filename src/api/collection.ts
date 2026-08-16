import { env } from '@/config/env';
import { handleAuthResponse } from '@/api/auth';
import type { CollectionDetailDto, CollectionListItemDto } from '@/types/collection';
import type { EndQuizRequest, StartQuizResponse, SubmitQuizAnswerRequest } from '@/types/quiz';

export const getCollectionList = (): Promise<CollectionListItemDto[] | null> => {
  return fetch(env.API_URL + '/collection/list')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    }).then((data)=>{
      return data["data"]
    })
    .catch(err => {
      console.error('Fetch error:', err);
      return null;
    })
}

export const getCollectionByCollectionID = (collection_id: string): Promise<CollectionDetailDto | null> => {
  return fetch(`${env.API_URL}/collection/${collection_id}`)
    .then((res) => {
      if (!res.ok) throw new Error('Failed to fetch collection details')
      return res.json()
    })
    .then((data) => {
      return data['data'];
    })
    .catch((err) => {
      console.error('Fetch error:', err);
      return null;
    })
}

export const startQuiz = (collection_id: string, user_id: string) => {
  return fetch(`${env.API_URL}/quiz/start`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({
      collection_id: collection_id,
      user_id: user_id,
    }),
  }).then(
    res => {
      handleAuthResponse(res)
      return res.json()
    }
  ).then((data: StartQuizResponse)=>{
    return data.attempt_id
  }).catch((err) => {
    console.error('Fetch error:', err);
    return null;
  })
}

export const submitQuizAnswer = async (payload: SubmitQuizAnswerRequest) => {
  const response = await fetch(`${env.API_URL}/quiz/answer`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(payload),
  })

  handleAuthResponse(response)
  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || 'Failed to submit quiz answer')
  }

  return data
}

export const endQuiz = async (payload: EndQuizRequest) => {
  const response = await fetch(`${env.API_URL}/quiz/end`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(payload),
  })

  handleAuthResponse(response)
  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || 'Failed to end quiz')
  }

  return data
}
