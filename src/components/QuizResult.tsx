import React from 'react'
// import { MOCK_QUESTIONS } from '../mockData'
// import { Card } from '@/components/ui/card'
// import { Label } from '@/components/ui/label'
// import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
// import { Button } from '@/components/ui/button';
// import { useQuizStore } from '@/store/quizStore';

export const QuizResult: React.FC = () => {
  // const listQuestion = MOCK_QUESTIONS;
  // const answers = useQuizStore((state)=>state.answers);

  // console.log(listQuestion);

  return (
    <React.Fragment>
      <div className='grid gap-4 p-4 text-left'>
      {/* {listQuestion.map((item, index) => {
        console.log(item)
        return (
            <Card className='px-4'>
              <p>{item.questionText}</p>
              <p>Correct answer: {item.correctAnswer}</p>
              <p>Your answer: {answers[index]} - {item.options[answers[index]-1]}</p>
            </Card>
          )
      })} */}
      </div>
    </React.Fragment>
  );
}