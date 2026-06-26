import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import type { Locale } from '@/lib/questions';
import { loadQuestionsPaged } from '@/lib/questions';
import DifficultyFilterWrapper from '@/components/flashcards/DifficultyFilterWrapper';
import DueCountBadge from '@/components/flashcards/DueCountBadge';

const CATEGORIES = ['all', 'gov', 'history', 'civics'] as const;
const DIFFICULTY_FILTERS = ['all', 'due'] as const;

const PAGE_SIZE = 20;

export default async function FlashcardsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: Locale }>;
  searchParams: Promise<{ category?: string; page?: string; difficulty?: string }>;
}) {
  const { locale } = await params;
  const sp = await searchParams;
  const activeCategory = (sp.category ?? 'all') as 'all' | 'gov' | 'history' | 'civics';
  const activeDifficulty = (sp.difficulty ?? 'all') as 'all' | 'due';
  const currentPage = Math.max(1, parseInt(sp.page ?? '1', 10) || 1);

  const t = await getTranslations({ locale, namespace: 'flashcards' });

  const { items: questions, total } = await loadQuestionsPaged(
    locale,
    activeCategory,
    (currentPage - 1) * PAGE_SIZE,
    PAGE_SIZE,
  );

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-display font-bold text-fg">{t('title')}</h1>
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
                href={`/flashcards?category=${cat}${activeDifficulty !== 'all' ? `&difficulty=${activeDifficulty}` : ''}`}
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
      </div>

      {/* Difficulty filter pills */}
      <div>
        <p className="text-body-sm font-medium text-muted-foreground mb-3">
          {t('filterByDifficulty')}
        </p>
        <div className="flex flex-wrap gap-3">
          {DIFFICULTY_FILTERS.map((f) => {
            const isActive = activeDifficulty === f;
            return (
              <Link
                key={f}
                href={`/flashcards?category=${activeCategory}${f !== 'all' ? `&difficulty=${f}` : ''}`}
                className={
                  isActive
                    ? 'inline-flex items-center rounded-xl bg-primary px-5 py-2.5 text-body-sm font-semibold text-primary-fg transition-colors'
                    : 'inline-flex items-center rounded-xl border-2 border-border bg-white px-5 py-2.5 text-body-sm font-semibold text-fg transition-colors hover:border-primary'
                }
              >
                {f === 'all' ? t('all') : t('dueForReview')}
                {f === 'due' && !isActive && <DueCountBadge />}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Flashcards */}
      {questions.length > 0 ? (
        <>
          <DifficultyFilterWrapper
            questions={questions}
            locale={locale}
            totalCount={total}
            difficultyFilter={activeDifficulty}
          />

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              {currentPage > 1 && (
                <Link
                  href={`/flashcards?category=${activeCategory}&page=${currentPage - 1}`}
                  className="inline-flex items-center gap-1 rounded-xl border-2 border-border bg-white px-4 py-2 text-body-sm font-semibold text-fg transition-colors hover:border-primary"
                >
                  ← {t('previous')}
                </Link>
              )}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Link
                  key={page}
                  href={`/flashcards?category=${activeCategory}&page=${page}`}
                  className={`inline-flex h-9 w-9 items-center justify-center rounded-xl text-body-sm font-semibold transition-colors ${
                    page === currentPage
                      ? 'bg-primary text-primary-fg'
                      : 'border-2 border-border bg-white text-fg hover:border-primary'
                  }`}
                >
                  {page}
                </Link>
              ))}
              {currentPage < totalPages && (
                <Link
                  href={`/flashcards?category=${activeCategory}&page=${currentPage + 1}`}
                  className="inline-flex items-center gap-1 rounded-xl border-2 border-border bg-white px-4 py-2 text-body-sm font-semibold text-fg transition-colors hover:border-primary"
                >
                  {t('next')} →
                </Link>
              )}
            </div>
          )}
        </>
      ) : (
        <div className="rounded-2xl border-2 border-border bg-white p-8 text-center">
          <p className="text-body text-muted-foreground">{t('noCards')}</p>
        </div>
      )}
    </div>
  );
}
