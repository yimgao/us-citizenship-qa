import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { loadQuestions, CATEGORY_BY_LOCALE, type Locale } from '@/lib/questions';
import PrintButton from '@/components/sections/PrintButton';

type CategoryKey = 'gov' | 'history' | 'civics';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const meta: Record<string, { title: string; desc: string }> = {
    en: { title: 'Study Guide — Citizenship Prep', desc: 'All 100 USCIS civics questions and answers for the U.S. naturalization test.' },
    es: { title: 'Guía de Estudio — Citizenship Prep', desc: 'Las 100 preguntas y respuestas de educación cívica de USCIS.' },
    zh: { title: '学习指南 — Citizenship Prep', desc: '美国入籍考试的全部 100 道公民知识题目及答案。' },
  };
  const m = meta[locale as 'en' | 'es' | 'zh'] ?? meta.en;
  return { title: m.title, description: m.desc };
}

export default async function StudyGuidePage({
  params,
}: {
  params: Promise<{ locale: 'en' | 'es' | 'zh' }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'study-guide' });
  const questions = await loadQuestions(locale as Locale, 'all', 'all');

  const catMap = CATEGORY_BY_LOCALE[locale as Locale];
  const categories: { key: CategoryKey; label: string; color: string }[] = [
    { key: 'gov', label: catMap.gov, color: 'bg-primary' },
    { key: 'history', label: catMap.history, color: 'bg-secondary' },
    { key: 'civics', label: catMap.civics, color: 'bg-accent' },
  ];

  const questionsByCategory: Record<string, typeof questions> = {};
  for (const cat of categories) {
    questionsByCategory[cat.key] = questions.filter((q) => q.category === cat.label);
  }

  return (
    <div className="mx-auto max-w-4xl">
      {/* Print-friendly styles */}
      <style>{`
        @media print {
          header, footer, nav, .no-print { display: none !important; }
          body { background: white !important; }
          @page { margin: 1.5cm; }
        }
      `}</style>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-display font-bold text-fg">{t('title')}</h1>
            <p className="mt-1 text-body-lg text-muted-foreground">{t('subtitle')}</p>
          </div>
          <PrintButton />
        </div>
        <p className="no-print mt-2 text-sm text-muted-foreground">{t('printDesc')}</p>
      </div>

      {/* Questions by category */}
      {categories.map((cat) => {
        const catQuestions = questionsByCategory[cat.key];
        if (catQuestions.length === 0) return null;

        return (
          <section key={cat.key} className="mb-10">
            {/* Category divider */}
            <div className={`mb-4 flex items-center gap-3 rounded-2xl ${cat.color} px-6 py-4 text-white`}>
              <h2 className="text-title font-bold">{t(cat.key === 'gov' ? 'government' : cat.key === 'history' ? 'history' : 'civics')}</h2>
              <span className="rounded-full bg-white/20 px-3 py-0.5 text-caption font-semibold">
                {catQuestions.length} {catQuestions.length === 1 ? 'question' : 'questions'}
              </span>
            </div>

            {/* Question cards */}
            <div className="space-y-3">
              {catQuestions.map((q, idx) => {
                // Find the global question number
                const globalIdx = questions.findIndex((x) => x.id === q.id) + 1;
                return (
                  <div
                    key={q.id}
                    className="rounded-2xl border-2 border-border bg-white p-5 transition-shadow hover:shadow-sm"
                  >
                    <div className="flex items-start gap-3">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-bg text-body-sm font-bold text-primary">
                        {globalIdx}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-body font-medium text-fg leading-relaxed">
                          {q.text}
                        </p>
                        <p className="mt-2 text-body-sm font-bold text-primary leading-relaxed">
                          {q.options[q.answer]}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        );
      })}

      {/* Footer note for print */}
      <p className="no-print mt-6 text-center text-sm text-muted-foreground">
        Citizenship Prep &mdash; Free U.S. citizenship practice
      </p>
    </div>
  );
}
