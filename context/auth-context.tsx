"use client"

import type { ReactNode } from "react"
import { createContext, useState, useEffect, useContext } from "react"
import { useRouter } from "next/navigation"

interface AuthContextProps {
  user: any
  login: (userData: any) => Promise<void>
  logout: () => void
  register: (userData: any) => Promise<void>
  isLoading: boolean
}

const AuthContext = createContext<AuthContextProps>({
  user: null,
  login: async () => {},
  logout: () => {},
  register: async () => {},
  isLoading: true,
})

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const router = useRouter()

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (userData: any) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    localStorage.setItem("user", JSON.stringify(userData))
    setUser(userData)
    router.push("/dashboard") // Use router.push instead of navigate
  }

  const register = async (userData: any) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    localStorage.setItem("user", JSON.stringify(userData))
    setUser(userData)
    router.push("/dashboard") // Use router.push instead of navigate
  }

  const logout = () => {
    localStorage.removeItem("user")
    setUser(null)
    router.push("/login") // Use router.push instead of navigate
  }

  const value: AuthContextProps = {
    user,
    login,
    logout,
    register,
    isLoading,
  }

  return <AuthContext.Provider value={value}>{!isLoading && children}</AuthContext.Provider>
}

export const useAuth = () => {
  return useContext(AuthContext)
}
