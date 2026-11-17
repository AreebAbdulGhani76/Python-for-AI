'use client';

import React from 'react';
import {
  ArrowUpRight,
  MessageSquareText,
  ReceiptText,
  ShieldCheck,
  Sparkles,
  Tag,
  Utensils,
} from 'lucide-react';

interface WelcomeScreenProps {
  onSelectPrompt: (prompt: string) => void;
}

const STARTERS = [
  {
    icon: Utensils,
    title: 'Browse the menu',
    subtitle: 'See what is cooking and compare prices',
    prompt: 'Hi, what is on the menu today?',
  },
  {
    icon: Tag,
    title: 'See today’s offer',
    subtitle: 'Ask about the current restaurant deal',
    prompt: 'What offer do you have today?',
  },
  {
    icon: ShieldCheck,
    title: 'Check an order',
    subtitle: 'Verify an order ID with our team',
    prompt: 'Can you check if order ID OR-1045 is valid?',
  },
  {
    icon: MessageSquareText,
    title: 'Talk to support',
    subtitle: 'Get help with a recent restaurant order',
    prompt: 'I want to lodge a complaint regarding my recent order.',
  },
];

export function WelcomeScreen({ onSelectPrompt }: WelcomeScreenProps) {
  return (
    <section className="welcome-screen">
      <div className="welcome-content">
        <div className="welcome-mark" aria-hidden="true">
          <Sparkles className="h-6 w-6" />
        </div>

        <p className="welcome-eyebrow">A little help, served fresh</p>
        <h2 className="welcome-title">
          Good food starts
          <br />
          with a <span>good question.</span>
        </h2>
        <p className="welcome-copy">
          Ask about the menu, your order, or anything you need from Xander. We’re here to make it easy.
        </p>

        <div className="offer-card">
          <div className="offer-copy">
            <div className="offer-label">
              <Tag className="h-3.5 w-3.5" />
              Today at Xander
            </div>
            <p className="offer-title">Buy 2 Zinger and get one Club Sandwich Free</p>
          </div>
          <div className="offer-tag">
            <span>Ask us about it</span>
            <ArrowUpRight className="h-4 w-4" />
          </div>
        </div>

        <div className="w-full">
          <p className="starter-heading">A few good places to start</p>
          <div className="starter-grid">
            {STARTERS.map((starter) => {
              const Icon = starter.icon;
              return (
                <button
                  key={starter.title}
                  onClick={() => onSelectPrompt(starter.prompt)}
                  type="button"
                  className="starter-card"
                >
                  <span className="starter-icon"><Icon className="h-4 w-4" /></span>
                  <span>
                    <span className="starter-title">{starter.title}</span>
                    <span className="starter-subtitle">{starter.subtitle}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
