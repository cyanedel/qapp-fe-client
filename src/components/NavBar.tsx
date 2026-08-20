import React, { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { logoutUser } from '@/api/auth'
import { useAuthStore } from '@/store/useAuthStore'
import { useTheme } from '@/components/ThemeProvider'
import { LogIn, LogOut, User as UserIcon, Settings } from 'lucide-react'

export const NavBar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuthStore()
  const { theme } = useTheme()
  const location = useLocation()
  const navigate = useNavigate()
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

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
    setIsUserMenuOpen(false)
    navigate('/accountinformation')
  }

  return (
    <header
      className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur-sm"
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center space-x-6">
          <Link to="/" className="font-bold text-lg tracking-tight flex items-center gap-2">
            {/* <img src={theme === 'light' ? '/potero_alt_p_icon.svg' : '/potero_p_icon.svg'} alt="Potero" className="h-7 w-7" /> */}
            <img src={theme === 'light' ? '/potero_text.svg' : '/potero_alt_text.svg'} alt="Potero" className="h-7" />
          </Link>
        </div>

        <div className="flex items-center space-x-3">
          {isAuthenticated && user ? (
            <div ref={userMenuRef} className="relative">
              <button
                type="button"
                onClick={() => setIsUserMenuOpen((isOpen) => !isOpen)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-muted transition-colors hover:bg-muted/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30"
                aria-label="Open account menu"
                aria-expanded={isUserMenuOpen}
              >
                <UserIcon className="h-4 w-4 text-muted-foreground" />
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 top-11 z-50 w-56 overflow-hidden rounded-xl border bg-popover py-1 text-popover-foreground shadow-lg">
                  <button
                    type="button"
                    onClick={handleAccountInformation}
                    className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm font-medium transition-colors hover:bg-muted"
                  >
                    <UserIcon className="h-4 w-4 text-muted-foreground" />
                    <span className="truncate">{user.display_name || user.username}</span>
                  </button>
                  <button
                    type="button"
                    className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition-colors hover:bg-muted"
                  >
                    <Settings className="h-4 w-4 text-muted-foreground" />
                    Settings
                  </button>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-destructive transition-colors hover:bg-destructive/10"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </div>
              )}
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
