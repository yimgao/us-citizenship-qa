/**
 * Hook for managing quiz storage persistence
 */

'use client';

import { useEffect } from 'react';
import { StorageService } from '@/core/services/storage/storageService';
import type { QuizStorageData } from '../types/quiz.types';

export function useQuizStorage(
  storageKey: string,
  answers: Record<string, string>,
  onLoad: (data: QuizStorageData) => void
) {
  // Load persisted answers on mount
  useEffect(() => {
    const stored = StorageService.getItem<QuizStorageData>(`${storageKey}:answers`);
    if (stored) {
      onLoad({
        answers: stored.answers || {},
        answeredQuestions: Object.keys(stored.answers || {}),
      });
    }
  }, [storageKey, onLoad]);

  // Persist answers on change
  useEffect(() => {
    StorageService.setItem(`${storageKey}:answers`, {
      answers,
      answeredQuestions: Object.keys(answers),
    });
  }, [storageKey, answers]);
}
