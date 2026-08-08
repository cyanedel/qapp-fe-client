import React, { useEffect } from 'react'
// import { Card } from '@/components/ui/card'
import { useNavigate, useParams } from 'react-router-dom';
import { useScoreHistoryStore } from '@/store/useScoreHistoryStore';

type QueryParams = {
  result_index?: string;
};

export const QuizResultDetail: React.FC = () => {
  const scoreHistory = useScoreHistoryStore((state)=>state.scoreHistory);
  const navigate = useNavigate();
  const { result_index } = useParams<QueryParams>();

  const scoreIndex = Number(result_index); 
  const isValidIndex: Boolean = scoreIndex != undefined && Number.isNaN(scoreIndex);

  useEffect(() => {
    if(isValidIndex){
      //  fetch(`${API_URL}/user/history?user_id=${user?.user_id}&collection_id=${collectionID}`)
      // .then((res) => res.json())
      // .then((data) => {
      //   setScoreHistory(data["history"])
      // })
      // .catch((err) => console.error('No Data:', err))
    } else {
      navigate(`/home`)
    }
  },[isValidIndex]);

  const {} = scoreHistory[scoreIndex]
  return (
    <React.Fragment>
      <div className='grid gap-4 p-4 text-left'>
      {/* {
        return (
          <Card key={index} className='px-4'>
            <div>
              Attempt ID: {item.attempt_id}<br />
              Score: {item.score}/{item.total_questions} ( {item.percentage}% )<br />
              Completion time: {item.completed_at}
            </div>
          </Card>
        )
      })} */}
      </div>
    </React.Fragment>
  );
}