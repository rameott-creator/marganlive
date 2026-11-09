import { Icon } from './Icon';
import { EqBars } from './EqBars';
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

const TICKER_ITEMS = [
  'live · 214 на форуме',
  '132 тем за неделю',
  '318 сообщений сегодня',
  'пик активности после 22:00',
  'пятничное АМА — 23:00 по МСК',
];

function Ticker() {
  const line = TICKER_ITEMS.join('   ◆   ');
  return (
    <div className="ticker" aria-hidden="true">
      <div className="ticker-inner">
        <span className="ticker-text">{line}</span>
        <span className="ticker-text">{line}</span>
      </div>
    </div>
  );
}

function Wordmark({ onHome }: { onHome: () => void }) {
  return (
    <button type="button" className="wordmark" onClick={onHome} aria-label="margan.live — на главную">
      <EqBars size={34} className="wordmark-eq" />
      <span className="wordmark-text">
        <span className="wordmark-name">
          margan<em>.live</em>
        </span>
        <span className="wordmark-tag">форум ночных разговоров</span>
      </span>
    </button>
  );
}

export function TopBar({ query, onQueryChange, onCreateTopic, onHome, notif, profile }: TopBarProps) {
  return (
    <>
      <Ticker />
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
    </>
  );
}
