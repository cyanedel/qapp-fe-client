import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { logoutUser } from '@/api/auth'
import { useAuthStore } from '@/store/useAuthStore'
import { useTheme } from '@/components/ThemeProvider'
import { cn } from '@/lib/utils'
import { LogIn, LogOut, User as UserIcon, Shield, Crown, UserCheck, Moon, Sun } from 'lucide-react'

export const NavBar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuthStore()
  const { theme, toggleTheme } = useTheme()
  const location = useLocation()
  const navigate = useNavigate()
  const isLoginRoute = location.pathname === '/login'

  const handleLogout = async () => {
    try {
      await logoutUser()
    } catch (err) {
      console.error('Logout failed:', err)
    }
    logout()
    navigate('/login')
  }

  const handleAccountInformation = () => {
    navigate('/accountinformation')
  }

  const renderRoleBadge = (role?: string) => {
    switch (role) {
      case 'admin':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-xs font-semibold text-amber-600 dark:text-amber-400 ring-1 ring-amber-500/20">
            <Shield className="h-3 w-3" /> Admin
          </span>
        )
      case 'question_maker':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-purple-500/10 px-2 py-0.5 text-xs font-semibold text-purple-600 dark:text-purple-400 ring-1 ring-purple-500/20">
            <Crown className="h-3 w-3" /> Creator
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/10 px-2 py-0.5 text-xs font-semibold text-blue-600 dark:text-blue-400 ring-1 ring-blue-500/20">
            <UserCheck className="h-3 w-3" /> Student
          </span>
        )
    }
  }

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b backdrop-blur-sm",
        isLoginRoute
          ? "border-amber-900/10 bg-[#FFFAE5]/90 dark:border-border dark:bg-background/95"
          : "bg-background/95"
      )}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center space-x-6">
          <Link to="/" className="font-bold text-lg tracking-tight flex items-center gap-2">
            <img src={theme === 'light' ? '/potero_alt_p_icon.svg' : '/potero_p_icon.svg'} alt="Potero" className="h-7 w-7" />
            <img src={theme === 'light' ? '/potero_alt_text.svg' : '/potero_text.svg'} alt="Potero" className="h-7" />
          </Link>
          {/* <nav className="flex items-center space-x-1">
            <Button variant="ghost" asChild>
              <Link to="/home">Home</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link to="/quizresult">Results</Link>
            </Button>
          </nav> */}
        </div>

        <div className="flex items-center space-x-3">
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            onClick={toggleTheme}
            className={cn(isLoginRoute && "border-amber-900/15 bg-[#FFF4CC]/80 hover:bg-[#F5E6B8]/80 dark:border-border dark:bg-transparent dark:hover:bg-input/30")}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>

          {isAuthenticated && user ? (
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleAccountInformation}
                className="flex items-center gap-2 rounded-full px-2 py-1 text-sm font-medium transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                  <UserIcon className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="flex flex-col items-start leading-tight">
                  <span className="font-semibold text-xs text-foreground">
                    {user.display_name || user.username}
                  </span>
                  {renderRoleBadge(user.role)}
                </div>
              </button>
              <Button variant="outline" size="sm" onClick={handleLogout} className="gap-1">
                <LogOut className="h-4 w-4" /> Logout
              </Button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/login" className="gap-1">
                  <LogIn className="h-4 w-4" /> Sign In
                </Link>
              </Button>
              <Button size="sm" asChild>
                <Link to="/register">Register</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
