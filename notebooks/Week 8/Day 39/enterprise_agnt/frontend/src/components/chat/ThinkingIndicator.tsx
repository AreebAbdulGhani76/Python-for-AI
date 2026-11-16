'use client';

import React, { useEffect, useState } from 'react';
import { Bot } from 'lucide-react';

interface ThinkingIndicatorProps {
  startTime?: number;
}

export function ThinkingIndicator({ startTime = Date.now() }: ThinkingIndicatorProps) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTime) / 1000));
    }, 500);
    return () => clearInterval(timer);
  }, [startTime]);

  return (
    <div className="flex items-start gap-3.5 py-3 px-2 max-w-2xl animate-fade-in select-none">
      <div className="w-7 h-7 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-amber-500 border border-zinc-200 dark:border-zinc-700/60 flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
        <Bot className="w-4 h-4 animate-pulse" />
      </div>

      <div className="flex-1 space-y-1.5">
        <div className="flex items-center gap-2 text-xs font-semibold text-zinc-900 dark:text-zinc-100">
          <span>Xander Assistant</span>
          <span className="text-[11px] font-mono text-zinc-400 font-normal">
            ({elapsed}s)
          </span>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-xs text-zinc-600 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700/60">
          <span className="text-xs">Thinking</span>
          <div className="flex items-center gap-1">
            <span
              className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-bounce"
              style={{ animationDelay: '0ms' }}
            />
            <span
              className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-bounce"
              style={{ animationDelay: '150ms' }}
            />
            <span
              className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-bounce"
              style={{ animationDelay: '300ms' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
