import React, { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { useCollectionStore } from '@/store/useCollectionStore'
import { useAuthStore } from '@/store/useAuthStore'
import type { Question } from '@/types'
import { ShieldAlert, CheckCircle2, History } from 'lucide-react'
import { getCollectionByCollectionID, startQuestion } from '@/api/collection';
import { getUserAccessStatus } from '@/api/user';

export const CollectionInfo: React.FC = () => {
  const [searchParams] = useSearchParams()
  const collectionIDFromUrl = searchParams.get('collectionid') || ''

  const { user } = useAuthStore()

  const [title, setTitle] = useState<string>('')
  const [tags, setTags] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const [canAccess, setCanAccess] = useState<boolean>(true)
  const [attemptsUsed, setAttemptsUsed] = useState<number>(0)
  const [maxAttempts, setMaxAttempts] = useState<number | null>(null)
  const [accessMessage, setAccessMessage] = useState<string>('')

  const setCollectionID = useCollectionStore((state) => state.setCollectionID)
  const setQuestionList = useCollectionStore((state) => state.setQuestionList)
  const questionList = useCollectionStore((state) => state.questionList)

  const navigate = useNavigate()

  useEffect(() => {
    if (!collectionIDFromUrl) {
      navigate('/home')
      return
    }

    setCollectionID(collectionIDFromUrl)

    getCollectionByCollectionID(collectionIDFromUrl).then((data)=>{
      setTitle(data.Title || data.title || 'Question Set')
      setTags(data.Tags || data.tags || [])

      const rawQuestions = data.Question || data.question || []
      const mappedData: Question[] = rawQuestions.map((item: any) => ({
        id: item.ID || item.id,
        questionText: item.QuestionText || item.questionText,
        options: item.Options || item.options,
        correctAnswer: item.CorrectAnswer || item.correctAnswer,
      }))
      setQuestionList(mappedData)
    })
    .catch((err) => {
      console.error(err)
      setError('Failed to load collection information.')
    })
    .finally(() => {
      setIsLoading(false)
    })

    if (user?.user_id) {
      getUserAccessStatus(collectionIDFromUrl, user?.user_id)
        .then((accessData) => {
          setCanAccess(accessData.can_access)
          setAttemptsUsed(accessData.attempts_used)
          setMaxAttempts(accessData.max_attempts)
          setAccessMessage(accessData.message)
        })
        .catch((err) => console.error('Access check failed:', err))
    }
  }, [collectionIDFromUrl, setCollectionID, setQuestionList, navigate, user?.user_id])

  const handleStartQuestions = async () => {
    if (!canAccess) return

    if (user?.user_id) {
      try {
        startQuestion(collectionIDFromUrl, user.user_id)
        .then((attempt_id)=>{
          sessionStorage.setItem('current_attempt_id', attempt_id)
        })
      } catch (err) {
        console.error('Failed to log quiz attempt start:', err)
      }
    }

    navigate('/quiz?collectionid=' + collectionIDFromUrl)
  }

  const handleViewPreviousResults = () => {
    navigate('/quizresult')
  }

  if (isLoading) {
    return (
      <div className="flex min-h-64 flex-col items-center justify-center gap-3 text-muted-foreground">
        <Spinner className="size-10" />
        <p>Loading collection details...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto p-6 text-center">
        <Card className="p-6">
          <p className="text-destructive font-medium">{error}</p>
          <Button className="mt-4" onClick={() => navigate('/')}>
            Back to Home
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <Card className="p-6">
        <CardHeader className="px-0 pt-0">
          <CardTitle className="text-2xl font-bold">{title}</CardTitle>
          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center rounded-md bg-secondary px-2.5 py-0.5 text-xs font-semibold text-secondary-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </CardHeader>

        <CardContent className="px-0 py-4 space-y-4">
          <div className="rounded-lg bg-muted p-4 space-y-2">
            <h3 className="font-semibold text-xs text-muted-foreground uppercase tracking-wider">
              Collection Overview
            </h3>
            <div className="flex justify-between items-center text-sm">
              <span>Total Questions:</span>
              <span className="font-bold text-primary">{questionList.length}</span>
            </div>
            {maxAttempts !== null && (
              <div className="flex justify-between items-center text-sm pt-1 border-t border-border/50">
                <span>Attempt Limit:</span>
                <span className="font-semibold">
                  {attemptsUsed} / {maxAttempts} used
                </span>
              </div>
            )}
          </div>

          {user && !canAccess && (
            <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive font-medium">
              <ShieldAlert className="h-5 w-5 shrink-0" />
              <span>{accessMessage || 'You have reached the maximum allowed attempts for this quiz.'}</span>
            </div>
          )}

          {user && canAccess && maxAttempts !== null && (
            <div className="flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-600 dark:text-emerald-400 font-medium">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>Access Granted. You have {maxAttempts - attemptsUsed} attempt(s) remaining.</span>
            </div>
          )}
        </CardContent>

        <CardFooter className="px-0 pb-0 pt-4 flex flex-col sm:flex-row gap-3">
          <Button
            className="w-full sm:w-1/2"
            onClick={handleStartQuestions}
            disabled={!canAccess}
          >
            Start Questions
          </Button>
          <Button className="w-full sm:w-1/2" variant="outline" onClick={handleViewPreviousResults}>
            <History className="mr-2 h-4 w-4" /> Previous Results
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
