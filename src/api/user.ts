import { env } from '@/config/env';
import { handleAuthResponse } from '@/api/auth';
import type { CollectionAccessResponse, CollectionEntitlement } from '@/types/collection';
import { type ApiResponse, readApiResponse } from '@/api/response';

type EntitlementsResponse = ApiResponse<{ entitlements: CollectionEntitlement[] }>
type EntitlementResponse = ApiResponse<{ entitlement: CollectionEntitlement }>

export const getUserAccessStatus = async (collection_id: string): Promise<CollectionAccessResponse> => {
  const response = await fetch(`${env.API_URL}/collection/${collection_id}/access`, {
    credentials: 'include',
  })
  handleAuthResponse(response)
  return readApiResponse<CollectionAccessResponse>(response, 'Failed to check collection access')
}

export const getUserEntitlements = async (): Promise<CollectionEntitlement[]> => {
  const response = await fetch(`${env.API_URL}/user/entitlement/list`, {
    credentials: 'include',
  })
  handleAuthResponse(response)
  const data = await readApiResponse<EntitlementsResponse>(response, 'Failed to load entitlements')
  return data.entitlements
}

export const getCollectionEntitlement = async (collection_id: string): Promise<CollectionEntitlement | null> => {
  const response = await fetch(`${env.API_URL}/collection/${collection_id}/entitlement`, {
    credentials: 'include',
  })
  handleAuthResponse(response)
  if (response.status === 404) return null
  const data = await readApiResponse<EntitlementResponse>(response, 'Failed to load collection entitlement')
  return data.entitlement
}
