"use client"

import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api';
import { type User, type AuthUser } from '@/types';

interface AuthContextType {
    user: AuthUser | null;
    isLoading: boolean;
    accessToken: string | null;
    setAccessToken: (token: string | null) => void;
    login: (credentials: { email: string; password?: string }) => Promise<void>;
    logout: () => Promise<void>;
    fetchUser: () => Promise<void>;
    updateUserContext: (updatedUserData: Partial<AuthUser>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

let currentAccessToken: string | null = null;

export const getAccessToken = () => currentAccessToken;

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    const [accessTokenState, setAccessTokenState] = useState<string | null>(null);

    const setToken = useCallback((token: string | null) => {
        currentAccessToken = token;
        setAccessTokenState(token);
    }, []);


    const fetchUser = useCallback(async () => {
        if (!getAccessToken()) {
             setUser(null);
             setIsLoading(false);
             return;
        }
        setIsLoading(true);
        try {
            const userData = await apiClient<AuthUser>('/users/me', 'GET');
            setUser({ ...userData, isAdmin: userData.role === 'admin' });
        } catch (error: any) {
            if (error.message?.includes('401') || error.message?.includes('Unauthorized')) {
                 console.log("fetchUser failed, attempting refresh or logging out");
                 setUser(null);
                 setToken(null);
            } else {
                 console.error("Failed to fetch user:", error);
                 setUser(null);
                 setToken(null);
            }
        } finally {
            setIsLoading(false);
        }
    }, [setToken]);


    const login = async (credentials: { email: string; password?: string }) => {
        setIsLoading(true);
        try {
            const response = await apiClient<{ accessToken: string; user: User, userdetails: User }>(
                '/auth/signin',
                'POST',
                credentials
            );
            setToken(response.accessToken);
            const userData = response.userdetails || response.user;
            setUser({ ...userData, isAdmin: response.user.role === 'admin' });
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
            setToken(null);
            setUser(null);
            console.error("Login failed:", error);
            throw error;
        }
    };

    const logout = async () => {
        setIsLoading(true);
        try {
            await apiClient('/auth/logout', 'POST');
        } catch (error) {
            console.error("Logout API call failed:", error);
        } finally {
            setToken(null);
            setUser(null);
            setIsLoading(false);
             router.push('/signin');
             console.log("User logged out, redirecting...");
        }
    };

    const updateUserContext = (updatedUserData: Partial<AuthUser>) => {
        setUser(prevUser => {
            if (!prevUser) return null;
            return { ...prevUser, ...updatedUserData };
        });
    };

    useEffect(() => {
        const tryRefreshAndFetch = async () => {
            setIsLoading(true);
            try {
                const response = await apiClient<{ accessToken: string }>('/auth/token', 'POST');
                setToken(response.accessToken);
                await fetchUser();
            } catch (error) {
                console.log("Initial token refresh failed or no session.", error);
                setToken(null);
                setUser(null);
            } finally {
                 setIsLoading(false);
            }
        };
        tryRefreshAndFetch();
    }, [setToken]);

    return (
        <AuthContext.Provider value={{ user, isLoading, accessToken: accessTokenState, setAccessToken: setToken, login, logout, fetchUser, updateUserContext }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}