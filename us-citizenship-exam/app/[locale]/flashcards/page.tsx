import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import type { Locale } from '@/lib/questions';
import { loadQuestions } from '@/lib/questions';
import FlashcardViewer from '@/components/flashcards/FlashcardViewer';
import DueCountBadge from '@/components/flashcards/DueCountBadge';

const CATEGORIES = ['all', 'gov', 'history', 'civics'] as const;

export default async function FlashcardsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: Locale }>;
  searchParams: Promise<{ category?: string }>;
}) {
  const { locale } = await params;
  const sp = await searchParams;
  const activeCategory = (sp.category ?? 'all') as 'all' | 'gov' | 'history' | 'civics';

  const t = await getTranslations({ locale, namespace: 'flashcards' });

  const allQuestions = await loadQuestions(locale, activeCategory, 'all');

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-display font-bold text-fg">{t('title')}</h1>
      </div>

      {/* Category pills */}
      <div className="flex flex-wrap gap-3">
        {CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat;
          return (
            <Link
              key={cat}
              href={`/flashcards?category=${cat}`}
              className={
                isActive
                  ? 'rounded-xl bg-primary px-5 py-2.5 text-body-sm font-semibold text-primary-fg transition-colors'
                  : 'rounded-xl border-2 border-border bg-white px-5 py-2.5 text-body-sm font-semibold text-fg transition-colors hover:border-primary'
              }
            >
              {cat === 'all'
                ? t('all')
                : cat === 'gov'
                  ? t('categoryGov')
                  : cat === 'history'
                    ? t('categoryHistory')
                    : t('categoryCivics')}
            </Link>
          );
        })}
      </div>

      {/* Flashcards */}
      {allQuestions.length > 0 ? (
        <FlashcardViewer
          questions={allQuestions}
          locale={locale}
          totalCount={allQuestions.length}
        />
      ) : (
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-border bg-white p-12 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-bg-alt">
            <span className="text-3xl">🃏</span>
          </div>
          <h3 className="mb-1 text-body-lg font-bold text-fg">{t('noCards')}</h3>
          <p className="max-w-xs text-body-sm text-muted-foreground">
            {t('all') === 'All' ? 'No cards match this category.' : '没有匹配的卡片。'}
          </p>
        </div>
      )}
    </div>
  );
}
