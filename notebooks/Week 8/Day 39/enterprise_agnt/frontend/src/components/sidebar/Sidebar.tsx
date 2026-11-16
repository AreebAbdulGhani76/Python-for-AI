'use client';

import React, { useState, useEffect } from 'react';
import { ChatSession } from '@/types/chat';
import { useTheme } from '@/context/ThemeContext';
import {
  SquarePen,
  MessageSquare,
  Trash2,
  Sun,
  Moon,
  Search,
  PanelLeftClose,
  Sparkles,
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

  useEffect(() => {
    setIsClient(true);
  }, []);

  const filteredSessions = sessions.filter((s) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      s.title.toLowerCase().includes(q) ||
      (s.lastMessage && s.lastMessage.toLowerCase().includes(q)) ||
      s.id.toLowerCase().includes(q)
    );
  });

  // Time groupings
  const now = isClient ? Date.now() : 0;
  const oneDay = 24 * 60 * 60 * 1000;
  const sevenDays = 7 * oneDay;

  const todaySessions = isClient
    ? filteredSessions.filter((s) => now - s.updatedAt < oneDay)
    : filteredSessions;
  const weekSessions = isClient
    ? filteredSessions.filter(
        (s) => now - s.updatedAt >= oneDay && now - s.updatedAt < sevenDays
      )
    : [];
  const olderSessions = isClient
    ? filteredSessions.filter((s) => now - s.updatedAt >= sevenDays)
    : [];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/50 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static top-0 bottom-0 left-0 z-50 w-64 md:w-72 bg-zinc-950 text-zinc-300 border-r border-zinc-800/70 flex flex-col transition-transform duration-200 ease-in-out shrink-0 select-none ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Top Header / Brand */}
        <div className="h-14 px-4 flex items-center justify-between border-b border-zinc-800/60">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-zinc-800 border border-zinc-700/80 flex items-center justify-center text-amber-400">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-semibold tracking-tight text-zinc-100">
                Xander AI
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-zinc-800 text-zinc-400 font-medium">
                Agent
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => {
                onNewSession();
                if (window.innerWidth < 1024) onClose();
              }}
              title="New chat (Ctrl+K)"
              className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
            >
              <SquarePen className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              title="Close sidebar"
              className="lg:hidden p-1.5 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
            >
              <PanelLeftClose className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Search */}
        {sessions.length > 2 && (
          <div className="px-3 pt-3 pb-1">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search chats..."
                className="w-full pl-8 pr-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-200 placeholder:text-zinc-500 focus:outline-hidden focus:border-zinc-700 transition-colors"
              />
            </div>
          </div>
        )}

        {/* Sessions list */}
        <div className="flex-1 overflow-y-auto px-2 py-3 space-y-4">
          {filteredSessions.length === 0 ? (
            <div className="text-center py-10 px-3 text-xs text-zinc-500">
              {searchQuery ? 'No chats found' : 'No chat history yet'}
            </div>
          ) : (
            <>
              {todaySessions.length > 0 && (
                <SessionSection
                  title="Today"
                  sessions={todaySessions}
                  activeSessionId={activeSessionId}
                  onSelectSession={(id) => {
                    onSelectSession(id);
                    if (window.innerWidth < 1024) onClose();
                  }}
                  onDeleteSession={onDeleteSession}
                />
              )}

              {weekSessions.length > 0 && (
                <SessionSection
                  title="Previous 7 Days"
                  sessions={weekSessions}
                  activeSessionId={activeSessionId}
                  onSelectSession={(id) => {
                    onSelectSession(id);
                    if (window.innerWidth < 1024) onClose();
                  }}
                  onDeleteSession={onDeleteSession}
                />
              )}

              {olderSessions.length > 0 && (
                <SessionSection
                  title="Older"
                  sessions={olderSessions}
                  activeSessionId={activeSessionId}
                  onSelectSession={(id) => {
                    onSelectSession(id);
                    if (window.innerWidth < 1024) onClose();
                  }}
                  onDeleteSession={onDeleteSession}
                />
              )}
            </>
          )}
        </div>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-zinc-800/60 bg-zinc-950/80 space-y-2">
          {/* Theme switcher */}
          <button
            onClick={toggleTheme}
            className="w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 transition-colors"
          >
            <span className="flex items-center gap-2">
              {theme === 'dark' ? (
                <Moon className="w-3.5 h-3.5" />
              ) : (
                <Sun className="w-3.5 h-3.5 text-amber-400" />
              )}
              <span>Theme</span>
            </span>
            <span className="text-[11px] font-mono capitalize px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400">
              {theme}
            </span>
          </button>

          {/* Backend status indicator */}
          <div className="flex items-center justify-between px-2.5 py-1.5 text-[11px] text-zinc-500 font-mono">
            <span className="flex items-center gap-2">
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  backendOnline ? 'bg-emerald-500' : 'bg-rose-500'
                }`}
              />
              <span>FastAPI Backend</span>
            </span>
            <span>{backendOnline ? '8000 Online' : 'Offline'}</span>
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
    <div className="space-y-0.5">
      <h4 className="px-2.5 py-1 text-[11px] font-medium text-zinc-500 tracking-wider">
        {title}
      </h4>
      {sessions.map((session) => {
        const isActive = session.id === activeSessionId;
        return (
          <div
            key={session.id}
            onClick={() => onSelectSession(session.id)}
            className={`group relative flex items-center justify-between px-2.5 py-2 rounded-lg text-xs cursor-pointer transition-colors ${
              isActive
                ? 'bg-zinc-800/90 text-zinc-100 font-medium'
                : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200'
            }`}
          >
            <div className="flex items-center gap-2 min-w-0 flex-1 pr-2">
              <MessageSquare className="w-3.5 h-3.5 shrink-0 opacity-60" />
              <span className="truncate">{session.title}</span>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onDeleteSession(session.id);
              }}
              title="Delete conversation"
              className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-zinc-700/80 text-zinc-400 hover:text-rose-400 transition-all shrink-0"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
