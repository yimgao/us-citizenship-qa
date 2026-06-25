import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import type { Locale } from '@/lib/questions';
import { loadQuestions } from '@/lib/questions';
import QuizRunner from '@/components/quiz/QuizRunner';

const CATEGORIES = ['all', 'gov', 'history', 'civics'] as const;
const MODES = ['practice', 'test'] as const;

export default async function QuizPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: Locale }>;
  searchParams: Promise<{ mode?: string; category?: string }>;
}) {
  const { locale } = await params;
  const sp = await searchParams;
  const activeMode = sp.mode ?? 'practice';
  const activeCategory = sp.category ?? 'all';

  const t = await getTranslations({ locale, namespace: 'quiz' });

  const questions = await loadQuestions(
    locale,
    activeCategory as 'all' | 'gov' | 'history' | 'civics',
    activeMode === 'test' ? 'test' : 'trial',
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-display font-bold text-fg">{t('title')}</h1>
      </div>

      {/* Mode pills */}
      <div>
        <p className="text-body-sm font-medium text-muted-foreground mb-3">
          {t('selectMode')}
        </p>
        <div className="flex flex-wrap gap-3">
          {MODES.map((mode) => {
            const isActive = activeMode === mode;
            return (
              <Link
                key={mode}
                href={`/quiz?mode=${mode}&category=${activeCategory}`}
                className={
                  isActive
                    ? 'rounded-xl bg-primary px-5 py-2.5 text-body-sm font-semibold text-primary-fg transition-colors'
                    : 'rounded-xl border-2 border-border bg-white px-5 py-2.5 text-body-sm font-semibold text-fg transition-colors hover:border-primary'
                }
              >
                {mode === 'practice' ? t('practiceMode') : t('testMode')}
              </Link>
            );
          })}
        </div>
        <p className="text-caption text-muted-foreground mt-2">
          {activeMode === 'practice' ? t('practiceDesc') : t('testDesc')}
        </p>
      </div>

      {/* Category pills */}
      <div>
        <p className="text-body-sm font-medium text-muted-foreground mb-3">
          {t('selectCategory')}
        </p>
        <div className="flex flex-wrap gap-3">
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <Link
                key={cat}
                href={`/quiz?mode=${activeMode}&category=${cat}`}
                className={
                  isActive
                    ? 'rounded-xl bg-primary px-5 py-2.5 text-body-sm font-semibold text-primary-fg transition-colors'
                    : 'rounded-xl border-2 border-border bg-white px-5 py-2.5 text-body-sm font-semibold text-fg transition-colors hover:border-primary'
                }
              >
                {cat === 'all'
                  ? t('allQuestions')
                  : cat === 'gov'
                    ? t('categoryGov')
                    : cat === 'history'
                      ? t('categoryHistory')
                      : t('categoryCivics')}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Quiz runner */}
      {questions.length > 0 ? (
        <QuizRunner
          questions={questions}
          mode={activeMode as 'practice' | 'test'}
          locale={locale}
        />
      ) : (
        <div className="rounded-2xl border-2 border-border bg-white p-8 text-center">
          <p className="text-body text-muted-foreground">{t('noQuestions')}</p>
        </div>
      )}
    </div>
  );
}
