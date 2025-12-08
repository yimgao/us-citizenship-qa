/**
 * Hook for managing grammar viewer state and logic
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSwipeable } from 'react-swipeable';
import { useTTS } from '@/shared/hooks/useTTS';
import type { Locale } from '@/core/types';
import type { GrammarRule } from '../types/grammar.types';

export interface UseGrammarOptions {
  rules: GrammarRule[];
  locale: Locale;
}

export function useGrammar({ rules, locale }: UseGrammarOptions) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [speakingLang, setSpeakingLang] = useState<Locale | null>(null);

  const tts = useTTS(locale);

  // Stop TTS when rule changes
  useEffect(() => {
    tts.stop();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setShowExplanation(false);
    setSpeakingLang(null);
  }, [currentIndex, tts]);

  const stopSpeaking = useCallback(() => {
    tts.stop();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setSpeakingLang(null);
  }, [tts]);

  // Keyboard shortcuts
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === ' ') {
        e.preventDefault();
        setShowExplanation((v) => !v);
      }
      if (e.key === 'ArrowRight') {
        setCurrentIndex((v) => Math.min(rules.length - 1, v + 1));
        setShowExplanation(false);
        stopSpeaking();
      }
      if (e.key === 'ArrowLeft') {
        setCurrentIndex((v) => Math.max(0, v - 1));
        setShowExplanation(false);
        stopSpeaking();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [rules.length, stopSpeaking]);

  // Speak text in specific language
  const speakInLang = useCallback((text: string, lang: Locale) => {
    if (speakingLang === lang) {
      stopSpeaking();
    } else {
      const utterance = new SpeechSynthesisUtterance(text);
      const langMap: Record<Locale, string> = {
        en: 'en-US',
        es: 'es-ES',
        zh: 'zh-CN',
      };
      utterance.lang = langMap[lang] || 'en-US';
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 1;

      utterance.onstart = () => setSpeakingLang(lang);
      utterance.onend = () => setSpeakingLang(null);
      utterance.onerror = () => setSpeakingLang(null);

      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(utterance);
      }
    }
  }, [speakingLang, stopSpeaking]);

  // Swipe handlers
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => {
      if (currentIndex < rules.length - 1) {
        setCurrentIndex((v) => Math.min(rules.length - 1, v + 1));
        setShowExplanation(false);
        stopSpeaking();
      }
    },
    onSwipedRight: () => {
      if (currentIndex > 0) {
        setCurrentIndex((v) => Math.max(0, v - 1));
        setShowExplanation(false);
        stopSpeaking();
      }
    },
    trackMouse: false,
    preventScrollOnSwipe: true,
  });

  const currentRule = rules[currentIndex];
  const progress = ((currentIndex + 1) / rules.length) * 100;

  const goToNext = useCallback(() => {
    if (currentIndex < rules.length - 1) {
      setCurrentIndex((v) => Math.min(rules.length - 1, v + 1));
      setShowExplanation(false);
      stopSpeaking();
    }
  }, [currentIndex, rules.length, stopSpeaking]);

  const goToPrevious = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((v) => Math.max(0, v - 1));
      setShowExplanation(false);
      stopSpeaking();
    }
  }, [currentIndex, stopSpeaking]);

  const toggleFlip = useCallback(() => {
    setShowExplanation((v) => !v);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopSpeaking();
    };
  }, [stopSpeaking]);

  return {
    currentIndex,
    showExplanation,
    speakingLang,
    currentRule,
    progress,
    goToNext,
    goToPrevious,
    toggleFlip,
    speakInLang,
    stopSpeaking,
    swipeHandlers,
  };
}
