/**
 * Backward compatibility adapter for TTS hook
 * Re-exports the new modular hook implementation
 * @deprecated Use @/shared/hooks/useTTS instead
 */

'use client';

// Re-export from new modular hook for backward compatibility
export { useTTS } from '@/shared/hooks/useTTS';
export type { TTSState, TTSOptions } from '@/shared/hooks/useTTS';
