/**
 * Hook for calculating quiz progress and score
 */

'use client';

import { useMemo } from 'react';
import { PASS_THRESHOLD } from '@/core/constants';
import type { Question } from '@/core/types';
import type { QuizScore } from '../types/quiz.types';

export function useQuizProgress(
  questions: Question[],
  answers: Record<string, string>
): QuizScore {
  return useMemo(() => {
    let correct = 0;
    for (const q of questions) {
      const sel = answers[q.id];
      if (sel != null && Number(sel) === q.answer) {
        correct += 1;
      }
    }
    const total = questions.length;
    const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;
    const passed = correct >= PASS_THRESHOLD;

    return {
      correct,
      total,
      percentage,
      passed,
    };
  }, [questions, answers]);
}
