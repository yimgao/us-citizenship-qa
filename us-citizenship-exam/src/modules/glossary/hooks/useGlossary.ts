/**
 * Hook for managing glossary state and logic
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSwipeable } from 'react-swipeable';
import { useTTS } from '@/shared/hooks/useTTS';
import type { Locale } from '@/core/types';
import type { GlossaryItem } from '../types/glossary.types';

export interface UseGlossaryOptions {
  items: GlossaryItem[];
  locale: Locale;
}

export function useGlossary({ items, locale }: UseGlossaryOptions) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showDefinition, setShowDefinition] = useState(false);
  const [speakingLang, setSpeakingLang] = useState<Locale | null>(null);

  const tts = useTTS(locale);

  // Stop TTS when item changes
  useEffect(() => {
    tts.stop();
    setShowDefinition(false);
    setSpeakingLang(null);
  }, [currentIndex, tts]);

  // Keyboard shortcuts
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === ' ') {
        e.preventDefault();
        setShowDefinition((v) => !v);
      }
      if (e.key === 'ArrowRight') {
        setCurrentIndex((v) => Math.min(items.length - 1, v + 1));
        setShowDefinition(false);
        tts.stop();
      }
      if (e.key === 'ArrowLeft') {
        setCurrentIndex((v) => Math.max(0, v - 1));
        setShowDefinition(false);
        tts.stop();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [items.length, tts]);

  // Speak text in specific language
  const speakInLang = useCallback(
    (text: string, lang: Locale) => {
      if (speakingLang === lang) {
        tts.stop();
        setSpeakingLang(null);
      } else {
        // Create a temporary TTS instance for the specific language
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
    },
    [speakingLang, tts]
  );

  const stopSpeaking = useCallback(() => {
    tts.stop();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setSpeakingLang(null);
  }, [tts]);

  // Swipe handlers
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => {
      if (currentIndex < items.length - 1) {
        setCurrentIndex((v) => Math.min(items.length - 1, v + 1));
        setShowDefinition(false);
        stopSpeaking();
      }
    },
    onSwipedRight: () => {
      if (currentIndex > 0) {
        setCurrentIndex((v) => Math.max(0, v - 1));
        setShowDefinition(false);
        stopSpeaking();
      }
    },
    trackMouse: false,
    preventScrollOnSwipe: true,
  });

  const currentItem = items[currentIndex];
  const progress = ((currentIndex + 1) / items.length) * 100;

  const goToNext = useCallback(() => {
    if (currentIndex < items.length - 1) {
      setCurrentIndex((v) => Math.min(items.length - 1, v + 1));
      setShowDefinition(false);
      stopSpeaking();
    }
  }, [currentIndex, items.length, stopSpeaking]);

  const goToPrevious = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((v) => Math.max(0, v - 1));
      setShowDefinition(false);
      stopSpeaking();
    }
  }, [currentIndex, stopSpeaking]);

  const toggleFlip = useCallback(() => {
    setShowDefinition((v) => !v);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopSpeaking();
    };
  }, [stopSpeaking]);

  return {
    currentIndex,
    showDefinition,
    speakingLang,
    currentItem,
    progress,
    goToNext,
    goToPrevious,
    toggleFlip,
    speakInLang,
    stopSpeaking,
    swipeHandlers,
  };
}
