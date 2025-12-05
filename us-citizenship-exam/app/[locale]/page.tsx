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
    <div className="mx-auto max-w-4xl">
      <div className="flex min-h-[calc(100vh-8rem)] flex-col items-center justify-center text-center px-4">
        <h1 className="text-display text-slate-900 animate-fade-in">
          {t('title')}
        </h1>
        <p className="mt-4 text-body-lg text-slate-600 animate-slide-up">
          {t('subtitle')}
        </p>
        <p className="mt-6 text-title text-slate-700 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          {t('question')}
        </p>
        <div className="mt-10 grid w-full grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-2 items-stretch">
          <Link
            href={`/${locale}/quiz`}
            className="group h-full min-h-[200px] sm:min-h-[220px] rounded-2xl border-2 border-slate-200 bg-white px-6 sm:px-8 py-6 sm:py-8 text-left shadow-sm card-hover btn-press active:bg-blue-50 hover:border-blue-400 hover:bg-blue-50 flex flex-col justify-between touch-action-manipulation animate-scale-in"
            style={{ animationDelay: '0.2s', animationFillMode: 'both' }}
          >
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 group-hover:bg-blue-200 transition-all duration-300 group-hover:scale-110">
                <FileText className="h-6 w-6 text-blue-600 transition-transform group-hover:scale-110" />
              </div>
              <div className="text-title text-slate-900 group-hover:text-blue-700 transition-colors">
                {t('quizTitle')}
              </div>
            </div>
            <p className="mt-4 text-body text-slate-600">
              {t('quizDescription')}
            </p>
          </Link>
          <Link
            href={`/${locale}/flashcards`}
            className="group h-full min-h-[200px] sm:min-h-[220px] rounded-2xl border-2 border-slate-200 bg-white px-6 sm:px-8 py-6 sm:py-8 text-left shadow-sm card-hover btn-press active:bg-blue-50 hover:border-blue-400 hover:bg-blue-50 flex flex-col justify-between touch-action-manipulation animate-scale-in"
            style={{ animationDelay: '0.3s', animationFillMode: 'both' }}
          >
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 group-hover:bg-blue-200 transition-all duration-300 group-hover:scale-110">
                <BookOpen className="h-6 w-6 text-blue-600 transition-transform group-hover:scale-110" />
              </div>
              <div className="text-title text-slate-900 group-hover:text-blue-700 transition-colors">
                {t('flashcardsTitle')}
              </div>
            </div>
            <p className="mt-4 text-body text-slate-600">
              {t('flashcardsDescription')}
            </p>
          </Link>
          <Link
            href={`/${locale}/grammar`}
            className="group h-full min-h-[200px] sm:min-h-[220px] rounded-2xl border-2 border-slate-200 bg-white px-6 sm:px-8 py-6 sm:py-8 text-left shadow-sm card-hover btn-press active:bg-blue-50 hover:border-blue-400 hover:bg-blue-50 flex flex-col justify-between touch-action-manipulation animate-scale-in"
            style={{ animationDelay: '0.4s', animationFillMode: 'both' }}
          >
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 group-hover:bg-blue-200 transition-all duration-300 group-hover:scale-110">
                <GraduationCap className="h-6 w-6 text-blue-600 transition-transform group-hover:scale-110" />
              </div>
              <div className="text-title text-slate-900 group-hover:text-blue-700 transition-colors">
                {t('grammarTitle')}
              </div>
            </div>
            <p className="mt-4 text-body text-slate-600">
              {t('grammarDescription')}
            </p>
          </Link>
          <Link
            href={`/${locale}/glossary`}
            className="group h-full min-h-[200px] sm:min-h-[220px] rounded-2xl border-2 border-slate-200 bg-white px-6 sm:px-8 py-6 sm:py-8 text-left shadow-sm card-hover btn-press active:bg-blue-50 hover:border-blue-400 hover:bg-blue-50 flex flex-col justify-between touch-action-manipulation animate-scale-in"
            style={{ animationDelay: '0.5s', animationFillMode: 'both' }}
          >
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 group-hover:bg-blue-200 transition-all duration-300 group-hover:scale-110">
                <BookMarked className="h-6 w-6 text-blue-600 transition-transform group-hover:scale-110" />
              </div>
              <div className="text-title text-slate-900 group-hover:text-blue-700 transition-colors">
                {t('glossaryTitle')}
              </div>
            </div>
            <p className="mt-4 text-body text-slate-600">
              {t('glossaryDescription')}
            </p>
          </Link>
        </div>
        <p className="mt-8 text-sm text-slate-500">
          {t('suggestion')}
        </p>
        <FeedbackForm />
      </div>
    </div>
  );
}


