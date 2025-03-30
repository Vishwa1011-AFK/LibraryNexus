import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { getAccessToken } from "@/context/auth-context";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

interface ApiClientOptions extends RequestInit {}

let isRefreshing = false;
let failedQueue: Array<{ resolve: (value: any) => void, reject: (reason?: any) => void }> = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

async function refreshToken(): Promise<string | null> {
    try {
        console.log("Attempting token refresh...");
        const response = await fetch(`${API_BASE_URL}/auth/token`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
             const errorData = await response.json().catch(() => ({}));
             console.error("Token refresh failed:", response.status, errorData);
             throw new Error(errorData.error || 'Token refresh failed');
        }

        const data = await response.json();
        const newAccessToken = data.accessToken;
        console.log("Token refreshed successfully.");
        return newAccessToken;

    } catch (error) {
        console.error("Error during token refresh:", error);
        return null;
    }
}


export async function apiClient<T = any>(
    endpoint: string,
    method: string = 'GET',
    body?: any,
    options: ApiClientOptions = {},
    isRetry: boolean = false
): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = getAccessToken();

    const fetchOptions: RequestInit = {
        method,
        credentials: 'include',
        headers: {
            ...(body && { 'Content-Type': 'application/json' }),
            ...(token && { 'Authorization': `Bearer ${token}` }),
            ...options.headers,
        },
        ...options,
    };

    if (body) {
        fetchOptions.body = JSON.stringify(body);
    }

    try {
        const response = await fetch(url, fetchOptions);

        if (!response.ok) {
            const status = response.status;
            const errorData = await response.json().catch(() => ({}));

            if (status === 401 && errorData.error === "Unauthorized - Access Token expired" && !isRefreshing && !isRetry) {
                 console.log("Access token expired, initiating refresh...");
                 isRefreshing = true;

                 return new Promise((resolve, reject) => {
                     refreshToken().then(newAccessToken => {
                         if (newAccessToken) {
                             console.log("Retrying original request with new token...");
                             apiClient<T>(endpoint, method, body, {
                                 ...options,
                                 headers: {
                                     ...(body && { 'Content-Type': 'application/json' }),
                                     ...options.headers,
                                     'Authorization': `Bearer ${newAccessToken}`
                                 }
                             }, true)
                             .then(resolve)
                             .catch(reject);

                         } else {
                            console.error("Token refresh failed, cannot retry request.");
                            reject(new Error("Session expired. Please log in again."));
                         }
                     }).catch(refreshError => {
                         console.error("Error in refreshToken promise:", refreshError);
                         reject(new Error("Session refresh failed. Please log in again."));
                     }).finally(() => {
                          isRefreshing = false;
                     });
                 });

            } else if (status === 401 && isRetry) {
                 console.error("Retry request failed with 401. Logging out.");
                  throw new Error(errorData.error || "Authentication failed after retry.");
            }

             const errorMessage = errorData?.error || errorData?.message || errorData?.msg || `HTTP error ${status}: ${response.statusText}`;
             console.error(`API Client Error (${method} ${endpoint}): Status ${status}`, errorMessage, errorData);
            const error = new Error(errorMessage) as any;
             error.status = status;
             error.data = errorData;
            throw error;
        }

        if (response.status === 204) {
            return undefined as T;
        }

        const contentType = response.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
            return await response.json();
        } else {
             return await response.text() as T;
        }

    } catch (error) {
        if (!(error instanceof Error && (error as any).status)) {
             console.error(`API Client Network/Fetch Error (${method} ${endpoint}):`, error);
        }
        throw error;
    }
}