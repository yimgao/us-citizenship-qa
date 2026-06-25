import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import GrammarPageClient from './GrammarPageClient';
import type { Locale } from '@/lib/questions';
import { getAllTopics } from '@/lib/grammar';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const meta: Record<string, { title: string; desc: string }> = {
    en: { title: 'Grammar Practice — Citizenship Prep', desc: 'Learn and practice English grammar for the U.S. citizenship interview.' },
    es: { title: 'Práctica de Gramática — Citizenship Prep', desc: 'Aprende y practica la gramática inglesa para la entrevista de ciudadanía.' },
    zh: { title: '语法练习 — Citizenship Prep', desc: '学习和练习英语语法，为入籍面试做准备。' },
  };
  const m = meta[locale as 'en' | 'es' | 'zh'] ?? meta.en;
  return { title: m.title, description: m.desc };
}

export default async function GrammarPage({ params }: Props) {
  const { locale } = await params;
  const activeLocale = (['en', 'es', 'zh'].includes(locale) ? locale : 'en') as Locale;
  const t = await getTranslations({ locale: activeLocale, namespace: 'grammar' });

  const topics = await getAllTopics(activeLocale);

  const initialTopics = topics.map((topic) => ({
    id: topic.id,
    name: topic.name,
  }));

  return (
    <div className="flex flex-col items-center gap-8 py-6">
      {/* Header */}
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-display font-bold text-fg">{t('title')}</h1>
        <p className="max-w-xl text-body text-muted-foreground">{t('description')}</p>
      </div>

      <GrammarPageClient
        locale={activeLocale}
        topics={initialTopics}
        translations={{
          selectMode: t('selectMode'),
          learnMode: t('learnMode'),
          practiceMode: t('practiceMode'),
          learnDesc: t('learnDesc'),
          practiceDesc: t('practiceDesc'),
          selectTopic: t('selectTopic'),
          allTopics: t('allTopics'),
          noRules: t('noRules'),
          noExercises: t('noExercises'),
        }}
      />
    </div>
  );
}
