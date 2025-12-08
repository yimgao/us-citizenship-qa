/**
 * Backward compatibility adapter for quiz store
 * Re-exports the new modular store implementation
 * @deprecated Use @/core/store instead
 */

'use client';

// Re-export the store directly for backward compatibility
// This allows useQuizStore.getState() to work
export { useAppStore as useQuizStore } from '@/core/store';

// Re-export types for backward compatibility
export type { QuizStoreState as QuizState } from '@/core/types';


