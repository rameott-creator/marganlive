import { useEffect, useMemo, useRef, useState } from 'react';
import { Icon } from './Icon';
import { Avatar } from './Avatar';
import {
  authorById,
  categoryById,
  fmtCount,
  timeAgo,
  REACTION_META,
  ME_ID,
  type Post,
  type ReactionId,
  type Topic,
} from '../data/forum';

interface ThreadViewProps {
  topic: Topic;
  posts: Post[];
  views: number;
  userReactions: Record<string, ReactionId>;
  isBookmarked: boolean;
  isFollowing: boolean;
  onBack: () => void;
  onOpenCategory: (categoryId: Topic['category']) => void;
  onToggleBookmark: (id: string) => void;
  onToggleFollow: (id: string) => void;
  onToggleReaction: (postId: string, reaction: ReactionId) => void;
  onAddPost: (topicId: string, body: string) => void;
  onShare: (topicId: string) => void;
}

function ReactionRow({
  postId,
  base,
  mine,
  onToggle,
}: {
  postId: string;
  base: Record<ReactionId, number>;
  mine?: ReactionId;
  onToggle: (postId: string, reaction: ReactionId) => void;
}) {
  return (
    <div className="reactions" role="group" aria-label="Реакции">
      {REACTION_META.map(({ id, label, icon }) => {
        const active = mine === id;
        const count = base[id] + (active ? 1 : 0);
        return (
          <button
            key={id}
            type="button"
            className={`reaction ${active ? 'is-active' : ''}`}
            onClick={() => onToggle(postId, id)}
            aria-pressed={active}
            aria-label={`${label}: ${count}`}
            title={label}
          >
            <Icon name={icon} size={15} filled={active} />
            <span>{count > 0 ? fmtCount(count) : '·'}</span>
          </button>
        );
      })}
    </div>
  );
}

const OP_BASE = (views: number): Record<ReactionId, number> => ({
  useful: Math.round(views / 45) + 12,
  heart: Math.round(views / 95) + 5,
  fire: Math.round(views / 160) + 2,
});

