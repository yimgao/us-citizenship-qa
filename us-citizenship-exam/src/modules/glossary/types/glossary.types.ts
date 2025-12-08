/**
 * Glossary module types
 */

import type { Locale } from '@/core/types';

export interface GlossaryItem {
  id: string;
  term: {
    en: string;
    zh: string;
    es: string;
  };
  definitions: {
    en: string;
    zh: string;
    es: string;
  };
}

export interface GlossaryState {
  currentIndex: number;
  showDefinition: boolean;
  speakingLang: Locale | null;
}
