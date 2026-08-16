import React, { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { useCollectionStore } from '@/store/useCollectionStore'
import { useAuthStore } from '@/store/useAuthStore'
import { useScoreHistoryStore } from '@/store/useScoreHistoryStore'
import type { Question, QuestionDto } from '@/types/collection'
import type { ScoreHistory } from '@/types/history'
import { ShieldAlert, CheckCircle2, Trophy, Clock, Target, TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { getCollectionByCollectionID, startQuiz } from '@/api/collection';
import { getUserAccessStatus } from '@/api/user';
import { getScoreHistory } from '@/api/history';

const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }) + ' at ' + date.toLocaleTimeString(undefined, {
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return dateString
  }
}

const getScoreColor = (percentage: number): string => {
  if (percentage >= 80) return 'text-emerald-500'
  if (percentage >= 60) return 'text-amber-500'
  return 'text-rose-500'
}

const getScoreBgColor = (percentage: number): string => {
  if (percentage >= 80) return 'bg-emerald-500'
  if (percentage >= 60) return 'bg-amber-500'
  return 'bg-rose-500'
}

const getScoreBadgeBg = (percentage: number): string => {
  if (percentage >= 80) return 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/25'
  if (percentage >= 60) return 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/25'
  return 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/25'
}

const getTrendIcon = (current: ScoreHistory, previous: ScoreHistory | undefined) => {
  if (!previous) return null
  if (current.percentage > previous.percentage) return <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
  if (current.percentage < previous.percentage) return <TrendingDown className="h-3.5 w-3.5 text-rose-500" />
  return <Minus className="h-3.5 w-3.5 text-muted-foreground" />
}

