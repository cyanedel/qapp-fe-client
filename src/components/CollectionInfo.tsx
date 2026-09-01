import React, { useEffect, useState } from 'react'
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { useCollectionStore } from '@/store/useCollectionStore'
import { useAuthStore } from '@/store/useAuthStore'
import { useScoreHistoryStore } from '@/store/useScoreHistoryStore'
import type { CollectionAccessType, Question, QuestionDto, QuestionCollection } from '@/types/collection'
import type { ScoreHistory } from '@/types/history'
import { ShieldAlert, CheckCircle2, Trophy, Clock, Target, TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { getCollectionByCollectionID, startQuiz } from '@/api/collection';
import { getUserAccessStatus } from '@/api/user';
import { getScoreHistory } from '@/api/history';
import { ApiError } from '@/api/response'
import { getCollectionAccessDeniedKey, getCollectionAccessLabelKey } from '@/lib/collectionAccess'

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
  const { t, i18n } = useTranslation()
  const [searchParams] = useSearchParams()
  const location = useLocation()
  const collectionIDFromUrl = searchParams.get('collectionid') || ''
  const collectionSummary = location.state?.collection as QuestionCollection | undefined

  const { user } = useAuthStore()

  const [title, setTitle] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [searchTags, setSearchTags] = useState<string[]>(collectionSummary?.search_tags ?? [])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const [canAccess, setCanAccess] = useState<boolean>(collectionSummary?.can_access ?? true)
  const [accessType, setAccessType] = useState<CollectionAccessType>(collectionSummary?.access_type ?? 'public')
  const [attemptsUsed, setAttemptsUsed] = useState<number>(0)
  const [maxAttempts, setMaxAttempts] = useState<number | null>(null)
  const [accessCode, setAccessCode] = useState<string>('')
  const [accessMessage, setAccessMessage] = useState<string>('')

  const [scoreHistory, setScoreHistory] = useState<ScoreHistory[]>([])
  const [historyLoading, setHistoryLoading] = useState<boolean>(false)
  const [isStarting, setIsStarting] = useState<boolean>(false)

  const setCollectionID = useCollectionStore((state) => state.setCollectionID)
  const setQuestionList = useCollectionStore((state) => state.setQuestionList)
  const questionList = useCollectionStore((state) => state.questionList)

  const setScoreHistoryStore = useScoreHistoryStore((state) => state.setScoreHistory)

  const navigate = useNavigate()
  const formatDate = (dateString: string): string => {
    try {
      return new Intl.DateTimeFormat(i18n.language, { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(dateString))
    } catch {
      return dateString
    }
  }
  const accessDeniedMessage = accessCode === 'QUIZ_MAX_ATTEMPTS_REACHED' && accessMessage
    ? t(`errors.${accessCode}`, { defaultValue: accessMessage })
    : t(getCollectionAccessDeniedKey(accessType))

  useEffect(() => {
    let isMounted = true

    if (!collectionIDFromUrl) {
      navigate('/home')
      return () => { isMounted = false }
    }

    setCollectionID(collectionIDFromUrl)
    setQuestionList([])
    setScoreHistory([])
    setScoreHistoryStore([])
    setError(null)
    setIsLoading(true)
    setHistoryLoading(false)
    setAccessCode('')
    setAccessMessage('')

    if (collectionSummary) {
      setTitle(collectionSummary.title)
      setDescription(collectionSummary.description)
      setSearchTags(collectionSummary.search_tags ?? [])
      setAccessType(collectionSummary.access_type)
      setCanAccess(collectionSummary.can_access)
    } else {
      setTitle(t('collection.fallbackTitle'))
      setDescription('')
      setSearchTags([])
      setCanAccess(false)
    }

    const loadCollection = async () => {
      if (!user?.user_id) {
        if (isMounted) {
          setError(t('errors.AUTHENTICATION_REQUIRED', { defaultValue: t('errors.generic') }))
          setIsLoading(false)
        }
        return
      }

      try {
        const accessData = await getUserAccessStatus(collectionIDFromUrl)
        if (!isMounted) return

        setCanAccess(accessData.can_access)
        setAccessType(accessData.access_type)
        setAttemptsUsed(accessData.attempts_used)
        setMaxAttempts(accessData.max_attempts)
        setAccessCode(accessData.code ?? '')
        setAccessMessage(accessData.message ?? '')

        setHistoryLoading(true)
        getScoreHistory(collectionIDFromUrl)
          .then((history) => {
            if (isMounted && history) {
              setScoreHistory(history)
              setScoreHistoryStore(history)
            }
          })
          .catch((historyError) => console.error('History load failed:', historyError))
          .finally(() => {
            if (isMounted) setHistoryLoading(false)
          })

        if (!accessData.can_access) return

        const data = await getCollectionByCollectionID(collectionIDFromUrl)
        if (!isMounted) return
        if (!data) {
          setError(t('errors.COLLECTION_LOAD_FAILED', { defaultValue: t('errors.generic') }))
          return
        }

        setTitle(data.Title || data.title || t('collection.fallbackTitle'))
        setDescription(data.Description || data.description || '')
        setSearchTags(data.SearchTags || data.search_tags || collectionSummary?.search_tags || [])

        const rawQuestions = data.Question || data.question || []
        const mappedData: Question[] = rawQuestions.map((item: QuestionDto) => ({
          id: item.ID ?? item.id ?? 0,
          questionText: item.QuestionText ?? item.questionText ?? '',
          options: item.Options ?? item.options ?? [],
          correctAnswer: item.CorrectAnswer ?? item.correctAnswer ?? 0,
        }))
        setQuestionList(mappedData)
      } catch (loadError) {
        console.error('Collection access check failed:', loadError)
        if (isMounted) setError(t('errors.COLLECTION_LOAD_FAILED', { defaultValue: t('errors.generic') }))
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }

    void loadCollection()

    return () => {
      isMounted = false
    }
  }, [collectionIDFromUrl, collectionSummary, setCollectionID, setQuestionList, navigate, user?.user_id, setScoreHistoryStore, t])

  const handleStartQuestions = async () => {
    if (!canAccess || isStarting) return

    if (!user?.user_id) {
      setError(t('errors.AUTHENTICATION_REQUIRED', { defaultValue: t('errors.generic') }))
      return
    }

    setIsStarting(true)
    try {
      const accessData = await getUserAccessStatus(collectionIDFromUrl)
      setCanAccess(accessData.can_access)
      setAccessType(accessData.access_type)
      setAttemptsUsed(accessData.attempts_used)
      setMaxAttempts(accessData.max_attempts)
      setAccessCode(accessData.code ?? '')
      setAccessMessage(accessData.message ?? '')
      if (!accessData.can_access) return

      const attemptId = await startQuiz(collectionIDFromUrl, user.user_id)
      if (!attemptId) throw new Error(t('errors.QUIZ_START_FAILED', { defaultValue: t('errors.generic') }))
      sessionStorage.setItem('current_attempt_id', attemptId)
      navigate('/quiz?collectionid=' + collectionIDFromUrl)
    } catch (err) {
      console.error('Failed to start quiz:', err)
      setError(err instanceof ApiError
        ? t(`errors.${err.code}`, { defaultValue: t('errors.generic') })
        : t('errors.QUIZ_START_FAILED', { defaultValue: t('errors.generic') }))
    } finally {
      setIsStarting(false)
    }
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
        <p>{t('collection.loading')}</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto p-6 text-center">
        <Card className="p-6">
          <p className="text-destructive font-medium">{error}</p>
          <Button className="mt-4" onClick={() => navigate('/')}>
            {t('common.backToHome')}
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
          {searchTags && searchTags.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {searchTags.map((tag, idx) => (
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
              {t('collection.overview')}
            </h3>
            <div className="flex justify-between items-center text-sm">
              <span>{t('collection.totalQuestions')}</span>
              <span className="font-bold text-primary">{questionList.length}</span>
            </div>
            <div className="flex justify-between items-center text-sm pt-1 border-t border-border/50">
              <span>{t('collection.accessType')}</span>
              <span className="font-semibold">{t(getCollectionAccessLabelKey(accessType))}</span>
            </div>
            {maxAttempts !== null && (
              <div className="flex justify-between items-center text-sm pt-1 border-t border-border/50">
                <span>{t('collection.attemptLimit')}</span>
                <span className="font-semibold">
                  {maxAttempts === 0 ? t('collection.unlimited') : t('collection.attemptsUsed', { used: attemptsUsed, total: maxAttempts })}
                </span>
              </div>
            )}
          </div>

          {user && !canAccess && (
            <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive font-medium">
              <ShieldAlert className="h-5 w-5 shrink-0" />
              <span>{accessDeniedMessage}</span>
            </div>
          )}

          {user && canAccess && maxAttempts !== null && (
            <div className="flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-600 dark:text-emerald-400 font-medium">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>
                {maxAttempts === 0
                  ? t('collection.accessGrantedUnlimited')
                  : t('collection.accessGrantedRemaining', { count: maxAttempts - attemptsUsed })}
              </span>
            </div>
          )}
        </CardContent>

        <CardFooter className="px-0 pb-0 pt-4">
          <Button
            className="w-full"
            onClick={handleStartQuestions}
            disabled={!canAccess || isStarting || questionList.length === 0}
          >
            {isStarting ? t('collection.starting') : canAccess ? t('collection.startQuestions') : t('collection.accessRequired')}
          </Button>
        </CardFooter>
      </Card>

      {/* Score History Section */}
      {user && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">{t('collection.previousResults')}</h2>
            {scoreHistory.length > 0 && (
              <span className="ml-auto text-xs font-medium text-muted-foreground bg-muted rounded-full px-2.5 py-0.5">
                {t('collection.attempts', { count: scoreHistory.length })}
              </span>
            )}
          </div>

          {/* Summary Stats */}
          {scoreHistory.length > 0 && (
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border bg-card p-4 space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  <Trophy className="h-3.5 w-3.5" />
                  {t('collection.bestScore')}
                </div>
                <p className={`text-2xl font-bold ${getScoreColor(bestScore!)}`}>
                  {bestScore}%
                </p>
              </div>
              <div className="rounded-xl border bg-card p-4 space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  <Target className="h-3.5 w-3.5" />
                  {t('collection.average')}
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
              <span className="text-sm">{t('collection.loadingHistory')}</span>
            </div>
          ) : scoreHistory.length === 0 ? (
            <Card className="p-6">
              <div className="flex flex-col items-center justify-center text-center py-4 space-y-2">
                <div className="rounded-full bg-muted p-3">
                  <Clock className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="text-sm font-medium text-muted-foreground">{t('collection.noAttempts')}</p>
                <p className="text-xs text-muted-foreground/70">
                  {t('collection.noAttemptsDescription')}
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
                          {t('collection.attemptNumber', { number: scoreHistory.length - index })}
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
                        <span>{t('collection.correctCount', { score: item.score, total: item.total_questions })}</span>
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
