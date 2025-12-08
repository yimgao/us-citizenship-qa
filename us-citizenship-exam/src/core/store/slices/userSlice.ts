/**
 * User slice for Zustand store
 * Reserved for future user-related state management
 * This will be extended when user authentication is added
 */

import type { StateCreator } from 'zustand';

export interface UserSlice {
  // Reserved for future user state
  // Examples:
  // userId: string | null;
  // userPreferences: UserPreferences;
  // etc.
  _reserved?: never;
}

export const createUserSlice: StateCreator<UserSlice> = () => ({
  // Reserved for future implementation
});
