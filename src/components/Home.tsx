import React, {useEffect, useState} from 'react'
import { Spinner } from '@/components/ui/spinner';
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom'
import type { CollectionListItemDto, QuestionCollection } from '@/types/collection';
import { useCollectionStore } from '@/store/useCollectionStore';
import { useQuestionStore } from '@/store/useQuestionStore';
import { getCollectionList } from '@/api/collection';
import { ArrowRight, BookOpen, Layers } from 'lucide-react';

export const Home: React.FC = () => {
  const [collectionList, setCollectionList] = useState<QuestionCollection[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const setCollectionID = useCollectionStore((state)=>state.setCollectionID)
  const resetCollection = useCollectionStore((state)=>state.reset)
  const resetAnswers = useQuestionStore((state)=>state.reset)
  const navigate = useNavigate();
  
  useEffect(()=>{
    resetCollection();
    resetAnswers();

    getCollectionList().then(data => {
      if (!data) {
        setCollectionList([])
        return
      }

      const mappedData: QuestionCollection[] = data.map((item: CollectionListItemDto)=>{
        const { collectionid, title, description, tags } = item
        return {
          collectionID: collectionid,
          description: description,
          title: title,
          tags: tags
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

  const handleSelectCollectionID = (collectionID: string) => {
    setCollectionID(collectionID);
    navigate("/collection?collectionid=" + collectionID);
  }

  return(
    <div className='container mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8'>
      <div className='mb-10 flex max-w-2xl flex-col gap-3'>
        <div className='flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-primary'>
          <span className='flex h-8 w-8 items-center justify-center rounded-xl bg-secondary text-primary'>
            <BookOpen className='h-4 w-4' />
          </span>
          <span>Explore Potero</span>
        </div>
        <h1 className='text-4xl font-semibold tracking-[-0.04em] sm:text-5xl'>Choose your next challenge</h1>
        <p className='max-w-xl text-base leading-7 text-muted-foreground'>
          Browse a question set, review what is inside, and start learning at your own pace.
        </p>
      </div>

      {isLoading ? (
        <div className='flex min-h-64 flex-col items-center justify-center gap-3 rounded-3xl border border-dashed border-border bg-card/60 text-muted-foreground'>
          <Spinner className='size-9 text-primary' />
          <p>Loading question sets...</p>
        </div>
      ) : collectionList.length === 0 ? (
        <Card className='border-border bg-card p-8 text-center shadow-sm'>
          <div className='mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground'>
            <Layers className='h-6 w-6' />
          </div>
          <h2 className='text-xl font-semibold'>No question sets available</h2>
          <p className='mt-2 text-sm text-muted-foreground'>
            Available collections will appear here once they are added.
          </p>
        </Card>
      ) : (
        <div className='flex flex-col gap-3'>
          {collectionList.map((item)=>{
            return (
              <Card key={item.collectionID} className='border-border bg-card shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/35 hover:shadow-md'>
                <div className='flex flex-col gap-5 p-5 md:flex-row md:items-center md:gap-6'>
                  <div className='flex min-w-0 flex-1 items-start gap-4'>
                    <div className='flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary'>
                      <Layers className='h-5 w-5' />
                    </div>
                    <div className='min-w-0 flex-1'>
                      <h2 className='text-lg font-semibold tracking-tight'>{item.title}</h2>
                      <p className='mt-1 line-clamp-2 text-sm leading-6 text-muted-foreground'>
                        {item.description || 'No description provided.'}
                      </p>
                      {item.tags && item.tags.length > 0 && (
                        <div className='mt-3 flex flex-wrap gap-2'>
                          {item.tags.map((tag, index) => (
                            <span
                              key={`${item.collectionID}-${tag}-${index}`}
                              className='inline-flex items-center rounded-full border border-primary/10 bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground'
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className='shrink-0 md:w-36'>
                    <Button
                      className='h-10 w-full bg-primary font-semibold text-primary-foreground hover:bg-primary/85'
                      onClick={()=>handleSelectCollectionID(item.collectionID)}
                    >
                      Start
                      <ArrowRight className='h-4 w-4' />
                    </Button>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
