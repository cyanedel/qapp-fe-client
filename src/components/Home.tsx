import React, {useEffect, useState} from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom'
import type { QuestionCollection } from '@/types';
import { useQuestionListStore } from '@/store/questionList';

export const Home: React.FC = () => {
  const [collectionList, setCollectionList] = useState<QuestionCollection[]>()
  const setCollectionID = useQuestionListStore((state)=>state.setCollectionID)
  const navigate = useNavigate();

  useEffect(()=>{
    fetch(import.meta.env.VITE_API_URL + '/collection/list')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      const mappedData: QuestionCollection[] = data["data"].map((item: any)=>{
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
    });
  }, [])

  const handleSelectCollectionID = (collectionID: string) => {
    setCollectionID(collectionID);
    navigate("/quiz?collectionid="+collectionID);
  }

  return(
    <React.Fragment>
      <h1>Pick a Question Set</h1>
      <div className='container grid px-8 sm:grid-cols-2 md:grid-cols-4 gap-4'>
      {collectionList && collectionList.map((item, index)=>{
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
      })}
      </div>
    </React.Fragment>
  )
}