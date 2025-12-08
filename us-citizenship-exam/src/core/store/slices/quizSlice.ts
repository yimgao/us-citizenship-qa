/**
 * Quiz slice for Zustand store
 * Manages quiz-related state including answers, starred items, and incorrect answers
 */

import type { StateCreator } from 'zustand';
import { StorageService } from '../../services/storage/storageService';

export interface QuizSlice {
  // Answers
  answersByQuestionId: Record<string, string>;
  setAnswer: (questionId: string, answer: string) => void;
  setAllAnswers: (map: Record<string, string>) => void;
  reset: () => void;

  // Starred questions
  starredIds: Set<string>;
  toggleStar: (id: string) => void;
  isStarred: (id: string) => boolean;

  // Incorrect answers tracking
  lastIncorrectIds: Set<string>;
  setIncorrect: (ids: string[]) => void;
}

const STARRED_IDS_KEY = 'starredIds';
const LAST_INCORRECT_IDS_KEY = 'lastIncorrectIds';

/**
 * Load starred IDs from localStorage
 */
function loadStarredIds(): Set<string> {
  if (typeof window === 'undefined') {
    return new Set<string>();
  }
  const ids = StorageService.getItem<string[]>(STARRED_IDS_KEY, []);
  return new Set(ids ?? []);
}

/**
 * Load last incorrect IDs from localStorage
 */
function loadLastIncorrectIds(): Set<string> {
  if (typeof window === 'undefined') {
    return new Set<string>();
  }
  const ids = StorageService.getItem<string[]>(LAST_INCORRECT_IDS_KEY, []);
  return new Set(ids ?? []);
}

/**
 * Save starred IDs to localStorage
 */
function saveStarredIds(ids: Set<string>): void {
  StorageService.setItem(STARRED_IDS_KEY, Array.from(ids));
}

/**
 * Save last incorrect IDs to localStorage
 */
function saveLastIncorrectIds(ids: Set<string>): void {
  StorageService.setItem(LAST_INCORRECT_IDS_KEY, Array.from(ids));
}

export const createQuizSlice: StateCreator<QuizSlice> = (set, get) => ({
  // Answers
  answersByQuestionId: {},
  setAnswer: (questionId, answer) =>
    set((state) => ({
      answersByQuestionId: { ...state.answersByQuestionId, [questionId]: answer },
    })),
  setAllAnswers: (map) => set({ answersByQuestionId: map }),
  reset: () => set({ answersByQuestionId: {} }),

  // Starred questions
  starredIds: loadStarredIds(),
  toggleStar: (id) =>
    set((state) => {
      const next = new Set(state.starredIds);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      saveStarredIds(next);
      return { starredIds: next };
    }),
  isStarred: (id) => get().starredIds.has(id),

  // Incorrect answers tracking
  lastIncorrectIds: loadLastIncorrectIds(),
  setIncorrect: (ids) => {
    const s = new Set(ids);
    saveLastIncorrectIds(s);
    set({ lastIncorrectIds: s });
  },
});
