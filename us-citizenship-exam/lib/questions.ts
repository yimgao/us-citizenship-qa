/**
 * Backward compatibility adapter for question loading
 * Re-exports the new modular service implementation
 * @deprecated Use @/core/services/data/questionService instead
 */

// Re-export types for backward compatibility
export type { Locale, Question } from '@/core/types';

// Re-export functions from new service
import { QuestionService } from '@/core/services/data/questionService';
import type { Locale, Category, QuestionMode } from '@/core/types';
import type { Question } from '@/core/types';

export async function loadQuestions(
  locale: Locale,
  categoryKey: Category,
  mode: QuestionMode = 'trial'
): Promise<Question[]> {
  return QuestionService.loadQuestions(locale, categoryKey, mode);
}

export async function loadQuestionsPaged(
  locale: Locale,
  categoryKey: Category,
  offset: number,
  limit: number
): Promise<{ items: Question[]; total: number }> {
  return QuestionService.loadQuestionsPaged(locale, categoryKey, offset, limit);
}


