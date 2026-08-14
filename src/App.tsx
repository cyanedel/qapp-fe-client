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
import { UserDetails } from "@/components/UserDetails"
import { ThemeProvider } from "@/components/ThemeProvider"
import { AUTH_SESSION_EXPIRED_EVENT, validateCurrentSession } from "@/api/auth"
import { Spinner } from "@/components/ui/spinner"
import { useAuthStore } from "@/store/useAuthStore"
import { cn } from "@/lib/utils"

function App() {
  const navigate = useNavigate()
  const location = useLocation()
  const { isAuthenticated, setUser, logout } = useAuthStore()
  const [authChecked, setAuthChecked] = useState(false)

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
  }, [logout, setUser])

  useEffect(() => {
    const handleSessionExpired = () => {
      logout()
      navigate('/login', { replace: true })
    }

    window.addEventListener(AUTH_SESSION_EXPIRED_EVENT, handleSessionExpired)
    return () => window.removeEventListener(AUTH_SESSION_EXPIRED_EVENT, handleSessionExpired)
  }, [logout, navigate])

  useEffect(() => {
    const isLoginRoute = location.pathname === '/login'

    document.body.classList.toggle('login-light-surface', isLoginRoute)

    return () => document.body.classList.remove('login-light-surface')
  }, [location.pathname])

  const ProtectedRoute = () => {
    if (!authChecked) {
      return <AuthLoading />
    }

    return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace state={{ from: location }} />;
  };

  const PublicOnlyRoute = () => {
    if (!authChecked) {
      return <AuthLoading />
    }

    return isAuthenticated ? <Navigate to="/home" replace /> : <Outlet />;
  };

  return (
    <ThemeProvider>
      <div
        className={cn(
          "flex min-h-screen flex-col text-foreground antialiased",
          location.pathname === '/login' ? "bg-transparent dark:bg-background" : "bg-background"
        )}
      >
        <NavBar />
        <main className="flex-1">
          <Routes>
            <Route element={<PublicOnlyRoute />}>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Route>

            <Route element={<ProtectedRoute />}>
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

const AuthLoading = () => (
  <div className="flex min-h-64 items-center justify-center text-muted-foreground">
    <Spinner className="mr-2 h-5 w-5" />
    Checking session...
  </div>
)

export default App