export const CollectionInfo: React.FC = () => {
  const [searchParams] = useSearchParams()
  const collectionIDFromUrl = searchParams.get('collectionid') || ''

  const { user } = useAuthStore()

  const [title, setTitle] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [tags, setTags] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const [canAccess, setCanAccess] = useState<boolean>(true)
  const [attemptsUsed, setAttemptsUsed] = useState<number>(0)
  const [maxAttempts, setMaxAttempts] = useState<number | null>(null)
  const [accessMessage, setAccessMessage] = useState<string>('')

  const [scoreHistory, setScoreHistory] = useState<ScoreHistory[]>([])
  const [historyLoading, setHistoryLoading] = useState<boolean>(false)

  const setCollectionID = useCollectionStore((state) => state.setCollectionID)
  const setQuestionList = useCollectionStore((state) => state.setQuestionList)
  const questionList = useCollectionStore((state) => state.questionList)

  const setScoreHistoryStore = useScoreHistoryStore((state) => state.setScoreHistory)

  const navigate = useNavigate()

  useEffect(() => {
    if (!collectionIDFromUrl) {
      navigate('/home')
      return
    }

    setCollectionID(collectionIDFromUrl)

    getCollectionByCollectionID(collectionIDFromUrl).then((data)=>{
      if (!data) {
        setError('Failed to load collection information.')
        return
      }

      setTitle(data.Title || data.title || 'Question Set')
      setDescription(data.Description || data.description || '')
      setTags(data.Tags || data.tags || [])

      const rawQuestions = data.Question || data.question || []
      const mappedData: Question[] = rawQuestions.map((item: QuestionDto) => ({
        id: item.ID ?? item.id ?? 0,
        questionText: item.QuestionText ?? item.questionText ?? '',
        options: item.Options ?? item.options ?? [],
        correctAnswer: item.CorrectAnswer ?? item.correctAnswer ?? 0,
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
      getUserAccessStatus(collectionIDFromUrl)
        .then((accessData) => {
          setCanAccess(accessData.can_access)
          setAttemptsUsed(accessData.attempts_used)
          setMaxAttempts(accessData.max_attempts)
          setAccessMessage(accessData.message)
        })
        .catch((err) => console.error('Access check failed:', err))

      setHistoryLoading(true)
      getScoreHistory(collectionIDFromUrl)
        .then((data) => {
          if (data) {
            setScoreHistory(data)
            setScoreHistoryStore(data)
          }
        })
        .finally(() => setHistoryLoading(false))
    }
  }, [collectionIDFromUrl, setCollectionID, setQuestionList, navigate, user?.user_id, setScoreHistoryStore])

  const handleStartQuestions = async () => {
    if (!canAccess) return

    if (user?.user_id) {
      try {
        startQuiz(collectionIDFromUrl, user.user_id)
        .then((attempt_id)=>{
          if (attempt_id) {
            sessionStorage.setItem('current_attempt_id', attempt_id)
          }
        })
      } catch (err) {
        console.error('Failed to log quiz attempt start:', err)
      }
    }

    navigate('/quiz?collectionid=' + collectionIDFromUrl)
  }

  const bestScore = scoreHistory.length > 0
    ? Math.max(...scoreHistory.map(s => s.percentage))
    : null

  const avgScore = scoreHistory.length > 0
    ? Math.round(scoreHistory.reduce((sum, s) => sum + s.percentage, 0) / scoreHistory.length)
    : null

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
    <div className="container mx-auto max-w-2xl px-4 py-8 space-y-6">
      <Card className="p-6">
        <CardHeader className="px-0 pt-0">
          <CardTitle className="text-2xl font-bold">{title}</CardTitle>
          <p>{description}</p>
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

        <CardFooter className="px-0 pb-0 pt-4">
          <Button
            className="w-full"
            onClick={handleStartQuestions}
            disabled={!canAccess}
          >
            Start Questions
          </Button>
        </CardFooter>
      </Card>

      {/* Score History Section */}
      {user && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">Previous Results</h2>
            {scoreHistory.length > 0 && (
              <span className="ml-auto text-xs font-medium text-muted-foreground bg-muted rounded-full px-2.5 py-0.5">
                {scoreHistory.length} attempt{scoreHistory.length !== 1 ? 's' : ''}
              </span>
            )}
          </div>

          {/* Summary Stats */}
          {scoreHistory.length > 0 && (
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border bg-card p-4 space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  <Trophy className="h-3.5 w-3.5" />
                  Best Score
                </div>
                <p className={`text-2xl font-bold ${getScoreColor(bestScore!)}`}>
                  {bestScore}%
                </p>
              </div>
              <div className="rounded-xl border bg-card p-4 space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  <Target className="h-3.5 w-3.5" />
                  Average
                </div>
                <p className={`text-2xl font-bold ${getScoreColor(avgScore!)}`}>
                  {avgScore}%
                </p>
              </div>
            </div>
          )}

          {historyLoading ? (
            <div className="flex items-center justify-center py-8 text-muted-foreground">
              <Spinner className="size-6 mr-2" />
              <span className="text-sm">Loading history...</span>
            </div>
          ) : scoreHistory.length === 0 ? (
            <Card className="p-6">
              <div className="flex flex-col items-center justify-center text-center py-4 space-y-2">
                <div className="rounded-full bg-muted p-3">
                  <Clock className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="text-sm font-medium text-muted-foreground">No attempts yet</p>
                <p className="text-xs text-muted-foreground/70">
                  Start the quiz to see your results here.
                </p>
              </div>
            </Card>
          ) : (
            <div className="space-y-3">
              {scoreHistory.map((item, index) => (
                <Card
                  key={item.attempt_id}
                  className="group relative overflow-hidden transition-all duration-200 hover:shadow-md"
                >
                  <div className="p-4 space-y-3">
                    {/* Top row: attempt number + percentage badge */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-foreground">
                          Attempt #{scoreHistory.length - index}
                        </span>
                        {getTrendIcon(item, scoreHistory[index + 1])}
                      </div>
                      <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-bold ${getScoreBadgeBg(item.percentage)}`}>
                        {item.percentage}%
                      </span>
                    </div>

                    {/* Score bar */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{item.score} / {item.total_questions} correct</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-700 ease-out ${getScoreBgColor(item.percentage)}`}
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                    </div>

                    {/* Bottom row: timestamp */}
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>{formatDate(item.completed_at)}</span>
                    </div>
                  </div>

                  {/* Hover indicator */}
                  {/* <div className="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <span className="text-xs font-medium text-primary">View Details →</span>
                  </div> */}
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
