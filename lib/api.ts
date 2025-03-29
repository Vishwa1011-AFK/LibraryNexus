import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

interface ApiClientOptions extends RequestInit {}

export async function apiClient<T = any>(
    endpoint: string,
    method: string = 'GET',
    body?: any,
    options: ApiClientOptions = {}
): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;

    const fetchOptions: RequestInit = {
        method,
        credentials: 'include',
        headers: {
            ...(body && { 'Content-Type': 'application/json' }),
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
            let errorData;
            try {
                errorData = await response.json();
            } catch (e) {}

            const errorMessage = errorData?.error || errorData?.message || errorData?.msg || `HTTP error ${response.status}: ${response.statusText}`;
            throw new Error(errorMessage);
        }

        if (response.status === 204) {
            return undefined as T;
        }

        return await response.json();
    } catch (error) {
        console.error(`API Client Error (${method} ${endpoint}):`, error);
        throw error;
    }
}
