import { useEffect, useState } from 'react';
import type { ReactionId, Topic, Post } from './data/forum';

export interface UserState {
  reactions: Record<string, ReactionId>;
  bookmarks: string[];
  userTopics: Topic[];
  userPosts: Record<string, Post[]>;
  notifRead: string[];
  following: string[];
  extraViews: Record<string, number>;
  compact: boolean;
  notifyReplies: boolean;
}

export const DEFAULT_USER_STATE: UserState = {
  reactions: {},
  bookmarks: [],
  userTopics: [],
  userPosts: {},
  notifRead: [],
  following: [],
  extraViews: {},
  compact: false,
  notifyReplies: true,
};

const KEY = 'poluton-state-v1';

function load(): UserState {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return DEFAULT_USER_STATE;
    const parsed = JSON.parse(raw) as Partial<UserState>;
    return { ...DEFAULT_USER_STATE, ...parsed };
  } catch {
    return DEFAULT_USER_STATE;
  }
}

export function usePersistentState() {
  const [state, setState] = useState<UserState>(() => load());
  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch {
      /* хранилище недоступно — живём без него */
    }
  }, [state]);
  return [state, setState] as const;
}
