import { GrammarService, GrammarViewer, GrammarPractice } from '@/modules/grammar';
import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import type { Locale } from '@/core/types';
import { Suspense } from 'react';
import { GrammarLoadingSkeleton } from '@/shared/ui/loading';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const dict = {
    en: {
      title: 'Grammar Practice | U.S. Civics Study Hub',
      desc: 'Learn and practice English grammar for the U.S. citizenship interview.'
    },
    es: {
      title: 'Práctica de Gramática | Centro de Estudio Cívico de EE. UU.',
      desc: 'Aprende y practica gramática inglesa para la entrevista de ciudadanía de EE. UU.'
    },
    zh: {
      title: '语法练习 | 美国入籍考试练习中心',
      desc: '学习和练习英语语法，为美国入籍面试做准备。'
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

async function GrammarContent({
  locale,
  selectedMode,
  selectedTopic,
}: {
  locale: Locale;
  selectedMode: string;
  selectedTopic?: string;
}) {
  try {
    let rules;
    const exercises = selectedMode === 'practice'
      ? await GrammarService.loadExercises(locale, selectedTopic)
      : undefined;

    if (selectedMode === 'learn') {
      rules = await GrammarService.getAllRules(locale, selectedTopic);
    }

    return selectedMode === 'learn' ? (
      <GrammarViewer rules={rules || []} locale={locale} />
    ) : (
      <GrammarPractice 
        exercises={exercises || []} 
        storageKey={`${locale}:grammar:${selectedMode}:${selectedTopic || 'all'}`}
      />
    );
  } catch (error) {
    throw new Error(`Failed to load grammar content: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export default async function GrammarPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: Locale }>;
  searchParams: Promise<{ mode?: string; topic?: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'grammar' });
  const { mode, topic } = await searchParams;

  const selectedMode = (mode as string) ?? 'learn';
  const selectedTopic = (topic as string) ?? undefined;
  const topics = await GrammarService.getAllTopics(locale);

  return (
    <div>
      <div className="mb-6 sm:mb-8">
        <h1 className="mb-4 sm:mb-6 text-center text-headline text-primary">{t('title')}</h1>
        
        {/* Mode Selection */}
        <div className="mb-4 sm:mb-6 rounded-xl glass-card modern-shadow p-4 sm:p-6">
          <p className="mb-3 sm:mb-4 text-center text-body font-medium text-foreground/70">{t('selectMode')}</p>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4">
            <a 
              href={`?mode=learn${selectedTopic ? `&topic=${selectedTopic}` : ''}`}
              className={`touch-target flex flex-col rounded-xl border-2 px-4 sm:px-6 py-3 sm:py-4 text-left smooth-hover transition-all ${
                selectedMode === 'learn'
                  ? 'border-blue-500 bg-gradient-to-r from-blue-50 to-blue-100 modern-shadow'
                  : 'border-slate-200/50 bg-white/80 hover:border-blue-300 hover:bg-blue-50/50'
              }`}
            >
              <span className="font-semibold text-body-lg text-primary">{t('learnMode')}</span>
              <span className="mt-1 text-body-sm text-foreground/75">{t('learnDesc')}</span>
            </a>
            <a 
              href={`?mode=practice${selectedTopic ? `&topic=${selectedTopic}` : ''}`}
              className={`touch-target flex flex-col rounded-xl border-2 px-4 sm:px-6 py-3 sm:py-4 text-left smooth-hover transition-all ${
                selectedMode === 'practice'
                  ? 'border-blue-500 bg-gradient-to-r from-blue-50 to-blue-100 modern-shadow'
                  : 'border-slate-200/50 bg-white/80 hover:border-blue-300 hover:bg-blue-50/50'
              }`}
            >
              <span className="font-semibold text-body-lg text-primary">{t('practiceMode')}</span>
              <span className="mt-1 text-body-sm text-foreground/75">{t('practiceDesc')}</span>
            </a>
          </div>
        </div>

        {/* Topic Selection */}
        <div className="rounded-xl glass-card modern-shadow p-4 sm:p-6">
          <p className="mb-3 sm:mb-4 text-center text-body font-medium text-foreground/70">{t('selectTopic')}</p>
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            <a 
              href={`?mode=${selectedMode}`} 
              className={`touch-target rounded-lg border-2 px-4 sm:px-6 py-2.5 sm:py-3 text-body font-semibold smooth-hover transition-all ${
                !selectedTopic
                  ? 'border-blue-500 bg-primary text-primary-foreground modern-shadow'
                  : 'border-blue-200/50 bg-white/80 text-primary hover:border-blue-400 hover:bg-blue-50/50'
              }`}
            >
              {t('allTopics')}
            </a>
            {topics.map((t) => (
              <a 
                key={t.id}
                href={`?mode=${selectedMode}&topic=${t.id}`} 
                className={`touch-target rounded-lg border-2 px-4 sm:px-6 py-2.5 sm:py-3 text-body font-semibold smooth-hover transition-all ${
                  selectedTopic === t.id
                    ? 'border-blue-500 bg-primary text-primary-foreground modern-shadow'
                    : 'border-blue-200/50 bg-white/80 text-primary hover:border-blue-400 hover:bg-blue-50/50'
                }`}
              >
                {t.name[locale]}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <Suspense fallback={<GrammarLoadingSkeleton />}>
        <GrammarContent 
          locale={locale}
          selectedMode={selectedMode}
          selectedTopic={selectedTopic}
        />
      </Suspense>
    </div>
  );
}

