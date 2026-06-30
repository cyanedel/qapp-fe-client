import React, {useEffect, useState} from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom'
import type { QuestionSet } from '@/types';

export const Home: React.FC = () => {
  const [questionList, setQuestionList] = useState<QuestionSet[]>()

  useEffect(()=>{
    fetch(import.meta.env.VITE_API_URL + '/questionsets')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      const mappedData: QuestionSet[] = data["data"].map((item: any)=>{
        const { setid, title, tags } = item
        return {
          setID: setid,
          title: title,
          tags: tags
        }
      })

      setQuestionList(mappedData)
    })
    .catch(error => {
      console.error('Fetch error:', error);
    });
  }, [])

  return(
    <React.Fragment>
      <h1>Pick a Question Set</h1>
      <div className='container grid px-8 sm:grid-cols-2 md:grid-cols-4 gap-4'>
      {questionList && questionList.map((item, index)=>{
        return (
          <Card key={index} className='px-4'>
            <p>{item.title}</p>
            <Button className='w-1/2 sm:w-3/4 md:w-full self-center' asChild>
              <Link to={`/quiz?setid=${item.setID}`}>Start</Link>
            </Button>
            {/* <Button className='w-1/2 sm:w-3/4 md:w-full self-center'>Start</Button> */}
          </Card>
        )
      })}
      </div>
    </React.Fragment>
  )
}