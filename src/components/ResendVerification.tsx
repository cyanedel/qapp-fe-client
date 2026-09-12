import { useState, type SubmitEvent } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { MailCheck, RefreshCw } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { resendEmailVerification } from '@/api/auth'
import { ApiError } from '@/api/response'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { LanguageSelector } from '@/components/LanguageSelector'
import { Spinner } from '@/components/ui/spinner'

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export const ResendVerification = () => {
  const { t } = useTranslation()
  const [searchParams] = useSearchParams()
  const [email, setEmail] = useState(searchParams.get('email')?.trim() ?? '')
  const [submitting, setSubmitting] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()
    const normalizedEmail = email.trim().toLowerCase()
    setError(null)

    if (!emailPattern.test(normalizedEmail)) {
      setError(t('resendVerification.emailInvalid'))
      return
    }

    setSubmitting(true)
    try {
      await resendEmailVerification(normalizedEmail)
      setEmail(normalizedEmail)
      setSent(true)
    } catch (err: unknown) {
      setError(err instanceof ApiError ? err.message : t('errors.generic'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#FFF8E7] px-4 py-10 text-[#252238]">
      <div className="pointer-events-none absolute -left-28 -top-28 h-80 w-80 rounded-full bg-[#FFD166]/45 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-20 h-96 w-96 rounded-full bg-[#FF8A5B]/20 blur-3xl" />
      <LanguageSelector className="absolute right-4 top-4 z-20 sm:right-6 sm:top-6" />

      <Card className="relative w-full max-w-lg border-0 bg-white/80 py-8 shadow-2xl shadow-[#5B4BDB]/15 ring-1 ring-[#5B4BDB]/10 backdrop-blur-sm">
        <CardHeader className="space-y-3 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#5B4BDB]/10 text-[#5B4BDB]">
            <MailCheck className="size-7" />
          </div>
          <CardTitle className="text-2xl text-[#252238]">
            {sent ? t('resendVerification.successTitle') : t('resendVerification.title')}
          </CardTitle>
          <CardDescription className="text-[#6D6880]">
            {sent ? t('resendVerification.successDescription') : t('resendVerification.description')}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            {error && <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}
            <div className="space-y-2">
              <Label htmlFor="resend-email">{t('common.emailAddress')}</Label>
              <Input id="resend-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} disabled={submitting} />
            </div>
            <Button type="submit" variant="outline" className="w-full" disabled={submitting}>
              {submitting ? <Spinner className="mr-2 size-4" /> : <RefreshCw className="mr-2 size-4" />}
              {submitting ? t('resendVerification.submitting') : t('resendVerification.submit')}
            </Button>
            <Button asChild className="w-full bg-[#5B4BDB] text-white hover:bg-[#4D3FC4]">
              <Link to="/login">{t('resendVerification.goToSignIn')}</Link>
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
