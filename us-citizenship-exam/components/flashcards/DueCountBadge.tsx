'use client';

import { useState, useEffect } from 'react';

interface DifficultyRecord {
  cardId: string;
  difficulty: 'easy' | 'medium' | 'hard';
  timestamp: number;
}

const REVIEW_INTERVALS: Record<string, number> = {
  easy: 7 * 24 * 60 * 60 * 1000,
  medium: 3 * 24 * 60 * 60 * 1000,
  hard: 1 * 24 * 60 * 60 * 1000,
};

function getDueCount(): number {
  try {
    const raw = localStorage.getItem('flashcard-difficulty');
    if (!raw) return 0;
    const records: DifficultyRecord[] = JSON.parse(raw);
    const now = Date.now();
    let due = 0;
    for (const r of records) {
      const interval = REVIEW_INTERVALS[r.difficulty] ?? REVIEW_INTERVALS.hard;
      if (now - r.timestamp >= interval) {
        due++;
      }
    }
    return due;
  } catch {
    return 0;
  }
}

export default function DueCountBadge() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    setCount(getDueCount());
    // Refresh count on focus since localStorage might change
    const handleFocus = () => setCount(getDueCount());
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  if (count === 0) return null;

  return (
    <span className="ml-1.5 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-danger px-1.5 text-[11px] font-bold text-white leading-none">
      {count}
    </span>
  );
}
