import { useCallback, useEffect, useState } from 'react';

/**
 * Revision data persisted to localStorage (no backend).
 * Tracks bookmarks, personal notes, topic progress, and a review log
 * that powers the daily streak and activity heatmap.
 */

export interface Bookmark {
  library: string;
  topicId: string;
  title: string;
  createdAt: number;
}

export interface PersonalNote {
  library: string;
  topicId: string;
  content: string;
  updatedAt: number;
}

export interface TopicProgress {
  library: string;
  topicId: string;
  status: 'learning' | 'learned';
  updatedAt: number;
}

export interface ReviewEntry {
  library: string;
  topicId: string;
  date: string; // YYYY-MM-DD
}

export interface RevisionData {
  bookmarks: Bookmark[];
  notes: PersonalNote[];
  progress: TopicProgress[];
  reviewLog: ReviewEntry[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  toggleBookmark: (library: string, topicId: string, title: string) => Promise<void>;
  isBookmarked: (library: string, topicId: string) => boolean;
  getNote: (library: string, topicId: string) => string;
  saveNote: (library: string, topicId: string, content: string) => Promise<void>;
  getProgress: (library: string, topicId: string) => 'learning' | 'learned' | null;
  setProgress: (library: string, topicId: string, status: 'learning' | 'learned') => Promise<void>;
  logReview: (library: string, topicId: string) => Promise<void>;
  streakDays: number;
  lastReviewedDate: string | null;
  reviewedToday: boolean;
  reviewDates: string[];
  topicsReviewedCount: number;
}

const KEYS = {
  bookmarks: 'cppreviser.bookmarks',
  notes: 'cppreviser.notes',
  progress: 'cppreviser.progress',
  reviews: 'cppreviser.reviews',
};

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function save<T>(key: string, value: T) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage full or unavailable — ignore */
  }
}

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

export function useRevisionData(): RevisionData {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [notes, setNotes] = useState<PersonalNote[]>([]);
  const [progress, setProgressState] = useState<TopicProgress[]>([]);
  const [reviewLog, setReviewLog] = useState<ReviewEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setBookmarks(load(KEYS.bookmarks, []));
    setNotes(load(KEYS.notes, []));
    setProgressState(load(KEYS.progress, []));
    setReviewLog(load(KEYS.reviews, []));
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const isBookmarked = useCallback(
    (library: string, topicId: string) =>
      bookmarks.some((b) => b.library === library && b.topicId === topicId),
    [bookmarks],
  );

  const toggleBookmark = useCallback(
    async (library: string, topicId: string, title: string) => {
      setBookmarks((prev) => {
        const existing = prev.find((b) => b.library === library && b.topicId === topicId);
        let next: Bookmark[];
        if (existing) {
          next = prev.filter((b) => !(b.library === library && b.topicId === topicId));
        } else {
          next = [{ library, topicId, title, createdAt: Date.now() }, ...prev];
        }
        save(KEYS.bookmarks, next);
        return next;
      });
    },
    [],
  );

  const getNote = useCallback(
    (library: string, topicId: string) =>
      notes.find((n) => n.library === library && n.topicId === topicId)?.content ?? '',
    [notes],
  );

  const saveNote = useCallback(
    async (library: string, topicId: string, content: string) => {
      setNotes((prev) => {
        const idx = prev.findIndex((n) => n.library === library && n.topicId === topicId);
        let next: PersonalNote[];
        if (idx >= 0) {
          next = prev.map((n) => (n.library === library && n.topicId === topicId
            ? { ...n, content, updatedAt: Date.now() } : n));
        } else {
          next = [...prev, { library, topicId, content, updatedAt: Date.now() }];
        }
        save(KEYS.notes, next);
        return next;
      });
    },
    [],
  );

  const getProgress = useCallback(
    (library: string, topicId: string) =>
      progress.find((p) => p.library === library && p.topicId === topicId)?.status ?? null,
    [progress],
  );

  const setProgress = useCallback(
    async (library: string, topicId: string, status: 'learning' | 'learned') => {
      setProgressState((prev) => {
        const idx = prev.findIndex((p) => p.library === library && p.topicId === topicId);
        let next: TopicProgress[];
        if (idx >= 0) {
          next = prev.map((p) => (p.library === library && p.topicId === topicId
            ? { ...p, status, updatedAt: Date.now() } : p));
        } else {
          next = [...prev, { library, topicId, status, updatedAt: Date.now() }];
        }
        save(KEYS.progress, next);
        return next;
      });
    },
    [],
  );

  const logReview = useCallback(
    async (library: string, topicId: string) => {
      const today = todayISO();
      setReviewLog((prev) => {
        if (prev.some((r) => r.library === library && r.topicId === topicId && r.date === today)) {
          return prev; // one review per topic per day
        }
        const next = [...prev, { library, topicId, date: today }];
        save(KEYS.reviews, next);
        return next;
      });
    },
    [],
  );

  const reviewDates = Array.from(new Set(reviewLog.map((r) => r.date))).sort();
  const lastReviewedDate = reviewDates.length ? reviewDates[reviewDates.length - 1] : null;
  const today = todayISO();
  const reviewedToday = reviewDates.includes(today);
  const streakDays = computeStreak(reviewDates);
  const topicsReviewedCount = reviewLog.length;

  return {
    bookmarks,
    notes,
    progress,
    reviewLog,
    loading,
    error,
    refresh,
    toggleBookmark,
    isBookmarked,
    getNote,
    saveNote,
    getProgress,
    setProgress,
    logReview,
    streakDays,
    lastReviewedDate,
    reviewedToday,
    reviewDates,
    topicsReviewedCount,
  };
}

function computeStreak(dates: string[]): number {
  if (!dates.length) return 0;
  const set = new Set(dates);
  const todayStr = todayISO();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().slice(0, 10);

  let start: string | null = null;
  if (set.has(todayStr)) start = todayStr;
  else if (set.has(yesterdayStr)) start = yesterdayStr;
  else return 0;

  let streak = 0;
  const cursor = new Date(start + 'T00:00:00Z');
  while (set.has(cursor.toISOString().slice(0, 10))) {
    streak += 1;
    cursor.setUTCDate(cursor.getUTCDate() - 1);
  }
  return streak;
}
