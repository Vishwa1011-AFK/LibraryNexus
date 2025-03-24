"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { UserRole } from "@/types"

interface User {
  id: string
  name: string
  email: string
  role: UserRole
}

interface AuthState {
  isAuthenticated: boolean
  user: User | null
  token: string | null
  login: (userData: { user: User; token: string }) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      token: null,
      login: (userData) =>
        set({
          isAuthenticated: true,
          user: userData.user,
          token: userData.token,
        }),
      logout: () =>
        set({
          isAuthenticated: false,
          user: null,
          token: null,
        }),
    }),
    {
      name: "auth-storage",
    },
  ),
)

