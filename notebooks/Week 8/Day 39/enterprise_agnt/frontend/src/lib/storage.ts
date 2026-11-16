import { ChatSession } from '@/types/chat';

const SESSIONS_STORAGE_KEY = 'xander_chat_sessions_v1';
const CURRENT_SESSION_KEY = 'xander_current_session_id';

/**
 * Generate a new random session ID
 */
export function generateSessionId(): string {
  const timestamp = Date.now().toString(36);
  const randomSuffix = Math.random().toString(36).substring(2, 8);
  return `session_${timestamp}_${randomSuffix}`;
}

/**
 * Get all saved sessions from localStorage
 */
export function getSavedSessions(): ChatSession[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(SESSIONS_STORAGE_KEY);
    if (!raw) return [];
    const sessions = JSON.parse(raw);
    return Array.isArray(sessions) ? sessions : [];
  } catch (e) {
    console.error('Failed to parse sessions from localStorage:', e);
    return [];
  }
}

/**
 * Save sessions to localStorage
 */
export function saveSessions(sessions: ChatSession[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(sessions));
  } catch (e) {
    console.error('Failed to save sessions to localStorage:', e);
  }
}

/**
 * Get the current active session ID, or create a new one
 */
export function getActiveSessionId(): string {
  if (typeof window === 'undefined') return generateSessionId();
  try {
    const current = localStorage.getItem(CURRENT_SESSION_KEY);
    if (current && current.trim()) {
      return current;
    }
  } catch (e) {
    console.error('Failed to read current session ID:', e);
  }

  const newId = generateSessionId();
  setActiveSessionId(newId);
  return newId;
}

/**
 * Set the current active session ID
 */
export function setActiveSessionId(sessionId: string): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(CURRENT_SESSION_KEY, sessionId);
  } catch (e) {
    console.error('Failed to set current session ID:', e);
  }
}

/**
 * Upsert a session's metadata (e.g. after a message is sent)
 */
export function upsertSession(
  sessionId: string,
  previewText?: string,
  suggestedTitle?: string
): ChatSession {
  const sessions = getSavedSessions();
  const existingIndex = sessions.findIndex((s) => s.id === sessionId);

  const now = Date.now();
  let session: ChatSession;

  if (existingIndex >= 0) {
    const existing = sessions[existingIndex];
    session = {
      ...existing,
      updatedAt: now,
      lastMessage: previewText || existing.lastMessage,
      title: suggestedTitle || existing.title,
      messageCount: (existing.messageCount || 0) + 1,
    };
    sessions[existingIndex] = session;
  } else {
    // Generate an intelligent title from previewText
    const autoTitle = suggestedTitle || generateTitleFromText(previewText) || 'New Conversation';
    session = {
      id: sessionId,
      title: autoTitle,
      createdAt: now,
      updatedAt: now,
      lastMessage: previewText,
      messageCount: 1,
    };
    sessions.unshift(session);
  }

  // Sort by updatedAt descending
  sessions.sort((a, b) => b.updatedAt - a.updatedAt);
  saveSessions(sessions);
  return session;
}

/**
 * Delete a session
 */
export function deleteSession(sessionId: string): ChatSession[] {
  const sessions = getSavedSessions().filter((s) => s.id !== sessionId);
  saveSessions(sessions);
  return sessions;
}

/**
 * Generate a neat title from the first message
 */
export function generateTitleFromText(text?: string): string {
  if (!text) return 'New Conversation';
  const clean = text.trim().replace(/^["']|["']$/g, '');
  if (!clean) return 'New Conversation';

  // Capitalize first letter and cut at 32 chars
  const firstSentence = clean.split('\n')[0].split(/[.?!]/)[0];
  const trimmed = firstSentence.trim();
  if (trimmed.length > 35) {
    return trimmed.substring(0, 32).trim() + '...';
  }
  return trimmed || 'New Conversation';
}
