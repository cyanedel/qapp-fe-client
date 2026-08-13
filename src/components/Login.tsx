import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuthStore } from '@/store/useAuthStore'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { loginUser } from '@/api/auth'
import { Mail, Lock, Eye, EyeOff, LogIn, Sparkles, AlertCircle, Shield, UserCheck, Crown } from 'lucide-react'

export const Login: React.FC = () => {
  const navigate = useNavigate()
  const { setUser } = useAuthStore()

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

  // Quick helper for demo logins
  const handleQuickFill = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail)
    setPassword(demoPass)
    setError(null)
  }

  return (
    <div className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center p-4">
      {/* Dynamic Background Glow Effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      
      <Card className="w-full max-w-md shadow-2xl border-border/50 bg-card/95 backdrop-blur-md">
        <CardHeader className="space-y-2 text-center pb-6">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary mb-2 ring-1 ring-primary/20">
            <Sparkles className="h-6 w-6" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">Welcome back</CardTitle>
          <CardDescription className="text-muted-foreground">
            Sign in to your QApp account to access collections & quizzes
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
                  className="pl-9"
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
                  className="pl-9 pr-10"
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

            <Button type="submit" className="w-full font-medium" disabled={loading}>
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

            {/* Quick Demo Credentials Panel */}
            <div className="pt-4 border-t border-border/40 space-y-2">
              <p className="text-xs font-medium text-muted-foreground text-center">
                Quick Demo Accounts (Click to test):
              </p>
              <div className="grid grid-cols-3 gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="text-xs flex items-center justify-center gap-1"
                  onClick={() => handleQuickFill('admin@qapp.com', 'AdminPass123!')}
                >
                  <Shield className="h-3 w-3 text-amber-500" /> Admin
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="text-xs flex items-center justify-center gap-1"
                  onClick={() => handleQuickFill('creator@qapp.com', 'CreatorPass123!')}
                >
                  <Crown className="h-3 w-3 text-purple-500" /> Creator
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="text-xs flex items-center justify-center gap-1"
                  onClick={() => handleQuickFill('user@qapp.com', 'UserPass123!')}
                >
                  <UserCheck className="h-3 w-3 text-blue-500" /> Student
                </Button>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-2 text-center text-sm text-muted-foreground">
            <div>
              Don&apos;t have an account?{' '}
              <Link to="/register" className="font-semibold text-primary underline-offset-4 hover:underline">
                Create an account
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
