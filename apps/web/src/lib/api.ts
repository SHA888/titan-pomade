import { toast } from 'sonner';

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

    throw new ApiError(
      errorData.message || response.statusText,
      response.status,
      errorData
    );
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

  const config: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    credentials,
    signal,
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';
    const url = `${baseUrl}${endpoint}`;
    const response = await fetch(url, config);
    return await handleResponse<T>(response);
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

// Example API methods
export const api = {
  get: <T>(endpoint: string, options?: Omit<RequestOptions, 'method'>) =>
    apiRequest<T>(endpoint, { ...options, method: 'GET' }),

  post: <T>(
    endpoint: string,
    body?: unknown,
    options?: Omit<RequestOptions, 'method' | 'body'>
  ) => apiRequest<T>(endpoint, { ...options, method: 'POST', body }),

  put: <T>(
    endpoint: string,
    body?: unknown,
    options?: Omit<RequestOptions, 'method' | 'body'>
  ) => apiRequest<T>(endpoint, { ...options, method: 'PUT', body }),

  patch: <T>(
    endpoint: string,
    body?: unknown,
    options?: Omit<RequestOptions, 'method' | 'body'>
  ) => apiRequest<T>(endpoint, { ...options, method: 'PATCH', body }),

  delete: <T>(endpoint: string, options?: Omit<RequestOptions, 'method'>) =>
    apiRequest<T>(endpoint, { ...options, method: 'DELETE' }),
};
