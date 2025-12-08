import { GlossaryViewer, GlossaryService } from '@/modules/glossary';
import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import type { Locale } from '@/core/types';
import { Suspense } from 'react';
import { GlossaryLoadingSkeleton } from '@/shared/ui/loading';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const dict = {
    en: {
      title: 'Glossary | U.S. Civics Study Hub',
      desc: 'Learn key terms and definitions for the U.S. civics test in English, Spanish, and Chinese.'
    },
    es: {
      title: 'Glosario | Centro de Estudio Cívico de EE. UU.',
      desc: 'Aprende términos clave y definiciones para el examen cívico de EE. UU. en inglés, español y chino.'
    },
    zh: {
      title: '名词解释 | 美国入籍考试练习中心',
      desc: '学习美国公民考试的关键术语和定义，支持中文、英文与西语。'
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

async function GlossaryContent({
  locale,
}: {
  locale: 'en' | 'es' | 'zh';
}) {
  try {
    const items = await GlossaryService.loadGlossary();
    return <GlossaryViewer items={items} locale={locale} />;
  } catch (error) {
    throw new Error(`Failed to load glossary: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export default async function GlossaryPage({
  params,
}: {
  params: Promise<{ locale: 'en' | 'es' | 'zh' }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'glossary' });

  return (
    <div>
      <div className="mb-6 sm:mb-8">
        <h1 className="mb-4 sm:mb-6 text-center text-headline text-primary">{t('title')}</h1>
        <p className="text-center text-body text-foreground/75 max-w-2xl mx-auto">{t('description')}</p>
      </div>
      <Suspense fallback={<GlossaryLoadingSkeleton />}>
        <GlossaryContent locale={locale} />
      </Suspense>
    </div>
  );
}

