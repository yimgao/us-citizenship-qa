import type { Locale } from './questions';

export type ExerciseType = 'fill-blank' | 'multiple-choice' | 'sentence-reorder' | 'correction';

export type GrammarExample = {
  sentence: string;
  translation: {
    en: string;
    es: string;
    zh: string;
  };
  highlight?: string;
};

export type GrammarExercise = {
  id: string;
  type: ExerciseType;
  question: string;
  options?: string[];
  answer: string | number;
  explanation: string;
};

export type GrammarRule = {
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
};

export type GrammarTopic = {
  id: string;
  name: {
    en: string;
    es: string;
    zh: string;
  };
  rules: GrammarRule[];
};

export type GrammarData = {
  topics: GrammarTopic[];
};

async function importOptional<T>(path: string): Promise<T | null> {
  try {
    const mod: unknown = await import(/* @vite-ignore */ path);
    if (mod && typeof mod === 'object' && 'default' in (mod as Record<string, unknown>)) {
      const d = (mod as { default?: unknown }).default;
      return (d as T) ?? null;
    }
  } catch {}
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

async function loadAllGrammarData(locale: Locale): Promise<GrammarData> {
  const mod = await import(`@/data/grammar/${locale}/grammar.json`);
  return (mod.default ?? mod) as GrammarData;
}

export async function loadGrammarData(
  locale: Locale,
  topicId?: string
): Promise<GrammarData | GrammarTopic> {
  const data = await loadAllGrammarData(locale);
  
  if (topicId) {
    const topic = data.topics.find(t => t.id === topicId);
    if (!topic) {
      throw new Error(`Topic ${topicId} not found`);
    }
    return topic;
  }
  
  return data;
}

export async function loadGrammarRule(
  locale: Locale,
  ruleId: string
): Promise<GrammarRule | null> {
  const data = await loadAllGrammarData(locale);
  
  for (const topic of data.topics) {
    const rule = topic.rules.find(r => r.id === ruleId);
    if (rule) {
      return rule;
    }
  }
  
  return null;
}

export async function loadExercises(
  locale: Locale,
  topicId?: string,
  exerciseType?: ExerciseType
): Promise<GrammarExercise[]> {
  const data = await loadAllGrammarData(locale);
  
  let exercises: GrammarExercise[] = [];
  
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

export async function getAllTopics(locale: Locale): Promise<GrammarTopic[]> {
  const data = await loadAllGrammarData(locale);
  return data.topics;
}

export async function getAllRules(locale: Locale, topicId?: string): Promise<GrammarRule[]> {
  const data = await loadAllGrammarData(locale);
  
  let rules: GrammarRule[] = [];
  
  for (const topic of data.topics) {
    if (topicId && topic.id !== topicId) {
      continue;
    }
    rules.push(...topic.rules);
  }
  
  return rules;
}

