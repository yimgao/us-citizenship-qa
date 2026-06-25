'use client';

import { ArrowRight, BookOpen } from 'lucide-react';

interface HeroSectionProps {
  locale: string;
  t: {
    heroTitle: string;
    heroDescription: string;
    startQuiz: string;
    learnMore: string;
    statsLearners: string;
    statsQuestions: string;
    statsLanguages: string;
  };
}

export default function HeroSection({ locale, t }: HeroSectionProps) {
  return (
    <section className="rounded-2xl bg-gradient-to-br from-primary to-[#46a502] p-6 sm:p-10 md:p-14">
      <div className="flex flex-col items-center text-center">
        <h1 className="text-hero font-bold leading-tight tracking-tight text-primary-fg">
          {t.heroTitle}
        </h1>
        <p className="mt-3 max-w-lg text-body-lg text-primary-fg/80">
          {t.heroDescription}
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <a
            href={`/${locale}/quiz`}
            className="flex h-12 items-center gap-2 rounded-2xl bg-white px-7 text-base font-bold text-primary shadow-md transition-all hover:brightness-95 active:scale-[0.97]"
          >
            {t.startQuiz}
            <ArrowRight size={18} />
          </a>
          <a
            href={`/${locale}/flashcards`}
            className="flex h-12 items-center gap-2 rounded-2xl border-2 border-white/30 px-7 text-base font-bold text-white transition-all hover:bg-white/10 active:scale-[0.97]"
          >
            <BookOpen size={18} />
            {t.learnMore}
          </a>
        </div>
        <div className="mt-8 grid w-full max-w-lg grid-cols-3 gap-3 rounded-2xl bg-white/15 p-4">
          {[
            { value: '10K+', label: t.statsLearners },
            { value: '100', label: t.statsQuestions },
            { value: '3', label: t.statsLanguages },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-xl font-bold text-white sm:text-2xl">{s.value}</div>
              <div className="text-xs text-white/70 sm:text-sm">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
