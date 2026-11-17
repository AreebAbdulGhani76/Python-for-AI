'use client';

import React, { useEffect, useState } from 'react';
import { Bot } from 'lucide-react';

interface ThinkingIndicatorProps {
  startTime?: number;
}

export function ThinkingIndicator({ startTime = Date.now() }: ThinkingIndicatorProps) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTime) / 1000));
    }, 500);
    return () => window.clearInterval(timer);
  }, [startTime]);

  return (
    <div className="thinking-row" aria-live="polite">
      <div className="assistant-avatar"><Bot className="h-[18px] w-[18px] animate-pulse" /></div>
      <div className="assistant-message">
        <div className="assistant-message-top">
          <span className="assistant-name">Xander Assistant</span>
          <span className="text-[10px] text-[var(--muted)]">{elapsed}s</span>
        </div>
        <div className="thinking-pill">
          <span>Finding the right answer</span>
          <span className="thinking-dots" aria-hidden="true"><span /><span /><span /></span>
        </div>
      </div>
    </div>
  );
}
