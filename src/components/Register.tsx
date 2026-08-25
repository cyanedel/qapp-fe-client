import React, { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { LanguageSelector } from '@/components/LanguageSelector'
import { registerUser } from '@/api/auth'
import { ApiError } from '@/api/response'
import { Mail, Lock, Eye, EyeOff, UserPlus, AlertCircle, CheckCircle2, Sparkles } from 'lucide-react'
import { env } from '@/config/env';

export const Register: React.FC = () => {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const appName = t('app.name')

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [registered, setRegistered] = useState(false)

  useEffect(() => {
    if (!registered) {
      return
    }

    const redirectTimer = window.setTimeout(() => {
      navigate('/login')
    }, env.TIMEOUT_UI)

    return () => window.clearTimeout(redirectTimer)
  }, [navigate, registered])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    const normalizedEmail = email.trim()
    if (!normalizedEmail) {
      setError(t('register.validation.emailRequired'))
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      setError(t('register.validation.emailInvalid'))
      return
    }
    if (!password) {
      setError(t('register.validation.passwordRequired'))
      return
    }

    setLoading(true)

    try {
      await registerUser(normalizedEmail, password)
      setRegistered(true)
    } catch (err: unknown) {
      const errorMessage = err instanceof ApiError
        ? t(`errors.${err.code}`, { defaultValue: t('errors.generic') })
        : t('errors.generic')
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
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
              <p className="max-w-sm text-4xl font-semibold leading-tight tracking-tight">{t('register.heroTitle')}</p>
              <p className="max-w-sm text-base leading-7 text-white/75">{t('register.heroDescription')}</p>
            </div>
            <div className="mt-8 h-1.5 w-14 rounded-full bg-[#FF8A5B]" />
          </div>
          <div className="relative flex items-center gap-3 text-sm text-white/80">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/15"><Sparkles className="h-5 w-5" /></span>
            {t('register.heroFooter')}
          </div>
        </div>

      <Card className="h-full w-full rounded-none border-0 bg-transparent py-10 shadow-none sm:px-8 lg:px-12 lg:py-16">
        {registered ? (
          <>
            <CardHeader className="space-y-2 text-center pb-6">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#4FB286]/15 text-[#388E68] mb-2 ring-1 ring-[#4FB286]/25">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <CardTitle className="text-2xl font-bold tracking-tight text-[#252238]">{t('register.successTitle')}</CardTitle>
              <CardDescription className="text-[#6D6880]">
                {t('register.successDescription', { seconds: Math.round(Number(env.TIMEOUT_UI) / 1000) })}
              </CardDescription>
            </CardHeader>

            <CardContent>
              <Button type="button" className="w-full font-medium" onClick={() => navigate('/login')}>
                {t('register.goToSignIn')}
              </Button>
            </CardContent>
          </>
        ) : (
          <>
            <CardHeader className="space-y-2 text-center pb-6">
              <div className="mx-auto flex w-32 items-center justify-center">
                <span className="text-4xl font-semibold tracking-[-0.06em] text-[#5146C7]">{appName}</span>
              </div>
              <CardTitle className="text-3xl font-bold tracking-tight text-[#252238]">{t('register.title')}</CardTitle>
              <CardDescription className="text-[#6D6880]">
                {t('register.description', { appName })}
              </CardDescription>
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
                  <Label htmlFor="email">{t('common.emailAddress')}</Label>
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
                  <Label htmlFor="password">{t('common.password')}</Label>
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

                <Button type="submit" className="mb-4 h-12 w-full bg-[#5B4BDB] font-semibold text-white hover:bg-[#4D3FC4]" disabled={loading}>
                  {loading ? (
                    <>
                      <Spinner className="mr-2 h-4 w-4" /> {t('register.creating')}
                    </>
                  ) : (
                    <>
                      <UserPlus className="mr-2 h-4 w-4" /> {t('register.register')}
                    </>
                  )}
                </Button>
              </CardContent>

              <CardFooter className="flex flex-col space-y-2 text-center text-sm text-muted-foreground">
                <div>
                  {t('register.hasAccount')}{' '}
                    <Link to="/login" className="font-semibold text-[#5B4BDB] underline-offset-4 hover:underline">
                    {t('nav.signIn')}
                  </Link>
                </div>
              </CardFooter>
            </form>
          </>
        )}
      </Card>
      </div>
    </div>
  )
}
