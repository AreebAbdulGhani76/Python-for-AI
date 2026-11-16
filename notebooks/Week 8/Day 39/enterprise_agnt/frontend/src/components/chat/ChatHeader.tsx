'use client';

import React, { useState } from 'react';
import {
  PanelLeft,
  RotateCw,
  Copy,
  Check,
  Plus,
  Sparkles,
} from 'lucide-react';

interface ChatHeaderProps {
  sessionTitle: string;
  sessionId: string;
  backendOnline: boolean;
  isRefreshing: boolean;
  onRefresh: () => void;
  onNewChat: () => void;
  onToggleSidebar: () => void;
}

export function ChatHeader({
  sessionTitle,
  sessionId,
  backendOnline,
  isRefreshing,
  onRefresh,
  onNewChat,
  onToggleSidebar,
}: ChatHeaderProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(sessionId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <header className="h-14 px-4 flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800/80 bg-white/80 dark:bg-zinc-900/70 backdrop-blur-md sticky top-0 z-20 shrink-0 select-none">
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onToggleSidebar}
          type="button"
          aria-label="Toggle sidebar"
          className="p-2 -ml-1 rounded-lg text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
        >
          <PanelLeft className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 min-w-0">
          <div className="flex items-center gap-1.5 font-medium text-sm text-zinc-900 dark:text-zinc-100">
            <span className="truncate max-w-[200px] sm:max-w-xs md:max-w-md">
              {sessionTitle || 'New Conversation'}
            </span>
          </div>

          <button
            onClick={handleCopy}
            title={`Session ID: ${sessionId} (Click to copy)`}
            className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-[11px] font-mono text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300 border border-zinc-200 dark:border-zinc-700/60 transition-colors"
          >
            <span className="truncate max-w-[80px]">{sessionId}</span>
            {copied ? (
              <Check className="w-3 h-3 text-emerald-500" />
            ) : (
              <Copy className="w-2.5 h-2.5 opacity-60" />
            )}
          </button>
        </div>
      </div>

      <div className="flex items-center gap-1.5">
        {/* Backend health status badge */}
        <div
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono border transition-all ${
            backendOnline
              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400'
              : 'bg-rose-500/10 border-rose-500/20 text-rose-600 dark:text-rose-400'
          }`}
          title={
            backendOnline
              ? 'Connected to FastAPI (http://localhost:8000)'
              : 'Backend disconnected. Ensure FastAPI is running.'
          }
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              backendOnline ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'
            }`}
          />
          <span className="hidden sm:inline">
            {backendOnline ? 'FastAPI Online' : 'Offline'}
          </span>
        </div>

        {/* Sync from backend history */}
        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          type="button"
          aria-label="Sync history"
          title="Sync with backend history"
          className="p-2 rounded-lg text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors disabled:opacity-50"
        >
          <RotateCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-amber-500' : ''}`} />
        </button>

        {/* New Chat */}
        <button
          onClick={onNewChat}
          type="button"
          aria-label="New chat"
          title="New conversation"
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-white text-xs font-medium transition-all shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">New Chat</span>
        </button>
      </div>
    </header>
  );
}
