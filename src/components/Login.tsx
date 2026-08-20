import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuthStore } from '@/store/useAuthStore'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { loginUser } from '@/api/auth'
import { useTheme } from '@/components/ThemeProvider'
import { Mail, Lock, Eye, EyeOff, LogIn, AlertCircle, Sparkles, UserCheck } from 'lucide-react'

const demoAccounts = [
  { label: 'Student 1', email: 'student-alice@potero.com', password: 'SeedPass123!' },
  { label: 'Student 2', email: 'student-bob@potero.com', password: 'SeedPass123!' },
  { label: 'Student 3', email: 'student-charlie@potero.com', password: 'SeedPass123!' },
]

export const Login: React.FC = () => {
  const navigate = useNavigate()
  const { setUser } = useAuthStore()
  const { theme } = useTheme()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)

    if (!email || !password) {
      setError('Please enter both email and password.')
      return
    }

    setLoading(true)

    try {
      const data = await loginUser(email, password)
      setUser(data.user)
      navigate('/home')
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Something went wrong. Please try again.'
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

      <div className="relative grid w-full max-w-5xl overflow-hidden rounded-[2rem] bg-white/70 shadow-2xl shadow-[#5B4BDB]/15 ring-1 ring-[#5B4BDB]/10 backdrop-blur-sm lg:h-[620px] lg:grid-cols-[1.05fr_0.95fr]">
        <div className="relative hidden min-h-[620px] overflow-hidden bg-[#5B4BDB] p-12 text-left text-white lg:flex lg:flex-col lg:justify-between">
          <div className="absolute -right-24 -top-20 h-72 w-72 rounded-full bg-[#8C7CFF]" />
          <div className="absolute -bottom-32 -left-20 h-80 w-80 rounded-full border-[48px] border-[#FF8A5B]/70" />
          <div className="relative">
            <img src={theme === 'light' ? '/potero_alt_text.svg' : '/potero_text.svg'} alt="Potero" className="h-12 w-auto brightness-0 invert" />
            <p className="mt-16 max-w-sm text-4xl font-semibold leading-tight tracking-tight">A smarter way to learn, one question at a time.</p>
            <p className="mt-5 max-w-sm text-base leading-7 text-white/75">Pick up where you left off, discover new topics, and make every quiz count.</p>
          </div>
          <div className="relative flex items-center gap-3 text-sm text-white/80">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/15"><Sparkles className="h-5 w-5" /></span>
            Friendly quizzes for curious minds
          </div>
        </div>

        <Card className="h-full w-full rounded-none border-0 bg-transparent py-10 shadow-none sm:px-8 lg:px-12 lg:py-16">
        <CardHeader className="space-y-2 text-center pb-6">
          <div className="mx-auto flex w-32 items-center justify-center lg:hidden">
            <img src={theme === 'light' ? '/potero_alt_text.svg' : '/potero_text.svg'} alt="Potero" />
          </div>
          <CardTitle className="text-3xl font-bold tracking-tight text-[#252238]">Welcome back</CardTitle>
          <CardDescription className="text-[#6D6880]">Continue your quiz journey with Potero.</CardDescription>
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
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
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

            <Button type="submit" className="h-12 w-full bg-[#5B4BDB] font-semibold text-white hover:bg-[#4D3FC4]" disabled={loading}>
              {loading ? (
                <>
                  <Spinner className="mr-2 h-4 w-4" /> Signing in...
                </>
              ) : (
                <>
                  <LogIn className="mr-2 h-4 w-4" /> Sign In
                </>
              )}
            </Button>

          </CardContent>

          <CardFooter className="flex flex-col space-y-2 text-center text-sm text-muted-foreground">
            <div>
              Don&apos;t have an account?{' '}
                <Link to="/register" className="font-semibold text-[#5B4BDB] underline-offset-4 hover:underline">
                Create an account
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
            {account.label}
          </Button>
        ))}
      </div>
    </div>
  )
}
