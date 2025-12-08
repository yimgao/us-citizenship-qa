/**
 * Glossary service for loading glossary data
 */

import type { GlossaryItem } from '../types/glossary.types';

export class GlossaryService {
  /**
   * Load all glossary items
   */
  static async loadGlossary(): Promise<GlossaryItem[]> {
    try {
      const mod = await import('@/data/glossary/glossary.json');
      return (mod.default ?? []) as GlossaryItem[];
    } catch {
      return [];
    }
  }
}
