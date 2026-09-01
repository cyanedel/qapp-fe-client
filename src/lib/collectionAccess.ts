import type { CollectionAccessType } from '@/types/collection'

const accessLabelKeys: Record<CollectionAccessType, string> = {
  public: 'collectionAccessTypes.public',
  premium: 'collectionAccessTypes.premium',
  public_org: 'collectionAccessTypes.public_org',
  grant_org: 'collectionAccessTypes.grant_org',
}

const accessDeniedKeys: Record<CollectionAccessType, string> = {
  public: 'collection.accessDenied.public',
  premium: 'collection.accessDenied.premium',
  public_org: 'collection.accessDenied.public_org',
  grant_org: 'collection.accessDenied.grant_org',
}

export const getCollectionAccessLabelKey = (accessType: CollectionAccessType) => accessLabelKeys[accessType]

export const getCollectionAccessDeniedKey = (accessType: CollectionAccessType) => accessDeniedKeys[accessType]
