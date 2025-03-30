"use client"

import type { ReactNode } from "react"
import { createContext, useState, useEffect, useContext, useCallback } from "react"
import { useRouter } from "next/navigation"
import { apiClient } from "@/lib/api"
import { type AuthUser } from "@/types"
import { type SignupPayload } from "@/types";
import { type SignInResponse } from "@/types";

interface AuthContextProps {
  user: AuthUser | null;
  accessToken: string | null; 
  login: (credentials: { email: string; password: string }) => Promise<AuthUser>;
  logout: () => Promise<void>;
  isLoading: boolean;
  checkAuthStatus: () => Promise<void>;
  updateUserContext: (updatedUserData: Partial<AuthUser>) => void;
}

const AuthContext = createContext<AuthContextProps>({
  user: null,
  accessToken: null,
  login: async () => { throw new Error("Login function not implemented."); },
  logout: async () => {},
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
    setIsLoading(true);
    try {
      const response = await apiClient<AuthUser>("/auth/status");
      setUser(response);
      // Assuming role determines isAdmin for simplicity
      if (response) {
          setUser({ ...response, isAdmin: response.role === 'admin' });
      } else {
          setUser(null);
      }
    } catch (error) {
      console.warn("Auth status check failed or user not logged in:", error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  const login = async (credentials: { email: string; password: string }): Promise<AuthUser> => {
    try {
        const response = await apiClient<SignInResponse>("/auth/login", "POST", credentials);
        const loggedInUser: AuthUser = {
            id: response.user.user_id,
            role: response.user.role,
            isAdmin: response.user.role === 'admin',
            firstName: response.userdetails.firstName,
            middleName: response.userdetails.middleName,
            lastName: response.userdetails.lastName,
            email: response.userdetails.email,
            birthDate: response.userdetails.birthDate,
        };
        setUser(loggedInUser);
        setAccessToken(response.accessToken);
        router.push(loggedInUser.isAdmin ? "/admin" : "/library"); 
        return loggedInUser;
    } catch (error) {
      console.error("Login failed", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await apiClient("/auth/logout", "POST");
    } catch (error) {
      console.error("Logout API call failed (might be expected if session was already invalid):", error);
    } finally {
      setUser(null);
      setAccessToken(null);
      router.push("/signin");
    }
  };

  const updateUserContext = (updatedUserData: Partial<AuthUser>) => {
    setUser((currentUser) => {
      if (!currentUser) return null;
      const isAdmin = updatedUserData.isAdmin !== undefined ? updatedUserData.isAdmin : currentUser.isAdmin;
      return { ...currentUser, ...updatedUserData, isAdmin };
    });
  };

  const value: AuthContextProps = {
    user,
    accessToken,
    login,
    logout,
    isLoading,
    checkAuthStatus,
    updateUserContext,
  };

  return <AuthContext.Provider value={value}>{!isLoading ? children : <div className="flex min-h-screen items-center justify-center">Authenticating...</div>}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};