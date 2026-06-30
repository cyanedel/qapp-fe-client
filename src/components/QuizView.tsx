import React, { useEffect, useState } from 'react'
import { redirect, useSearchParams } from 'react-router-dom'
import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { useQuizStore } from '@/store/quizStore';
import type { Question } from '@/types'

export const QuizView: React.FC = () => {
  // const [currentSet, setCurrentSet] = useState<string>();
  const [currentIndex, setCurrentIndex] = useState<number>(0); // Tracks current question
  // const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const selectedAnswer = useQuizStore((state)=>state.selectAnswer)
  const answers = useQuizStore((state)=>state.answers)
  // const [showFeedback, setShowFeedback] = useState<boolean>(false);
  const [questionList, setQuestionList] = useState<Question[]>();
  // const [currentQuestion, setCurrentQuestion] = useState<Question>();
  const [searchParams] = useSearchParams();

  useEffect(()=>{
    if(searchParams.get('setid')){
      fetch(import.meta.env.VITE_API_URL + '/question/'+searchParams.get('setid'))
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        const mappedData: Question[] = data["data"].map((item: any)=>{
          const { id, questionText, options, correctAnswer } = item
          return {
            id: id,
            questionText: questionText,
            options: options,
            correctAnswer: correctAnswer
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

  console.log("a");

  const answerStr = answers[currentIndex] ? answers[currentIndex].toString() : "" ;

  return (
    <Card className="quiz-container p-4">
      {/* Progress Bar Component can go here */}
      <p>Question {currentIndex + 1} of {questionList?.length}</p>
      
      <h2>{questionList && questionList[currentIndex].questionText}</h2>
      
      <RadioGroup className='grid md:grid-cols-2 gap-4' value={answerStr}>
        {questionList && questionList[currentIndex].options.map((option, index) => (
          <Card key={index} className="w-1/2 p-4 flex flex-row w-full text-left items-center" onClick={()=>handleAnswerSelect(index+1)}>
            <RadioGroupItem value={(index+1).toString()} id={`opt${index+1}`} className='flex-none'></RadioGroupItem>
            <Label htmlFor={`opt${index+1}`} className='grow'>{option}</Label>
          </Card>
        ))}
      </RadioGroup>

      <div className='flex flex-wrap items-center gap-2 justify-center md:justify-end'>
        <Button onClick={()=>handleNav("prev")} variant={'outline'} aria-label='back' disabled={currentIndex == 0}>Previous</Button>
        <Button onClick={()=>handleNav("next")}>Next</Button>
      </div>
    </Card>
  );
};