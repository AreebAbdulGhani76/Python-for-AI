'use client';

import React, { useState } from 'react';
import { Check, Copy, PanelLeft, Plus, RefreshCw } from 'lucide-react';

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
    if (!sessionId) return;
    try {
      await navigator.clipboard.writeText(sessionId);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch (error) {
      console.error('Could not copy session ID:', error);
    }
  };

  return (
    <header className="chat-header">
      <div className="header-left">
        <button
          onClick={onToggleSidebar}
          type="button"
          aria-label="Toggle chat history"
          className="icon-button"
        >
          <PanelLeft className="h-[17px] w-[17px]" />
        </button>

        <div className="header-title-wrap">
          <p className="header-eyebrow">Xander · Restaurant concierge</p>
          <div className="header-title-row">
            <h1 className="header-title">{sessionTitle || 'New conversation'}</h1>
            {sessionId && (
              <button
                onClick={handleCopy}
                type="button"
                title="Copy session ID"
                className="session-chip"
              >
                <span>{sessionId.slice(-8)}</span>
                {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="header-actions">
        <div className="header-status" title={backendOnline ? 'Connected to the restaurant assistant' : 'Backend disconnected'}>
          <span className={`status-dot ${backendOnline ? 'online' : 'offline'}`} />
          <span>{backendOnline ? 'Assistant ready' : 'Offline'}</span>
        </div>

        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          type="button"
          aria-label="Refresh conversation"
          title="Refresh conversation"
          className="icon-button"
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
        </button>

        <button onClick={onNewChat} type="button" className="primary-button">
          <Plus className="h-4 w-4" />
          <span>New chat</span>
        </button>
      </div>
    </header>
  );
}
