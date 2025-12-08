import { QuestionService } from '@/core/services/data/questionService';
import { QuizRunner } from '@/modules/quiz';
import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import type { Category } from '@/core/types';
import { Suspense } from 'react';
import { QuizLoadingSkeleton } from '@/shared/ui/loading';

export async function generateMetadata(
  { params }: { params: Promise<{ locale: 'en'|'es'|'zh' }> }
): Promise<Metadata> {
  const { locale } = await params;
  const dict = {
    en: {
      title: 'Quiz Mode | U.S. Civics Study Hub',
      desc: 'Test your U.S. civics knowledge with multiple-choice practice aligned to the naturalization test.'
    },
    es: {
      title: 'Modo Examen | Centro de Estudio Cívico de EE. UU.',
      desc: 'Pon a prueba tus conocimientos de cívica con preguntas de opción múltiple.'
    },
    zh: {
      title: '测验模式 | 美国入籍考试练习中心',
      desc: '通过多项选择题测试您的美国公民知识。'
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

async function QuizContent({
  locale,
  selectedMode,
  selectedCategory,
}: {
  locale: 'en' | 'es' | 'zh';
  selectedMode: string;
  selectedCategory: string;
}) {
  try {
    let questions;
    if (selectedMode === 'test') {
      // Official test: up to 20 random questions from all categories
      questions = await QuestionService.loadQuestions(locale, 'all', 'test');
    } else {
      // Practice mode: 10 questions from selected category
      const catKey = selectedCategory as Category;
      questions = await QuestionService.loadQuestions(locale, catKey, 'trial');
    }

    return (
      <QuizRunner 
        questions={questions} 
        storageKey={`${locale}:${selectedMode}:${selectedCategory}`}
        mode={selectedMode as 'practice'|'test'}
      />
    );
  } catch (error) {
    throw new Error(`Failed to load quiz questions: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export default async function QuizPage({
  params,
  searchParams
}: {
  params: Promise<{ locale: 'en' | 'es' | 'zh' }>;
  searchParams: Promise<{ mode?: string; category?: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'quiz' });
  const { mode, category } = await searchParams;
  
  const selectedMode = (mode as string) ?? 'practice';
  const selectedCategory = (category as string) ?? 'gov';

  return (
    <div>
      <div className="mb-6 sm:mb-8">
        <h1 className="mb-4 sm:mb-6 text-center text-headline text-primary">{t('title')}</h1>
        
        {/* Mode Selection */}
        <div className="mb-4 sm:mb-6 rounded-xl glass-card modern-shadow p-4 sm:p-6">
          <p className="mb-3 sm:mb-4 text-center text-body font-medium text-foreground/70">{t('selectMode')}</p>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4">
            <a 
              href={`?mode=practice${selectedCategory ? `&category=${selectedCategory}` : ''}`}
              className={`touch-target flex flex-col rounded-xl border-2 px-4 sm:px-6 py-3 sm:py-4 text-left smooth-hover transition-all ${
                selectedMode === 'practice'
                  ? 'border-blue-500 bg-gradient-to-r from-blue-50 to-blue-100 modern-shadow'
                  : 'border-slate-200/50 bg-white/80 hover:border-blue-300 hover:bg-blue-50/50'
              }`}
            >
              <span className="font-semibold text-body-lg text-primary">{t('practiceMode')}</span>
              <span className="mt-1 text-body-sm text-foreground/75">{t('practiceDesc')}</span>
            </a>
            <a 
              href={`?mode=test`}
              className={`touch-target flex flex-col rounded-xl border-2 px-4 sm:px-6 py-3 sm:py-4 text-left smooth-hover transition-all ${
                selectedMode === 'test'
                  ? 'border-blue-500 bg-gradient-to-r from-blue-50 to-blue-100 modern-shadow'
                  : 'border-slate-200/50 bg-white/80 hover:border-blue-300 hover:bg-blue-50/50'
              }`}
            >
              <span className="font-semibold text-body-lg text-primary">{t('testMode')}</span>
              <span className="mt-1 text-body-sm text-foreground/75">{t('testDesc')}</span>
            </a>
          </div>
        </div>

        {/* Category Selection (only for practice mode) */}
        {selectedMode === 'practice' && (
          <div className="rounded-xl glass-card modern-shadow p-4 sm:p-6">
            <p className="mb-3 sm:mb-4 text-center text-body font-medium text-foreground/70">{t('selectCategory')}</p>
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
              <a 
                href={`?mode=practice&category=gov`} 
                className={`touch-target rounded-lg border-2 px-4 sm:px-6 py-2.5 sm:py-3 text-body font-semibold smooth-hover transition-all ${
                  selectedCategory === 'gov'
                    ? 'border-blue-500 bg-primary text-primary-foreground modern-shadow'
                    : 'border-blue-200/50 bg-white/80 text-primary hover:border-blue-400 hover:bg-blue-50/50'
                }`}
              >
                {t('categoryGov')}
              </a>
              <a 
                href={`?mode=practice&category=history`} 
                className={`touch-target rounded-lg border-2 px-4 sm:px-6 py-2.5 sm:py-3 text-body font-semibold smooth-hover transition-all ${
                  selectedCategory === 'history'
                    ? 'border-blue-500 bg-primary text-primary-foreground modern-shadow'
                    : 'border-blue-200/50 bg-white/80 text-primary hover:border-blue-400 hover:bg-blue-50/50'
                }`}
              >
                {t('categoryHistory')}
              </a>
              <a 
                href={`?mode=practice&category=civics`} 
                className={`touch-target rounded-lg border-2 px-4 sm:px-6 py-2.5 sm:py-3 text-body font-semibold smooth-hover transition-all ${
                  selectedCategory === 'civics'
                    ? 'border-blue-500 bg-primary text-primary-foreground modern-shadow'
                    : 'border-blue-200/50 bg-white/80 text-primary hover:border-blue-400 hover:bg-blue-50/50'
                }`}
              >
                {t('categoryCivics')}
              </a>
            </div>
          </div>
        )}
      </div>
      <Suspense fallback={<QuizLoadingSkeleton />}>
        <QuizContent 
          locale={locale}
          selectedMode={selectedMode}
          selectedCategory={selectedCategory}
        />
      </Suspense>
    </div>
  );
}
