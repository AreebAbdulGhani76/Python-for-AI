'use client';

import React, { useState } from 'react';
import { ChatMessage } from '@/types/chat';
import { MarkdownContent } from './MarkdownContent';
import {
  Bot,
  Copy,
  Check,
  Wrench,
  ChevronDown,
  ChevronRight,
  AlertCircle,
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
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  // Human / User message
  if (message.role === 'human') {
    return (
      <div className="group flex justify-end py-1.5 px-2 animate-fade-in">
        <div className="flex flex-col items-end max-w-[85%] sm:max-w-[75%]">
          <div className="relative px-4 py-2.5 rounded-2xl rounded-br-xs bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100 text-sm leading-relaxed whitespace-pre-wrap selection:bg-amber-500/30">
            {message.content}
          </div>

          <div className="flex items-center gap-1 mt-1 text-[11px] text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={handleCopy}
              className="p-1 rounded hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"
              title="Copy message"
            >
              {copied ? (
                <Check className="w-3 h-3 text-emerald-500" />
              ) : (
                <Copy className="w-3 h-3" />
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Tool execution message (LangGraph ToolNode output)
  if (message.role === 'tool') {
    let formattedJson = message.content;
    let toolBadgeText = 'Agent Tool Activity';

    try {
      const parsed = JSON.parse(message.content);
      formattedJson = JSON.stringify(parsed, null, 2);
      if (Array.isArray(parsed)) {
        toolBadgeText = `fetch_menu: ${parsed.length} items returned`;
      } else if (typeof parsed === 'object' && parsed !== null) {
        if ('complaint_id' in parsed) {
          toolBadgeText = `log_complaint: Registered Complaint #${parsed.complaint_id}`;
        } else {
          toolBadgeText = 'Tool execution data';
        }
      }
    } catch {
      if (message.content === 'True') toolBadgeText = 'validate_order_id: Order Verified (True)';
      if (message.content === 'False') toolBadgeText = 'validate_order_id: Order Not Found (False)';
    }

    return (
      <div className="py-1 px-2 max-w-2xl animate-fade-in">
        <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 text-xs overflow-hidden">
          <button
            onClick={() => setToolExpanded(!toolExpanded)}
            className="w-full flex items-center justify-between px-3 py-2 text-left hover:bg-zinc-100 dark:hover:bg-zinc-800/60 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2 font-mono text-[11px] text-zinc-600 dark:text-zinc-400">
              <Wrench className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span className="font-medium text-zinc-800 dark:text-zinc-200">
                {toolBadgeText}
              </span>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-zinc-400">
              <span>{toolExpanded ? 'Hide' : 'Inspect'}</span>
              {toolExpanded ? (
                <ChevronDown className="w-3 h-3" />
              ) : (
                <ChevronRight className="w-3 h-3" />
              )}
            </div>
          </button>

          {toolExpanded && (
            <div className="px-3 pb-3 pt-1 border-t border-zinc-200 dark:border-zinc-800">
              <pre className="p-2.5 rounded bg-zinc-950 text-zinc-300 font-mono text-[11px] overflow-x-auto leading-relaxed max-h-56">
                <code>{formattedJson}</code>
              </pre>
            </div>
          )}
        </div>
      </div>
    );
  }

  // AI Assistant message
  return (
    <div className="group flex items-start gap-3.5 py-3 px-2 animate-fade-in">
      <div className="w-7 h-7 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-amber-500 border border-zinc-200 dark:border-zinc-700/60 flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
        <Bot className="w-4 h-4" />
      </div>

      <div className="flex-1 min-w-0 space-y-1">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
            Xander Assistant
          </span>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1 text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 px-1.5 py-0.5 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
            title="Copy response"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-emerald-500" />
                <span className="text-[11px] text-emerald-500">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                <span className="text-[11px]">Copy</span>
              </>
            )}
          </button>
        </div>

        {message.status === 'error' ? (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-sm">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{message.content}</span>
          </div>
        ) : (
          <div className="text-sm leading-relaxed text-zinc-800 dark:text-zinc-200 markdown-body">
            {message.content ? (
              <MarkdownContent content={message.content} />
            ) : (
              <span className="text-xs italic text-zinc-400">
                (Executing tools...)
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
