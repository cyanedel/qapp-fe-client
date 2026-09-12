import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { AlertCircle, CheckCircle2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { verifyEmail } from '@/api/auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LanguageSelector } from '@/components/LanguageSelector'
import { Spinner } from '@/components/ui/spinner'

type VerificationStatus = 'verifying' | 'verified' | 'invalid'

const verificationRequests = new Map<string, ReturnType<typeof verifyEmail>>()

const verifyEmailOnce = (token: string) => {
  const existingRequest = verificationRequests.get(token)
  if (existingRequest) return existingRequest

  const request = verifyEmail(token).catch((error: unknown) => {
    verificationRequests.delete(token)
    throw error
  })
  verificationRequests.set(token, request)
  return request
}

export const EmailVerification = () => {
  const { t } = useTranslation()
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')?.trim() ?? ''
  const [status, setStatus] = useState<VerificationStatus>(token ? 'verifying' : 'invalid')

  useEffect(() => {
    if (!token) return

    let active = true
    verifyEmailOnce(token)
      .then(() => {
        if (active) setStatus('verified')
      })
      .catch(() => {
        if (active) setStatus('invalid')
      })

    return () => {
      active = false
    }
  }, [token])

  const verified = status === 'verified'
  const invalid = status === 'invalid'

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#FFF8E7] px-4 py-10 text-[#252238]">
      <div className="pointer-events-none absolute -left-28 -top-28 h-80 w-80 rounded-full bg-[#FFD166]/45 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-20 h-96 w-96 rounded-full bg-[#FF8A5B]/20 blur-3xl" />
      <LanguageSelector className="absolute right-4 top-4 z-20 sm:right-6 sm:top-6" />

      <Card className="relative w-full max-w-lg border-0 bg-white/80 py-8 shadow-2xl shadow-[#5B4BDB]/15 ring-1 ring-[#5B4BDB]/10 backdrop-blur-sm">
        <CardHeader className="space-y-3 text-center">
          <div className={`mx-auto flex h-14 w-14 items-center justify-center rounded-2xl ${verified ? 'bg-emerald-500/15 text-emerald-700' : invalid ? 'bg-destructive/10 text-destructive' : 'bg-[#5B4BDB]/10 text-[#5B4BDB]'}`}>
            {verified ? <CheckCircle2 className="size-7" /> : invalid ? <AlertCircle className="size-7" /> : <Spinner className="size-6" />}
          </div>
          <CardTitle className="text-2xl text-[#252238]">
            {verified ? t('emailVerification.verifiedTitle') : invalid ? t('emailVerification.invalidTitle') : t('emailVerification.verifyingTitle')}
          </CardTitle>
          <CardDescription className="text-[#6D6880]">
            {verified ? t('emailVerification.verifiedDescription') : invalid ? t('emailVerification.invalidDescription') : t('emailVerification.verifyingDescription')}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-3">
          {invalid && (
            <Button asChild variant="outline" className="w-full">
              <Link to="/resend-verification">{t('emailVerification.requestAnother')}</Link>
            </Button>
          )}
          <Button asChild className="w-full bg-[#5B4BDB] text-white hover:bg-[#4D3FC4]">
            <Link to="/login">{t('emailVerification.goToSignIn')}</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
