import { Icon } from './Icon';
import { TopicCard } from './TopicCard';
import type { Topic } from '../data/forum';

export type FeedTab = 'hot' | 'new' | 'unanswered';

export interface FeedEntry {
  topic: Topic;
  postsCount: number;
  views: number;
  reactionsTotal: number;
  isUserTopic: boolean;
  isBookmarked: boolean;
}

interface FeedProps {
  entries: FeedEntry[];
  tab: FeedTab;
  onTabChange: (tab: FeedTab) => void;
  tabCounts: Record<FeedTab, number>;
  showWelcome: boolean;
  filtersActive: boolean;
  filterSummary: string;
  onResetFilters: () => void;
  compact: boolean;
  onOpenTopic: (id: string) => void;
  onToggleBookmark: (id: string) => void;
  onAbout: () => void;
  onSurprise: () => void;
}

const TABS: { id: FeedTab; label: string; icon: string }[] = [
  { id: 'hot', label: 'Популярное', icon: 'flame' },
  { id: 'new', label: 'Новое', icon: 'clock' },
  { id: 'unanswered', label: 'Без ответа', icon: 'message' },
];

export function Feed({
  entries,
  tab,
  onTabChange,
  tabCounts,
  showWelcome,
  filtersActive,
  filterSummary,
  onResetFilters,
  compact,
  onOpenTopic,
  onToggleBookmark,
  onAbout,
  onSurprise,
}: FeedProps) {
  return (
    <div className="feed">
      {showWelcome && (
        <section className="masthead" aria-label="О сообществе">
          <div className="masthead-text">
            <span className="masthead-kicker">
              <span className="live-dot" aria-hidden="true" />
              margan.live · живой эфир сообщества
            </span>
            <h1 className="masthead-title">
              Здесь разговаривают,<br />
              <em>а не торгуют.</em>
            </h1>
            <p className="masthead-sub">
              Русскоязычный форум о технологиях и цифровой жизни. Никаких маркетплейсов
              и рекламных вставок — только опыт, аргументы и разговоры после десяти вечера.
            </p>
            <div className="welcome-actions">
              <button type="button" className="btn btn--soft" onClick={onAbout}>
                <Icon name="compass" size={16} />
                Как устроен форум
              </button>
              <button type="button" className="btn btn--ghost" onClick={onSurprise}>
                <Icon name="sparkles" size={16} />
                Случайная тема
              </button>
            </div>
          </div>
          <svg className="masthead-art" viewBox="0 0 180 160" aria-hidden="true">
            <circle cx="90" cy="72" r="62" fill="none" stroke="#2c2544" strokeWidth="1.2" strokeDasharray="2.5 7" />
            <circle cx="90" cy="72" r="40" fill="none" stroke="#38304f" strokeWidth="1" />
            <line x1="14" y1="138" x2="166" y2="138" stroke="#2c2544" strokeWidth="1.6" />
            <rect className="eq-bar eq-bar--1" x="30" y="112" width="14" height="26" rx="2" fill="#5b3fd6" />
            <rect className="eq-bar eq-bar--2" x="54" y="64" width="14" height="74" rx="2" fill="#7c3aed" />
            <rect className="eq-bar eq-bar--3" x="78" y="90" width="14" height="48" rx="2" fill="#a78bfa" />
            <rect className="eq-bar eq-bar--4" x="102" y="36" width="14" height="102" rx="2" fill="#8b5cf6" />
            <rect className="eq-bar eq-bar--1" x="126" y="100" width="14" height="38" rx="2" fill="#c4b5fd" />
            <circle className="live-dot" cx="152" cy="22" r="5" fill="#a78bfa" />
          </svg>
        </section>
      )}

      <div className="feed-head">
        <div className="tabs" role="tablist" aria-label="Сортировка обсуждений">
          {TABS.map(({ id, label, icon }) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={tab === id}
              className={`tab ${tab === id ? 'is-active' : ''}`}
              onClick={() => onTabChange(id)}
            >
              <Icon name={icon} size={15} filled={tab === id && id === 'hot'} />
              {label}
              <span className="tab-count">{tabCounts[id]}</span>
            </button>
          ))}
        </div>
        <span className="feed-rule" aria-hidden="true" />
      </div>

      {filtersActive && (
        <div className="filter-note" role="status">
          <Icon name="search" size={14} />
          <span>{filterSummary}</span>
          <button type="button" className="link-btn" onClick={onResetFilters}>
            Сбросить
          </button>
        </div>
      )}

      {entries.length === 0 ? (
        <div className="empty-state">
          <Icon name="search" size={28} />
          <h2>Ничего не нашлось</h2>
          <p>Попробуйте другое слово, сбросьте фильтры или подождите — форум живёт, темы появляются каждый день.</p>
          <button type="button" className="btn btn--soft" onClick={onResetFilters}>
            <Icon name="x" size={16} />
            Сбросить фильтры
          </button>
        </div>
      ) : (
        <div className="topic-list">
          {entries.map(({ topic, postsCount, views, reactionsTotal, isUserTopic, isBookmarked }, index) => (
            <TopicCard
              key={topic.id}
              index={index + 1}
              topic={topic}
              postsCount={postsCount}
              views={views}
              reactionsTotal={reactionsTotal}
              isBookmarked={isBookmarked}
              compact={compact}
              isUserTopic={isUserTopic}
              onToggleBookmark={onToggleBookmark}
              onOpen={onOpenTopic}
            />
          ))}
        </div>
      )}
    </div>
  );
}
