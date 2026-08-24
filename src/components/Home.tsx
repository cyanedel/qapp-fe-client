import React, {useEffect, useState} from 'react'
import { Spinner } from '@/components/ui/spinner';
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import type { CollectionListItemDto, QuestionCollection } from '@/types/collection';
import { useCollectionStore } from '@/store/useCollectionStore';
import { useQuestionStore } from '@/store/useQuestionStore';
import { useAuthStore } from '@/store/useAuthStore';
import { getCollectionList } from '@/api/collection';
import { ArrowRight, BookOpen, Layers, Sparkles } from 'lucide-react';

export const Home: React.FC = () => {
  const { t } = useTranslation()
  const [collectionList, setCollectionList] = useState<QuestionCollection[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const setCollectionID = useCollectionStore((state)=>state.setCollectionID)
  const resetCollection = useCollectionStore((state)=>state.reset)
  const resetAnswers = useQuestionStore((state)=>state.reset)
  const user = useAuthStore((state) => state.user)
  const navigate = useNavigate();
  const displayName = user?.display_name || user?.real_name || user?.username || ''
  
  useEffect(()=>{
    resetCollection();
    resetAnswers();

    getCollectionList().then(data => {
      if (!data) {
        setCollectionList([])
        return
      }

      const mappedData: QuestionCollection[] = data.map((item: CollectionListItemDto)=>{
        const { collectionid, org_id, display_name, title, description, search_tags, access_type, access_tag, can_access } = item
        return {
          collectionID: collectionid,
          org_id,
          display_name,
          description: description,
          title: title,
          search_tags: search_tags ?? [],
          access_type,
          access_tag,
          can_access,
        }
      })

      setCollectionList(mappedData)
    })
    .catch(error => {
      console.error('Fetch error:', error);
    })
    .finally(() => {
      setIsLoading(false)
    });
  }, [resetAnswers, resetCollection])

  const handleSelectCollectionID = (collection: QuestionCollection) => {
    const collectionID = collection.collectionID
    setCollectionID(collectionID);
    navigate("/collection?collectionid=" + collectionID, { state: { collection } });
  }

  const accessLabel = (item: QuestionCollection) => {
    if (item.can_access) return t('home.access.available')
    if (item.access_type === 'premium') return t('home.access.premium')
    if (item.access_type === 'public_org') return t('home.access.organizationMembers')
    if (item.access_type === 'grant_org') return item.access_tag ? t('home.access.requiresTag', { tag: item.access_tag }) : t('home.access.organizationGrant')
    return t('home.access.unavailable')
  }

  return(
    <div className='container mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8'>
      <Card className='mb-8 overflow-hidden border-0 bg-primary text-white shadow-lg shadow-primary/15'>
        <div className='flex flex-col gap-8 p-6 sm:p-8 md:flex-row md:items-end md:justify-between'>
          <div className='max-w-2xl text-left'>
            <div className='mb-5 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-white/70'>
              <Sparkles className='h-4 w-4' />
              <span>{t('home.learningSpace')}</span>
            </div>
            <h1 className='text-left text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl'>{t('home.welcome', { name: displayName })}</h1>
            <p className='mt-3 max-w-xl text-sm leading-6 text-white/75 sm:text-base'>
              {t('home.subtitle')}
            </p>
          </div>
          <div className='flex shrink-0 gap-6 border-t border-white/15 pt-5 md:border-l md:border-t-0 md:pl-6 md:pt-0'>
            <div>
              <p className='text-2xl font-semibold text-white'>{collectionList.length}</p>
              <p className='mt-1 text-xs text-white/65'>{t('home.questionSets')}</p>
            </div>
            <div>
              <p className='text-2xl font-semibold text-white'>{collectionList.filter((item) => item.can_access).length}</p>
              <p className='mt-1 text-xs text-white/65'>{t('home.availableNow')}</p>
            </div>
          </div>
        </div>
      </Card>

      <div className='mb-5 flex items-end justify-between gap-4'>
        <div>
          <div className='flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-primary'>
            <BookOpen className='h-4 w-4' />
            <span>{t('home.questionSets')}</span>
          </div>
          <h2 className='mt-2 text-2xl font-semibold tracking-tight'>{t('home.continueExploring')}</h2>
        </div>
        <p className='hidden text-sm text-muted-foreground sm:block'>{t('home.chooseSet')}</p>
      </div>

      {isLoading ? (
        <div className='flex min-h-64 flex-col items-center justify-center gap-3 rounded-3xl border border-dashed border-border bg-card/60 text-muted-foreground'>
          <Spinner className='size-9 text-primary' />
          <p>{t('home.loading')}</p>
        </div>
      ) : collectionList.length === 0 ? (
        <Card className='border-border bg-card p-8 text-center shadow-sm'>
          <div className='mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground'>
            <Layers className='h-6 w-6' />
          </div>
          <h2 className='text-xl font-semibold'>{t('home.emptyTitle')}</h2>
          <p className='mt-2 text-sm text-muted-foreground'>
            {t('home.emptyDescription')}
          </p>
        </Card>
      ) : (
        <div className='overflow-hidden border-y border-border'>
          {collectionList.map((item)=>{
            return (
              <div key={item.collectionID} className='group flex flex-col gap-5 border-b border-border bg-background px-2 py-5 transition-colors last:border-b-0 hover:bg-secondary/35 sm:px-4 md:flex-row md:items-center md:justify-between md:gap-8'>
                <div className='min-w-0 flex-1 text-left'>
                  <h2 className='text-lg font-semibold tracking-tight text-foreground'>{item.title}</h2>
                  <p className='mt-1 line-clamp-2 max-w-3xl text-sm leading-6 text-muted-foreground'>
                    {item.description || t('home.noDescription')}
                  </p>
                  {(item.display_name !== null && item.display_name !== undefined) || item.org_id ? (
                    <p className='mt-1 text-sm font-medium text-primary'>
                      {t('home.publisher', { publisher: item.display_name ?? item.org_id })}
                    </p>
                  ) : null}
                  <div className='mt-3 flex flex-wrap items-center gap-x-2 gap-y-2 text-xs'>
                    <span className={item.can_access ? 'font-semibold text-primary' : 'font-medium text-muted-foreground'}>
                      {accessLabel(item)}
                    </span>
                    {item.search_tags?.slice(0, 2).map((tag, index) => (
                      <React.Fragment key={`${item.collectionID}-${tag}-${index}`}>
                        <span className='text-border'>•</span>
                        <span className='text-muted-foreground'>{tag}</span>
                      </React.Fragment>
                    ))}
                    {(item.search_tags?.length ?? 0) > 2 && (
                      <span className='text-muted-foreground'>{t('home.more', { count: item.search_tags!.length - 2 })}</span>
                    )}
                  </div>
                </div>
                <div className='shrink-0 md:w-28'>
                    <Button
                      variant={item.can_access ? 'default' : 'outline'}
                      className='h-10 w-full font-semibold transition-colors'
                      onClick={()=>handleSelectCollectionID(item)}
                    >
                      {item.can_access ? t('common.start') : t('common.view')}
                      <ArrowRight className='h-4 w-4' />
                    </Button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
