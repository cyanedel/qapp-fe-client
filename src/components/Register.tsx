import React, { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { registerUser } from '@/api/register'
import { Mail, Lock, Eye, EyeOff, UserPlus, AlertCircle, CheckCircle2 } from 'lucide-react'

export const Register: React.FC = () => {
  const navigate = useNavigate()

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
    }, 5000)

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
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center p-4">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

      <Card className="w-full max-w-md shadow-2xl border-border/50 bg-card/95 backdrop-blur-md">
        {registered ? (
          <>
            <CardHeader className="space-y-2 text-center pb-6">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary mb-2 ring-1 ring-primary/20">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <CardTitle className="text-2xl font-bold tracking-tight">Registration successful</CardTitle>
              <CardDescription className="text-muted-foreground">
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
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary mb-2 ring-1 ring-primary/20">
                <UserPlus className="h-6 w-6" />
              </div>
              <CardTitle className="text-2xl font-bold tracking-tight">Create an account</CardTitle>
              <CardDescription className="text-muted-foreground">
                Get started with QApp to take and manage quizzes
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
                  <Label htmlFor="password">Password</Label>
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

                <Button type="submit" className="mb-4 w-full font-medium" disabled={loading}>
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
                  <Link to="/login" className="font-semibold text-primary underline-offset-4 hover:underline">
                    Sign In
                  </Link>
                </div>
              </CardFooter>
            </form>
          </>
        )}
      </Card>
    </div>
  )
}
