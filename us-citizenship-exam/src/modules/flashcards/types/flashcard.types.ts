/**
 * Flashcard module types
 */

import type { Question } from '@/core/types';

export type Flashcard = Question; // Flashcard uses the same structure as Question

export type FlashcardFilter = 'all' | 'starred' | 'missed';

export interface FlashcardState {
  currentIndex: number;
  showAnswer: boolean;
  filter: FlashcardFilter;
}
