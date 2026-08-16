import { create } from 'zustand'
import type { UserState } from '@/types/auth'

export const useUserStore = create<UserState>((set) => ({
  profile: null,
  setProfile: (profile) => set({ profile }),
}))
