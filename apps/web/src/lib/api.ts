import { toast } from 'sonner';

// Token management
const TOKEN_KEY = 'auth_tokens';

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

const getTokens = (): AuthTokens | null => {
  if (typeof window === 'undefined') return null;
  const tokens = localStorage.getItem(TOKEN_KEY);
  return tokens ? JSON.parse(tokens) : null;
};

const setTokens = (tokens: AuthTokens): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(TOKEN_KEY, JSON.stringify(tokens));
  }
};

const clearTokens = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(TOKEN_KEY);
  }
};

// API base URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  body?: unknown;
  headers?: HeadersInit;
  credentials?: RequestCredentials;
  signal?: AbortSignal;
};

export class ApiError extends Error {
  status: number;
  details?: unknown;

  constructor(message: string, status: number, details?: unknown) {
    super(message);
    this.status = status;
    this.details = details;
    this.name = 'ApiError';
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let errorData;
    try {
      errorData = await response.json().catch(() => ({}));
    } catch {
      errorData = { message: 'An unknown error occurred' };
    }

    throw new ApiError(errorData.message || response.statusText, response.status, errorData);
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return undefined as unknown as T;
  }

  return response.json() as Promise<T>;
}

export async function apiRequest<T = void>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { method = 'GET', body, headers = {}, credentials = 'same-origin', signal } = options;

  // Get tokens for the request
  const tokens = getTokens();
  const authHeaders: HeadersInit = {};

  // Add authorization header if we have a token
  if (tokens?.accessToken) {
    authHeaders['Authorization'] = `Bearer ${tokens.accessToken}`;
  }

  const config: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders,
      ...headers,
    },
    credentials,
    signal,
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  try {
    return fetch(`${API_URL}${endpoint}`, config)
      .then(async (response) => {
        // Handle token refresh if 401 and we have a refresh token
        if (response.status === 401 && tokens?.refreshToken) {
          try {
            const newTokens = await refreshAuthToken(tokens.refreshToken);
            if (newTokens) {
              // Update the Authorization header with the new token
              config.headers = {
                ...config.headers,
                Authorization: `Bearer ${newTokens.accessToken}`,
              };
              // Retry the original request
              return fetch(`${API_URL}${endpoint}`, config).then(handleResponse<T>);
            }
          } catch {
            // If refresh fails, clear tokens and redirect to login
            clearTokens();
            if (typeof window !== 'undefined') {
              window.location.href = '/auth/login';
            }
            throw new Error('Session expired. Please log in again.');
          }
        }
        return handleResponse<T>(response);
      })
      .catch((error) => {
        if (error instanceof ApiError) {
          // Handle specific error statuses
          if (error.status === 401) {
            // Only redirect if we actually had a session
            if (tokens?.accessToken || tokens?.refreshToken) {
              clearTokens();
              if (typeof window !== 'undefined') {
                window.location.href = '/auth/login';
              }
            }
            // For guests, just propagate without noisy toast
            return Promise.reject(error);
          } else if (error.status === 429) {
            // Too Many Requests — surface a mild toast
            toast.error('You are making requests too quickly. Please wait a moment.');
          } else if (error.status >= 500) {
            toast.error('Server error. Please try again later.');
          } else {
            toast.error(error.message || 'An error occurred');
          }
        } else {
          toast.error('Network error. Please check your connection.');
        }
        throw error;
      });
  } catch (error) {
    if (error instanceof ApiError) {
      // Show error toast for client-side errors (400-499)
      if (error.status >= 400 && error.status < 500) {
        toast.error(error.message);
      } else {
        console.error('API Error:', error);
      }
    } else {
      console.error('Network error:', error);
      toast.error('Network error. Please check your connection.');
    }
    throw error;
  }
}

// Auth token refresh function
async function refreshAuthToken(refreshToken: string): Promise<AuthTokens | null> {
  try {
    const response = await fetch(`${API_URL}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      throw new Error('Failed to refresh token');
    }

    const tokens = await response.json();
    setTokens(tokens);
    return tokens;
  } catch {
    clearTokens();
    return null;
  }
}

// Export token helpers for use in AuthContext and other modules
export { getTokens, setTokens, clearTokens };

// Example API methods
export const api = {
  get: <T>(endpoint: string, options?: Omit<RequestOptions, 'method'>) =>
    apiRequest<T>(endpoint, { ...options, method: 'GET' }),

  post: <T>(endpoint: string, body?: unknown, options?: Omit<RequestOptions, 'method' | 'body'>) =>
    apiRequest<T>(endpoint, { ...options, method: 'POST', body }),

  put: <T>(endpoint: string, body?: unknown, options?: Omit<RequestOptions, 'method' | 'body'>) =>
    apiRequest<T>(endpoint, { ...options, method: 'PUT', body }),

  patch: <T>(endpoint: string, body?: unknown, options?: Omit<RequestOptions, 'method' | 'body'>) =>
    apiRequest<T>(endpoint, { ...options, method: 'PATCH', body }),

  delete: <T>(endpoint: string, options?: Omit<RequestOptions, 'method'>) =>
    apiRequest<T>(endpoint, { ...options, method: 'DELETE' }),
};
