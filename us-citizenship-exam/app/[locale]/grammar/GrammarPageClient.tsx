'use client';

import { useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { BookOpen, PenLine, ChevronDown } from 'lucide-react';
import GrammarViewer from '@/components/grammar/GrammarViewer';
import GrammarPractice from '@/components/grammar/GrammarPractice';
import type { Locale } from '@/lib/questions';
import type { GrammarRule, GrammarExercise } from '@/lib/grammar';

type TopicBrief = {
  id: string;
  name: { en: string; es: string; zh: string };
};

type Mode = 'learn' | 'practice';

export default function GrammarPageClient({
  locale,
  topics,
  translations,
}: {
  locale: Locale;
  topics: TopicBrief[];
  translations: Record<string, string>;
}) {
  const [mode, setMode] = useState<Mode>('learn');
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [rules, setRules] = useState<GrammarRule[] | null>(null);
  const [exercises, setExercises] = useState<GrammarExercise[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadContent = useCallback(
    async (topicId: string | null) => {
      setLoading(true);
      setError(null);
      try {
        if (mode === 'learn') {
          const { getAllRules } = await import('@/lib/grammar');
          const loaded = await getAllRules(locale, topicId ?? undefined);
          setRules(loaded);
          setExercises(null);
        } else {
          const { loadExercises } = await import('@/lib/grammar');
          const loaded = await loadExercises(locale, topicId ?? undefined);
          setExercises(loaded);
          setRules(null);
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to load content');
        setRules(null);
        setExercises(null);
      } finally {
        setLoading(false);
      }
    },
    [locale, mode]
  );

  const handleModeChange = useCallback(
    (newMode: Mode) => {
      setMode(newMode);
      setRules(null);
      setExercises(null);
      setError(null);
    },
    []
  );

  const handleTopicChange = useCallback(
    (topicId: string | null) => {
      setSelectedTopic(topicId);
      loadContent(topicId);
    },
    [loadContent]
  );

  return (
    <div className="flex w-full max-w-2xl flex-col items-center gap-6">
      {/* Mode pills */}
      <div className="flex gap-2">
        <button
          onClick={() => handleModeChange('learn')}
          className={`flex items-center gap-2 rounded-xl px-5 py-3 text-body font-bold transition-all ${
            mode === 'learn'
              ? 'bg-primary text-primary-fg shadow-sm'
              : 'border-2 border-border bg-card text-fg hover:border-primary hover:bg-primary-bg'
          }`}
        >
          <BookOpen size={18} />
          {translations.learnMode}
        </button>
        <button
          onClick={() => handleModeChange('practice')}
          className={`flex items-center gap-2 rounded-xl px-5 py-3 text-body font-bold transition-all ${
            mode === 'practice'
              ? 'bg-primary text-primary-fg shadow-sm'
              : 'border-2 border-border bg-card text-fg hover:border-primary hover:bg-primary-bg'
          }`}
        >
          <PenLine size={18} />
          {translations.practiceMode}
        </button>
      </div>

      {/* Description */}
      <p className="text-body-sm text-muted-foreground">
        {mode === 'learn' ? translations.learnDesc : translations.practiceDesc}
      </p>

      {/* Topic pills */}
      <div className="flex w-full flex-col gap-2">
        <p className="text-body-sm font-bold text-muted-foreground">{translations.selectTopic}</p>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleTopicChange(null)}
            className={`rounded-xl px-4 py-2 text-body-sm font-bold transition-all ${
              selectedTopic === null
                ? 'bg-primary text-primary-fg shadow-sm'
                : 'border-2 border-border bg-card text-fg hover:border-primary hover:bg-primary-bg'
            }`}
          >
            {translations.allTopics}
          </button>
          {topics.map((topic) => (
            <button
              key={topic.id}
              onClick={() => handleTopicChange(topic.id)}
              className={`rounded-xl px-4 py-2 text-body-sm font-bold transition-all ${
                selectedTopic === topic.id
                  ? 'bg-primary text-primary-fg shadow-sm'
                  : 'border-2 border-border bg-card text-fg hover:border-primary hover:bg-primary-bg'
              }`}
            >
              {topic.name[locale]}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-border border-t-primary" />
        </div>
      )}

      {error && (
        <div className="w-full rounded-xl border-2 border-danger bg-danger-bg p-4 text-center">
          <p className="text-body font-semibold text-danger">{error}</p>
        </div>
      )}

      {!loading && !error && mode === 'learn' && rules && (
        rules.length > 0 ? (
          <GrammarViewer rules={rules} locale={locale} />
        ) : (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-bg-alt">
              <span className="text-3xl">📖</span>
            </div>
            <h3 className="text-body-lg font-bold text-fg mb-1">{translations.noRules}</h3>
            <p className="text-body-sm text-muted-foreground max-w-xs">
              {translations.noRulesDesc ?? 'No grammar rules found for this topic.'}
            </p>
          </div>
        )
      )}

      {!loading && !error && mode === 'practice' && exercises && (
        exercises.length > 0 ? (
          <GrammarPractice exercises={exercises} locale={locale} />
        ) : (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-bg-alt">
              <span className="text-3xl">✍️</span>
            </div>
            <h3 className="text-body-lg font-bold text-fg mb-1">{translations.noExercises}</h3>
            <p className="text-body-sm text-muted-foreground max-w-xs">
              {translations.noExercisesDesc ?? 'No exercises available for this topic yet.'}
            </p>
          </div>
        )
      )}
    </div>
  );
}
