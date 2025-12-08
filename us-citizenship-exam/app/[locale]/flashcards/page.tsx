import { QuestionService } from '@/core/services/data/questionService';
import { FlashcardViewer } from '@/modules/flashcards';
import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import type { Category } from '@/core/types';
import { Suspense } from 'react';
import { FlashcardLoadingSkeleton } from '@/shared/ui/loading';

export async function generateMetadata(
  { params }: { params: Promise<{ locale: 'en'|'es'|'zh' }> }
): Promise<Metadata> {
  const { locale } = await params;
  const dict = {
    en: {
      title: 'Flashcards | U.S. Civics Study Hub',
      desc: 'Review U.S. civics test questions with interactive flashcards.'
    },
    es: {
      title: 'Tarjetas de Estudio (Flashcards) | Centro de Estudio Cívico de EE. UU.',
      desc: 'Revise las preguntas del examen de cívica con tarjetas de estudio interactivas.'
    },
    zh: {
      title: '闪卡 | 美国入籍考试练习中心',
      desc: '通过交互式闪卡复习美国公民考试题目。'
    }
  } as const;
  const lang = (locale === 'en' || locale === 'es' || locale === 'zh') ? locale : 'en';
  const meta = dict[lang];
  return {
    title: meta.title,
    description: meta.desc,
    openGraph: { title: meta.title, description: meta.desc, type: 'website' },
    twitter: { card: 'summary_large_image', title: meta.title, description: meta.desc }
  };
}

async function FlashcardsContent({
  locale,
  selected,
  current,
  size,
}: {
  locale: 'en' | 'es' | 'zh';
  selected: string;
  current: number;
  size: number;
}) {
  try {
    const key = (selected === 'all' ? 'all' : selected) as Category;
    const offset = (current - 1) * size;
    let cards;
    let totalPages = 1;
    if (key === 'all') {
      // Show all cards when "All" is selected (no pagination)
      cards = await QuestionService.loadQuestions(locale, 'all', 'all');
    } else {
      const paged = await QuestionService.loadQuestionsPaged(locale, key, offset, size);
      cards = paged.items;
      totalPages = Math.max(1, Math.ceil(paged.total / size));
    }

    return (
      <>
        <FlashcardViewer cards={cards} />
        {selected !== 'all' && (
          <div className="mt-6 sm:mt-8 flex items-center justify-center gap-3 sm:gap-4">
            <a
              href={`?category=${selected}&page=${Math.max(1, current - 1)}&pageSize=${size}`}
              className={`touch-target rounded-lg border-2 border-slate-200/50 bg-white/80 px-4 sm:px-6 py-2.5 sm:py-3 text-body font-medium smooth-hover transition-all ${
                current === 1 
                  ? 'pointer-events-none opacity-40 cursor-not-allowed' 
                  : 'hover:bg-slate-50/50 hover:border-slate-300 text-primary'
              }`}
            >
              ← Prev
            </a>
            <span className="text-body-sm text-muted-foreground px-2">Page {current} / {totalPages}</span>
            <a
              href={`?category=${selected}&page=${Math.min(totalPages, current + 1)}&pageSize=${size}`}
              className={`touch-target rounded-lg border-2 border-slate-200/50 bg-white/80 px-4 sm:px-6 py-2.5 sm:py-3 text-body font-medium smooth-hover transition-all ${
                current === totalPages 
                  ? 'pointer-events-none opacity-40 cursor-not-allowed' 
                  : 'hover:bg-slate-50/50 hover:border-slate-300 text-primary'
              }`}
            >
              Next →
            </a>
          </div>
        )}
      </>
    );
  } catch (error) {
    throw new Error(`Failed to load flashcards: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export default async function FlashcardsPage({
  params,
  searchParams
}: {
  params: Promise<{ locale: 'en' | 'es' | 'zh' }>;
  searchParams: Promise<{ category?: string; page?: string; pageSize?: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'flashcards' });
  const { category, page, pageSize } = await searchParams;
  const selected = (category as string) ?? 'all';
  const current = Math.max(1, parseInt((page as string) ?? '1', 10));
  const size = Math.max(1, Math.min(50, parseInt((pageSize as string) ?? '25', 10)));

  return (
    <div>
      <div className="mb-6 sm:mb-8">
        <h1 className="mb-4 sm:mb-6 text-center text-headline text-primary">{t('title')}</h1>
        <div className="rounded-xl glass-card modern-shadow p-4 sm:p-6">
          <p className="mb-3 sm:mb-4 text-center text-body font-medium text-foreground/70">{t('selectCategory')}</p>
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            <a 
              href={`?category=all`} 
              className={`touch-target rounded-lg border-2 px-4 sm:px-6 py-2.5 sm:py-3 text-body font-semibold smooth-hover transition-all ${
                selected === 'all' 
                  ? 'border-blue-500 bg-primary text-primary-foreground modern-shadow' 
                  : 'border-blue-200/50 bg-white/80 text-primary hover:border-blue-400 hover:bg-blue-50/50'
              }`}
            >
              {t('all')}
            </a>
            <a 
              href={`?category=gov`} 
              className={`touch-target rounded-lg border-2 px-4 sm:px-6 py-2.5 sm:py-3 text-body font-semibold smooth-hover transition-all ${
                selected === 'gov' 
                  ? 'border-blue-500 bg-primary text-primary-foreground modern-shadow' 
                  : 'border-blue-200/50 bg-white/80 text-primary hover:border-blue-400 hover:bg-blue-50/50'
              }`}
            >
              {t('categoryGov')}
            </a>
            <a 
              href={`?category=history`} 
              className={`touch-target rounded-lg border-2 px-4 sm:px-6 py-2.5 sm:py-3 text-body font-semibold smooth-hover transition-all ${
                selected === 'history' 
                  ? 'border-blue-500 bg-primary text-primary-foreground modern-shadow' 
                  : 'border-blue-200/50 bg-white/80 text-primary hover:border-blue-400 hover:bg-blue-50/50'
              }`}
            >
              {t('categoryHistory')}
            </a>
            <a 
              href={`?category=civics`} 
              className={`touch-target rounded-lg border-2 px-4 sm:px-6 py-2.5 sm:py-3 text-body font-semibold smooth-hover transition-all ${
                selected === 'civics' 
                  ? 'border-blue-500 bg-primary text-primary-foreground modern-shadow' 
                  : 'border-blue-200/50 bg-white/80 text-primary hover:border-blue-400 hover:bg-blue-50/50'
              }`}
            >
              {t('categoryCivics')}
            </a>
          </div>
        </div>
      </div>
      <Suspense fallback={<FlashcardLoadingSkeleton />}>
        <FlashcardsContent 
          locale={locale}
          selected={selected}
          current={current}
          size={size}
        />
      </Suspense>
    </div>
  );
}


