/**
 * Grammar service for loading grammar data
 * Migrated from lib/grammar.ts
 */

import type { Locale } from '@/core/types';
import type {
  GrammarData,
  GrammarTopic,
  GrammarRule,
  GrammarExercise,
  ExerciseType,
} from '../types/grammar.types';

// Removed unused importOptional function

async function loadAllGrammarData(locale: Locale): Promise<GrammarData> {
  const mod = await import(`@/data/grammar/${locale}/grammar.json`);
  return (mod.default ?? mod) as GrammarData;
}

export class GrammarService {
  /**
   * Load grammar data, optionally filtered by topic
   */
  static async loadGrammarData(
    locale: Locale,
    topicId?: string
  ): Promise<GrammarData | GrammarTopic> {
    const data = await loadAllGrammarData(locale);

    if (topicId) {
      const topic = data.topics.find((t) => t.id === topicId);
      if (!topic) {
        throw new Error(`Topic ${topicId} not found`);
      }
      return topic;
    }

    return data;
  }

  /**
   * Load a specific grammar rule by ID
   */
  static async loadGrammarRule(locale: Locale, ruleId: string): Promise<GrammarRule | null> {
    const data = await loadAllGrammarData(locale);

    for (const topic of data.topics) {
      const rule = topic.rules.find((r) => r.id === ruleId);
      if (rule) {
        return rule;
      }
    }

    return null;
  }

  /**
   * Load exercises, optionally filtered by topic and type
   */
  static async loadExercises(
    locale: Locale,
    topicId?: string,
    exerciseType?: ExerciseType
  ): Promise<GrammarExercise[]> {
    const data = await loadAllGrammarData(locale);

    const exercises: GrammarExercise[] = [];

    for (const topic of data.topics) {
      if (topicId && topic.id !== topicId) {
        continue;
      }

      for (const rule of topic.rules) {
        for (const exercise of rule.exercises) {
          if (exerciseType && exercise.type !== exerciseType) {
            continue;
          }
          exercises.push(exercise);
        }
      }
    }

    return exercises;
  }

  /**
   * Get all topics
   */
  static async getAllTopics(locale: Locale): Promise<GrammarTopic[]> {
    const data = await loadAllGrammarData(locale);
    return data.topics;
  }

  /**
   * Get all rules, optionally filtered by topic
   */
  static async getAllRules(locale: Locale, topicId?: string): Promise<GrammarRule[]> {
    const data = await loadAllGrammarData(locale);

    const rules: GrammarRule[] = [];

    for (const topic of data.topics) {
      if (topicId && topic.id !== topicId) {
        continue;
      }
      rules.push(...topic.rules);
    }

    return rules;
  }
}
