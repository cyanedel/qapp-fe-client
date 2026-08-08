import React, { useEffect, useState } from 'react'
import type { Question } from '@/types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useNavigate } from 'react-router-dom'
import { useQuestionStore } from '@/store/useQuestionStore';
import { useCollectionStore } from '@/store/useCollectionStore';
import { useAuthStore } from '@/store/useAuthStore';

export const QuizView: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const navigate = useNavigate();

  const { user } = useAuthStore();
  
  const collectionID = useCollectionStore((state)=>state.collectionID)
  const setQuestionList = useCollectionStore((state)=>state.setQuestionList)
  const questionList = useCollectionStore((state)=>state.questionList)

  const selectedAnswer = useQuestionStore((state)=>state.selectAnswer)
  const answers = useQuestionStore((state)=>state.answers)

  useEffect(()=>{
    if(collectionID){
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'
      fetch(API_URL + '/collection/'+collectionID)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        const rawQuestions = data["data"]["Question"] || data["data"]["question"] || []
        const mappedData: Question[] = rawQuestions.map((item: any)=>{
          const { ID, id, QuestionText, questionText, Options, options, CorrectAnswer, correctAnswer } = item
          return {
            id: ID || id,
            questionText: QuestionText || questionText,
            options: Options || options,
            correctAnswer: CorrectAnswer || correctAnswer
          }
        })
        setQuestionList(mappedData)
      })
      .catch(error => {
        console.error('Fetch error:', error);
      });
    } else {
      navigate('/home')
    }
  }, [collectionID, navigate, setQuestionList])

  const handleAnswerSelect = (answerIndex: number) => {
    selectedAnswer(currentIndex, answerIndex);
  }

  const handleNav = (direction: string) => {
    if (direction === "next") {
      setCurrentIndex(currentIndex+1)
    } else if (direction === "prev") {
      setCurrentIndex(currentIndex-1 < 0 ? 0 : currentIndex-1)
    }
  };

  const handleFinishQuiz = async () => {
    const attemptID = sessionStorage.getItem('current_attempt_id')
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

    if (attemptID && user?.user_id) {
      setSubmitting(true)
      try {
        const formattedAnswers = Object.entries(answers).map(([idx, selected]) => ({
          question_index: Number(idx),
          selected_option: selected,
        }))

        await fetch(`${API_URL}/quiz/submit`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            attempt_id: attemptID,
            user_id: user.user_id,
            answers: formattedAnswers,
          }),
        })
        sessionStorage.removeItem('current_attempt_id')
      } catch (err) {
        console.error('Failed to submit quiz attempt to backend:', err)
      } finally {
        setSubmitting(false)
      }
    }

    navigate('/quizresult')
  }

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
        <Button onClick={()=>handleNav("prev")} variant={'outline'} aria-label='back' disabled={currentIndex === 0}>Previous</Button>
        { currentIndex + 1 === questionList?.length
          ? <Button onClick={handleFinishQuiz} disabled={submitting}>
              {submitting ? 'Submitting...' : 'Finish & View Result'}
            </Button>
          : <Button onClick={()=>handleNav("next")}>Next</Button> }
      </div>
    </Card>
  );
};