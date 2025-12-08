/**
 * Storage service for localStorage operations
 * Provides type-safe storage interface with serialization/deserialization
 */

export class StorageService {
  /**
   * Check if localStorage is available
   */
  private static isLocalStorageAvailable(): boolean {
    try {
      return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
    } catch {
      return false;
    }
  }

  /**
   * Get item from localStorage
   */
  static getItem<T>(key: string, defaultValue: T | null = null): T | null {
    if (!this.isLocalStorageAvailable()) {
      return defaultValue;
    }

    try {
      const item = localStorage.getItem(key);
      if (item === null) {
        return defaultValue;
      }
      return JSON.parse(item) as T;
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.warn(`Failed to parse localStorage item "${key}":`, error);
      }
      return defaultValue;
    }
  }

  /**
   * Set item to localStorage
   */
  static setItem<T>(key: string, value: T): boolean {
    if (!this.isLocalStorageAvailable()) {
      return false;
    }

    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.warn(`Failed to set localStorage item "${key}":`, error);
      }
      return false;
    }
  }

  /**
   * Remove item from localStorage
   */
  static removeItem(key: string): boolean {
    if (!this.isLocalStorageAvailable()) {
      return false;
    }

    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.warn(`Failed to remove localStorage item "${key}":`, error);
      }
      return false;
    }
  }

  /**
   * Clear all items from localStorage
   */
  static clear(): boolean {
    if (!this.isLocalStorageAvailable()) {
      return false;
    }

    try {
      localStorage.clear();
      return true;
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('Failed to clear localStorage:', error);
      }
      return false;
    }
  }
}
