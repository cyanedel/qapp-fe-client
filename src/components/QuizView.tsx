import React, { useEffect, useState } from 'react'
import type { Question } from '@/types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { redirect, Link } from 'react-router-dom'
import { useAnswerListStore } from '@/store/answerList';
import { useQuestionListStore } from '@/store/questionList';

export const QuizView: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  
  const collectionID = useQuestionListStore((state)=>state.collectionID)
  const setQuestionList = useQuestionListStore((state)=>state.setQuestionList)
  const questionList = useQuestionListStore((state)=>state.questionList)

  const selectedAnswer = useAnswerListStore((state)=>state.selectAnswer)
  const answers = useAnswerListStore((state)=>state.answers)

  useEffect(()=>{
    if(collectionID){
      fetch(import.meta.env.VITE_API_URL + '/collection/'+collectionID)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log(data["data"])
        const mappedData: Question[] = data["data"]["Question"].map((item: any)=>{
          const { ID, QuestionText, Options, CorrectAnswer } = item
          return {
            id: ID,
            questionText: QuestionText,
            options: Options,
            correctAnswer: CorrectAnswer
          }
        })
        setQuestionList(mappedData)
      })
      .catch(error => {
        console.error('Fetch error:', error);
      });
    } else {
      redirect("home")
    }
  }, [])

  const handleAnswerSelect = (answerIndex: number) => {
    // setSelectedAnswer(option);
    selectedAnswer(currentIndex, answerIndex);
  }

  const handleNav = (direction: string) => {
    // setShowFeedback(true);
    if (direction === "next") {
      setCurrentIndex(currentIndex+1)
    } else if (direction === "prev") {
      setCurrentIndex(currentIndex-1 < 0 ? 0 : currentIndex-1)
    }
  };

  const answerStr = answers[currentIndex] ? answers[currentIndex].toString() : "" ;

  return (
    <Card className="quiz-container p-4">
      {/* Progress Bar Component can go here */}
      <p>Question {currentIndex + 1} of {questionList?.length}</p>
      
      <h2>{questionList?.length > 0 && questionList[currentIndex].questionText}</h2>
      
      <RadioGroup className='grid md:grid-cols-2 gap-4' value={answerStr}>
        {questionList?.length > 0 && questionList[currentIndex].options.map((option, index) => (
          <Card key={index} className="w-1/2 p-4 flex flex-row w-full text-left items-center" onClick={()=>handleAnswerSelect(index+1)}>
            <RadioGroupItem value={(index+1).toString()} id={`opt${index+1}`} className='flex-none'></RadioGroupItem>
            <Label htmlFor={`opt${index+1}`} className='grow'>{option}</Label>
          </Card>
        ))}
      </RadioGroup>

      <div className='flex flex-wrap items-center gap-2 justify-center md:justify-end'>
        <Button onClick={()=>handleNav("prev")} variant={'outline'} aria-label='back' disabled={currentIndex == 0}>Previous</Button>
        { currentIndex + 1 == questionList?.length
          ? <Button asChild>
              <Link to={"/quizresult"}>Result</Link>
            </Button>
          : <Button onClick={()=>handleNav("next")}>Next</Button> }
        
      </div>
    </Card>
  );
};