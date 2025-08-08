/**
 * Type-safe error handling utilities for API responses
 */

interface ApiError extends Error {
  response?: {
    data?: {
      message?: string;
    };
  };
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    const apiError = error as ApiError;

    if (apiError.response?.data?.message && typeof apiError.response.data.message === 'string') {
      return apiError.response.data.message;
    }

    return error.message || 'An unexpected error occurred';
  }

  return typeof error === 'string' ? error : 'An unknown error occurred';
}
