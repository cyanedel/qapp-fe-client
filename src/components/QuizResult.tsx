import React from 'react'
// import { MOCK_QUESTIONS } from '../mockData'
import { Card } from '@/components/ui/card'
// import { Label } from '@/components/ui/label'
// import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
// import { Button } from '@/components/ui/button';
import { useAnswerListStore } from '@/store/answerList';
import { useQuestionListStore } from '@/store/questionList';

export const QuizResult: React.FC = () => {
  // const listQuestion = MOCK_QUESTIONS;
  const questionList = useQuestionListStore((state)=>state.questionList)
  const answers = useAnswerListStore((state)=>state.answers);

  return (
    <React.Fragment>
      <div className='grid gap-4 p-4 text-left'>
      {questionList.map((item, index) => {
        const isCorrect = item.correctAnswer == answers[index]
        console.log(item)
        return (
            <Card className={`px-4 border ${isCorrect ? 'border-lime-400' : 'border-rose-400'}`}>
              <p>{item.questionText}</p>
              <p>Correct answer: {item.correctAnswer}</p>
              <p>Your answer: {answers[index]} - {item.options[answers[index]-1]}</p>
              <p>{item.correctAnswer == answers[index] ? "Correct" : "Incorrect"}</p>
            </Card>
          )
      })}
      </div>
    </React.Fragment>
  );
}