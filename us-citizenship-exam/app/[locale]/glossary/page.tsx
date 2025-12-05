import GlossaryViewer from '@/components/glossary/GlossaryViewer';
import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';

type GlossaryItem = {
  id: string;
  term: {
    en: string;
    zh: string;
    es: string;
  };
  definitions: {
    en: string;
    zh: string;
    es: string;
  };
};

async function loadGlossary(): Promise<GlossaryItem[]> {
  try {
    const mod = await import('@/data/glossary/glossary.json');
    return (mod.default ?? []) as GlossaryItem[];
  } catch {
    return [];
  }
}

export async function generateMetadata(
  { params }: { params: { locale: 'en'|'es'|'zh' } }
): Promise<Metadata> {
  const { locale } = params;
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

export default async function GlossaryPage({
  params,
}: {
  params: Promise<{ locale: 'en' | 'es' | 'zh' }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'glossary' });
  const items = await loadGlossary();

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6">
        <h1 className="mb-4 text-center text-3xl font-bold text-slate-900">{t('title')}</h1>
        <p className="text-center text-slate-600">{t('description')}</p>
      </div>
      <GlossaryViewer items={items} locale={locale} />
    </div>
  );
}

