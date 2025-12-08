/**
 * Quiz-related constants
 */

import type { Locale } from '../types';

export const PASS_THRESHOLD = 12;

export const DEFAULT_QUESTION_COUNT = 10;

export const TEST_QUESTION_COUNT = 20;

export const CATEGORY_BY_LOCALE: Record<Locale, Record<'gov' | 'history' | 'civics', string>> = {
  en: {
    gov: 'American Government',
    history: 'American History',
    civics: 'Integrated Civics',
  },
  es: {
    gov: 'Gobierno Americano',
    history: 'Historia Americana',
    civics: 'Educación Cívica Integrada',
  },
  zh: {
    gov: '美国政府',
    history: '美国历史',
    civics: '综合公民',
  },
};
