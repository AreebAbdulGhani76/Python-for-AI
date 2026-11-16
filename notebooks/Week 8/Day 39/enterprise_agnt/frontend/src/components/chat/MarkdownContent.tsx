'use client';

import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Check, Copy } from 'lucide-react';

interface MarkdownContentProps {
  content: string;
}

export function MarkdownContent({ content }: MarkdownContentProps) {
  return (
    <div className="prose prose-sm dark:prose-invert max-w-none break-words leading-relaxed text-zinc-800 dark:text-zinc-200">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            const isInline = !match && !String(children).includes('\n');
            const codeString = String(children).replace(/\n$/, '');

            if (isInline) {
              return (
                <code
                  className="px-1.5 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800/80 font-mono text-[13px] text-amber-700 dark:text-amber-300 border border-zinc-200/60 dark:border-zinc-700/60"
                  {...props}
                >
                  {children}
                </code>
              );
            }

            return (
              <CodeBlock
                language={match ? match[1] : 'text'}
                code={codeString}
              />
            );
          },
          table({ children }) {
            return (
              <div className="my-3 overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 shadow-xs">
                <table className="w-full text-left text-sm border-collapse">
                  {children}
                </table>
              </div>
            );
          },
          thead({ children }) {
            return (
              <thead className="bg-zinc-50 dark:bg-zinc-800/60 border-b border-zinc-200 dark:border-zinc-800 text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
                {children}
              </thead>
            );
          },
          th({ children }) {
            return <th className="px-3.5 py-2.5 font-medium">{children}</th>;
          },
          td({ children }) {
            return (
              <td className="px-3.5 py-2.5 border-b border-zinc-100 dark:border-zinc-800/40 text-zinc-700 dark:text-zinc-300">
                {children}
              </td>
            );
          },
          ul({ children }) {
            return <ul className="my-2 ml-4 list-disc space-y-1">{children}</ul>;
          },
          ol({ children }) {
            return (
              <ol className="my-2 ml-4 list-decimal space-y-1">{children}</ol>
            );
          },
          li({ children }) {
            return <li className="pl-1">{children}</li>;
          },
          p({ children }) {
            return <p className="mb-2.5 last:mb-0">{children}</p>;
          },
          strong({ children }) {
            return (
              <strong className="font-semibold text-zinc-900 dark:text-zinc-100">
                {children}
              </strong>
            );
          },
          blockquote({ children }) {
            return (
              <blockquote className="my-2.5 border-l-2 border-amber-500/70 pl-3.5 italic text-zinc-600 dark:text-zinc-400 bg-amber-500/5 py-1 rounded-r-md">
                {children}
              </blockquote>
            );
          },
          h1({ children }) {
            return (
              <h1 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mt-4 mb-2">
                {children}
              </h1>
            );
          },
          h2({ children }) {
            return (
              <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 mt-3 mb-1.5">
                {children}
              </h2>
            );
          },
          h3({ children }) {
            return (
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mt-2 mb-1">
                {children}
              </h3>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

function CodeBlock({ language, code }: { language: string; code: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error('Failed to copy code:', e);
    }
  };

  return (
    <div className="relative my-3 rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-zinc-950 text-zinc-100 shadow-xs">
      <div className="flex items-center justify-between px-3.5 py-1.5 bg-zinc-900 border-b border-zinc-800/80 text-[11px] font-mono text-zinc-400">
        <span className="uppercase tracking-wider font-semibold text-amber-400/90">
          {language}
        </span>
        <button
          onClick={handleCopy}
          type="button"
          aria-label="Copy code to clipboard"
          className="flex items-center gap-1 px-2 py-0.5 rounded text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-emerald-400" />
              <span className="text-[11px] text-emerald-400 font-sans">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              <span className="text-[11px] font-sans">Copy</span>
            </>
          )}
        </button>
      </div>
      <pre className="p-3.5 overflow-x-auto text-[13px] leading-relaxed font-mono">
        <code>{code}</code>
      </pre>
    </div>
  );
}
