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
        <section className="welcome panel" aria-label="О сообществе">
          <div className="welcome-text">
            <span className="welcome-eyebrow">независимое русскоязычное сообщество</span>
            <h1 className="welcome-title">
              Тёмный зал, тёплый свет — и разговоры,<br className="welcome-break" />
              за которые не стыдно <em>утром</em>.
            </h1>
            <p className="welcome-sub">
              Здесь не продают и не вставляют рекламу: только люди, опыт и темы про технологии,
              разработку и цифровую жизнь — с чашкой чая и в хорошей компании.
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
          <svg className="welcome-art" viewBox="0 0 200 150" aria-hidden="true">
            <circle cx="150" cy="52" r="44" fill="none" stroke="#3b2f63" strokeWidth="1.4" strokeDasharray="3 6" />
            <circle cx="150" cy="52" r="30" fill="#241d3a" stroke="#8b5cf6" strokeWidth="1.6" />
            <path d="M150 22a30 30 0 0 1 0 60z" fill="#8b5cf6" opacity="0.82" />
            <circle cx="150" cy="52" r="5" fill="#ece8f6" />
            <path d="M28 118h72M28 96h44M28 140h96" stroke="#2e2649" strokeWidth="5" strokeLinecap="round" />
            <path d="M28 118h32" stroke="#a78bfa" strokeWidth="5" strokeLinecap="round" />
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
          {entries.map(({ topic, postsCount, views, reactionsTotal, isUserTopic, isBookmarked }) => (
            <TopicCard
              key={topic.id}
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
