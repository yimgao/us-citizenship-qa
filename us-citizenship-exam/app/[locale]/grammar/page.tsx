import { getAllRules, getAllTopics, loadExercises } from '@/lib/grammar';
import GrammarViewer from '@/components/grammar/GrammarViewer';
import GrammarPractice from '@/components/grammar/GrammarPractice';
import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';

export async function generateMetadata(
  { params }: { params: Promise<{ locale: 'en'|'es'|'zh' }> }
): Promise<Metadata> {
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

export default async function GrammarPage({
  params,
  searchParams
}: {
  params: Promise<{ locale: 'en' | 'es' | 'zh' }>;
  searchParams: Promise<{ mode?: string; topic?: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'grammar' });
  const { mode, topic } = await searchParams;
  
  const selectedMode = (mode as string) ?? 'learn';
  const selectedTopic = (topic as string) ?? undefined;

  let rules: Awaited<ReturnType<typeof getAllRules>> | undefined;
  let exercises: Awaited<ReturnType<typeof loadExercises>> | undefined;
  let topics;

  if (selectedMode === 'learn') {
    rules = await getAllRules(locale, selectedTopic);
  } else {
    exercises = await loadExercises(locale, selectedTopic);
  }

  topics = await getAllTopics(locale);

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6">
        <h1 className="mb-4 text-center text-3xl font-bold text-slate-900">{t('title')}</h1>
        
        {/* Mode Selection */}
        <div className="mb-4 rounded-xl bg-white p-4 shadow-sm">
          <p className="mb-3 text-center text-sm font-medium text-slate-600">{t('selectMode')}</p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <a 
              href={`?mode=learn${selectedTopic ? `&topic=${selectedTopic}` : ''}`}
              className={`flex flex-col rounded-lg border-2 px-6 py-3 text-left transition-all ${
                selectedMode === 'learn'
                  ? 'border-blue-500 bg-blue-50 shadow-md'
                  : 'border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50'
              }`}
            >
              <span className="font-semibold text-slate-900">{t('learnMode')}</span>
              <span className="mt-1 text-xs text-slate-600">{t('learnDesc')}</span>
            </a>
            <a 
              href={`?mode=practice${selectedTopic ? `&topic=${selectedTopic}` : ''}`}
              className={`flex flex-col rounded-lg border-2 px-6 py-3 text-left transition-all ${
                selectedMode === 'practice'
                  ? 'border-blue-500 bg-blue-50 shadow-md'
                  : 'border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50'
              }`}
            >
              <span className="font-semibold text-slate-900">{t('practiceMode')}</span>
              <span className="mt-1 text-xs text-slate-600">{t('practiceDesc')}</span>
            </a>
          </div>
        </div>

        {/* Topic Selection */}
        <div className="rounded-xl bg-white p-4 shadow-sm">
          <p className="mb-3 text-center text-sm font-medium text-slate-600">{t('selectTopic')}</p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <a 
              href={`?mode=${selectedMode}`} 
              className={`rounded-lg border-2 px-4 py-2 text-sm font-semibold transition-all ${
                !selectedTopic
                  ? 'border-blue-500 bg-blue-600 text-white shadow-md'
                  : 'border-blue-200 bg-white text-blue-600 hover:border-blue-400 hover:bg-blue-50'
              }`}
            >
              {t('allTopics')}
            </a>
            {topics.map((t) => (
              <a 
                key={t.id}
                href={`?mode=${selectedMode}&topic=${t.id}`} 
                className={`rounded-lg border-2 px-4 py-2 text-sm font-semibold transition-all ${
                  selectedTopic === t.id
                    ? 'border-blue-500 bg-blue-600 text-white shadow-md'
                    : 'border-blue-200 bg-white text-blue-600 hover:border-blue-400 hover:bg-blue-50'
                }`}
              >
                {t.name[locale]}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      {selectedMode === 'learn' ? (
        <GrammarViewer rules={rules || []} locale={locale} />
      ) : (
        <GrammarPractice 
          exercises={exercises || []} 
          storageKey={`${locale}:grammar:${selectedMode}:${selectedTopic || 'all'}`}
        />
      )}
    </div>
  );
}

