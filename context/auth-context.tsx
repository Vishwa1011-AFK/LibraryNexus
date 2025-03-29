"use client"

import type { ReactNode } from "react"
import { createContext, useState, useEffect, useContext, useCallback } from "react"
import { useRouter } from "next/navigation"
import { apiClient } from "@/lib/api"
import { type AuthUser } from "@/types"

interface SignInResponse {
    accessToken: string
    msg: string
    user: {
        user_id: string
        role: 'student' | 'admin'
    }
    userdetails: {
        firstName: string
        middleName?: string
        lastName: string
        email: string
        birthDate?: string
    }
}

interface AuthContextProps {
  user: AuthUser | null
  accessToken: string | null
  login: (credentials: { email: string, password: string }) => Promise<void>
  logout: () => Promise<void>
  register: (userData: any) => Promise<void>
  isLoading: boolean
  checkAuthStatus: () => Promise<void>
}

const AuthContext = createContext<AuthContextProps>({
  user: null,
  accessToken: null,
  login: async () => {},
  logout: async () => {},
  register: async () => {},
  isLoading: true,
  checkAuthStatus: async () => {},
})

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const router = useRouter()

  const checkAuthStatus = useCallback(async () => {
    try {
        const userData = await apiClient<AuthUser>('/auth/me', 'GET')
        try {
            const tokenResponse = await apiClient<{ accessToken: string }>('/auth/token', 'POST')
            setAccessToken(tokenResponse.accessToken)
        } catch {
            setAccessToken(null)
        }
        setUser({ ...userData, isAdmin: userData.role === 'admin' })
    } catch {
        setUser(null)
        setAccessToken(null)
    } finally {
        setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    checkAuthStatus()
  }, [checkAuthStatus])

  const login = async (credentials: { email: string, password: string }) => {
    try {
        const response = await apiClient<SignInResponse>('/auth/signin', 'POST', credentials)
        const loggedInUser: AuthUser = {
            id: response.user.user_id,
            role: response.user.role,
            isAdmin: response.user.role === 'admin',
            firstName: response.userdetails.firstName,
            middleName: response.userdetails.middleName,
            lastName: response.userdetails.lastName,
            email: response.userdetails.email,
            birthDate: response.userdetails.birthDate,
        }
        setUser(loggedInUser)
        setAccessToken(response.accessToken)
    } catch {
        setUser(null)
        setAccessToken(null)
        throw new Error("Login failed")
    }
  }

  const register = async (userData: any) => {
    await new Promise((resolve) => setTimeout(resolve, 1000))
  }

  const logout = async () => {
    console.log("Attempting logout...");
    try {
        await apiClient('/auth/logout', 'POST');
        console.log("Logout API call successful.");
    } catch (error) {
        console.error("Logout API call failed (might be okay if session already invalid):", error);
    } finally {
        setUser(null);
        setAccessToken(null);
        console.log("Frontend state cleared.");
        router.replace("/signin");
    }
 }

  const value: AuthContextProps = {
    user,
    accessToken,
    login,
    logout,
    register,
    isLoading,
    checkAuthStatus
  }

  return <AuthContext.Provider value={value}>{!isLoading ? children : <div className="flex min-h-screen items-center justify-center">Authenticating...</div>}</AuthContext.Provider>
}

export const useAuth = () => {
  return useContext(AuthContext)
}
