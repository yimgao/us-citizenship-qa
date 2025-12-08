"use client";
import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import { FileText, BookOpen, GraduationCap, BookMarked, Link as LinkIcon, Heart } from 'lucide-react';

export default function Footer() {
  const t = useTranslations('footer');
  const pathname = usePathname();
  const locale = (pathname?.split('/')?.[1] || 'en') as 'en'|'es'|'zh';
  
  return (
    <footer className="relative mt-12 sm:mt-16 lg:mt-20 border-t-2 border-slate-200/60 bg-gradient-to-b from-white via-slate-50/30 to-slate-50/50 safe-area-inset-x safe-area-inset-y">
      {/* Decorative top border gradient */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-blue-300 to-transparent opacity-50" />
      
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14 lg:py-20">
        {/* Mobile: Single column, Desktop: Multi-column */}
        <div className="grid grid-cols-1 gap-10 sm:gap-12 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand/Info Section */}
          <div className="space-y-5 sm:space-y-6">
            <div className="space-y-3">
              <h3 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                {t('title') || 'U.S. Civics Study Hub'}
              </h3>
              <div className="w-12 h-1 bg-gradient-to-r from-blue-500 to-blue-300 rounded-full" />
            </div>
            <p className="text-body leading-relaxed text-slate-600 max-w-sm">
              {t('description') || 'Practice for the U.S. naturalization test with interactive quizzes and flashcards.'}
            </p>
          </div>

          {/* Quick Links Section */}
          <div className="space-y-5">
            <div>
              <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-1">
                {t('quickLinks') || 'Quick Links'}
              </h4>
              <div className="w-8 h-0.5 bg-blue-400 rounded-full" />
            </div>
            <nav className="flex flex-col space-y-3">
              <a 
                href={`/${locale}/quiz`} 
                className="group flex items-center gap-3 text-body font-medium text-slate-700 smooth-hover touch-target rounded-lg px-3 py-2 -ml-3 hover:bg-blue-50/50 hover:text-blue-700 transition-all duration-200"
              >
                <div className="p-1.5 rounded-md bg-blue-100 group-hover:bg-blue-200 transition-colors">
                  <FileText className="h-4 w-4 text-blue-600" />
                </div>
                <span>{t('quiz') || 'Quiz'}</span>
              </a>
              <a 
                href={`/${locale}/flashcards`} 
                className="group flex items-center gap-3 text-body font-medium text-slate-700 smooth-hover touch-target rounded-lg px-3 py-2 -ml-3 hover:bg-blue-50/50 hover:text-blue-700 transition-all duration-200"
              >
                <div className="p-1.5 rounded-md bg-blue-100 group-hover:bg-blue-200 transition-colors">
                  <BookOpen className="h-4 w-4 text-blue-600" />
                </div>
                <span>{t('flashcards') || 'Flashcards'}</span>
              </a>
              <a 
                href={`/${locale}/glossary`} 
                className="group flex items-center gap-3 text-body font-medium text-slate-700 smooth-hover touch-target rounded-lg px-3 py-2 -ml-3 hover:bg-blue-50/50 hover:text-blue-700 transition-all duration-200"
              >
                <div className="p-1.5 rounded-md bg-blue-100 group-hover:bg-blue-200 transition-colors">
                  <BookMarked className="h-4 w-4 text-blue-600" />
                </div>
                <span>{t('glossary') || 'Glossary'}</span>
              </a>
              <a 
                href={`/${locale}/grammar`} 
                className="group flex items-center gap-3 text-body font-medium text-slate-700 smooth-hover touch-target rounded-lg px-3 py-2 -ml-3 hover:bg-blue-50/50 hover:text-blue-700 transition-all duration-200"
              >
                <div className="p-1.5 rounded-md bg-blue-100 group-hover:bg-blue-200 transition-colors">
                  <GraduationCap className="h-4 w-4 text-blue-600" />
                </div>
                <span>{t('grammar') || 'Grammar'}</span>
              </a>
            </nav>
          </div>

          {/* Resources Section */}
          <div className="space-y-5">
            <div>
              <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-1">
                {t('resources') || 'Resources'}
              </h4>
              <div className="w-8 h-0.5 bg-blue-400 rounded-full" />
            </div>
            <nav className="flex flex-col space-y-3">
              <a 
                href={`/${locale}/resources`} 
                className="group flex items-center gap-3 text-body font-medium text-slate-700 smooth-hover touch-target rounded-lg px-3 py-2 -ml-3 hover:bg-blue-50/50 hover:text-blue-700 transition-all duration-200"
              >
                <div className="p-1.5 rounded-md bg-blue-100 group-hover:bg-blue-200 transition-colors">
                  <LinkIcon className="h-4 w-4 text-blue-600" />
                </div>
                <span>{t('resources') || 'Resources'}</span>
              </a>
              <a 
                href={`/${locale}/resources#feedback`} 
                className="group flex items-center gap-3 text-body font-medium text-slate-700 smooth-hover touch-target rounded-lg px-3 py-2 -ml-3 hover:bg-blue-50/50 hover:text-blue-700 transition-all duration-200"
              >
                <div className="p-1.5 rounded-md bg-blue-100 group-hover:bg-blue-200 transition-colors">
                  <Heart className="h-4 w-4 text-blue-600" />
                </div>
                <span>{t('feedback')}</span>
              </a>
            </nav>
          </div>

          {/* About Section */}
          <div className="space-y-5">
            <div>
              <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-1">
                {t('about') || 'About'}
              </h4>
              <div className="w-8 h-0.5 bg-blue-400 rounded-full" />
            </div>
            <div className="bg-gradient-to-br from-blue-50/50 to-slate-50/50 rounded-xl p-4 border border-blue-100/50">
              <p className="text-body leading-relaxed text-slate-700">
                {t('text')}
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 sm:mt-16 pt-8 sm:pt-10 border-t border-slate-200/60">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-center sm:text-left text-body-sm text-slate-500">
              © {new Date().getFullYear()} <span className="font-semibold text-slate-700">{t('title') || 'U.S. Civics Study Hub'}</span>. {t('rights') || 'All rights reserved.'}
            </p>
            <a 
              href={`/${locale}/resources#feedback`} 
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-body-sm font-medium text-blue-600 bg-blue-50/50 smooth-hover hover:bg-blue-100 hover:text-blue-700 touch-target transition-all duration-200"
            >
              <Heart className="h-4 w-4" />
              <span>{t('feedback')}</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}


