import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuthStore } from '@/store/useAuthStore'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { LanguageSelector } from '@/components/LanguageSelector'
import { loginUser } from '@/api/auth'
import { ApiError } from '@/api/response'
import { Mail, Lock, Eye, EyeOff, LogIn, AlertCircle, Sparkles, UserCheck } from 'lucide-react'

const demoAccounts = [
  { number: 1, email: 'student-alice@potero.com', password: 'SeedPass123!' },
  { number: 2, email: 'student-bob@potero.com', password: 'SeedPass123!' },
  { number: 3, email: 'student-charlie@potero.com', password: 'SeedPass123!' },
]

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export const Login: React.FC = () => {
  const navigate = useNavigate()
  const { setUser } = useAuthStore()
  const { t } = useTranslation()
  const appName = t('app.name')

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)

    const normalizedEmail = email.trim()

    if (!normalizedEmail) {
      setError(t('login.validation.emailRequired'))
      return
    }

    if (!emailPattern.test(normalizedEmail)) {
      setError(t('login.validation.emailInvalid'))
      return
    }

    if (!password) {
      setError(t('login.validation.passwordRequired'))
      return
    }

    setLoading(true)

    try {
      const data = await loginUser(normalizedEmail, password)
      setUser(data.user)
      navigate('/home')
    } catch (err: unknown) {
      if (err instanceof ApiError && err.code === 'AUTH_EMAIL_NOT_VERIFIED') {
        navigate(`/resend-verification?email=${encodeURIComponent(normalizedEmail)}`)
        return
      }
      const errorMessage = err instanceof ApiError
        ? t(`errors.${err.code}`, { defaultValue: t('errors.generic') })
        : t('errors.generic')
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleQuickFill = (account: (typeof demoAccounts)[number]) => {
    setEmail(account.email)
    setPassword(account.password)
    setError(null)
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#FFF8E7] px-4 py-10 text-[#252238]">
      <div className="pointer-events-none absolute -left-28 -top-28 h-80 w-80 rounded-full bg-[#FFD166]/45 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-20 h-96 w-96 rounded-full bg-[#FF8A5B]/20 blur-3xl" />

      <LanguageSelector className="absolute right-4 top-4 z-20 sm:right-6 sm:top-6" />

      <div className="relative grid w-full max-w-5xl overflow-hidden rounded-[2rem] bg-white/70 shadow-2xl shadow-[#5B4BDB]/15 ring-1 ring-[#5B4BDB]/10 backdrop-blur-sm lg:h-[620px] lg:grid-cols-[1.05fr_0.95fr]">
        <div className="relative hidden min-h-[620px] overflow-hidden bg-[#5B4BDB] p-12 text-left text-white lg:flex lg:flex-col lg:justify-between">
          <div className="relative">
            <span className="block text-5xl font-semibold tracking-[-0.06em] text-white">{appName}</span>
            <div className="auth-hero-copy">
              <p className="max-w-sm text-4xl font-semibold leading-tight tracking-tight">{t('login.heroTitle')}</p>
              <p className="max-w-sm text-base leading-7 text-white/75">{t('login.heroDescription')}</p>
            </div>
            <div className="mt-8 h-1.5 w-14 rounded-full bg-[#FF8A5B]" />
          </div>
          <div className="relative flex items-center gap-3 text-sm text-white/80">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/15"><Sparkles className="h-5 w-5" /></span>
            {t('login.heroFooter')}
          </div>
        </div>

        <Card className="h-full w-full rounded-none border-0 bg-transparent py-10 shadow-none sm:px-8 lg:px-12 lg:py-16">
        <CardHeader className="space-y-2 text-center pb-6">
          <div className="mx-auto flex w-32 items-center justify-center">
            <span className="text-4xl font-semibold tracking-[-0.06em] text-[#5146C7]">{appName}</span>
          </div>
          <CardTitle className="text-3xl font-bold tracking-tight text-[#252238]">{t('login.title')}</CardTitle>
          <CardDescription className="text-[#6D6880]">{t('login.description', { appName })}</CardDescription>
        </CardHeader>

        <form noValidate onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <div className="flex items-center gap-2 rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">{t('login.emailLabel')}</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder={t('login.emailPlaceholder')}
                  className="border-[#E7E2F4] bg-white pl-9 text-[#252238] placeholder:text-[#9A94AA] focus-visible:border-[#5B4BDB] focus-visible:ring-[#5B4BDB]/20"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">{t('login.passwordLabel')}</Label>
                <Link to="/resend-verification" className="text-xs font-semibold text-[#5B4BDB] underline-offset-4 hover:underline">
                  {t('login.resendVerification')}
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="border-[#E7E2F4] bg-white pl-9 pr-10 text-[#252238] placeholder:text-[#9A94AA] focus-visible:border-[#5B4BDB] focus-visible:ring-[#5B4BDB]/20"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={showPassword ? t('login.hidePassword') : t('login.showPassword')}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" className="h-12 w-full bg-[#5B4BDB] font-semibold text-white hover:bg-[#4D3FC4]" disabled={loading}>
              {loading ? (
                <>
                  <Spinner className="mr-2 h-4 w-4" /> {t('login.signingIn')}
                </>
              ) : (
                <>
                  <LogIn className="mr-2 h-4 w-4" /> {t('login.signIn')}
                </>
              )}
            </Button>

          </CardContent>

          <CardFooter className="flex flex-col space-y-2 text-center text-sm text-muted-foreground">
            <div>
              {t('login.noAccount')}{' '}
                <Link to="/register" className="font-semibold text-[#5B4BDB] underline-offset-4 hover:underline">
                {t('login.createAccount')}
              </Link>
            </div>
          </CardFooter>
        </form>
        </Card>
      </div>

      <div className="fixed bottom-4 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 rounded-2xl border border-[#5B4BDB]/10 bg-white/90 p-2 shadow-lg shadow-[#5B4BDB]/10 backdrop-blur-md">
        {demoAccounts.map((account) => (
          <Button
            key={account.email}
            type="button"
            variant="outline"
            size="sm"
            className="gap-1.5 border-[#E7E2F4] bg-white px-3 text-xs text-[#5B4BDB] hover:bg-[#F3F0FF] hover:text-[#4D3FC4]"
            onClick={() => handleQuickFill(account)}
          >
            <UserCheck className="h-3.5 w-3.5" />
            {t('login.demoAccount', { number: account.number })}
          </Button>
        ))}
      </div>
    </div>
  )
}
