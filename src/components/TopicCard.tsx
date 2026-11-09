import { Icon } from './Icon';
import { Avatar } from './Avatar';
import { authorById, categoryById, fmtCount, timeAgo, type Topic } from '../data/forum';

interface TopicCardProps {
  topic: Topic;
  postsCount: number;
  views: number;
  reactionsTotal: number;
  isBookmarked: boolean;
  compact: boolean;
  isUserTopic: boolean;
  onToggleBookmark: (id: string) => void;
  onOpen: (id: string) => void;
}

export function TopicCard({
  topic,
  postsCount,
  views,
  reactionsTotal,
  isBookmarked,
  compact,
  isUserTopic,
  onToggleBookmark,
  onOpen,
}: TopicCardProps) {
  const author = authorById(topic.authorId);
  const category = categoryById(topic.category);
  const ageHours = (Date.now() - new Date(topic.createdAt).getTime()) / 3600_000;
  const isHot = views >= 1800 || postsCount >= 3;
  const isNew = ageHours < 8;

  return (
    <article className={`topic-card ${compact ? 'is-compact' : ''}`}>
      <div className="topic-main">
        <div className="topic-chips">
          <span className="chip chip--category">
            <Icon name={category.icon} size={13} />
            {category.name}
          </span>
          {isHot && (
            <span className="chip chip--hot">
              <Icon name="flame" size={13} filled />
              Горячая
            </span>
          )}
          {isNew && (
            <span className="chip chip--new">
              <Icon name="zap" size={13} filled />
              Новое
            </span>
          )}
          {isUserTopic && <span className="chip chip--own">Ваша тема</span>}
        </div>

        <h3 className="topic-title">
          <button type="button" className="topic-title-btn stretched-link" onClick={() => onOpen(topic.id)}>
            {topic.title}
          </button>
        </h3>

        {!compact && <p className="topic-excerpt">{topic.excerpt}</p>}

        <div className="topic-meta">
          <Avatar author={author} size={22} className="meta-avatar" />
          <span className="meta-author">{author.name}</span>
          <span className="meta-rep" title={`Репутация ${author.rep}`}>+{fmtCount(author.rep)}</span>
          <span className="meta-dot" aria-hidden="true">·</span>
          <span className="meta-time">{timeAgo(topic.createdAt)}</span>
          <span className="meta-dot" aria-hidden="true">·</span>
          <span className="meta-views">
            <Icon name="eye" size={14} />
            {fmtCount(views)}
          </span>
        </div>

        {!compact && topic.tags.length > 0 && (
          <div className="topic-tags">
            {topic.tags.map((tag) => (
              <span key={tag} className="tag">#{tag}</span>
            ))}
          </div>
        )}
      </div>

      <div className="topic-rail">
        <button
          type="button"
          className={`bookmark-btn ${isBookmarked ? 'is-on' : ''}`}
          onClick={() => onToggleBookmark(topic.id)}
          aria-pressed={isBookmarked}
          aria-label={isBookmarked ? 'Убрать из закладок' : 'В закладки'}
          title={isBookmarked ? 'Убрать из закладок' : 'В закладки'}
        >
          <Icon name="bookmark" size={17} filled={isBookmarked} />
        </button>
        <div className="rail-stat" title={`${postsCount} ответов`}>
          <span className="rail-value">{fmtCount(postsCount)}</span>
          <span className="rail-label">ответов</span>
        </div>
        <div className="rail-stat rail-stat--reactions" title={`${reactionsTotal} реакций`}>
          <span className="rail-value">{fmtCount(reactionsTotal)}</span>
          <span className="rail-label">реакций</span>
        </div>
      </div>
    </article>
  );
}
