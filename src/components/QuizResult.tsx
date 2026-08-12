import React, { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card } from '@/components/ui/card'
import { Spinner } from '@/components/ui/spinner'
import { useAuthStore } from '@/store/useAuthStore'
import { useCollectionStore } from '@/store/useCollectionStore'
import { getScoreHistory } from '@/api/history'
import type { ScoreHistory } from '@/types'
import { CheckCircle2, Clock, ArrowLeft } from 'lucide-react'

const REDIRECT_SECONDS = 5

export const QuizResult: React.FC = () => {
  const { user } = useAuthStore()
  const collectionID = useCollectionStore((state) => state.collectionID)
  const navigate = useNavigate()

  const [latestScore, setLatestScore] = useState<ScoreHistory | null>(null)
  const [loading, setLoading] = useState(true)
  const [countdown, setCountdown] = useState(REDIRECT_SECONDS)
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Fetch the latest score
  useEffect(() => {
    if (!user?.user_id || !collectionID) {
      navigate('/home')
      return
    }

    getScoreHistory(user.user_id, collectionID)
      .then((data: ScoreHistory[] | null) => {
        if (data && data.length > 0) {
          setLatestScore(data[0])
        }
      })
      .finally(() => setLoading(false))
  }, [user, collectionID, navigate])

  // Countdown & redirect
  useEffect(() => {
    if (loading) return

    countdownRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownRef.current!)
          navigate(`/collection?collectionid=${collectionID}`)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => {
      if (countdownRef.current) clearInterval(countdownRef.current)
    }
  }, [loading, collectionID, navigate])

  const formatCompletionTime = (dateString: string): string => {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString(undefined, {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }) + ' at ' + date.toLocaleTimeString(undefined, {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
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

  const getScoreRingColor = (percentage: number): string => {
    if (percentage >= 80) return 'stroke-emerald-500'
    if (percentage >= 60) return 'stroke-amber-500'
    return 'stroke-rose-500'
  }

  const getScoreLabel = (percentage: number): string => {
    if (percentage >= 90) return 'Excellent!'
    if (percentage >= 80) return 'Great job!'
    if (percentage >= 60) return 'Good effort!'
    if (percentage >= 40) return 'Keep practicing!'
    return 'Don\'t give up!'
  }

  if (loading) {
    return (
      <div className="flex min-h-64 flex-col items-center justify-center gap-3 text-muted-foreground">
        <Spinner className="size-10" />
        <p>Loading your results...</p>
      </div>
    )
  }

  const percentage = latestScore?.percentage ?? 0
  const circumference = 2 * Math.PI * 54
  const strokeDashoffset = circumference - (circumference * percentage) / 100

  return (
    <div className="container mx-auto max-w-lg px-4 py-8">
      <Card className="overflow-hidden">
        {/* Success header */}
        <div className="bg-primary/5 border-b px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-emerald-500/15 p-2">
              <CheckCircle2 className="h-6 w-6 text-emerald-500" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Quiz Completed!</h1>
              <p className="text-sm text-muted-foreground">Your answers have been submitted successfully.</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {latestScore ? (
            <>
              {/* Score ring */}
              <div className="flex flex-col items-center gap-3">
                <div className="relative">
                  <svg className="h-36 w-36 -rotate-90" viewBox="0 0 120 120">
                    <circle
                      cx="60" cy="60" r="54"
                      fill="none"
                      className="stroke-muted"
                      strokeWidth="8"
                    />
                    <circle
                      cx="60" cy="60" r="54"
                      fill="none"
                      className={`${getScoreRingColor(percentage)} transition-all duration-1000 ease-out`}
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className={`text-3xl font-bold ${getScoreColor(percentage)}`}>
                      {percentage}%
                    </span>
                    <span className="text-xs text-muted-foreground font-medium">
                      {latestScore.score}/{latestScore.total_questions}
                    </span>
                  </div>
                </div>
                <p className={`text-sm font-semibold ${getScoreColor(percentage)}`}>
                  {getScoreLabel(percentage)}
                </p>
              </div>

              {/* Completion time */}
              <div className="rounded-lg bg-muted/50 border p-4">
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span className="text-muted-foreground">Completed:</span>
                  <span className="font-medium text-foreground ml-auto">
                    {formatCompletionTime(latestScore.completed_at)}
                  </span>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-4">
              <p className="text-sm text-muted-foreground">
                Could not load score details. You will be redirected shortly.
              </p>
            </div>
          )}

          {/* Redirect notice */}
          <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
            <div className="flex items-start gap-3">
              <ArrowLeft className="h-4 w-4 text-primary mt-0.5 shrink-0" />
              <div className="space-y-1">
                <p className="text-sm font-medium text-foreground">
                  Redirecting in {countdown} second{countdown !== 1 ? 's' : ''}...
                </p>
                <p className="text-xs text-muted-foreground">
                  You will be taken back to the collection page to view your full history.
                </p>
              </div>
            </div>

            {/* Countdown progress bar */}
            <div className="mt-3 h-1.5 w-full rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full bg-primary transition-all duration-1000 ease-linear"
                style={{ width: `${(countdown / REDIRECT_SECONDS) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
