/**
 * Flashcard filter buttons component
 */

'use client';

import type { FlashcardFilter } from '../../types/flashcard.types';

interface FlashcardFiltersProps {
  filter: FlashcardFilter;
  onChange: (filter: FlashcardFilter) => void;
}

export function FlashcardFilters({ filter, onChange }: FlashcardFiltersProps) {
  return (
    <div className="mb-3 flex items-center gap-2">
      <button
        onClick={() => onChange('all')}
        className={`rounded border px-3 py-1 text-caption font-medium transition-colors ${
          filter === 'all' 
            ? 'bg-blue-50 border-blue-300 text-primary' 
            : 'hover:bg-slate-50 border-slate-200 text-primary'
        }`}
      >
        All
      </button>
      <button
        onClick={() => onChange('starred')}
        className={`rounded border px-3 py-1 text-caption font-medium transition-colors ${
          filter === 'starred' 
            ? 'bg-blue-50 border-blue-300 text-primary' 
            : 'hover:bg-slate-50 border-slate-200 text-primary'
        }`}
      >
        Starred
      </button>
      <button
        onClick={() => onChange('missed')}
        className={`rounded border px-3 py-1 text-caption font-medium transition-colors ${
          filter === 'missed' 
            ? 'bg-blue-50 border-blue-300 text-primary' 
            : 'hover:bg-slate-50 border-slate-200 text-primary'
        }`}
      >
        Missed
      </button>
    </div>
  );
}
