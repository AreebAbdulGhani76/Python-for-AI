'use client';

import React, { useRef, useEffect } from 'react';
import { ArrowUp, Loader2 } from 'lucide-react';

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

  // Auto-resize textarea height
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = 'auto';
    const newHeight = Math.min(textarea.scrollHeight, 180);
    textarea.style.height = `${Math.max(48, newHeight)}px`;
  }, [input]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    if (!input.trim() || isLoading || disabled) return;
    onSend(input.trim());
    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = '48px';
    }
  };

  const canSend = input.trim().length > 0 && !isLoading && !disabled;

  return (
    <div className="w-full max-w-3xl mx-auto px-4 pb-4 pt-1">
      <div className="relative flex flex-col rounded-2xl border border-zinc-200 dark:border-zinc-700/70 bg-white dark:bg-zinc-800/90 shadow-md shadow-black/5 dark:shadow-black/25 focus-within:border-zinc-400 dark:focus-within:border-zinc-500 focus-within:ring-2 focus-within:ring-zinc-400/10 transition-all overflow-hidden">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Message Xander Restaurant Assistant..."
          disabled={isLoading || disabled}
          rows={1}
          className="w-full resize-none bg-transparent px-4 py-3.5 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-hidden disabled:opacity-50 min-h-[48px] max-h-[180px] leading-relaxed"
        />

        <div className="flex items-center justify-between px-3.5 pb-2.5 pt-1 text-[11px] text-zinc-400">
          <div className="flex items-center gap-1.5 text-[11px] text-zinc-400 dark:text-zinc-500 font-mono">
            <span>Shift + Enter for new line</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSubmit}
              disabled={!canSend}
              type="button"
              aria-label="Send message"
              className={`flex items-center justify-center w-8 h-8 rounded-full transition-all ${
                canSend
                  ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 hover:scale-105 active:scale-95 shadow-sm cursor-pointer'
                  : 'bg-zinc-100 dark:bg-zinc-700/60 text-zinc-300 dark:text-zinc-500 cursor-not-allowed'
              }`}
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin text-amber-500" />
              ) : (
                <ArrowUp className="w-4 h-4 stroke-[2.5]" />
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="text-center mt-2.5">
        <p className="text-[11px] text-zinc-400 dark:text-zinc-500 select-none">
          Xander Restaurant Assistant • Prices in PKR • Validates order IDs OR-1045 to OR-1047
        </p>
      </div>
    </div>
  );
}
