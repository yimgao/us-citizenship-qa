import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { FileText, BookOpen, GraduationCap, BookMarked } from 'lucide-react';
import FeedbackForm from '@/components/FeedbackForm';
import type { Metadata } from 'next';

export async function generateMetadata(
  { params }: { params: Promise<{ locale: 'en'|'es'|'zh' }> }
): Promise<Metadata> {
  const { locale } = await params;
  const dict = {
    en: {
      title: 'U.S. Civics Study Hub | Practice Quiz & Flashcards',
      desc: 'Practice for the U.S. naturalization civics test with our free quiz and flashcard tool. Available in English, Spanish, and Chinese.'
    },
    es: {
      title: 'U.S. Civics Study Hub | Examen y Tarjetas',
      desc: 'Practique para el examen de civismo de naturalización con nuestro quiz y tarjetas. Disponible en inglés, español y chino.'
    },
    zh: {
      title: '美国入籍考试练习中心 | 测验与闪卡',
      desc: '使用我们的免费测验与闪卡工具练习美国入籍公民知识题，支持中文、英文与西语。'
    }
  } as const;
  const lang = (locale === 'en' || locale === 'es' || locale === 'zh') ? locale : 'en';
  const meta = dict[lang];
  return {
    title: meta.title,
    description: meta.desc,
    openGraph: {
      title: meta.title,
      description: meta.desc,
      type: 'website'
    },
    twitter: {
      card: 'summary_large_image',
      title: meta.title,
      description: meta.desc
    }
  };
}

export default async function HomePage({ params }: { params: Promise<{ locale: 'en'|'es'|'zh' }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'home' });

  return (
    <div className="flex min-h-[calc(100vh-8rem)] flex-col items-center justify-center text-center">
      <h1 className="text-headline text-primary animate-fade-in">
        {t('title')}
      </h1>
      <p className="mt-4 sm:mt-6 text-body-lg text-foreground/75 animate-slide-up max-w-2xl">
        {t('subtitle')}
      </p>
      <p className="mt-6 sm:mt-8 text-body-lg font-semibold text-primary animate-slide-up" style={{ animationDelay: '0.1s' }}>
        {t('question')}
      </p>
      <div className="mt-8 sm:mt-10 lg:mt-12 grid w-full grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-2 items-stretch max-w-5xl">
        <Link
          href={`/${locale}/quiz`}
          className="group h-full min-h-[220px] sm:min-h-[240px] rounded-2xl border-2 border-slate-200/50 bg-white/80 backdrop-blur-sm px-6 sm:px-8 py-6 sm:py-8 text-left modern-shadow card-hover btn-press active:bg-blue-50/80 hover:border-blue-300 hover:bg-blue-50/50 flex flex-col justify-between touch-action-manipulation animate-scale-in smooth-hover"
          style={{ animationDelay: '0.2s', animationFillMode: 'both' }}
        >
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 group-hover:from-blue-200 group-hover:to-blue-300 smooth-hover group-hover:scale-110">
              <FileText className="h-6 w-6 sm:h-7 sm:w-7 text-primary smooth-hover group-hover:scale-110" />
            </div>
            <div className="text-subtitle text-primary group-hover:opacity-80 smooth-hover">
              {t('quizTitle')}
            </div>
          </div>
          <p className="mt-4 sm:mt-6 text-body text-foreground/75">
            {t('quizDescription')}
          </p>
        </Link>
        <Link
          href={`/${locale}/flashcards`}
          className="group h-full min-h-[220px] sm:min-h-[240px] rounded-2xl border-2 border-slate-200/50 bg-white/80 backdrop-blur-sm px-6 sm:px-8 py-6 sm:py-8 text-left modern-shadow card-hover btn-press active:bg-blue-50/80 hover:border-blue-300 hover:bg-blue-50/50 flex flex-col justify-between touch-action-manipulation animate-scale-in smooth-hover"
          style={{ animationDelay: '0.3s', animationFillMode: 'both' }}
        >
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 group-hover:from-blue-200 group-hover:to-blue-300 smooth-hover group-hover:scale-110">
              <BookOpen className="h-6 w-6 sm:h-7 sm:w-7 text-primary smooth-hover group-hover:scale-110" />
            </div>
            <div className="text-subtitle text-primary group-hover:opacity-80 smooth-hover">
              {t('flashcardsTitle')}
            </div>
          </div>
          <p className="mt-4 sm:mt-6 text-body text-foreground/75">
            {t('flashcardsDescription')}
          </p>
        </Link>
        <Link
          href={`/${locale}/grammar`}
          className="group h-full min-h-[220px] sm:min-h-[240px] rounded-2xl border-2 border-slate-200/50 bg-white/80 backdrop-blur-sm px-6 sm:px-8 py-6 sm:py-8 text-left modern-shadow card-hover btn-press active:bg-blue-50/80 hover:border-blue-300 hover:bg-blue-50/50 flex flex-col justify-between touch-action-manipulation animate-scale-in smooth-hover"
          style={{ animationDelay: '0.4s', animationFillMode: 'both' }}
        >
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 group-hover:from-blue-200 group-hover:to-blue-300 smooth-hover group-hover:scale-110">
              <GraduationCap className="h-6 w-6 sm:h-7 sm:w-7 text-primary smooth-hover group-hover:scale-110" />
            </div>
            <div className="text-subtitle text-primary group-hover:opacity-80 smooth-hover">
              {t('grammarTitle')}
            </div>
          </div>
          <p className="mt-4 sm:mt-6 text-body text-foreground/75">
            {t('grammarDescription')}
          </p>
        </Link>
        <Link
          href={`/${locale}/glossary`}
          className="group h-full min-h-[220px] sm:min-h-[240px] rounded-2xl border-2 border-slate-200/50 bg-white/80 backdrop-blur-sm px-6 sm:px-8 py-6 sm:py-8 text-left modern-shadow card-hover btn-press active:bg-blue-50/80 hover:border-blue-300 hover:bg-blue-50/50 flex flex-col justify-between touch-action-manipulation animate-scale-in smooth-hover"
          style={{ animationDelay: '0.5s', animationFillMode: 'both' }}
        >
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 group-hover:from-blue-200 group-hover:to-blue-300 smooth-hover group-hover:scale-110">
              <BookMarked className="h-6 w-6 sm:h-7 sm:w-7 text-primary smooth-hover group-hover:scale-110" />
            </div>
            <div className="text-subtitle text-primary group-hover:opacity-80 smooth-hover">
              {t('glossaryTitle')}
            </div>
          </div>
          <p className="mt-4 sm:mt-6 text-body text-foreground/75">
            {t('glossaryDescription')}
          </p>
        </Link>
      </div>
      <p className="mt-8 sm:mt-10 text-caption text-muted">
        {t('suggestion')}
      </p>
      <div className="mt-6 sm:mt-8 w-full max-w-2xl">
        <FeedbackForm />
      </div>
    </div>
  );
}


