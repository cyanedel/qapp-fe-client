import React, {useEffect, useState} from 'react'
import { Spinner } from '@/components/ui/spinner';
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom'
import type { QuestionCollection } from '@/types';
import { useCollectionStore } from '@/store/useCollectionStore';
import { useQuestionStore } from '@/store/useQuestionStore';
import { getCollectionList } from '@/api/collection';

export const Home: React.FC = () => {
  const [collectionList, setCollectionList] = useState<QuestionCollection[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const setCollectionID = useCollectionStore((state)=>state.setCollectionID)
  const resetCollection = useCollectionStore((state)=>state.reset)
  const resetAnswers = useQuestionStore((state)=>state.reset)
  const navigate = useNavigate();
  
  type RawCollectionItem = {
    collectionid: string;
    title: string;
    tags: string[];
  };

  useEffect(()=>{
    resetCollection();
    resetAnswers();

    getCollectionList().then(data => {
      const mappedData: QuestionCollection[] = data.map((item: RawCollectionItem)=>{
        const { collectionid, title, tags } = item
        return {
          collectionID: collectionid,
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
    <React.Fragment>
      <h1>Pick a Question Set</h1>
      <div className='container mx-auto grid px-8 sm:grid-cols-2 md:grid-cols-4 gap-4'>
      {isLoading ? (
        <div className='col-span-full flex min-h-48 flex-col items-center justify-center gap-3 text-muted-foreground'>
          <Spinner className='size-10' />
          <p>Loading</p>
        </div>
      ) : (
        collectionList.map((item, index)=>{
          return (
            <Card key={index} className='px-4'>
              <p>{item.title}</p>
              <Button
                className='w-1/2 sm:w-3/4 md:w-full self-center'
                onClick={()=>handleSelectCollectionID(item.collectionID)}
              >
                Start
              </Button>
              {/* <Button className='w-1/2 sm:w-3/4 md:w-full self-center'>Start</Button> */}
            </Card>
          )
        })
      )}
      </div>
    </React.Fragment>
  )
}
