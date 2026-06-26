'use client';

import { useState, useEffect, useCallback } from 'react';

// ── Streak ──

interface StreakData {
  count: number;
  lastDate: string; // YYYY-MM-DD
}

const STREAK_KEY = 'streak';
const DAILY_KEY = 'daily-progress';
const DAILY_GOAL = 10;

function getToday(): string {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

function readStreak(): StreakData {
  try {
    const raw = localStorage.getItem(STREAK_KEY);
    if (raw) return JSON.parse(raw) as StreakData;
  } catch {
    // ignore
  }
  return { count: 0, lastDate: '' };
}

function writeStreak(data: StreakData) {
  try {
    localStorage.setItem(STREAK_KEY, JSON.stringify(data));
  } catch {
    // ignore
  }
}

function computeStreak(existing: StreakData, today: string): StreakData {
  if (existing.lastDate === today) {
    // Same day — do nothing
    return existing;
  }

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yyyy = yesterday.getFullYear();
  const mm = String(yesterday.getMonth() + 1).padStart(2, '0');
  const dd = String(yesterday.getDate()).padStart(2, '0');
  const yesterdayStr = `${yyyy}-${mm}-${dd}`;

  if (existing.lastDate === yesterdayStr) {
    // Consecutive day — increment
    return { count: existing.count + 1, lastDate: today };
  }

  // Gap or first visit — reset to 1
  return { count: 1, lastDate: today };
}

// ── Daily progress ──

interface DailyProgress {
  date: string;
  count: number;
}

function readDailyProgress(): DailyProgress {
  try {
    const raw = localStorage.getItem(DAILY_KEY);
    if (raw) return JSON.parse(raw) as DailyProgress;
  } catch {
    // ignore
  }
  return { date: '', count: 0 };
}

function writeDailyProgress(data: DailyProgress) {
  try {
    localStorage.setItem(DAILY_KEY, JSON.stringify(data));
  } catch {
    // ignore
  }
}

// ── Hook ──

export function useDailyProgress() {
  const [streak, setStreak] = useState<StreakData>({ count: 0, lastDate: '' });
  const [daily, setDaily] = useState<DailyProgress>({ date: '', count: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Initialise from localStorage
    const today = getToday();
    const existingStreak = readStreak();
    const newStreak = computeStreak(existingStreak, today);
    writeStreak(newStreak);
    setStreak(newStreak);

    const existingDaily = readDailyProgress();
    if (existingDaily.date !== today) {
      // New day — reset
      const fresh: DailyProgress = { date: today, count: 0 };
      writeDailyProgress(fresh);
      setDaily(fresh);
    } else {
      setDaily(existingDaily);
    }

    setMounted(true);
  }, []);

  const incrementDaily = useCallback(() => {
    const today = getToday();
    setDaily((prev) => {
      const next = prev.date === today ? { ...prev, count: prev.count + 1 } : { date: today, count: 1 };
      writeDailyProgress(next);
      return next;
    });
  }, []);

  const remaining = Math.max(0, DAILY_GOAL - daily.count);
  const isGoalMet = daily.count >= DAILY_GOAL;

  return {
    streak,
    daily,
    dailyGoal: DAILY_GOAL,
    remaining,
    isGoalMet,
    mounted,
    incrementDaily,
  };
}
