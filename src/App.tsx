import { useEffect, useState } from "react"
import { Routes, Route, Outlet, Navigate, useLocation, useNavigate } from "react-router-dom"
import { CollectionInfo } from "@/components/CollectionInfo"
import { Home } from "@/components/Home"
import { Login } from "@/components/Login"
import { NavBar } from "@/components/NavBar"
import { NotFound } from "@/components/NotFound"
import { QuizResult } from "@/components/QuizResult"
import { QuizView } from "@/components/QuizView"
import { Register } from "@/components/Register"
import { EmailVerification } from "@/components/EmailVerification"
import { ResendVerification } from "@/components/ResendVerification"
import { UserDetails } from "@/components/UserDetails"
import { ThemeProvider } from "@/components/ThemeProvider"
import { AUTH_SESSION_EXPIRED_EVENT, startSessionRenewal, validateCurrentSession } from "@/api/auth"
import { Spinner } from "@/components/ui/spinner"
import { useAuthStore } from "@/store/useAuthStore"
import { cn } from "@/lib/utils"
import { useTranslation } from "react-i18next"

function App() {
  const navigate = useNavigate()
  const location = useLocation()
  const { isAuthenticated, setUser, logout } = useAuthStore()
  const [authChecked, setAuthChecked] = useState(false)

  useEffect(() => startSessionRenewal(), [])

  useEffect(() => {
    let isMounted = true

    const checkSession = async () => {
      try {
        const user = await validateCurrentSession()
        if (!isMounted) return

        setUser(user)
      } catch (err) {
        if (!isMounted) return

        console.error('Failed to validate session:', err)
        logout()
      } finally {
        if (isMounted) {
          setAuthChecked(true)
        }
      }
    }

    checkSession()

    return () => {
      isMounted = false
    }
  }, [location.pathname, logout, setUser])

  useEffect(() => {
    const handleSessionExpired = () => {
      logout()
      if (!isAuthRoute(location.pathname)) {
        navigate('/login', { replace: true })
      }
    }

    window.addEventListener(AUTH_SESSION_EXPIRED_EVENT, handleSessionExpired)
    return () => window.removeEventListener(AUTH_SESSION_EXPIRED_EVENT, handleSessionExpired)
  }, [location.pathname, logout, navigate])

  useEffect(() => {
    const usesAuthSurface = isAuthRoute(location.pathname)

    document.body.classList.toggle('login-light-surface', usesAuthSurface)

    return () => document.body.classList.remove('login-light-surface')
  }, [location.pathname])

  return (
    <ThemeProvider>
      <div
        className={cn(
          "flex min-h-screen flex-col text-foreground antialiased",
          isAuthRoute(location.pathname) ? "bg-[#FFF8E7] dark:bg-[#FFF8E7]" : "bg-background"
        )}
      >
        {!isAuthRoute(location.pathname) && <NavBar />}
        <main className="flex-1">
          <Routes>
            <Route path="/verify-email" element={<EmailVerification />} />
            <Route path="/resend-verification" element={<ResendVerification />} />

            <Route element={<PublicOnlyRoute authChecked={authChecked} isAuthenticated={isAuthenticated} />}>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Route>

            <Route element={<ProtectedRoute authChecked={authChecked} isAuthenticated={isAuthenticated} />}>
              <Route path="/" element={<Home />} />
              <Route path="/home" element={<Home />} />
              <Route path="/collection" element={<CollectionInfo />} />
              <Route path="/quiz" element={<QuizView />} />
              <Route path="/quizresult" element={<QuizResult />} />
              <Route path="/accountinformation" element={<UserDetails />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </ThemeProvider>
  )
}

const isEmailActionRoute = (pathname: string) => pathname === '/verify-email' || pathname === '/resend-verification'

const isAuthRoute = (pathname: string) => pathname === '/login' || pathname === '/register' || isEmailActionRoute(pathname)

interface RouteGuardProps {
  authChecked: boolean
  isAuthenticated: boolean
}

const ProtectedRoute = ({ authChecked, isAuthenticated }: RouteGuardProps) => {
  const location = useLocation()

  if (!authChecked) return <AuthLoading />
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace state={{ from: location }} />
}

const PublicOnlyRoute = ({ authChecked, isAuthenticated }: RouteGuardProps) => {
  if (!authChecked) return <AuthLoading />
  return isAuthenticated ? <Navigate to="/home" replace /> : <Outlet />
}

const AuthLoading = () => {
  const { t } = useTranslation()

  return (
    <div className="flex min-h-64 items-center justify-center text-muted-foreground">
      <Spinner className="mr-2 h-5 w-5" />
      {t('app.checkingSession')}
    </div>
  )
}

export default App
