'use client';

import React, { useRef, useEffect } from 'react';
import { ArrowUp, Loader2, CornerDownLeft } from 'lucide-react';

interface MessageComposerProps {
  input: string;
  setInput: (value: string) => void;
  onSend: (text: string) => void;
  isLoading: boolean;
  disabled?: boolean;
}

export function MessageComposer({
  input,
  setInput,
  onSend,
  isLoading,
  disabled = false,
}: MessageComposerProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = 'auto';
    textarea.style.height = `${Math.min(180, Math.max(52, textarea.scrollHeight))}px`;
  }, [input]);

  const handleSubmit = () => {
    if (!input.trim() || isLoading || disabled) return;
    onSend(input.trim());
    setInput('');
    if (textareaRef.current) textareaRef.current.style.height = '52px';
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSubmit();
    }
  };

  const canSend = input.trim().length > 0 && !isLoading && !disabled;

  return (
    <div className="composer-dock">
      <div className="composer-wrap">
        <div className="composer-surface">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about the menu, an order, or anything else…"
            disabled={isLoading || disabled}
            rows={1}
            aria-label="Message Xander Restaurant Assistant"
            className="composer-input"
          />
          <div className="composer-footer">
            <div className="composer-hint">
              <CornerDownLeft className="h-3.5 w-3.5" />
              <span>Enter to send · Shift + Enter for a new line</span>
            </div>
            <button
              onClick={handleSubmit}
              disabled={!canSend}
              type="button"
              aria-label="Send message"
              className="send-button"
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowUp className="h-[18px] w-[18px] stroke-[2.4]" />}
            </button>
          </div>
        </div>
        <p className="composer-caption">Xander Restaurant Assistant · Menu prices in PKR</p>
      </div>
    </div>
  );
}
