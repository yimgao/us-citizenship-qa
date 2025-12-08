/**
 * Grammar module types
 * Migrated from lib/grammar.ts
 */

export type ExerciseType = 'fill-blank' | 'multiple-choice' | 'sentence-reorder' | 'correction';

export interface GrammarExample {
  sentence: string;
  translation: {
    en: string;
    es: string;
    zh: string;
  };
  highlight?: string;
}

export interface GrammarExercise {
  id: string;
  type: ExerciseType;
  question: string;
  options?: string[];
  answer: string | number;
  explanation: string;
}

export interface GrammarRule {
  id: string;
  title: {
    en: string;
    es: string;
    zh: string;
  };
  explanation: {
    en: string;
    es: string;
    zh: string;
  };
  examples: GrammarExample[];
  exercises: GrammarExercise[];
}

export interface GrammarTopic {
  id: string;
  name: {
    en: string;
    es: string;
    zh: string;
  };
  rules: GrammarRule[];
}

export interface GrammarData {
  topics: GrammarTopic[];
}
