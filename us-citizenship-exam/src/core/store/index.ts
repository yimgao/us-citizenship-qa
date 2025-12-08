/**
 * Core store - combines all slices
 * Provides unified state management using Zustand
 */

'use client';

import { create } from 'zustand';
import { createQuizSlice, type QuizSlice } from './slices/quizSlice';
import { createUserSlice, type UserSlice } from './slices/userSlice';

/**
 * Combined store state
 */
export interface AppStore extends QuizSlice, UserSlice {}

/**
 * Main app store hook
 * Combines all slices into a single store
 */
export const useAppStore = create<AppStore>((...args) => ({
  ...createQuizSlice(...args),
  ...createUserSlice(...args),
}));

/**
 * Selector hooks for better performance
 */
export const useQuizAnswers = () => useAppStore((state) => state.answersByQuestionId);
export const useStarredIds = () => useAppStore((state) => state.starredIds);
export const useLastIncorrectIds = () => useAppStore((state) => state.lastIncorrectIds);
