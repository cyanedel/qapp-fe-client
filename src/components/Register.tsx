import React, { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { registerUser } from '@/api/auth'
import { Mail, Lock, Eye, EyeOff, UserPlus, AlertCircle, CheckCircle2, Sparkles } from 'lucide-react'
import { env } from '@/config/env';
import { useTheme } from '@/components/ThemeProvider'

export const Register: React.FC = () => {
  const navigate = useNavigate()
  const { theme } = useTheme()

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

    if (!email || !password) {
      setError('Email and password are required.')
      return
    }

    setLoading(true)

    try {
      await registerUser(email, password)
      setRegistered(true)
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Registration failed. Please try again.' ;
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#FFF8E7] px-4 py-10 text-[#252238]">
      <div className="pointer-events-none absolute -left-28 -top-28 h-80 w-80 rounded-full bg-[#FFD166]/45 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-20 h-96 w-96 rounded-full bg-[#FF8A5B]/20 blur-3xl" />

      <div className="relative grid w-full max-w-5xl overflow-hidden rounded-[2rem] bg-white/70 shadow-2xl shadow-[#5B4BDB]/15 ring-1 ring-[#5B4BDB]/10 backdrop-blur-sm lg:h-[620px] lg:grid-cols-[1.05fr_0.95fr]">
        <div className="relative hidden min-h-[620px] overflow-hidden bg-[#5B4BDB] p-12 text-left text-white lg:flex lg:flex-col lg:justify-between">
          <div className="absolute -right-24 -top-20 h-72 w-72 rounded-full bg-[#8C7CFF]" />
          <div className="absolute -bottom-32 -left-20 h-80 w-80 rounded-full border-[48px] border-[#FF8A5B]/70" />
          <div className="relative">
            <img src={theme === 'light' ? '/potero_alt_text.svg' : '/potero_text.svg'} alt="Potero" className="h-12 w-auto brightness-0 invert" />
            <p className="mt-16 max-w-sm text-4xl font-semibold leading-tight tracking-tight">Make learning feel like progress.</p>
            <p className="mt-5 max-w-sm text-base leading-7 text-white/75">Create your account and turn every quiz into a small win.</p>
          </div>
          <div className="relative flex items-center gap-3 text-sm text-white/80">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/15"><Sparkles className="h-5 w-5" /></span>
            Start with something curious
          </div>
        </div>

      <Card className="h-full w-full rounded-none border-0 bg-transparent py-10 shadow-none sm:px-8 lg:px-12 lg:py-16">
        {registered ? (
          <>
            <CardHeader className="space-y-2 text-center pb-6">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#4FB286]/15 text-[#388E68] mb-2 ring-1 ring-[#4FB286]/25">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <CardTitle className="text-2xl font-bold tracking-tight text-[#252238]">Registration successful</CardTitle>
              <CardDescription className="text-[#6D6880]">
                Your account has been created. Redirecting to sign in in 5 seconds.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <Button type="button" className="w-full font-medium" onClick={() => navigate('/login')}>
                Go to Sign In
              </Button>
            </CardContent>
          </>
        ) : (
          <>
            <CardHeader className="space-y-2 text-center pb-6">
              <div className="mx-auto flex w-32 items-center justify-center lg:hidden">
                <img src={theme === 'light' ? '/potero_alt_text.svg' : '/potero_text.svg'} alt="Potero" />
              </div>
              <div className="mx-auto mt-2 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FF8A5B]/15 text-[#E46C43] ring-1 ring-[#FF8A5B]/25">
                <UserPlus className="h-6 w-6" />
              </div>
              <CardTitle className="text-3xl font-bold tracking-tight text-[#252238]">Create your learning profile</CardTitle>
              <CardDescription className="text-[#6D6880]">
                Start building your quiz journey with Potero.
              </CardDescription>
            </CardHeader>

            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                {error && (
                  <div className="flex items-center gap-2 rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email">Email address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@example.com"
                      className="border-[#E7E2F4] bg-white pl-9 text-[#252238] placeholder:text-[#9A94AA] focus-visible:border-[#5B4BDB] focus-visible:ring-[#5B4BDB]/20"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={loading}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
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
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <Button type="submit" className="mb-4 h-12 w-full bg-[#5B4BDB] font-semibold text-white hover:bg-[#4D3FC4]" disabled={loading}>
                  {loading ? (
                    <>
                      <Spinner className="mr-2 h-4 w-4" /> Creating account...
                    </>
                  ) : (
                    <>
                      <UserPlus className="mr-2 h-4 w-4" /> Register
                    </>
                  )}
                </Button>
              </CardContent>

              <CardFooter className="flex flex-col space-y-2 text-center text-sm text-muted-foreground">
                <div>
                  Already have an account?{' '}
                    <Link to="/login" className="font-semibold text-[#5B4BDB] underline-offset-4 hover:underline">
                    Sign In
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
