'use client';

import { useMemo } from 'react';
import FlashcardViewer from './FlashcardViewer';
import type { Question, Locale } from '@/lib/questions';

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

function getDueCardIds(): Set<string> {
  try {
    const raw = localStorage.getItem('flashcard-difficulty');
    if (!raw) return new Set();
    const records: DifficultyRecord[] = JSON.parse(raw);
    const now = Date.now();
    const due = new Set<string>();
    for (const r of records) {
      const interval = REVIEW_INTERVALS[r.difficulty] ?? REVIEW_INTERVALS.hard;
      if (now - r.timestamp >= interval) {
        due.add(r.cardId);
      }
    }
    return due;
  } catch {
    return new Set();
  }
}

function getDifficultyCounts(): Record<string, number> {
  try {
    const raw = localStorage.getItem('flashcard-difficulty');
    if (!raw) return { total: 0, due: 0 };
    const records: DifficultyRecord[] = JSON.parse(raw);
    const now = Date.now();
    let due = 0;
    for (const r of records) {
      const interval = REVIEW_INTERVALS[r.difficulty] ?? REVIEW_INTERVALS.hard;
      if (now - r.timestamp >= interval) {
        due++;
      }
    }
    return { total: records.length, due };
  } catch {
    return { total: 0, due: 0 };
  }
}

export function useDueCardCount(): number {
  return useMemo(() => getDifficultyCounts().due, []);
}

export function useDueCardIds(): Set<string> {
  return useMemo(() => getDueCardIds(), []);
}

interface DifficultyFilterWrapperProps {
  questions: Question[];
  locale: Locale;
  totalCount: number;
  difficultyFilter?: string;
}

export default function DifficultyFilterWrapper({
  questions,
  locale,
  totalCount,
  difficultyFilter,
}: DifficultyFilterWrapperProps) {
  const filteredQuestions = useMemo(() => {
    if (difficultyFilter !== 'due') return questions;
    const dueIds = getDueCardIds();
    return questions.filter((q) => dueIds.has(q.id));
  }, [questions, difficultyFilter]);

  return (
    <FlashcardViewer
      questions={filteredQuestions}
      locale={locale}
      totalCount={difficultyFilter === 'due' ? filteredQuestions.length : totalCount}
    />
  );
}
