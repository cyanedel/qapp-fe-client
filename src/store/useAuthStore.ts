import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AuthState } from '@/types/auth'

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    {
      name: 'potero-auth-storage',
    }
  )
)
