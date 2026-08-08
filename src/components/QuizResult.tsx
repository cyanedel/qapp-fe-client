import React, { useEffect } from 'react'
import { Card } from '@/components/ui/card'
// import { Label } from '@/components/ui/label'
// import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { useCollectionStore } from '@/store/useCollectionStore';
import { useScoreHistoryStore } from '@/store/useScoreHistoryStore';
import { getScoreHistory } from '@/api/history';

export const QuizResult: React.FC = () => {
  // const listQuestion = MOCK_QUESTIONS;
  const { user } = useAuthStore()
  const collectionID = useCollectionStore((state)=>state.collectionID)
  // const questionList = useCollectionStore((state)=>state.questionList);
  // const answers = useQuestionStore((state)=>state.answers);
  const scoreHistory = useScoreHistoryStore((state)=>state.scoreHistory);
  const setScoreHistory = useScoreHistoryStore((state)=>state.setScoreHistory);
  const navigate = useNavigate();

  useEffect(()=>{
    if(user != null && user.user_id && collectionID){
      getScoreHistory(user.user_id, collectionID).then((data)=>{
        setScoreHistory(data);
      })
    } else {
      navigate(`/home`)
    }
  },[user, collectionID, setScoreHistory])

  const handleViewDetails = (index: number) => {
    navigate(`/quizresultdetail?result_index=${index}`)
  }

  return (
    <React.Fragment>
      <div className='grid gap-4 p-4 text-left'>
      {scoreHistory.map((item, index) => {
        return (
          <Card key={index} className='px-4'>
            <div>
              Attempt ID: {item.attempt_id}<br />
              Score: {item.score}/{item.total_questions} ( {item.percentage}% )<br />
              Completion time: {item.completed_at}
            </div>
            <Button onClick={()=>handleViewDetails(index)}>Details</Button>
          </Card>
        )
      })}
      </div>
    </React.Fragment>
  );
}