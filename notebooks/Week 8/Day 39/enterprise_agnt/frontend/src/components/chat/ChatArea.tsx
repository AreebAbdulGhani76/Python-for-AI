'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage, ChatSession } from '@/types/chat';
import {
  sendChatMessage,
  fetchChatHistory,
  checkBackendStatus,
  ApiError,
} from '@/lib/api';
import {
  getActiveSessionId,
  setActiveSessionId,
  getSavedSessions,
  upsertSession,
  deleteSession,
  generateSessionId,
} from '@/lib/storage';
import { ChatHeader } from './ChatHeader';
import { MessageItem } from './MessageItem';
import { ThinkingIndicator } from './ThinkingIndicator';
import { MessageComposer } from './MessageComposer';
import { WelcomeScreen } from './WelcomeScreen';
import { Sidebar } from '../sidebar/Sidebar';
import { ArrowDown, AlertTriangle } from 'lucide-react';

export function ChatArea() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionIdState] = useState<string>('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [backendOnline, setBackendOnline] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [thinkingStartTime, setThinkingStartTime] = useState<number>(0);
  const [isUserScrolledUp, setIsUserScrolledUp] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Initialize session and load sessions list
  useEffect(() => {
    const saved = getSavedSessions();
    setSessions(saved);

    const initialSessionId = getActiveSessionId();
    setActiveSessionIdState(initialSessionId);

    // Initial check of backend health
    checkBackendStatus()
      .then((res) => {
        setBackendOnline(res.status === 'ok');
      })
      .catch(() => {
        setBackendOnline(false);
      });

    // Load initial history for active session
    loadHistory(initialSessionId);
  }, []);

  // Poll backend health periodically
  useEffect(() => {
    const interval = setInterval(() => {
      checkBackendStatus()
        .then((res) => {
          setBackendOnline(res.status === 'ok');
        })
        .catch(() => {
          setBackendOnline(false);
        });
    }, 25000);
    return () => clearInterval(interval);
  }, []);

  // Keyboard shortcut Ctrl+K / Cmd+K for new chat
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        handleNewSession();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Track scroll position to show scroll-to-bottom button
  const handleScroll = () => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const distanceToBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight;
    setIsUserScrolledUp(distanceToBottom > 160);
  };

  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  // Scroll to bottom when messages change or loading begins
  useEffect(() => {
    if (!isUserScrolledUp) {
      scrollToBottom('smooth');
    }
  }, [messages, isLoading]);

  // Load history from FastAPI backend
  const loadHistory = async (sessionId: string) => {
    setIsRefreshing(true);
    try {
      const data = await fetchChatHistory(sessionId);
      if (data && Array.isArray(data.messages)) {
        const mappedMessages: ChatMessage[] = data.messages
          .filter((m) => m.content && m.content.trim().length > 0)
          .map((m, index) => ({
            id: `${sessionId}_hist_${index}`,
            role: m.role as any,
            content: m.content,
            timestamp: Date.now() - (data.messages.length - index) * 1000,
            status: 'complete',
          }));
        setMessages(mappedMessages);
      } else {
        setMessages([]);
      }
      setBackendOnline(true);
    } catch (err: unknown) {
      console.warn('Failed to load history from backend:', err);
      setMessages([]);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Select another session
  const handleSelectSession = (sessionId: string) => {
    if (sessionId === activeSessionId) return;
    setActiveSessionId(sessionId);
    setActiveSessionIdState(sessionId);
    loadHistory(sessionId);
  };

  // Create a brand new session
  const handleNewSession = () => {
    const newSessionId = generateSessionId();
    setActiveSessionId(newSessionId);
    setActiveSessionIdState(newSessionId);
    setMessages([]);
  };

  // Delete a session
  const handleDeleteSession = (sessionId: string) => {
    const updated = deleteSession(sessionId);
    setSessions(updated);

    if (sessionId === activeSessionId) {
      if (updated.length > 0) {
        handleSelectSession(updated[0].id);
      } else {
        handleNewSession();
      }
    }
  };

  // Send message handler
  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessageText = text.trim();
    const currentSession = activeSessionId || generateSessionId();
    if (!activeSessionId) {
      setActiveSessionId(currentSession);
      setActiveSessionIdState(currentSession);
    }

    const userMsg: ChatMessage = {
      id: `user_${Date.now()}`,
      role: 'human',
      content: userMessageText,
      timestamp: Date.now(),
      status: 'complete',
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);
    setThinkingStartTime(Date.now());
    setIsUserScrolledUp(false);

    try {
      const responseData = await sendChatMessage(userMessageText, currentSession);

      const aiMsg: ChatMessage = {
        id: `ai_${Date.now()}`,
        role: 'ai',
        content: responseData.response || '',
        timestamp: Date.now(),
        status: 'complete',
      };

      setMessages((prev) => [...prev, aiMsg]);

      // Save / update session in localStorage
      upsertSession(currentSession, userMessageText);
      setSessions(getSavedSessions());

      // Sync backend history to capture any tool messages
      try {
        const refreshedHistory = await fetchChatHistory(currentSession);
        if (refreshedHistory && Array.isArray(refreshedHistory.messages)) {
          const hasToolMessages = refreshedHistory.messages.some(
            (m) => m.role === 'tool'
          );
          if (hasToolMessages) {
            const mapped: ChatMessage[] = refreshedHistory.messages.map(
              (m, idx) => ({
                id: `${currentSession}_sync_${idx}`,
                role: m.role as any,
                content: m.content,
                timestamp: Date.now(),
                status: 'complete',
              })
            );
            setMessages(mapped);
          }
        }
      } catch (historySyncErr) {
        console.warn('Silent sync error:', historySyncErr);
      }
    } catch (err: unknown) {
      console.error('Chat error:', err);
      const errorMsg =
        (err as ApiError)?.detail ||
        (err as Error)?.message ||
        'Failed to get a response from the agent.';

      const errorAiMsg: ChatMessage = {
        id: `error_${Date.now()}`,
        role: 'ai',
        content: `Error: ${errorMsg}`,
        timestamp: Date.now(),
        status: 'error',
      };

      setMessages((prev) => [...prev, errorAiMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const currentSessionObj = sessions.find((s) => s.id === activeSessionId);
  const activeTitle = currentSessionObj?.title || 'New Conversation';

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-white dark:bg-[#18181b] text-zinc-900 dark:text-zinc-100 font-sans">
      {/* Sidebar navigation */}
      <Sidebar
        sessions={sessions}
        activeSessionId={activeSessionId}
        onSelectSession={handleSelectSession}
        onNewSession={handleNewSession}
        onDeleteSession={handleDeleteSession}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        backendOnline={backendOnline}
      />

      {/* Main chat column */}
      <div className="flex-1 flex flex-col h-full min-w-0 bg-white dark:bg-[#18181b] relative">
        {/* Header */}
        <ChatHeader
          sessionTitle={activeTitle}
          sessionId={activeSessionId}
          backendOnline={backendOnline}
          isRefreshing={isRefreshing}
          onRefresh={() => loadHistory(activeSessionId)}
          onNewChat={handleNewSession}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />

        {/* Offline backend banner */}
        {!backendOnline && (
          <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-2 text-xs text-amber-700 dark:text-amber-400 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400" />
              <span>
                FastAPI backend offline at <code className="font-mono">http://localhost:8000</code>.
              </span>
            </div>
            <button
              onClick={() => checkBackendStatus().then((r) => setBackendOnline(r.status === 'ok'))}
              className="text-xs font-medium underline hover:text-amber-800 dark:hover:text-amber-300 ml-4 shrink-0"
            >
              Retry Connection
            </button>
          </div>
        )}

        {/* Messages viewport */}
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto px-4 py-6 space-y-4 relative scroll-smooth"
        >
          {messages.length === 0 ? (
            <WelcomeScreen onSelectPrompt={handleSendMessage} />
          ) : (
            <div className="max-w-3xl mx-auto space-y-4 pb-8">
              {messages.map((message) => (
                <MessageItem key={message.id} message={message} />
              ))}

              {isLoading && (
                <ThinkingIndicator startTime={thinkingStartTime} />
              )}

              <div ref={messagesEndRef} className="h-4" />
            </div>
          )}
        </div>

        {/* Scroll to bottom button */}
        {isUserScrolledUp && (
          <button
            onClick={() => scrollToBottom('smooth')}
            aria-label="Scroll to bottom"
            className="absolute bottom-24 right-8 p-2 rounded-full bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 shadow-lg hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-all z-20 cursor-pointer"
          >
            <ArrowDown className="w-4 h-4" />
          </button>
        )}

        {/* Message Composer */}
        <MessageComposer
          input={input}
          setInput={setInput}
          onSend={handleSendMessage}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
