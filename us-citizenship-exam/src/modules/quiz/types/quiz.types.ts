/**
 * Quiz module types
 */

import type { Question } from '@/core/types';

export type QuizMode = 'practice' | 'test';

export type ReviewFilter = 'all' | 'wrong' | 'starred';

export interface QuizConfig {
  questions: Question[];
  storageKey: string;
  mode: QuizMode;
}

export interface QuizState {
  currentIndex: number;
  submitted: boolean;
  reviewFilter: ReviewFilter;
  answeredQuestions: Set<string>;
}

export interface QuizScore {
  correct: number;
  total: number;
  percentage: number;
  passed: boolean;
}

export interface QuizStorageData {
  answers: Record<string, string>;
  answeredQuestions: string[];
}
