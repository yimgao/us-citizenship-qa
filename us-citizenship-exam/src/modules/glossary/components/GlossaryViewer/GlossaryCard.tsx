/**
 * Glossary card component with flip animation
 */

'use client';

import { memo } from 'react';
import { RotateCw, Volume2, VolumeX } from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { GlossaryItem } from '../../types/glossary.types';
import type { Locale } from '@/core/types';

interface GlossaryCardProps {
  item: GlossaryItem;
  showDefinition: boolean;
  speakingLang: Locale | null;
  onFlip: () => void;
  onSpeak: (text: string, lang: Locale) => void;
  swipeHandlers: ReturnType<typeof import('react-swipeable').useSwipeable>;
}

export const GlossaryCard = memo(function GlossaryCard({
  item,
  showDefinition,
  speakingLang,
  onFlip,
  onSpeak,
  swipeHandlers,
}: GlossaryCardProps) {
  const t = useTranslations('glossary');

  return (
    <div className="relative mb-6">
      <div
        {...swipeHandlers}
        onClick={onFlip}
        className="group relative mx-auto aspect-[4/3] w-full cursor-pointer select-none [perspective:1000px] touch-action-pan-y"
      >
        <div
          className={`absolute inset-0 rounded-2xl bg-white shadow-lg transition-transform duration-700 [transform-style:preserve-3d] ${
            showDefinition ? '[transform:rotateY(180deg)]' : ''
          }`}
        >
          {/* Front Side - Term (all languages) */}
          <div className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-white p-4 sm:p-6 [backface-visibility:hidden] overflow-y-auto max-h-[60vh] sm:max-h-none">
            <div className="mb-3 sm:mb-4 rounded-full bg-blue-100 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-blue-700">
              {t('term')}
            </div>

            {/* English Term */}
            <div className="mb-3 sm:mb-4 w-full rounded-lg bg-white/80 p-3 sm:p-4 shadow-sm">
              <div className="mb-2 text-center">
                <span className="text-xs font-semibold uppercase text-slate-500">🇺🇸 English</span>
              </div>
              <p className="text-center text-lg sm:text-xl font-bold leading-relaxed text-slate-900">
                {item.term.en}
              </p>
            </div>

            {/* Spanish Term */}
            <div className="mb-3 sm:mb-4 w-full rounded-lg bg-white/80 p-3 sm:p-4 shadow-sm">
              <div className="mb-2 text-center">
                <span className="text-xs font-semibold uppercase text-slate-500">🇪🇸 Español</span>
              </div>
              <p className="text-center text-lg sm:text-xl font-bold leading-relaxed text-slate-900">
                {item.term.es}
              </p>
            </div>

            {/* Chinese Term */}
            <div className="mb-2 w-full rounded-lg bg-white/80 p-3 sm:p-4 shadow-sm">
              <div className="mb-2 text-center">
                <span className="text-xs font-semibold uppercase text-slate-500">🇨🇳 中文</span>
              </div>
              <p className="text-center text-lg sm:text-xl font-bold leading-relaxed text-slate-900">
                {item.term.zh}
              </p>
            </div>

            <div className="mt-4 flex items-center gap-2 text-sm text-slate-500">
              <RotateCw className="h-4 w-4" />
              <span>{t('clickToFlip')}</span>
            </div>
          </div>

          {/* Back Side - Definitions in 3 languages */}
          <div className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl border-2 border-green-200 bg-gradient-to-br from-green-50 to-white p-4 sm:p-6 [backface-visibility:hidden] [transform:rotateY(180deg)] overflow-y-auto max-h-[60vh] sm:max-h-none">
            <div className="mb-3 rounded-full bg-green-100 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-green-700">
              {t('definitions')}
            </div>

            {/* English */}
            <div className="mb-3 sm:mb-4 w-full rounded-lg bg-white/80 p-3 sm:p-4 shadow-sm">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-semibold uppercase text-slate-500">🇺🇸 English</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSpeak(item.definitions.en, 'en');
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
                {item.definitions.en}
              </p>
            </div>

            {/* Spanish */}
            <div className="mb-3 sm:mb-4 w-full rounded-lg bg-white/80 p-3 sm:p-4 shadow-sm">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-semibold uppercase text-slate-500">🇪🇸 Español</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSpeak(item.definitions.es, 'es');
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
                {item.definitions.es}
              </p>
            </div>

            {/* Chinese */}
            <div className="mb-2 w-full rounded-lg bg-white/80 p-3 sm:p-4 shadow-sm">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-semibold uppercase text-slate-500">🇨🇳 中文</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSpeak(item.definitions.zh, 'zh');
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
                {item.definitions.zh}
              </p>
            </div>

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
