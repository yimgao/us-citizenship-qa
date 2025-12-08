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
  onTap?: () => void;
}

export function useFlashcardSwipe({
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  onTap,
}: UseFlashcardSwipeOptions) {
  return useSwipeable({
    onSwipedLeft: onSwipeLeft,
    onSwipedRight: onSwipeRight,
    onSwipedUp: onSwipeUp,
    onSwipedDown: onSwipeDown,
    onTap: onTap,
    trackMouse: false,
    preventScrollOnSwipe: true,
    delta: 10, // Minimum distance for a swipe
  });
}
