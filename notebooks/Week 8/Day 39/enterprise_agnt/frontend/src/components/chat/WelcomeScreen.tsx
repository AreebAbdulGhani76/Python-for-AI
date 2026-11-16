'use client';

import React from 'react';
import { Utensils, ReceiptText, ShieldAlert, Sparkles, HelpCircle } from 'lucide-react';

interface WelcomeScreenProps {
  onSelectPrompt: (prompt: string) => void;
}

const STARTERS = [
  {
    icon: Utensils,
    title: 'Explore Menu',
    subtitle: 'Fetch today\'s food menu and available specialties',
    prompt: 'Hi, what is on the menu today?',
  },
  {
    icon: ReceiptText,
    title: 'Item Pricing (PKR)',
    subtitle: 'Check burger, sandwich, and biryani prices in Rupees',
    prompt: 'What are the prices of your burgers and sandwiches in PKR?',
  },
  {
    icon: ShieldAlert,
    title: 'Validate Order ID',
    subtitle: 'Verify whether order ID OR-1045 is registered',
    prompt: 'Can you check if order ID OR-1045 is valid?',
  },
  {
    icon: HelpCircle,
    title: 'Customer Complaint',
    subtitle: 'Report a delayed or incorrect food delivery',
    prompt: 'I want to lodge a complaint regarding my recent order.',
  },
];

export function WelcomeScreen({ onSelectPrompt }: WelcomeScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[65vh] max-w-2xl mx-auto px-4 py-12 text-center animate-fade-in select-none">
      {/* Brand Icon */}
      <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-800/90 border border-zinc-200 dark:border-zinc-700/80 text-amber-500 flex items-center justify-center mb-5 shadow-xs">
        <Sparkles className="w-5 h-5" />
      </div>

      <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 mb-2.5">
        How can I help you today?
      </h1>

      <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-md mb-8 leading-relaxed">
        Xander Restaurant Customer Support, powered by our LangGraph AI agent and SQLite order registry.
      </p>

      {/* Starter cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full text-left">
        {STARTERS.map((starter, i) => {
          const Icon = starter.icon;
          return (
            <button
              key={i}
              onClick={() => onSelectPrompt(starter.prompt)}
              className="group p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all text-left shadow-2xs hover:shadow-xs cursor-pointer active:scale-[0.99]"
            >
              <div className="flex items-center gap-2.5 mb-1.5">
                <div className="w-7 h-7 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 flex items-center justify-center shrink-0 group-hover:text-amber-500 transition-colors">
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-amber-500 transition-colors">
                  {starter.title}
                </span>
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed pl-9">
                {starter.subtitle}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
