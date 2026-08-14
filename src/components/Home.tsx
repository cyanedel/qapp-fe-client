import React, {useEffect, useState} from 'react'
import { Spinner } from '@/components/ui/spinner';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom'
import type { QuestionCollection } from '@/types';
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
  
  type RawCollectionItem = {
    collectionid: string;
    description: string;
    title: string;
    tags: string[];
  };

  useEffect(()=>{
    resetCollection();
    resetAnswers();

    getCollectionList().then(data => {
      const mappedData: QuestionCollection[] = data.map((item: RawCollectionItem)=>{
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
    <div className='container mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8'>
      <div className='mb-8 flex flex-col gap-2'>
        <div className='flex items-center gap-2 text-sm font-medium text-primary'>
          <BookOpen className='h-4 w-4' />
          <span>Question Sets</span>
        </div>
        <h1 className='text-3xl font-bold tracking-tight'>Pick a Question Set</h1>
        <p className='text-muted-foreground'>
          Choose a collection to review the details and start your quiz.
        </p>
      </div>

      {isLoading ? (
        <div className='flex min-h-64 flex-col items-center justify-center gap-3 rounded-2xl border border-dashed text-muted-foreground'>
          <Spinner className='size-10' />
          <p>Loading question sets...</p>
        </div>
      ) : collectionList.length === 0 ? (
        <Card className='p-8 text-center'>
          <div className='mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground'>
            <Layers className='h-6 w-6' />
          </div>
          <h2 className='text-xl font-semibold'>No question sets available</h2>
          <p className='mt-2 text-sm text-muted-foreground'>
            Available collections will appear here once they are added.
          </p>
        </Card>
      ) : (
        <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
          {collectionList.map((item)=>{
            return (
              <Card key={item.collectionID} className='transition-all hover:-translate-y-0.5 hover:shadow-lg'>
                <CardHeader>
                  <CardTitle className='text-xl font-semibold'>{item.title}</CardTitle>
                  <p className='line-clamp-3 text-sm leading-6 text-muted-foreground'>
                    {item.description || 'No description provided.'}
                  </p>
                </CardHeader>

                <CardContent className='flex-1'>
                  {item.tags && item.tags.length > 0 && (
                    <div className='flex flex-wrap gap-2'>
                      {item.tags.map((tag, index) => (
                        <span
                          key={`${item.collectionID}-${tag}-${index}`}
                          className='inline-flex items-center rounded-full border bg-background px-2.5 py-1 text-xs font-medium text-muted-foreground'
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </CardContent>

                <CardFooter>
                  <Button
                    className='w-full'
                    onClick={()=>handleSelectCollectionID(item.collectionID)}
                  >
                    Start
                    <ArrowRight className='h-4 w-4' />
                  </Button>
                </CardFooter>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
