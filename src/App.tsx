import { useCallback, useEffect, useMemo, useState } from 'react';
import { Icon } from './components/Icon';
import { TopBar } from './components/TopBar';
import { CategoryNav, type CategoryFilter } from './components/CategoryNav';
import { Feed, type FeedTab, type FeedEntry } from './components/Feed';
import { Sidebar, type HotEntry } from './components/Sidebar';
import { ThreadView } from './components/ThreadView';
import { NewTopicModal, AboutModal, type NewTopicData } from './components/Modals';
import {
  SEED_TOPICS,
  SEED_NOTIFICATIONS,
  CATEGORIES,
  ME_ID,
  authorById,
  categoryById,
  type Post,
  type ReactionId,
  type Topic,
} from './data/forum';
import { usePersistentState } from './state';

type Route = { name: 'home' } | { name: 'thread'; topicId: string };

interface Toast {
  id: number;
  text: string;
}

const sumReactions = (r: Record<ReactionId, number>) => r.useful + r.heart + r.fire;

export default function App() {
  const [userState, setUserState] = usePersistentState();
  const [route, setRoute] = useState<Route>({ name: 'home' });
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<CategoryFilter>('all');
  const [tab, setTab] = useState<FeedTab>('hot');
  const [bookmarkedOnly, setBookmarkedOnly] = useState(false);
  const [newTopicOpen, setNewTopicOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const pushToast = useCallback((text: string) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev.slice(-2), { id, text }]);
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 3800);
  }, []);

  // ── Данные: сид + локальные ─────────────────────────────
  const allTopics = useMemo(
    () => [...userState.userTopics, ...SEED_TOPICS],
    [userState.userTopics],
  );

  const userTopicIds = useMemo(
    () => new Set(userState.userTopics.map((t) => t.id)),
    [userState.userTopics],
  );

  const postsFor = useCallback(
    (topic: Topic): Post[] => [...topic.posts, ...(userState.userPosts[topic.id] ?? [])],
    [userState.userPosts],
  );

  const viewsFor = useCallback(
    (topic: Topic) => topic.views + (userState.extraViews[topic.id] ?? 0),
    [userState.extraViews],
  );

  const reactionsFor = useCallback(
    (topic: Topic) => {
      const views = viewsFor(topic);
      const op = Math.round(views / 45) + 12 + Math.round(views / 95) + 5 + Math.round(views / 160) + 2;
      const postsSum = postsFor(topic).reduce((sum, post) => sum + sumReactions(post.reactions), 0);
      return op + postsSum;
    },
    [postsFor, viewsFor],
  );

  // ── Фильтрация и сортировка ─────────────────────────────
  const baseFiltered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return allTopics.filter((topic) => {
      if (bookmarkedOnly && !userState.bookmarks.includes(topic.id)) return false;
      if (category !== 'all' && topic.category !== category) return false;
      if (q) {
        const author = authorById(topic.authorId);
        const haystack = [
          topic.title,
          topic.excerpt,
          topic.tags.join(' '),
          author.name,
          author.handle,
          categoryById(topic.category).name,
        ]
          .join(' ')
          .toLowerCase();
        const words = q.split(/\s+/).filter(Boolean);
        if (!words.every((word) => haystack.includes(word))) return false;
      }
      return true;
    });
  }, [allTopics, bookmarkedOnly, category, query, userState.bookmarks]);

  const tabCounts = useMemo<Record<FeedTab, number>>(() => {
    const unanswered = baseFiltered.filter((topic) => postsFor(topic).length === 0).length;
    return { hot: baseFiltered.length, new: baseFiltered.length, unanswered };
  }, [baseFiltered, postsFor]);

  const entries = useMemo<FeedEntry[]>(() => {
    const withMeta = baseFiltered.map((topic) => ({
      topic,
      postsCount: postsFor(topic).length,
      views: viewsFor(topic),
      reactionsTotal: reactionsFor(topic),
      isUserTopic: userTopicIds.has(topic.id),
      isBookmarked: userState.bookmarks.includes(topic.id),
    }));
    const visible = tab === 'unanswered' ? withMeta.filter((entry) => entry.postsCount === 0) : withMeta;
    return [...visible].sort((a, b) => {
      if (tab === 'new') return +new Date(b.topic.createdAt) - +new Date(a.topic.createdAt);
      const score = (entry: FeedEntry) => entry.views + entry.postsCount * 220 + entry.reactionsTotal * 8;
      return score(b) - score(a);
    });
  }, [baseFiltered, tab, postsFor, viewsFor, reactionsFor, userTopicIds, userState.bookmarks]);

  const filtersActive = query.trim() !== '' || category !== 'all' || bookmarkedOnly;
  const filterSummary = useMemo(() => {
    const parts: string[] = [];
    if (category !== 'all') parts.push(`раздел «${categoryById(category).name}»`);
    if (bookmarkedOnly) parts.push('только закладки');
    if (query.trim()) parts.push(`поиск «${query.trim()}»`);
    return parts.length ? `Фильтр: ${parts.join(' · ')}` : '';
  }, [category, bookmarkedOnly, query]);

  const resetFilters = useCallback(() => {
    setQuery('');
    setCategory('all');
    setBookmarkedOnly(false);
    setTab('hot');
  }, []);

  const categoryCounts = useMemo(() => {
    const counts = Object.fromEntries(CATEGORIES.map((c) => [c.id, 0])) as Record<string, number>;
    for (const topic of allTopics) counts[topic.category] += 1;
    return counts as Record<(typeof CATEGORIES)[number]['id'], number>;
  }, [allTopics]);

  const hotEntries = useMemo<HotEntry[]>(
    () =>
      [...allTopics]
        .map((topic) => ({ topic, views: viewsFor(topic), postsCount: postsFor(topic).length }))
        .sort((a, b) => b.views - a.views)
        .slice(0, 4),
    [allTopics, viewsFor, postsFor],
  );

  // ── Действия ─────────────────────────────────────────────
  const openTopic = useCallback(
    (topicId: string) => {
      if (!topicId) return;
      setUserState((prev) => ({
        ...prev,
        extraViews: { ...prev.extraViews, [topicId]: (prev.extraViews[topicId] ?? 0) + 1 },
      }));
      setRoute({ name: 'thread', topicId });
    },
    [setUserState],
  );

  const goHome = useCallback(() => {
    setRoute({ name: 'home' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const toggleBookmark = useCallback(
    (topicId: string) => {
      setUserState((prev) => {
        const exists = prev.bookmarks.includes(topicId);
        pushToast(exists ? 'Убрано из закладок' : 'Сохранено в закладки');
        return {
          ...prev,
          bookmarks: exists ? prev.bookmarks.filter((id) => id !== topicId) : [...prev.bookmarks, topicId],
        };
      });
    },
    [pushToast, setUserState],
  );

  const toggleReaction = useCallback(
    (postId: string, reaction: ReactionId) => {
      setUserState((prev) => {
        const next = { ...prev.reactions };
        if (next[postId] === reaction) delete next[postId];
        else next[postId] = reaction;
        return { ...prev, reactions: next };
      });
    },
    [setUserState],
  );

  const toggleFollow = useCallback(
    (topicId: string) => {
      setUserState((prev) => {
        const exists = prev.following.includes(topicId);
        pushToast(exists ? 'Вы больше не следите за темой' : 'Будем присылать ответы по этой теме');
        return {
          ...prev,
          following: exists ? prev.following.filter((id) => id !== topicId) : [...prev.following, topicId],
        };
      });
    },
    [pushToast, setUserState],
  );

  const shareTopic = useCallback(
    (topicId: string) => {
      const url = `${window.location.origin}${window.location.pathname}#/topic/${topicId}`;
      const done = () => pushToast('Ссылка скопирована в буфер обмена');
      const fail = () => pushToast('Не вышло скопировать — адрес есть в строке браузера');
      if (navigator.clipboard?.writeText) {
        navigator.clipboard.writeText(url).then(done, fail);
      } else {
        fail();
      }
    },
    [pushToast],
  );

  const addPost = useCallback(
    (topicId: string, body: string) => {
      const post: Post = {
        id: `user-${Date.now()}-${Math.round(Math.random() * 1e6)}`,
        authorId: ME_ID,
        createdAt: new Date().toISOString(),
        body,
        reactions: { useful: 0, heart: 0, fire: 0 },
      };
      setUserState((prev) => ({
        ...prev,
        userPosts: {
          ...prev.userPosts,
          [topicId]: [...(prev.userPosts[topicId] ?? []), post],
        },
      }));
      pushToast('Ответ отправлен');
    },
    [pushToast, setUserState],
  );

  const addTopic = useCallback(
    (data: NewTopicData) => {
      const topic: Topic = {
        id: `user-topic-${Date.now()}`,
        category: data.category,
        title: data.title,
        excerpt: data.body,
        authorId: ME_ID,
        createdAt: new Date().toISOString(),
        tags: data.tags,
        views: 1,
        posts: [],
      };
      setUserState((prev) => ({ ...prev, userTopics: [topic, ...prev.userTopics] }));
      setNewTopicOpen(false);
      setTab('new');
      setCategory('all');
      setBookmarkedOnly(false);
      setQuery('');
      setRoute({ name: 'home' });
      pushToast('Тема опубликована — видим в ленте');
    },
    [pushToast, setUserState],
  );

  const consumeNotification = useCallback(
    (notification: (typeof SEED_NOTIFICATIONS)[number]) => {
      setUserState((prev) =>
        prev.notifRead.includes(notification.id)
          ? prev
          : { ...prev, notifRead: [...prev.notifRead, notification.id] },
      );
      if (notification.topicId) openTopic(notification.topicId);
    },
    [openTopic, setUserState],
  );

  const markAllNotificationsRead = useCallback(() => {
    setUserState((prev) => ({ ...prev, notifRead: SEED_NOTIFICATIONS.map((n) => n.id) }));
    pushToast('Все уведомления прочитаны');
  }, [pushToast, setUserState]);

  const surprise = useCallback(() => {
    const topic = allTopics[Math.floor(Math.random() * allTopics.length)];
    if (topic) openTopic(topic.id);
  }, [allTopics, openTopic]);

  // ── Клавиатура ───────────────────────────────────────────
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const typing =
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target instanceof HTMLSelectElement;
      if (event.key === '/' && !typing) {
        event.preventDefault();
        document.getElementById('site-search')?.focus();
      }
      if (event.key === 'Escape' && route.name === 'thread' && !newTopicOpen && !aboutOpen) {
        setRoute({ name: 'home' });
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [route.name, newTopicOpen, aboutOpen]);

  const currentTopic =
    route.name === 'thread' ? allTopics.find((topic) => topic.id === route.topicId) ?? null : null;

  const answersCount = useMemo(
    () => Object.values(userState.userPosts).reduce((sum, posts) => sum + posts.length, 0),
    [userState.userPosts],
  );

  const profileProps = {
    topicsCount: userState.userTopics.length,
    answersCount,
    bookmarksCount: userState.bookmarks.length,
    compact: userState.compact,
    notifyReplies: userState.notifyReplies,
    onToggleCompact: () => setUserState((prev) => ({ ...prev, compact: !prev.compact })),
    onToggleNotifyReplies: () => setUserState((prev) => ({ ...prev, notifyReplies: !prev.notifyReplies })),
    onSignOut: () => pushToast('Вы вошли локально — выходить некуда, всё остаётся в этом браузере'),
  };

  return (
    <div className={`app ${userState.compact ? 'is-compact' : ''} ${route.name === 'thread' ? 'is-thread' : ''}`}>
      <TopBar
        query={query}
        onQueryChange={(value) => {
          setQuery(value);
          if (route.name === 'thread') setRoute({ name: 'home' });
        }}
        onCreateTopic={() => setNewTopicOpen(true)}
        onHome={goHome}
        notif={{
          notifications: SEED_NOTIFICATIONS,
          readIds: userState.notifRead,
          onConsume: consumeNotification,
          onMarkAllRead: markAllNotificationsRead,
        }}
        profile={profileProps}
      />

      <div className={`page ${route.name === 'thread' ? 'page--thread' : ''}`}>
        {route.name === 'home' && (
          <CategoryNav
            active={category}
            onChange={(value) => {
              setCategory(value);
              setBookmarkedOnly(false);
            }}
            counts={categoryCounts}
            totalCount={allTopics.length}
            bookmarkedCount={userState.bookmarks.length}
            bookmarkedOnly={bookmarkedOnly}
            onToggleBookmarkedOnly={() => setBookmarkedOnly((v) => !v)}
          />
        )}

        <main className="col-main">
          {route.name === 'home' ? (
            <Feed
              entries={entries}
              tab={tab}
              onTabChange={setTab}
              tabCounts={tabCounts}
              showWelcome={!filtersActive && tab === 'hot'}
              filtersActive={filtersActive}
              filterSummary={filterSummary}
              onResetFilters={resetFilters}
              compact={userState.compact}
              onOpenTopic={openTopic}
              onToggleBookmark={toggleBookmark}
              onAbout={() => setAboutOpen(true)}
              onSurprise={surprise}
            />
          ) : currentTopic ? (
            <ThreadView
              topic={currentTopic}
              posts={postsFor(currentTopic)}
              views={viewsFor(currentTopic)}
              userReactions={userState.reactions}
              isBookmarked={userState.bookmarks.includes(currentTopic.id)}
              isFollowing={userState.following.includes(currentTopic.id)}
              onBack={goHome}
              onOpenCategory={(value) => {
                setCategory(value);
                setBookmarkedOnly(false);
                setTab('hot');
                setRoute({ name: 'home' });
              }}
              onToggleBookmark={toggleBookmark}
              onToggleFollow={toggleFollow}
              onToggleReaction={toggleReaction}
              onAddPost={addPost}
              onShare={shareTopic}
            />
          ) : (
            <div className="empty-state">
              <Icon name="search" size={28} />
              <h2>Тема не найдена</h2>
              <p>Похоже, её уже закрыли или она осталась в прошлой версии этого браузера.</p>
              <button type="button" className="btn btn--soft" onClick={goHome}>
                На главную
              </button>
            </div>
          )}
        </main>

        <Sidebar hot={hotEntries} onOpenTopic={openTopic} onAbout={() => setAboutOpen(true)} />
      </div>

      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <svg className="footer-mark" viewBox="0 0 64 64" aria-hidden="true">
              <circle cx="32" cy="32" r="16" fill="none" stroke="#a78bfa" strokeWidth="3.4" />
              <path d="M32 16a16 16 0 0 1 0 32z" fill="#8b5cf6" />
            </svg>
            <div>
              <span className="footer-name">полу<em>тон</em></span>
              <span className="footer-tag">форум ночных разговоров</span>
            </div>
          </div>
          <div className="footer-actions">
            <button type="button" className="link-btn" onClick={() => setAboutOpen(true)}>
              Как устроен форум
            </button>
            <button type="button" className="link-btn" onClick={surprise}>
              Случайная тема
            </button>
          </div>
          <p className="footer-note">Темы, ответы и реакции хранятся локально в этом браузере</p>
        </div>
      </footer>

      {newTopicOpen && <NewTopicModal onClose={() => setNewTopicOpen(false)} onSubmit={addTopic} />}
      {aboutOpen && <AboutModal onClose={() => setAboutOpen(false)} />}

      <div className="toasts" aria-live="polite" aria-atomic="true">
        {toasts.map((toast) => (
          <div key={toast.id} className="toast">
            <Icon name="check" size={15} />
            <span>{toast.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
