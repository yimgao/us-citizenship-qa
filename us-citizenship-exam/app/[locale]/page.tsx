import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import HeroSection from '@/components/sections/HeroSection';
import FeatureGrid from '@/components/sections/FeatureGrid';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const meta: Record<string, { title: string; desc: string }> = {
    en: { title: 'Citizenship Prep — Free U.S. Naturalization Practice', desc: 'Free practice for the U.S. naturalization civics test. Quizzes, flashcards, grammar, and glossary.' },
    es: { title: 'Citizenship Prep — Práctica de Naturalización Gratuita', desc: 'Práctica gratuita para el examen de civismo. Cuestionarios, tarjetas, gramática y glosario.' },
    zh: { title: 'Citizenship Prep — 免费美国入籍考试练习', desc: '免费入籍公民知识模拟练习，支持测验、闪卡、语法和词汇表。' },
  };
  const m = meta[locale as 'en' | 'es' | 'zh'] ?? meta.en;
  return { title: m.title, description: m.desc };
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: 'en' | 'es' | 'zh' }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'home' });

  const features = [
    { title: t('quizTitle'), description: t('quizDescription'), href: '/quiz', icon: 'FileText' as const, color: '#58cc02' },
    { title: t('flashcardsTitle'), description: t('flashcardsDescription'), href: '/flashcards', icon: 'BookOpen' as const, color: '#1cb0f6' },
    { title: t('grammarTitle'), description: t('grammarDescription'), href: '/grammar', icon: 'GraduationCap' as const, color: '#ce82ff' },
    { title: t('glossaryTitle'), description: t('glossaryDescription'), href: '/glossary', icon: 'Bookmark' as const, color: '#ff9600' },
  ];

  return (
    <div>
      <HeroSection
        locale={locale}
        t={{
          heroTitle: t('heroTitle'),
          heroDescription: t('heroDescription'),
          startQuiz: t('startQuiz'),
          learnMore: t('learnMore'),
          statsLearners: t('statsLearners'),
          statsQuestions: t('statsQuestions'),
          statsLanguages: t('statsLanguages'),
        }}
      />
      <FeatureGrid locale={locale} features={features} />
    </div>
  );
}
