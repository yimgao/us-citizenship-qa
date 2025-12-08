/**
 * Hook for handling flashcard swipe gestures
 */

'use client';

import { useSwipeable } from 'react-swipeable';

export interface UseFlashcardSwipeOptions {
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  onSwipeUp: () => void;
  onSwipeDown: () => void;
}

export function useFlashcardSwipe({
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
}: UseFlashcardSwipeOptions) {
  return useSwipeable({
    onSwipedLeft: onSwipeLeft,
    onSwipedRight: onSwipeRight,
    onSwipedUp: onSwipeUp,
    onSwipedDown: onSwipeDown,
    trackMouse: false,
    preventScrollOnSwipe: true,
  });
}