export function ThreadView({
  topic,
  posts,
  views,
  userReactions,
  isBookmarked,
  isFollowing,
  onBack,
  onOpenCategory,
  onToggleBookmark,
  onToggleFollow,
  onToggleReaction,
  onAddPost,
  onShare,
}: ThreadViewProps) {
  const author = authorById(topic.authorId);
  const category = categoryById(topic.category);
  const me = authorById(ME_ID);
  const [composer, setComposer] = useState('');
  const composerRef = useRef<HTMLTextAreaElement>(null);

  const opPostId = `op-${topic.id}`;
  const opBase = useMemo(() => OP_BASE(views), [views]);

  const paragraphs = topic.excerpt.split(/\n+/).filter(Boolean);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [topic.id]);

  const submit = () => {
    const body = composer.trim();
    if (body.length < 2) return;
    onAddPost(topic.id, body);
    setComposer('');
  };

  const quoteReply = (handle: string) => {
    setComposer((prev) => (prev.startsWith(`${handle}, `) ? prev : `${handle}, ${prev}`));
    composerRef.current?.focus();
  };

  return (
    <div className="thread">
      <button type="button" className="back-btn" onClick={onBack}>
        <Icon name="arrowLeft" size={16} />
        Все обсуждения
      </button>

      <header className="thread-head panel">
        <div className="topic-chips">
          <button type="button" className="chip chip--category chip--button" onClick={() => onOpenCategory(topic.category)}>
            <Icon name={category.icon} size={13} />
            {category.name}
          </button>
          <span className="chip chip--muted">{timeAgo(topic.createdAt)}</span>
        </div>

        <h1 className="thread-title">{topic.title}</h1>

        <div className="topic-tags thread-tags">
          {topic.tags.map((tag) => (
            <span key={tag} className="tag">#{tag}</span>
          ))}
        </div>

        <div className="thread-author">
          <Avatar author={author} size={44} />
          <div className="thread-author-info">
            <span className="thread-author-name">
              {author.name}
              {author.role && <span className="role-chip">{author.role}</span>}
            </span>
            <span className="thread-author-handle">
              {author.handle} · репутация {fmtCount(author.rep)}
            </span>
          </div>
          <div className="thread-tools">
            <button
              type="button"
              className={`tool-btn ${isFollowing ? 'is-on' : ''}`}
              onClick={() => onToggleFollow(topic.id)}
              aria-pressed={isFollowing}
            >
              <Icon name={isFollowing ? 'checkCheck' : 'bell'} size={16} />
              {isFollowing ? 'Вы следите' : 'Следить'}
            </button>
            <button type="button" className="tool-btn" onClick={() => onShare(topic.id)}>
              <Icon name="link" size={16} />
              Скопировать ссылку
            </button>
            <button
              type="button"
              className={`icon-btn ${isBookmarked ? 'is-active' : ''}`}
              onClick={() => onToggleBookmark(topic.id)}
              aria-label={isBookmarked ? 'Убрать из закладок' : 'В закладки'}
              aria-pressed={isBookmarked}
            >
              <Icon name="bookmark" size={18} filled={isBookmarked} />
            </button>
          </div>
        </div>

        <div className="thread-body">
          {paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>

        <div className="thread-foot">
          <ReactionRow
            postId={opPostId}
            base={opBase}
            mine={userReactions[opPostId]}
            onToggle={onToggleReaction}
          />
          <div className="thread-foot-stats">
            <span>
              <Icon name="eye" size={14} />
              {fmtCount(views)} просмотров
            </span>
            <span>
              <Icon name="message" size={14} />
              {fmtCount(posts.length)} ответов
            </span>
          </div>
        </div>
      </header>

      <section className="answers" aria-label="Ответы">
        <div className="answers-head">
          <h2>Ответы</h2>
          <span className="answers-count">{posts.length}</span>
        </div>

        {posts.length === 0 ? (
          <div className="answers-empty">
            <Icon name="chat" size={26} />
            <p>Пока тишина. Будьте первым, кто ответит — автор ждёт именно вас.</p>
          </div>
        ) : (
          posts.map((post) => {
            const postAuthor = authorById(post.authorId);
            return (
              <article key={post.id} className="post">
                <Avatar author={postAuthor} size={38} className="post-avatar" />
                <div className="post-body">
                  <div className="post-head">
                    <span className="post-name">{postAuthor.name}</span>
                    {postAuthor.role && <span className="role-chip">{postAuthor.role}</span>}
                    <span className="post-handle">{postAuthor.handle}</span>
                    <span className="meta-dot" aria-hidden="true">·</span>
                    <span className="post-time">{timeAgo(post.createdAt)}</span>
                  </div>
                  <p className="post-text">{post.body}</p>
                  <div className="post-foot">
                    <ReactionRow
                      postId={post.id}
                      base={post.reactions}
                      mine={userReactions[post.id]}
                      onToggle={onToggleReaction}
                    />
                    <button type="button" className="reply-btn" onClick={() => quoteReply(postAuthor.handle)}>
                      <Icon name="message" size={14} />
                      Ответить
                    </button>
                  </div>
                </div>
              </article>
            );
          })
        )}
      </section>

      <form
        className="composer panel"
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
      >
        <Avatar author={me} size={38} />
        <div className="composer-field">
          <label htmlFor="composer-input" className="composer-label">
            Ваш ответ
          </label>
          <textarea
            id="composer-input"
            ref={composerRef}
            value={composer}
            onChange={(e) => setComposer(e.target.value)}
            placeholder="Напишите по существу. Ссылки и личный опыт приветствуются."
            rows={3}
            onKeyDown={(e) => {
              if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') submit();
            }}
          />
          <div className="composer-foot">
            <span className="composer-hint">Ctrl / ⌘ + Enter — отправить</span>
            <button type="submit" className="btn btn--primary" disabled={composer.trim().length < 2}>
              <Icon name="send" size={16} />
              Отправить
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
