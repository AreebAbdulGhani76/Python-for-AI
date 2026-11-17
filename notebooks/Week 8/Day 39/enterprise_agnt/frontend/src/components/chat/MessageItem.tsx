'use client';

import React, { useState } from 'react';
import { ChatMessage } from '@/types/chat';
import { MarkdownContent } from './MarkdownContent';
import {
  AlertCircle,
  Bot,
  Check,
  ChevronDown,
  ChevronRight,
  Copy,
  Wrench,
} from 'lucide-react';

interface MessageItemProps {
  message: ChatMessage;
}

export function MessageItem({ message }: MessageItemProps) {
  const [copied, setCopied] = useState(false);
  const [toolExpanded, setToolExpanded] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch (error) {
      console.error('Could not copy message:', error);
    }
  };

  if (message.role === 'human') {
    return (
      <div className="message-user-row">
        <div className="message-user-wrap">
          <div className="message-user-bubble">{message.content}</div>
          <div className="message-user-tools">
            <button onClick={handleCopy} type="button" aria-label="Copy message" className="assistant-copy">
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (message.role === 'tool') {
    let formattedJson = message.content;
    let toolBadgeText = 'Assistant activity';

    try {
      const parsed = JSON.parse(message.content);
      formattedJson = JSON.stringify(parsed, null, 2);
      if (Array.isArray(parsed)) toolBadgeText = `Menu lookup · ${parsed.length} items`;
      else if (typeof parsed === 'object' && parsed !== null && 'complaint_id' in parsed) {
        toolBadgeText = `Complaint saved · #${parsed.complaint_id}`;
      } else if (typeof parsed === 'string') toolBadgeText = 'Offer lookup';
    } catch {
      if (message.content === 'True') toolBadgeText = 'Order ID verified';
      if (message.content === 'False') toolBadgeText = 'Order ID not found';
    }

    return (
      <div className="message-assistant-row">
        <div className="assistant-avatar"><Wrench className="h-4 w-4" /></div>
        <div className="tool-card">
          <button
            onClick={() => setToolExpanded(!toolExpanded)}
            type="button"
            aria-expanded={toolExpanded}
            className="tool-card-trigger"
          >
            <span className="tool-card-title"><Wrench className="h-3.5 w-3.5" />{toolBadgeText}</span>
            <span className="flex items-center gap-1 text-[10px]">
              {toolExpanded ? 'Hide details' : 'View details'}
              {toolExpanded ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
            </span>
          </button>
          {toolExpanded && <pre><code>{formattedJson}</code></pre>}
        </div>
      </div>
    );
  }

  return (
    <div className="message-assistant-row">
      <div className="assistant-avatar"><Bot className="h-[18px] w-[18px]" /></div>
      <div className="assistant-message">
        <div className="assistant-message-top">
          <span className="assistant-name">Xander Assistant</span>
          <button onClick={handleCopy} type="button" aria-label="Copy response" className="assistant-copy">
            {copied ? <span className="flex items-center gap-1"><Check className="h-3.5 w-3.5 text-emerald-600" />Copied</span> : <span className="flex items-center gap-1"><Copy className="h-3.5 w-3.5" />Copy</span>}
          </button>
        </div>
        {message.status === 'error' ? (
          <div className="flex items-start gap-2 rounded-xl border border-red-300/60 bg-red-50 px-3.5 py-3 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{message.content}</span>
          </div>
        ) : (
          <div className="message-body markdown-body">
            {message.content ? <MarkdownContent content={message.content} /> : <span className="italic text-[12px] text-zinc-400">Working on your request…</span>}
          </div>
        )}
      </div>
    </div>
  );
}
