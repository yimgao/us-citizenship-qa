"use client";
import { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, RotateCw, Volume2, VolumeX } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useSwipeable } from 'react-swipeable';
import type { GrammarRule } from '@/lib/grammar';

export default function GrammarViewer({ rules, locale }: { rules: GrammarRule[]; locale: 'en'|'es'|'zh' }) {
  const t = useTranslations('grammar');
  const [index, setIndex] = useState(0);
  const [show, setShow] = useState(false);
  const [speakingLang, setSpeakingLang] = useState<'en'|'es'|'zh'|null>(null);
  const [synth, setSynth] = useState<SpeechSynthesis | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setSynth(window.speechSynthesis);
    }
  }, []);

  // keyboard shortcuts
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === ' ') { e.preventDefault(); setShow(v => !v); }
      if (e.key === 'ArrowRight') { setIndex(v => Math.min(rules.length - 1, v + 1)); setShow(false); }
      if (e.key === 'ArrowLeft') { setIndex(v => Math.max(0, v - 1)); setShow(false); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [rules.length]);

  const speak = (text: string, lang: 'en'|'es'|'zh') => {
    if (!synth) return;
    
    synth.cancel();
    setSpeakingLang(null);
    
    const utterance = new SpeechSynthesisUtterance(text);
    const langMap: Record<'en'|'es'|'zh', string> = {
      en: 'en-US',
      es: 'es-ES',
      zh: 'zh-CN'
    };
    utterance.lang = langMap[lang] || 'en-US';
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onstart = () => setSpeakingLang(lang);
    utterance.onend = () => setSpeakingLang(null);
    utterance.onerror = () => setSpeakingLang(null);

    synth.speak(utterance);
  };

  const stopSpeaking = () => {
    if (synth) {
      synth.cancel();
      setSpeakingLang(null);
    }
  };

  useEffect(() => {
    return () => {
      if (synth) {
        synth.cancel();
      }
    };
  }, [synth]);

  if (rules.length === 0) {
    return (
      <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
        <p className="text-lg text-slate-600">{t('noRules')}</p>
      </div>
    );
  }

  const rule = rules[index];
  const pct = ((index + 1) / rules.length) * 100;

  // Swipe handlers
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => {
      if (index < rules.length - 1) {
        setIndex((v) => Math.min(rules.length - 1, v + 1));
        setShow(false);
        stopSpeaking();
      }
    },
    onSwipedRight: () => {
      if (index > 0) {
        setIndex((v) => Math.max(0, v - 1));
        setShow(false);
        stopSpeaking();
      }
    },
    trackMouse: false,
    preventScrollOnSwipe: true,
  });

  return (
    <div className="mx-auto max-w-2xl">
      {/* Progress */}
      <div className="mb-6">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm sm:text-base font-medium text-slate-600">
            {t('ruleCount', { current: index + 1, total: rules.length })}
          </span>
          <span className="text-sm sm:text-base font-medium text-slate-600">{Math.round(pct)}%</span>
        </div>
        <div className="h-2 sm:h-3 overflow-hidden rounded-full bg-slate-200">
          <div
            className="h-full bg-blue-600 transition-all duration-500 ease-out"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {/* Grammar Card */}
      <div className="relative mb-6">
        <div
          {...swipeHandlers}
          onClick={() => setShow(v => !v)}
          className="group relative mx-auto aspect-[4/3] w-full cursor-pointer select-none [perspective:1000px] touch-action-pan-y"
        >
          <div
            className={`absolute inset-0 rounded-2xl bg-white shadow-lg transition-transform duration-700 [transform-style:preserve-3d] ${
              show ? '[transform:rotateY(180deg)]' : ''
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
                      if (speakingLang === 'en') {
                        stopSpeaking();
                      } else {
                        speak(rule.explanation.en, 'en');
                      }
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
                      if (speakingLang === 'es') {
                        stopSpeaking();
                      } else {
                        speak(rule.explanation.es, 'es');
                      }
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
                      if (speakingLang === 'zh') {
                        stopSpeaking();
                      } else {
                        speak(rule.explanation.zh, 'zh');
                      }
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
                      <p className="mt-1 text-xs text-slate-600">
                        {example.translation[locale]}
                      </p>
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

      {/* Navigation Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-4">
        <button
          onClick={() => { setIndex((v) => Math.max(0, v - 1)); setShow(false); stopSpeaking(); }}
          disabled={index === 0}
          className="w-full sm:w-auto min-h-[44px] flex items-center justify-center gap-2 rounded-xl border-2 border-slate-200 bg-white px-6 py-3 font-semibold text-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed active:bg-slate-100 hover:bg-slate-50 touch-action-manipulation"
        >
          <ArrowLeft className="h-5 w-5" />
          {t('previous')}
        </button>

        <button
          onClick={() => { setIndex((v) => Math.min(rules.length - 1, v + 1)); setShow(false); stopSpeaking(); }}
          disabled={index === rules.length - 1}
          className="w-full sm:w-auto min-h-[44px] flex items-center justify-center gap-2 rounded-xl border-2 border-slate-200 bg-white px-6 py-3 font-semibold text-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed active:bg-slate-100 hover:bg-slate-50 touch-action-manipulation"
        >
          {t('next')}
          <ArrowRight className="h-5 w-5" />
        </button>
      </div>

      {/* Keyboard Tip */}
      <p className="mt-4 text-center text-xs text-slate-500">{t('tip')}</p>
    </div>
  );
}

