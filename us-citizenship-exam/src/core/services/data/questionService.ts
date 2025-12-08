/**
 * Question service for loading and managing questions
 * Refactored from lib/questions.ts with improved type safety
 */

import type { Locale, Category, QuestionMode } from '../../types';
import type { Question, PagedQuestionsResult } from '../../types';
import { CATEGORY_BY_LOCALE, TEST_QUESTION_COUNT, DEFAULT_QUESTION_COUNT } from '../../constants';

/**
 * Shuffle array using Fisher-Yates algorithm
 */
function shuffle<T>(items: T[]): T[] {
  const arr = items.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Sample random items from array
 */
function sampleRandom(items: Question[], count: number): Question[] {
  return shuffle(items).slice(0, Math.min(count, items.length));
}

/**
 * Try to import a module, returning null if it fails
 */
async function importOptional<T>(path: string): Promise<T | null> {
  // Try exact path first
  try {
    const mod: unknown = await import(/* @vite-ignore */ path);
    if (mod && typeof mod === 'object' && 'default' in (mod as Record<string, unknown>)) {
      const d = (mod as { default?: unknown }).default;
      return (d as T) ?? null;
    }
  } catch {}
  // If JSON not found, try corresponding TS module (gov.ts etc.)
  if (path.endsWith('.json')) {
    const alt = path.replace(/\.json$/, '.ts');
    try {
      const mod: unknown = await import(/* @vite-ignore */ alt);
      if (mod && typeof mod === 'object' && 'default' in (mod as Record<string, unknown>)) {
        const d = (mod as { default?: unknown }).default;
        return (d as T) ?? null;
      }
    } catch {}
  }
  return null;
}

/**
 * Load all questions for a locale
 */
async function loadAllQuestions(locale: Locale): Promise<Question[]> {
  // Prefer per-category files if they exist to enable smaller loads in the future
  try {
    const [gov, history, civics] = await Promise.all([
      importOptional<Question[]>(`@/data/questions/${locale}/gov.json`),
      importOptional<Question[]>(`@/data/questions/${locale}/history.json`),
      importOptional<Question[]>(`@/data/questions/${locale}/civics.json`),
    ]);
    if (gov && history && civics && Array.isArray(gov) && Array.isArray(history) && Array.isArray(civics)) {
      return [...gov, ...history, ...civics];
    }
  } catch {}
  // Fallback to single data.json
  try {
    const mod = await import(`@/data/questions/${locale}/data.json`);
    const data = (mod.default ?? mod) as Question[] | Question;
    // Handle both array and object formats
    if (Array.isArray(data)) {
      return data;
    }
    // If it's an object with a questions property
    if (data && typeof data === 'object' && 'questions' in data && Array.isArray((data as { questions: Question[] }).questions)) {
      return (data as { questions: Question[] }).questions;
    }
    return [];
  } catch {
    return [];
  }
}

/**
 * Question Service
 * Provides methods for loading questions with different configurations
 */
export class QuestionService {
  /**
   * Load questions based on locale, category, and mode
   * Maintains compatibility with lib/questions.ts API
   *
   * @param locale - The locale for questions (en, es, zh)
   * @param categoryKey - The category to filter by (gov, history, civics, all)
   * @param mode - The question mode (trial, test, all)
   * @returns Promise resolving to an array of questions
   *
   * @example
   * ```typescript
   * const questions = await QuestionService.loadQuestions('en', 'gov', 'trial');
   * ```
   */
  static async loadQuestions(
    locale: Locale,
    categoryKey: Category,
    mode: QuestionMode = 'trial'
  ): Promise<Question[]> {
    const all = await loadAllQuestions(locale);

    if (mode === 'test') {
      // Official test: balanced across categories (~1/3 each)
      const map = CATEGORY_BY_LOCALE[locale];
      const perCat: Record<'gov' | 'history' | 'civics', Question[]> = {
        gov: all.filter((q) => q.category === map.gov),
        history: all.filter((q) => q.category === map.history),
        civics: all.filter((q) => q.category === map.civics),
      };
      const targetTotal = TEST_QUESTION_COUNT;
      const base = Math.floor(targetTotal / 3); // 6 each
      let remainder = targetTotal - base * 3; // 2 remainder
      const picked: Question[] = [];
      (['gov', 'history', 'civics'] as const).forEach((k) => {
        picked.push(...sampleRandom(perCat[k], base));
      });
      const order: Array<'gov' | 'history' | 'civics'> = ['gov', 'history', 'civics'];
      let idx = 0;
      while (remainder > 0) {
        const k = order[idx % order.length];
        const pool = perCat[k].filter((q) => !picked.find((p) => p.id === q.id));
        const add = sampleRandom(pool, 1);
        picked.push(...add);
        idx++;
        remainder--;
      }
      return shuffle(picked);
    }

    if (categoryKey === 'all') {
      return mode === 'all' ? all : sampleRandom(all, DEFAULT_QUESTION_COUNT);
    }

    const target = CATEGORY_BY_LOCALE[locale][categoryKey];
    const filtered = all.filter((q) => q.category === target);
    return mode === 'all' ? filtered : sampleRandom(filtered, DEFAULT_QUESTION_COUNT);
  }

  /**
   * Load questions with pagination
   */
  static async loadQuestionsPaged(
    locale: Locale,
    categoryKey: Category,
    offset: number,
    limit: number
  ): Promise<PagedQuestionsResult> {
    const all = await loadAllQuestions(locale);
    if (categoryKey === 'all') {
      return { items: all.slice(offset, offset + limit), total: all.length };
    }
    const target = CATEGORY_BY_LOCALE[locale][categoryKey];
    const filtered = all.filter((q) => q.category === target);
    return { items: filtered.slice(offset, offset + limit), total: filtered.length };
  }

  /**
   * Load all questions for a locale
   *
   * @param locale - The locale for questions (en, es, zh)
   * @returns Promise resolving to all questions for the locale
   *
   * @example
   * ```typescript
   * const allQuestions = await QuestionService.loadAllQuestions('en');
   * ```
   */
  static async loadAllQuestions(locale: Locale): Promise<Question[]> {
    return loadAllQuestions(locale);
  }
}
