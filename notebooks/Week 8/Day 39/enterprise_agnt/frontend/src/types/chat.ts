export type MessageRole = 'human' | 'ai' | 'tool' | 'system';

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: number;
  status?: 'pending' | 'complete' | 'error';
  toolName?: string;
  error?: string;
}

export interface ChatSession {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  lastMessage?: string;
  messageCount?: number;
}

export interface ChatPayload {
  query: string;
  session_id: string;
}

export interface ChatApiResponse {
  session_id: string;
  response: string;
}

export interface RawHistoryMessage {
  role: string;
  content: string;
}

export interface HistoryApiResponse {
  session_id: string;
  messages: RawHistoryMessage[];
}

export interface BackendHealthResponse {
  status: 'ok' | 'error';
  message: string;
  backendUrl: string;
  timestamp: number;
}
