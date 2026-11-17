'use client';

import React, { useState, useEffect } from 'react';
import { ChatSession } from '@/types/chat';
import { useTheme } from '@/context/ThemeContext';
import {
  MessageSquare,
  Moon,
  PanelLeftClose,
  Plus,
  Search,
  Sparkles,
  Sun,
  Trash2,
} from 'lucide-react';

interface SidebarProps {
  sessions: ChatSession[];
  activeSessionId: string;
  onSelectSession: (sessionId: string) => void;
  onNewSession: () => void;
  onDeleteSession: (sessionId: string) => void;
  isOpen: boolean;
  onClose: () => void;
  backendOnline: boolean;
}

export function Sidebar({
  sessions,
  activeSessionId,
  onSelectSession,
  onNewSession,
  onDeleteSession,
  isOpen,
  onClose,
  backendOnline,
}: SidebarProps) {
  const { theme, toggleTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => setIsClient(true), []);

  const filteredSessions = sessions.filter((session) => {
    const query = searchQuery.trim().toLowerCase();
    return !query || session.title.toLowerCase().includes(query) ||
      (session.lastMessage && session.lastMessage.toLowerCase().includes(query)) ||
      session.id.toLowerCase().includes(query);
  });

  const now = isClient ? Date.now() : 0;
  const day = 24 * 60 * 60 * 1000;
  const today = isClient ? filteredSessions.filter((session) => now - session.updatedAt < day) : filteredSessions;
  const week = isClient ? filteredSessions.filter((session) => now - session.updatedAt >= day && now - session.updatedAt < 7 * day) : [];
  const older = isClient ? filteredSessions.filter((session) => now - session.updatedAt >= 7 * day) : [];

  const selectSession = (id: string) => {
    onSelectSession(id);
    if (window.innerWidth < 1024) onClose();
  };

  return (
    <>
      {isOpen && <div onClick={onClose} className="sidebar-backdrop lg:hidden" />}

      <aside className={`app-sidebar ${isOpen ? 'is-open' : ''}`} aria-label="Chat history">
        <div className="sidebar-top">
          <div className="brand-lockup">
            <div className="brand-mark"><Sparkles className="h-[18px] w-[18px]" /></div>
            <div>
              <p className="brand-name">Xander</p>
              <p className="brand-caption">Restaurant concierge</p>
            </div>
          </div>
          <button onClick={onClose} type="button" aria-label="Close chat history" className="sidebar-action lg:hidden">
            <PanelLeftClose className="h-4 w-4" />
          </button>
        </div>

        <button
          onClick={() => {
            onNewSession();
            if (window.innerWidth < 1024) onClose();
          }}
          type="button"
          className="sidebar-new-chat"
        >
          <span className="sidebar-new-icon"><Plus className="h-4 w-4" /></span>
          <span className="sidebar-new-copy"><strong>Start a new chat</strong><span>A fresh table, whenever you like</span></span>
        </button>

        {sessions.length > 1 && (
          <div className="sidebar-search">
            <Search className="h-3.5 w-3.5" />
            <input
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Find a conversation"
              aria-label="Search conversations"
            />
          </div>
        )}

        <div className="sidebar-history">
          {filteredSessions.length === 0 ? (
            <div className="sidebar-empty">{searchQuery ? 'No conversations match that search.' : 'Your conversations will be saved here.'}</div>
          ) : (
            <>
              {today.length > 0 && <SessionSection title="Today" sessions={today} activeSessionId={activeSessionId} onSelectSession={selectSession} onDeleteSession={onDeleteSession} />}
              {week.length > 0 && <SessionSection title="Previous 7 days" sessions={week} activeSessionId={activeSessionId} onSelectSession={selectSession} onDeleteSession={onDeleteSession} />}
              {older.length > 0 && <SessionSection title="Earlier" sessions={older} activeSessionId={activeSessionId} onSelectSession={selectSession} onDeleteSession={onDeleteSession} />}
            </>
          )}
        </div>

        <div className="sidebar-footer">
          <button onClick={toggleTheme} type="button" className="theme-toggle">
            <span className="theme-toggle-label">
              {theme === 'dark' ? <Moon className="h-3.5 w-3.5" /> : <Sun className="h-3.5 w-3.5 text-amber-300" />}
              Appearance
            </span>
            <span className="theme-value">{theme}</span>
          </button>
          <div className="backend-indicator">
            <span className="backend-label"><span className={`status-dot ${backendOnline ? 'online' : 'offline'}`} />Assistant service</span>
            <span>{backendOnline ? 'Connected' : 'Offline'}</span>
          </div>
        </div>
      </aside>
    </>
  );
}

function SessionSection({
  title,
  sessions,
  activeSessionId,
  onSelectSession,
  onDeleteSession,
}: {
  title: string;
  sessions: ChatSession[];
  activeSessionId: string;
  onSelectSession: (id: string) => void;
  onDeleteSession: (id: string) => void;
}) {
  return (
    <section className="sidebar-section">
      <h2 className="sidebar-section-title">{title}</h2>
      {sessions.map((session) => (
        <div
          key={session.id}
          className={`sidebar-session ${session.id === activeSessionId ? 'active' : ''}`}
        >
          <button
            onClick={() => onSelectSession(session.id)}
            type="button"
            aria-current={session.id === activeSessionId ? 'page' : undefined}
            className="sidebar-session-select"
          >
            <span className="sidebar-session-label"><MessageSquare className="h-3.5 w-3.5" /><span>{session.title}</span></span>
          </button>
          <button
            onClick={(event) => {
              event.stopPropagation();
              onDeleteSession(session.id);
            }}
            type="button"
            aria-label={`Delete ${session.title}`}
            title="Delete conversation"
            className="sidebar-delete"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      ))}
    </section>
  );
}
