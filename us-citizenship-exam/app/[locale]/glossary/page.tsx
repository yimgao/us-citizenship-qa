import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import GlossaryViewer from '@/components/glossary/GlossaryViewer';
import type { Locale } from '@/lib/questions';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const meta: Record<string, { title: string; desc: string }> = {
    en: { title: 'Glossary — Citizenship Prep', desc: 'Key terms and definitions for the U.S. naturalization test in English, Spanish, and Chinese.' },
    es: { title: 'Glosario — Citizenship Prep', desc: 'Términos y definiciones clave para el examen de naturalización en inglés, español y chino.' },
    zh: { title: '名词解释 — Citizenship Prep', desc: '美国入籍考试的关键术语和定义，支持英语、西班牙语和中文。' },
  };
  const m = meta[locale as 'en' | 'es' | 'zh'] ?? meta.en;
  return { title: m.title, description: m.desc };
}

export default async function GlossaryPage({ params }: Props) {
  const { locale } = await params;
  const activeLocale = (['en', 'es', 'zh'].includes(locale) ? locale : 'en') as Locale;
  const t = await getTranslations({ locale: activeLocale, namespace: 'glossary' });

  const items = (await import('@/data/glossary/glossary.json')).default;

  return (
    <div className="flex flex-col items-center gap-8 py-6">
      {/* Header */}
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-display font-bold text-fg">{t('title')}</h1>
        <p className="max-w-xl text-body text-muted-foreground">{t('description')}</p>
      </div>

      <GlossaryViewer items={items} locale={activeLocale} />
    </div>
  );
}
