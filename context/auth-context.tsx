"use client"

import type { ReactNode } from "react"
import { createContext, useState, useEffect, useContext, useCallback } from "react"
import { useRouter } from "next/navigation"
import { apiClient } from "@/lib/api"
import { type AuthUser } from "@/types"
import { type SignupPayload } from "@/types";

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
  user: AuthUser | null;
  accessToken: string | null;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  register: (userData: SignupPayload) => Promise<void>;
  isLoading: boolean;
  checkAuthStatus: () => Promise<void>;
  updateUserContext: (updatedUserData: Partial<AuthUser>) => void;
}

const AuthContext = createContext<AuthContextProps>({
  user: null,
  accessToken: null,
  login: async () => {},
  logout: async () => {},
  register: async () => { throw new Error("Register function not implemented in context yet."); },
  isLoading: true,
  checkAuthStatus: async () => {},
  updateUserContext: () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

  export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const router = useRouter();
  
    const checkAuthStatus = useCallback(async () => {
      try {
        setIsLoading(true);
        const response = await apiClient<AuthUser>("/auth/status");
        setUser(response);
      } catch {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    }, []);
  
    useEffect(() => {
      checkAuthStatus();
    }, [checkAuthStatus]);
  
    const login = async (credentials: { email: string; password: string }) => {
      try {
        const response = await apiClient<{ user: AuthUser; token: string }>("/auth/login", "POST", credentials);
        setUser(response.user);
        setAccessToken(response.token);
        router.push("/");
      } catch (error) {
        console.error("Login failed", error);
      }
    };
  
    const register = async (userData: SignupPayload) => {
      try {
        await Promise.resolve();
      } catch (error) {
        console.error("Registration failed", error);
      }
    };
  
    const logout = async () => {
      try {
        await apiClient("/auth/logout", "POST");
        setUser(null);
        setAccessToken(null);
        router.push("/login");
      } catch (error) {
        console.error("Logout failed", error);
      }
    };
  
    const updateUserContext = (updatedUserData: Partial<AuthUser>) => {
      setUser((currentUser) => {
        if (!currentUser) return null;
        return { ...currentUser, ...updatedUserData };
      });
    };
  
    const value: AuthContextProps = {
      user,
      accessToken,
      login,
      logout,
      register,
      isLoading,
      checkAuthStatus,
      updateUserContext,
    };
  
    return <AuthContext.Provider value={value}>{!isLoading ? children : <div className="flex min-h-screen items-center justify-center">Authenticating...</div>}</AuthContext.Provider>;
  };
  
  export const useAuth = () => {
    return useContext(AuthContext);
  };
  