import { Icon } from './Icon';
import { NotificationsMenu } from './NotificationsMenu';
import { ProfileMenu } from './ProfileMenu';
import type { Notification } from '../data/forum';

interface TopBarProps {
  query: string;
  onQueryChange: (value: string) => void;
  onCreateTopic: () => void;
  onHome: () => void;
  notif: {
    notifications: Notification[];
    readIds: string[];
    onConsume: (n: Notification) => void;
    onMarkAllRead: () => void;
  };
  profile: {
    topicsCount: number;
    answersCount: number;
    bookmarksCount: number;
    compact: boolean;
    notifyReplies: boolean;
    onToggleCompact: () => void;
    onToggleNotifyReplies: () => void;
    onSignOut: () => void;
  };
}

function Wordmark({ onHome }: { onHome: () => void }) {
  return (
    <button type="button" className="wordmark" onClick={onHome} aria-label="Полутон — на главную">
      <svg className="wordmark-mark" viewBox="0 0 64 64" aria-hidden="true">
        <rect width="64" height="64" rx="15" fill="#1e1830" />
        <circle cx="32" cy="32" r="15" fill="none" stroke="#a78bfa" strokeWidth="3.4" />
        <path d="M32 17a15 15 0 0 1 0 30z" fill="#8b5cf6" />
        <circle cx="32" cy="32" r="3.2" fill="#ece8f6" />
      </svg>
      <span className="wordmark-text">
        <span className="wordmark-name">
          полу<em>тон</em>
        </span>
        <span className="wordmark-tag">форум ночных разговоров</span>
      </span>
    </button>
  );
}

export function TopBar({ query, onQueryChange, onCreateTopic, onHome, notif, profile }: TopBarProps) {
  return (
    <header className="topbar">
      <div className="topbar-inner">
        <Wordmark onHome={onHome} />

        <label className="search" htmlFor="site-search">
          <Icon name="search" size={17} className="search-icon" />
          <input
            id="site-search"
            type="text"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Поиск тем и авторов…"
            autoComplete="off"
            spellCheck={false}
          />
          <kbd className="search-kbd">/</kbd>
        </label>

        <div className="topbar-actions">
          <button type="button" className="btn btn--primary btn--create" onClick={onCreateTopic}>
            <Icon name="plus" size={17} />
            <span>Создать тему</span>
          </button>
          <NotificationsMenu
            notifications={notif.notifications}
            readIds={notif.readIds}
            onConsume={notif.onConsume}
            onMarkAllRead={notif.onMarkAllRead}
          />
          <ProfileMenu
            topicsCount={profile.topicsCount}
            answersCount={profile.answersCount}
            bookmarksCount={profile.bookmarksCount}
            compact={profile.compact}
            notifyReplies={profile.notifyReplies}
            onToggleCompact={profile.onToggleCompact}
            onToggleNotifyReplies={profile.onToggleNotifyReplies}
            onSignOut={profile.onSignOut}
          />
        </div>
      </div>
    </header>
  );
}
