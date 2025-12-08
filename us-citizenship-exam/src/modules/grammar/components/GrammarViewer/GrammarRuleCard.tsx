/**
 * Grammar rule card component with flip animation
 */

'use client';

import { memo } from 'react';
import { RotateCw, Volume2, VolumeX } from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { GrammarRule } from '../../types/grammar.types';
import type { Locale } from '@/core/types';

interface GrammarRuleCardProps {
  rule: GrammarRule;
  locale: Locale;
  showExplanation: boolean;
  speakingLang: Locale | null;
  onFlip: () => void;
  onSpeak: (text: string, lang: Locale) => void;
  swipeHandlers: ReturnType<typeof import('react-swipeable').useSwipeable>;
}

export const GrammarRuleCard = memo(function GrammarRuleCard({
  rule,
  locale,
  showExplanation,
  speakingLang,
  onFlip,
  onSpeak,
  swipeHandlers,
}: GrammarRuleCardProps) {
  const t = useTranslations('grammar');

  return (
    <div className="relative mb-6">
      <div
        {...swipeHandlers}
        onClick={onFlip}
        className="group relative mx-auto aspect-[4/3] w-full cursor-pointer select-none [perspective:1000px] touch-action-pan-y"
      >
        <div
          className={`absolute inset-0 rounded-2xl bg-white shadow-lg transition-transform duration-700 [transform-style:preserve-3d] ${
            showExplanation ? '[transform:rotateY(180deg)]' : ''
          }`}
        >
          {/* Front Side - Rule Title */}
          <div className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-white p-4 sm:p-8 [backface-visibility:hidden]">
            <div className="mb-3 sm:mb-4 rounded-full bg-blue-100 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-blue-700">
              {t('ruleTitle')}
            </div>
            <p className="max-w-xl text-center text-lg sm:text-xl md:text-2xl font-bold leading-relaxed text-slate-900">
              {rule.title[locale]}
            </p>
            <div className="mt-6 flex items-center gap-2 text-sm text-slate-500">
              <RotateCw className="h-4 w-4" />
              <span>{t('clickToFlip')}</span>
            </div>
          </div>

          {/* Back Side - Explanation and Examples */}
          <div className="absolute inset-0 flex flex-col rounded-2xl border-2 border-green-200 bg-gradient-to-br from-green-50 to-white p-4 sm:p-6 [backface-visibility:hidden] [transform:rotateY(180deg)] overflow-y-auto max-h-[60vh] sm:max-h-none">
            <div className="mb-3 rounded-full bg-green-100 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-green-700">
              {t('explanation')}
            </div>

            {/* Explanation in 3 languages */}
            <div className="mb-3 sm:mb-4 w-full rounded-lg bg-white/80 p-3 sm:p-4 shadow-sm">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-semibold uppercase text-slate-500">🇺🇸 English</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSpeak(rule.explanation.en, 'en');
                  }}
                  className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded p-2 active:bg-slate-200 hover:bg-slate-100 transition-colors touch-action-manipulation"
                  title={speakingLang === 'en' ? t('stopSpeaking') : t('speak')}
                >
                  {speakingLang === 'en' ? (
                    <VolumeX className="h-5 w-5 text-slate-600" />
                  ) : (
                    <Volume2 className="h-5 w-5 text-slate-600" />
                  )}
                </button>
              </div>
              <p className="text-sm sm:text-base font-medium leading-relaxed text-slate-800">
                {rule.explanation.en}
              </p>
            </div>

            <div className="mb-3 sm:mb-4 w-full rounded-lg bg-white/80 p-3 sm:p-4 shadow-sm">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-semibold uppercase text-slate-500">🇪🇸 Español</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSpeak(rule.explanation.es, 'es');
                  }}
                  className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded p-2 active:bg-slate-200 hover:bg-slate-100 transition-colors touch-action-manipulation"
                  title={speakingLang === 'es' ? t('stopSpeaking') : t('speak')}
                >
                  {speakingLang === 'es' ? (
                    <VolumeX className="h-5 w-5 text-slate-600" />
                  ) : (
                    <Volume2 className="h-5 w-5 text-slate-600" />
                  )}
                </button>
              </div>
              <p className="text-sm sm:text-base font-medium leading-relaxed text-slate-800">
                {rule.explanation.es}
              </p>
            </div>

            <div className="mb-3 sm:mb-4 w-full rounded-lg bg-white/80 p-3 sm:p-4 shadow-sm">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-semibold uppercase text-slate-500">🇨🇳 中文</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSpeak(rule.explanation.zh, 'zh');
                  }}
                  className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded p-2 active:bg-slate-200 hover:bg-slate-100 transition-colors touch-action-manipulation"
                  title={speakingLang === 'zh' ? t('stopSpeaking') : t('speak')}
                >
                  {speakingLang === 'zh' ? (
                    <VolumeX className="h-5 w-5 text-slate-600" />
                  ) : (
                    <Volume2 className="h-5 w-5 text-slate-600" />
                  )}
                </button>
              </div>
              <p className="text-sm sm:text-base font-medium leading-relaxed text-slate-800">
                {rule.explanation.zh}
              </p>
            </div>

            {/* Examples */}
            {rule.examples.length > 0 && (
              <div className="mb-2 w-full">
                <div className="mb-2 text-xs font-semibold uppercase text-slate-500">
                  {t('examples')}
                </div>
                {rule.examples.map((example, idx) => (
                  <div key={idx} className="mb-2 rounded-lg bg-white/80 p-3 shadow-sm">
                    <p className="text-sm font-medium text-slate-900">
                      {example.highlight ? (
                        <>
                          {example.sentence.split(example.highlight)[0]}
                          <span className="bg-yellow-200 font-bold">{example.highlight}</span>
                          {example.sentence.split(example.highlight)[1]}
                        </>
                      ) : (
                        example.sentence
                      )}
                    </p>
                    <p className="mt-1 text-xs text-slate-600">{example.translation[locale]}</p>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
              <RotateCw className="h-3 w-3" />
              <span>{t('clickToFlipBack')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
