import { env } from '@/config/env';
import { authenticatedFetch } from '@/api/auth';
import { type ApiResponse, readApiResponse } from '@/api/response';
import type { ScoreHistory } from '@/types/history';

type HistoryResponse = ApiResponse<{ history: ScoreHistory[] }>

export const getScoreHistory = async (collection_id: string): Promise<ScoreHistory[] | null> => {
  try {
    const response = await authenticatedFetch(`${env.API_URL}/user/history?collection_id=${collection_id}`)
    const data = await readApiResponse<HistoryResponse>(response, 'Failed to load score history')
    return data.history
  } catch (err) {
    console.error('No Data:', err)
    return null
  }
}
