/**
 * Question-related types
 */

import type { Locale, Category, QuestionMode } from './common.types';

export interface Question {
  id: string;
  category: string;
  text: string;
  options: string[];
  answer: number;
}

export interface QuestionCategory {
  gov: string;
  history: string;
  civics: string;
}

export interface QuestionServiceConfig {
  locale: Locale;
  category: Category;
  mode: QuestionMode;
}

export interface PagedQuestionsResult {
  items: Question[];
  total: number;
}
