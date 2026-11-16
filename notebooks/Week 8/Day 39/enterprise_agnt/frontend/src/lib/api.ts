import { ChatApiResponse, HistoryApiResponse, BackendHealthResponse } from '@/types/chat';

export class ApiError extends Error {
  status?: number;
  detail?: string;

  constructor(message: string, status?: number, detail?: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.detail = detail;
  }
}

/**
 * Send a chat message to the FastAPI / LangGraph agent backend
 */
export async function sendChatMessage(
  query: string,
  sessionId: string
): Promise<ChatApiResponse> {
  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        session_id: sessionId,
      }),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new ApiError(
        data.detail || `Server error (${res.status})`,
        res.status,
        data.detail
      );
    }

    return data as ChatApiResponse;
  } catch (error: unknown) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(
      (error as Error)?.message || 'Failed to communicate with AI agent'
    );
  }
}

/**
 * Fetch historical messages for a given session from FastAPI backend
 */
export async function fetchChatHistory(
  sessionId: string
): Promise<HistoryApiResponse> {
  try {
    const res = await fetch(`/api/history?session_id=${encodeURIComponent(sessionId)}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
      cache: 'no-store',
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new ApiError(
        data.detail || `Failed to fetch history (${res.status})`,
        res.status,
        data.detail
      );
    }

    return data as HistoryApiResponse;
  } catch (error: unknown) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(
      (error as Error)?.message || 'Failed to load conversation history'
    );
  }
}

/**
 * Check backend health status
 */
export async function checkBackendStatus(): Promise<BackendHealthResponse> {
  try {
    const res = await fetch('/api/health', {
      cache: 'no-store',
    });
    const data = await res.json();
    return data;
  } catch (err: unknown) {
    return {
      status: 'error',
      message: (err as Error)?.message || 'Backend is currently offline',
      backendUrl: process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000',
      timestamp: Date.now(),
    };
  }
}
