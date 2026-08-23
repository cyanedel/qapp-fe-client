import { env } from '@/config/env';
import { handleAuthResponse } from '@/api/auth';
import type { CollectionAccessResponse, CollectionEntitlement } from '@/types/collection';

export const getUserAccessStatus = async (collection_id: string): Promise<CollectionAccessResponse> => {
  const response = await fetch(`${env.API_URL}/collection/${collection_id}/access`, {
    credentials: 'include',
  })
  handleAuthResponse(response)
  const data = await response.json()
  if (!response.ok) {
    throw new Error(data.error || 'Failed to check collection access')
  }
  return data.entitlements ?? data.data ?? data
}

export const getUserEntitlements = async (): Promise<CollectionEntitlement[]> => {
  const response = await fetch(`${env.API_URL}/user/entitlement/list`, {
    credentials: 'include',
  })
  handleAuthResponse(response)
  const data = await response.json()
  if (!response.ok) {
    throw new Error(data.error || 'Failed to load entitlements')
  }
  return data.entitlement ?? data.data ?? data
}

export const getCollectionEntitlement = async (collection_id: string): Promise<CollectionEntitlement | null> => {
  const response = await fetch(`${env.API_URL}/collection/${collection_id}/entitlement`, {
    credentials: 'include',
  })
  handleAuthResponse(response)
  if (response.status === 404) return null
  const data = await response.json()
  if (!response.ok) {
    throw new Error(data.error || 'Failed to load collection entitlement')
  }
  return data.data ?? data
}
